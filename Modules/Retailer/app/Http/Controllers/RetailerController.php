<?php

namespace Modules\Retailer\Http\Controllers;

use Modules\Farmer\Models\HarvestBatch; 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia; 
use Inertia\Response; 

class RetailerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $listings = \App\Models\FinishedRiceStock::with(['miller.municipality', 'deliverySetting'])
            ->whereNotNull('price_per_sack')
            ->where('total_sacks', '>', 0)
            ->get();

        $retailerMun = auth()->user()->municipality()->first();

        return Inertia::render('Retailer::Marketplace', [
            'available_rice' => $listings,
            'retailer_municipality' => $retailerMun ? $retailerMun->name : 'Iloilo City',
            'design_css_url' => '/design/rice-connect-dashboard/styles.css',
        ]);
    }

    /**
     * Handle placing an order and auto-deleting if stock is exhausted.
     */
    public function placeOrder(Request $request)
    {
        $request->validate([
            'rice_variety' => 'required|string',
            'sacks' => 'required|integer|min:1',
            'shipping_method' => 'required|in:pickup,delivery',
        ]);

        $requestedSacks = (int) $request->sacks;

        $batch = \App\Models\FinishedRiceStock::where('rice_variety', $request->rice_variety)
            ->whereNotNull('price_per_sack')
            ->where('total_sacks', '>', 0)
            ->first();

        if (!$batch || $batch->total_sacks < $requestedSacks) {
            return back()->withErrors(['message' => 'Insufficient stock!']);
        }

        $pricePerSack = (float) ($batch->price_per_sack ?? 0);
        $deliveryCharge = 0;

        if ($request->shipping_method === 'delivery') {
            $deliveryCharge = \App\Helpers\MunicipalityHelper::calculateFee($batch->miller_id, auth()->user()->municipality_id);
        }

        $totalPrice = ($requestedSacks * $pricePerSack) + $deliveryCharge;

        $order = null;

        DB::transaction(function () use ($request, $batch, $requestedSacks, $deliveryCharge, $totalPrice, &$order) {
            $decrementKg = $requestedSacks * 50;

            $batch->decrement('total_sacks', $requestedSacks);
            $batch->decrement('unpacked_weight_kg', $decrementKg);

            $order = \App\Models\Order::create([
                'retailer_id' => auth()->id(),
                'miller_id' => $batch->miller_id,
                'stock_id' => $batch->id,
                'rice_variety' => $batch->rice_variety,
                'sacks' => $requestedSacks,
                'total_weight' => $decrementKg,
                'total_price' => $totalPrice,
                'shipping_method' => $request->shipping_method,
                'fulfillment_type' => $request->shipping_method, // enum: ['pickup', 'delivery']
                'delivery_fee' => $deliveryCharge,
                'delivery_status' => 'Pending',
                'delivery_type' => 'rice',
                'status' => $request->shipping_method === 'pickup' ? 'ready_for_pickup' : 'pending_preparation',
            ]);

            // Threshold Check: Notify miller if stock is low
            if ($batch->total_sacks <= $batch->low_stock_threshold) {
                $miller = \App\Models\User::find($batch->miller_id);
                if ($miller) {
                    $miller->notify(new \App\Notifications\LowStockNotification($batch->rice_variety, $batch->id, $batch->total_sacks));
                }
            }
        });

        if ($order) {
            if ($request->shipping_method === 'delivery') {
                \App\Services\BookingBroadcastService::broadcastRiceDelivery($order);
            } else {
                // Send a release notification directly to the Miller
                $miller = \App\Models\User::find($order->miller_id);
                if ($miller) {
                    $retailerName = auth()->user()->first_name . ' ' . auth()->user()->last_name;
                    $miller->notify(new \App\Notifications\ReleaseRequestedNotification($order->id, $retailerName));
                }
            }
        }

        return redirect()->route('retailer.purchases')->with('message', 'Order placed successfully!');
    }

    public function myOrders(): Response
    {
        $orders = \App\Models\Order::with(['miller', 'driver'])
            ->where('retailer_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Retailer::MyPurchases', [
            'orders' => $orders,
            'design_css_url' => '/design/rice-connect-dashboard/styles.css',
        ]);
    }

    public function myPurchases(): Response
    {
        $orders = \App\Models\Order::with(['miller', 'driver'])
            ->where('retailer_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Retailer::MyOrders', [
            'orders' => $orders,
            'design_css_url' => '/design/rice-connect-dashboard/styles.css',
        ]);
    }

    /**
     * List verified drivers a retailer can book for a pending delivery order.
     */
    public function drivers($id)
    {
        $order = \App\Models\Order::where('retailer_id', auth()->id())->findOrFail($id);

        if ($order->shipping_method !== 'delivery' || $order->delivery_status !== 'Pending' || $order->driver_id) {
            return response()->json(['drivers' => []]);
        }

        $drivers = \App\Models\User::where('role', 'driver')
            ->where('is_verified_driver', true)
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'vehicle_type']);

        return response()->json(['drivers' => $drivers]);
    }

    /**
     * Retailer explicitly books a driver for their pending delivery order.
     */
    public function bookDriver(Request $request, $id)
    {
        $validated = $request->validate([
            'driver_id' => 'required|exists:users,id',
        ]);

        $order = \App\Models\Order::where('retailer_id', auth()->id())->findOrFail($id);

        if ($order->shipping_method !== 'delivery') {
            return redirect()->back()->withErrors('This order is not a delivery order.');
        }

        if ($order->delivery_status !== 'Pending') {
            return redirect()->back()->withErrors('A driver can only be booked while the order is still pending.');
        }

        if ($order->driver_id) {
            return redirect()->back()->withErrors('A driver is already assigned to this order.');
        }

        $driver = \App\Models\User::where('role', 'driver')
            ->where('is_verified_driver', true)
            ->find($validated['driver_id']);

        if (!$driver) {
            return redirect()->back()->withErrors('That driver is not available.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($order, $driver) {
            $order->update([
                'driver_id' => $driver->id,
                'delivery_status' => 'Pending',
            ]);

            // Withdraw the pending pool booking and assign it to the chosen driver.
            \App\Models\Booking::where('order_id', $order->id)
                ->where('status', \App\Enums\BookingStatus::Pending->value)
                ->update([
                    'driver_id' => $driver->id,
                    'status' => \App\Enums\BookingStatus::Assigned->value,
                ]);

            $driver->notify(new \App\Notifications\BookingAssignedNotification($order));
            $order->miller?->notify(new \App\Notifications\BookingAssignedNotification($order));
        });

        return redirect()->back()->with('message', $driver->first_name . ' ' . $driver->last_name . ' has been booked for your delivery.');
    }

    /**
     * Retailer confirms they have received the rice.
     */
    public function confirmReceived($id)
    {
        $order = \App\Models\Order::where('retailer_id', auth()->id())
            ->findOrFail($id);

        if ($order->delivery_status !== 'Delivered') {
            return redirect()->back()->withErrors('Cannot confirm receipt until the order is officially Delivered.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
            $order->update([
                'delivery_status' => 'Confirmed Received',
                'status' => 'completed',
                'updated_at' => now()
            ]);

            \App\Models\Booking::where('order_id', $order->id)->update(['status' => 'delivered']);

            \App\Services\PaymentService::transfer(
                auth()->id(),
                $order->miller_id,
                $order->total_price,
                'Payment for Rice Order #' . $order->id,
                'Payment received for Rice Order #' . $order->id,
                $order
            );

            if ($order->driver_id && $order->delivery_fee > 0) {
                \App\Services\PaymentService::transfer(
                    $order->miller_id,
                    $order->driver_id,
                    $order->delivery_fee,
                    'Delivery fee payout for Order #' . $order->id,
                    'Commission received for Order #' . $order->id,
                    $order
                );
            }
        });

        return redirect()->back()->with('message', 'Delivery confirmed and signed! Order completed.');
    }

    /**
     * Retailer deletes a completed/cancelled order.
     */
    public function deleteOrder($id)
    {
        $order = \App\Models\Order::where('retailer_id', auth()->id())->findOrFail($id);

        if ($order->status !== 'completed' && $order->status !== 'cancelled') {
            return redirect()->back()->withErrors('Can only delete completed or cancelled transactions.');
        }

        $order->delete();

        return redirect()->back()->with('message', 'Completed purchase deleted.');
    }
}
