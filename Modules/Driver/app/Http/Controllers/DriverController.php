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

        return Inertia::render('Driver::Dashboard', [
            'palayAssignments' => $palayAssignments,
            'riceAssignments' => $riceAssignments,
            'history' => $history,
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

        return redirect()->back()->with('message', 'Weight logged! Waiting for Miller to authorize payment before starting transit.');
    }

    /**
     * Phase 2.5: Driver finalizes pickup after Miller authorization.
     */
    public function payFarmer($id)
    {
        $batch = HarvestBatch::where('driver_id', auth()->id())->findOrFail($id);

        if ($batch->delivery_status !== 'Payment Authorized') {
            return redirect()->back()->withErrors('Miller has not authorized payment yet.');
        }

        $batch->update([
            'delivery_status' => 'In Transit',
            'status' => 'in_transit',
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('message', 'Payment confirmed with Farmer. Starting transit to Miller station!');
    }

    /**
     * Driver Phase 2: Confirm Loading & Start Trip for Rice Delivery
     */
    public function startRiceTrip(Request $request, $id)
    {
        $order = Order::where('driver_id', auth()->id())->findOrFail($id);

        if ($order->delivery_status !== 'Pending') {
            return redirect()->back()->withErrors('Trip already started or invalid status.');
        }

        $order->update([
            'delivery_status' => 'In Transit',
            'status' => 'in_transit',
        ]);

        return redirect()->back()->with('message', 'Trip started! Heading to retailer.');
    }

    /**
     * Driver marks palay delivery as "Arrived at Miller Station".
     */
    public function arriveAtMiller(Request $request, $id)
    {
        $batch = HarvestBatch::where('driver_id', auth()->id())->findOrFail($id);

        if ($batch->delivery_status !== 'In Transit') {
            return redirect()->back()->withErrors('Batch must be in transit to mark as arrived.');
        }

        $batch->update([
            'delivery_status' => 'Received',
            'status' => 'received',
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('message', 'Delivery finalized! Batch is now at the Miller station.');
    }

    /**
     * Driver marks rice delivery as "Arrived at Destination".
     */
    public function deliverRice(Request $request, $id)
    {
        $order = Order::where('driver_id', auth()->id())->findOrFail($id);

        $order->update([
            'delivery_status' => 'Delivered',
            'status' => 'delivered', 
        ]);

        return redirect()->back()->with('message', 'Order marked as Delivered. Please have the Retailer sign off or use the final sign-off button.');
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

            // Copy wallet logic from RetailerController to ensure funds move if driver signs off
            $retailerWallet = \App\Models\Wallet::firstOrCreate(['user_id' => $order->retailer_id]);
            $millerWallet = \App\Models\Wallet::firstOrCreate(['user_id' => $order->miller_id]);

            $retailerWallet->debit($order->total_price);
            $millerWallet->credit($order->total_price);

            \App\Models\LedgerEntry::create([
                'user_id' => $order->retailer_id,
                'amount' => $order->total_price,
                'type' => 'debit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment for Rice Order #' . $order->id . ' (Signed off by Driver)'
            ]);

            \App\Models\LedgerEntry::create([
                'user_id' => $order->miller_id,
                'amount' => $order->total_price,
                'type' => 'credit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment received for Rice Order #' . $order->id . ' (Signed off by Driver)'
            ]);

            // Driver commission
            if ($order->delivery_fee > 0) {
                $driverWallet = \App\Models\Wallet::firstOrCreate(['user_id' => auth()->id()]);
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
                    'user_id' => auth()->id(),
                    'amount' => $order->delivery_fee,
                    'type' => 'credit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Commission received for Order #' . $order->id
                ]);
            }
        });

        return redirect()->back()->with('message', 'Final sign-off complete! Delivery finalized.');
    }

    /**
     * Clear driver assignment for completed history records.
     */
    public function deleteHistory($type, $id)
    {
        if ($type === 'palay') {
            $batch = HarvestBatch::where('driver_id', auth()->id())->findOrFail($id);
            $batch->update(['driver_id' => null]);
        } elseif ($type === 'rice') {
            $order = Order::where('driver_id', auth()->id())->findOrFail($id);
            $order->update(['driver_id' => null]);
        }

        return redirect()->back()->with('message', 'Completed history record deleted.');
    }
}
