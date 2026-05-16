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

        DB::transaction(function () use ($request, $batch, $requestedSacks, $deliveryCharge, $totalPrice) {
            $decrementKg = $requestedSacks * 50;

            $batch->decrement('total_sacks', $requestedSacks);
            $batch->decrement('unpacked_weight_kg', $decrementKg);

            \App\Models\Order::create([
                'retailer_id' => auth()->id(),
                'miller_id' => $batch->miller_id,
                'stock_id' => $batch->id,
                'rice_variety' => $batch->rice_variety,
                'sacks' => $requestedSacks,
                'total_weight' => $decrementKg,
                'total_price' => $totalPrice,
                'shipping_method' => $request->shipping_method,
                'delivery_fee' => $deliveryCharge,
                'delivery_status' => 'Pending',
                'delivery_type' => 'rice',
                'status' => 'pending_preparation',
            ]);

            // Threshold Check: Notify miller if stock is low
            if ($batch->total_sacks <= $batch->low_stock_threshold) {
                $miller = \App\Models\User::find($batch->miller_id);
                if ($miller) {
                    $miller->notify(new \App\Notifications\LowStockNotification($batch->rice_variety, $batch->id, $batch->total_sacks));
                }
            }
        });

        return redirect()->route('retailer.purchases')->with('message', 'Order placed successfully!');
    }

    public function myOrders(): Response
    {
        $orders = \App\Models\Order::where('retailer_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Retailer::MyPurchases', [
            'orders' => $orders,
            'design_css_url' => '/design/rice-connect-dashboard/styles.css',
        ]);
    }

    public function myPurchases(): Response
    {
        $orders = \App\Models\Order::with('miller')
            ->where('retailer_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Retailer::MyOrders', [
            'orders' => $orders,
            'design_css_url' => '/design/rice-connect-dashboard/styles.css',
        ]);
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

            $retailerWallet = \App\Models\Wallet::firstOrCreate(['user_id' => auth()->id()]);
            $millerWallet = \App\Models\Wallet::firstOrCreate(['user_id' => $order->miller_id]);

            $retailerWallet->debit($order->total_price);
            $millerWallet->credit($order->total_price);

            \App\Models\LedgerEntry::create([
                'user_id' => auth()->id(),
                'amount' => $order->total_price,
                'type' => 'debit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment for Rice Order #' . $order->id
            ]);

            \App\Models\LedgerEntry::create([
                'user_id' => $order->miller_id,
                'amount' => $order->total_price,
                'type' => 'credit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment received for Rice Order #' . $order->id
            ]);

            if ($order->driver_id && $order->delivery_fee > 0) {
                $driverWallet = \App\Models\Wallet::firstOrCreate(['user_id' => $order->driver_id]);
                
                $millerWallet->debit($order->delivery_fee);
                $driverWallet->credit($order->delivery_fee);

                \App\Models\LedgerEntry::create([
                    'user_id' => $order->miller_id,
                    'amount' => $order->delivery_fee,
                    'type' => 'debit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Delivery fee payout for Order #' . $order->id
                ]);

                \App\Models\LedgerEntry::create([
                    'user_id' => $order->driver_id,
                    'amount' => $order->delivery_fee,
                    'type' => 'credit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Commission received for Order #' . $order->id
                ]);
            }
        });

        return redirect()->back()->with('message', 'Delivery confirmed and signed! Order completed.');
    }
}
