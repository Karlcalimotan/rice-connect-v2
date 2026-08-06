<?php

namespace Modules\Driver\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Farmer\Models\HarvestBatch;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $driverId = auth()->id();

        // 1. Inbound Palay Assignments
        $palayAssignments = HarvestBatch::with('user', 'buyer')
            ->where('driver_id', $driverId)
            ->whereIn('delivery_status', ['Pending', 'In Transit', 'Payment Pending', 'Payment Authorized'])
            ->latest()
            ->get();

        // 2. Outbound Rice Assignments
        $riceAssignments = Order::with('retailer', 'miller')
            ->where('driver_id', $driverId)
            ->whereIn('delivery_status', ['Pending', 'In Transit', 'Delivered'])
            ->latest()
            ->get();

        // 3. History
        $history = [
            'palay' => HarvestBatch::where('driver_id', $driverId)->whereIn('delivery_status', ['Received', 'Completed'])->latest()->limit(10)->get(),
            'rice' => Order::where('driver_id', $driverId)->whereIn('delivery_status', ['Confirmed Received', 'Completed'])->latest()->limit(10)->get(),
        ];

        // 4. Grab-style Broadcast system bookings
        $pendingBookings = \App\Models\Booking::with('bookable')
            ->where('status', 'pending')
            ->latest()
            ->get();

        $activeBookings = \App\Models\Booking::with(['bookable', 'harvestBatch.user', 'order.retailer'])
            ->where('driver_id', $driverId)
            ->whereIn('status', ['assigned', 'at_pickup', 'in_transit'])
            ->latest()
            ->get();

        $deliveredBookings = \App\Models\Booking::with(['harvestBatch.user', 'order.retailer'])
            ->where('driver_id', $driverId)
            ->where('status', 'delivered')
            ->latest()
            ->get();

        return Inertia::render('Driver::Dashboard', [
            'palayAssignments' => $palayAssignments,
            'riceAssignments' => $riceAssignments,
            'history' => $history,
            'pendingBookings' => $pendingBookings,
            'activeBookings' => $activeBookings,
            'deliveredBookings' => $deliveredBookings,
        ]);
    }

    /**
     * Driver confirms pickup and logs weight/price.
     */
    public function requestPickup(Request $request, $id)
    {
        $batch = HarvestBatch::where('driver_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'actual_weight_kg' => 'required|numeric|min:0.01',
            'suggested_price_per_kg' => 'required|numeric|min:0',
        ]);

        $batch->update([
            'actual_weight_kg' => $validated['actual_weight_kg'],
            'suggested_price_per_kg' => $validated['suggested_price_per_kg'],
            'delivery_status' => 'Payment Pending',
            'status' => 'payment_pending',
        ]);

        $batch->user?->notify(new \App\Notifications\WeightLoggedNotification($batch->id, $validated['actual_weight_kg'], $validated['suggested_price_per_kg']));

        return redirect()->back()->with('message', 'Weight logged! Waiting for Miller to authorize payment before starting transit.');
    }

    /**
     * Driver performs the final sign-off for a rice delivery.
     */
    public function finalSignOff(Request $request, $id)
    {
        $order = Order::where('driver_id', auth()->id())->findOrFail($id);

        if ($order->delivery_status !== 'Delivered') {
            return redirect()->back()->withErrors('Order must be marked as Delivered before final sign-off.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
            $order->update([
                'delivery_status' => 'Confirmed Received',
                'status' => 'completed',
                'updated_at' => now()
            ]);

            \App\Models\Booking::where('order_id', $order->id)->update(['status' => 'delivered']);

            // Copy wallet logic from RetailerController to ensure funds move if driver signs off
            \App\Services\PaymentService::transfer(
                $order->retailer_id,
                $order->miller_id,
                $order->total_price,
                'Payment for Rice Order #' . $order->id . ' (Signed off by Driver)',
                'Payment received for Rice Order #' . $order->id . ' (Signed off by Driver)',
                $order
            );

            // Driver commission
            if ($order->delivery_fee > 0) {
                \App\Services\PaymentService::transfer(
                    $order->miller_id,
                    auth()->id(),
                    $order->delivery_fee,
                    'Delivery fee payout for Order #' . $order->id,
                    'Commission received for Order #' . $order->id,
                    $order
                );
            }
        });

        return redirect()->back()->with('message', 'Final sign-off complete! Delivery finalized.');
    }
}
