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
            'palay' => HarvestBatch::where('driver_id', $driverId)->whereIn('delivery_status', ['Received', 'Completed'])->limit(5)->get(),
            'rice' => Order::where('driver_id', $driverId)->where('delivery_status', 'Completed')->limit(5)->get(),
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
    public function logPickup(Request $request, $id)
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
    public function finalizePickup($id)
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
    public function startTrip(Request $request, $id)
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
    public function arriveAtDestination(Request $request, $id)
    {
        $order = Order::where('driver_id', auth()->id())->findOrFail($id);

        $order->update([
            'delivery_status' => 'Delivered',
            'status' => 'delivered', 
        ]);

        return redirect()->back()->with('message', 'Order marked as Delivered. Waiting for Retailer confirmation.');
    }
}
