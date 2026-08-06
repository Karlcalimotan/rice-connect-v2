<?php

namespace Modules\Miller\Http\Controllers;

use Modules\Farmer\Models\HarvestBatch;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MillerController extends Controller
{
    /**
     * Display the Marketplace for Millers.
     */
    public function index(): Response
    {
        $user = auth()->user();

        // Show batches that are available or already have some interest received
        $batches = HarvestBatch::with(['user', 'interests'])
            ->whereIn('status', ['available', 'interest_received'])
            ->whereHas('user', function($query) use ($user) {
                $query->where('province', $user->province);
            })
            ->latest()
            ->get();

        return Inertia::render('Miller::Marketplace', [
            'batches' => $batches,
            'miller_town' => $user->municipality 
        ]);
    }

    /**
     * Miller marking interest in a Farmer's Palay.
     */
    public function interest(Request $request, $id) 
    {
        $batch = HarvestBatch::findOrFail($id);
    
        // 1. Record the interest in the separate table
        \App\Models\HarvestInterest::firstOrCreate([
            'harvest_id' => $id,
            'miller_id' => auth()->id(),
        ]);

        // 2. Update status if it was 'available'
        if ($batch->status === 'available') {
            $batch->update(['status' => 'interest_received']);
        }

        // 3. Notify the Farmer
        $miller = auth()->user();
        $batch->user->notify(new \App\Notifications\InterestReceivedNotification(
            $miller->first_name . ' ' . $miller->last_name,
            $batch->id,
            $batch->rice_variety
        ));

        return redirect()->back()->with('message', 'Interest sent! Awaiting farmer approval.');
    }

    public function incoming(): Response
    {
        $batches = HarvestBatch::with('user')
            ->where('buyer_id', auth()->id())
            ->whereIn('status', ['pending', 'sold', 'accepted', 'in_transit'])
            ->latest()
            ->get();

        return Inertia::render('Miller::IncomingPalay', [
            'batches' => $batches
        ]);
    }

    /**
     * View Palay bought but not yet processed.
     */
    public function inventory(): Response
    {
        // Aggregated view: group batches by rice variety for the Miller
        $inventory = HarvestBatch::with('user')
            ->where('buyer_id', auth()->id())
            ->whereIn('status', ['received','processing', 'milled'])
            ->latest()
            ->get();

        // Group by variety and aggregate totals
        $grouped = $inventory->groupBy('rice_variety')->map(function ($batches, $variety) {
            return [
                'rice_variety' => $variety,
                'total_unpacked_weight_kg' => $batches->sum('unpacked_weight_kg'),
                'total_sacks' => $batches->sum('total_sacks'),
                'total_weight' => $batches->sum('total_weight'),
                'batch_count' => $batches->count(),
                'batches' => $batches->map(fn($b) => [
                    'id' => $b->id,
                    'status' => $b->status,
                    'total_weight' => $b->total_weight,
                    'unpacked_weight_kg' => $b->unpacked_weight_kg,
                    'total_sacks' => $b->total_sacks,
                    'drying_status' => $b->drying_status,
                    'condition' => $b->condition,
                    'farmer_name' => ($b->user->first_name ?? '') . ' ' . ($b->user->last_name ?? ''),
                ])->values(),
            ];
        })->values();

        return Inertia::render('Miller::Inventory', [
            'inventory' => $grouped
        ]);
    }

    /**
     * View Milled Rice ready for sale.
     */
    public function processedInventory(): Response
    {
        $inventory = \App\Models\FinishedRiceStock::with('deliverySetting')
            ->where('miller_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Miller::ProcessedInventory', [
            'inventory' => $inventory
        ]);
    }

    /**
     * FIX: List Rice for Sale to Retailers
     */
    public function listForSale(Request $request, $id)
    {
        $request->validate([
            'price_per_sack' => 'required|numeric|min:1', 
        ]);
        
        $stock = \App\Models\FinishedRiceStock::where('miller_id', auth()->id())->findOrFail($id);

        $stock->update([
            'price_per_sack' => $request->price_per_sack,
        ]);

        return redirect()->route('miller.processed_inventory')->with('message', 'Rice is now listed in the Retailer Marketplace!');
    }

    /**
     * Phase 2: Driver (or Miller) confirms pickup, enters weight and suggests price.
     */
    public function confirmPickup(Request $request, $id)
    {
        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'actual_weight_kg' => 'required|numeric|min:0.01',
            'suggested_price_per_kg' => 'required|numeric|min:0',
        ]);

        $batch->update([
            'actual_weight_kg' => $validated['actual_weight_kg'],
            'suggested_price_per_kg' => $validated['suggested_price_per_kg'],
            'delivery_status' => 'In Transit',
            'status' => 'in_transit',
        ]);

        return redirect()->back()->with('message', 'Pickup confirmed! Palay is now In Transit.');
    }

    /**
     * Placeholder for Miller contacting Farmer.
     */
    public function contactFarmer($id)
    {
        // This is mainly for UI feedback in some flows
        return redirect()->back()->with('message', 'Farmer contact info displayed.');
    }

    /**
     * Phase 3: Miller finalizes the transaction.
     */
    public function finalizeTransaction(Request $request, $id)
    {
        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);

        if (is_null($batch->actual_weight_kg)) {
            return redirect()->back()->withErrors('Cannot finalize price if actual weight is not set.');
        }

        $validated = $request->validate([
            'final_price_per_kg' => 'required|numeric|min:0',
        ]);

        $totalPayment = $batch->actual_weight_kg * $validated['final_price_per_kg'];

        \Illuminate\Support\Facades\DB::transaction(function () use ($batch, $validated, $totalPayment) {
            $batch->update([
                'final_price_per_kg' => $validated['final_price_per_kg'],
                'price_per_kg' => $validated['final_price_per_kg'], // Sync for legacy views
                'total_weight' => $batch->actual_weight_kg, // Sync
                'delivery_status' => 'Completed',
                'status' => 'received',
                'drying_status' => 'received',
            ]);

            \App\Models\Booking::where('harvest_batch_id', $batch->id)->update(['status' => 'delivered']);

            \App\Services\PaymentService::transfer(
                auth()->id(),
                $batch->user_id,
                $totalPayment,
                'Payment for Harvest Batch #' . $batch->id,
                'Payment received for Harvest Batch #' . $batch->id,
                $batch
            );
        });

        $batch->user?->notify(new \App\Notifications\PaymentPaidNotification($batch->id, $totalPayment));

        return redirect()->back()->with('message', 'Transaction finalized! Total Payment: ₱' . number_format($totalPayment, 2));
    }

    public function assignDriver(Request $request, $id)
    {
        $request->validate([
            'driver_id' => 'required|exists:users,id',
            'type' => 'required|in:palay,rice'
        ]);

        if ($request->type === 'palay') {
            $model = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);
        } else {
            $model = \App\Models\Order::where('miller_id', auth()->id())->findOrFail($id);
        }

        $model->update([
            'driver_id' => $request->driver_id,
            'delivery_status' => 'Pending'
        ]);

        // Withdraw any pending pool booking from the driver grab pool and assign it.
        $bookingColumn = $request->type === 'palay' ? 'harvest_batch_id' : 'order_id';
        \App\Models\Booking::where($bookingColumn, $model->id)
            ->where('status', \App\Enums\BookingStatus::Pending->value)
            ->update([
                'driver_id' => $request->driver_id,
                'status' => \App\Enums\BookingStatus::Assigned->value,
            ]);

        if ($request->type === 'palay') {
            $model->user?->notify(new \App\Notifications\DriverAssignedNotification($model, $request->driver_id));
        } else {
            $model->retailer?->notify(new \App\Notifications\DriverAssignedNotification($model, $request->driver_id));
        }

        return redirect()->back()->with('message', 'Driver assigned successfully!');
    }

    public function markReceived($id)
    {
        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);
        $batch->update(['status' => 'received', 'delivery_status' => 'Received', 'drying_status' => 'received']);
        return redirect()->back();
    }

    public function startDrying($id)
    {
        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);
        $batch->update(['drying_status' => 'drying']);
        return redirect()->back();
    }

    public function millToRice(Request $request, $id)
    {
        $request->validate([
            'sacks' => 'required|integer|min:0',
            'leftover_kg' => 'required|numeric|min:0',
        ]);

        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);
        
        $batch->update([
            'status' => 'milled',
        ]);

        // Aggregate into Finished Rice Stock
        $stock = \App\Models\FinishedRiceStock::firstOrCreate(
            ['miller_id' => auth()->id(), 'rice_variety' => $batch->rice_variety],
            ['total_sacks' => 0, 'unpacked_weight_kg' => 0]
        );

        $stock->increment('total_sacks', $request->sacks);
        $stock->increment('unpacked_weight_kg', $request->leftover_kg);

        return redirect()->back()->with('message', 'Palay milled and added to Finished Rice stock.');
    }

    public function updateThreshold(Request $request, $id)
    {
        $request->validate([
            'low_stock_threshold' => 'required|integer|min:0'
        ]);

        $stock = \App\Models\FinishedRiceStock::where('miller_id', auth()->id())->findOrFail($id);
        $stock->update(['low_stock_threshold' => $request->low_stock_threshold]);

        return redirect()->back()->with('message', 'Threshold updated successfully.');
    }

    public function setReadyToProcess($id)
    {
        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);
        $batch->update(['drying_status' => 'ready_to_process']);
        return redirect()->back();
    }

    public function startProcessing($id)
    {
        $batch = HarvestBatch::where('buyer_id', auth()->id())->findOrFail($id);
        // If it's fresh, it must be ready_to_process. If dry, it can start immediately.
        if ($batch->condition === 'fresh' && $batch->drying_status !== 'ready_to_process') {
            return redirect()->back()->withErrors('Cannot start processing until drying is complete.');
        }
        $batch->update(['status' => 'processing']);
        return redirect()->back();
    }

    public function millerOrders(): Response
    {
        $orders = \App\Models\Order::with('retailer')
            ->where('miller_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Miller::MillerOrders', [
            'orders' => $orders
        ]);
    }

    public function readyForPickup($id)
    {
        $order = \App\Models\Order::where('id', $id)
            ->where('miller_id', auth()->id())
            ->firstOrFail();

        $order->update(['status' => 'ready_for_pickup']);

        $order->retailer->notify(new \App\Notifications\RiceReadyForPickupNotification($order->id));

        return redirect()->back()->with('message', 'Order marked as Ready for Pickup.');
    }

    /**
     * Mark a pickup order as complete (finalized).
     */
    public function completePickup($id)
    {
        $order = \App\Models\Order::where('miller_id', auth()->id())
            ->where('shipping_method', 'pickup')
            ->findOrFail($id);

        \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
            $order->update([
                'delivery_status' => 'Confirmed Received',
                'status' => 'completed',
                'updated_at' => now()
            ]);

            \App\Services\PaymentService::transfer(
                $order->retailer_id,
                auth()->id(),
                $order->total_price,
                'Payment for Rice Order #' . $order->id . ' (Picked up)',
                'Payment received for Rice Order #' . $order->id . ' (Picked up)',
                $order
            );
        });

        return redirect()->back()->with('message', 'Pickup completed successfully!');
    }

    /**
     * Delete a completed/cancelled order.
     */
    public function deleteOrder($id)
    {
        $order = \App\Models\Order::where('miller_id', auth()->id())->findOrFail($id);

        if ($order->status !== 'completed' && $order->status !== 'cancelled') {
            return redirect()->back()->withErrors('Can only delete completed or cancelled transactions.');
        }

        $order->delete();

        return redirect()->back()->with('message', 'Completed transaction deleted.');
    }

    /**
     * Dedicated Transport Tab for Millers.
     */
    public function transport(): Response
    {
        // 1. Palay Picking (Inbound) - ONLY UNLOCKED AFTER A SUCCESSFUL HANDSHAKE
        $inbound = HarvestBatch::with(['user', 'driver'])
            ->where('accepted_miller_id', auth()->id())
            ->whereIn('status', [\App\Enums\HarvestBatchStatus::Accepted->value, 'sold', 'received', 'processing', 'milled', 'payment_pending', 'payment_authorized'])
            ->whereIn('delivery_status', ['Pending', 'In Transit', 'Received', 'Payment Pending', 'Payment Authorized'])
            ->latest()
            ->get();

        // 2. Rice Delivery (Outbound)
        $outbound = \App\Models\Order::with('retailer')
            ->where('miller_id', auth()->id())
            ->whereIn('delivery_status', ['Pending', 'In Transit', 'Received'])
            ->latest()
            ->get();

        // Compute read status for badges
        $inbound->each(function($batch) {
            if ($batch->scheduled_pickup_date) {
                $batch->schedule_is_read = !$batch->user->unreadNotifications()
                    ->where('type', \App\Notifications\PickupScheduledNotification::class)
                    ->where('data', 'like', '%"id":' . $batch->id . '%')
                    ->exists();
            } else {
                $batch->schedule_is_read = false;
            }
        });

        $outbound->each(function($order) {
            if ($order->scheduled_delivery_date) {
                $order->schedule_is_read = !$order->retailer->unreadNotifications()
                    ->where('type', \App\Notifications\DeliveryScheduledNotification::class)
                    ->where('data', 'like', '%"id":' . $order->id . '%')
                    ->exists();
            } else {
                $order->schedule_is_read = false;
            }
        });

        // 3. All Drivers (for discovery/linking)
        $allDrivers = \App\Models\User::where('role', 'driver')->get();

        // 4. Miller's Linked Fleet
        $myFleet = auth()->user()->drivers()->get();

        return Inertia::render('Miller::Transport', [
            'inbound' => $inbound,
            'outbound' => $outbound,
            'allDrivers' => $allDrivers,
            'myFleet' => $myFleet,
        ]);
    }

    /**
     * Link/Verify a driver to the Miller's fleet.
     */
    public function linkDriver(Request $request, $id)
    {
        $miller = auth()->user();
        $driver = \App\Models\User::where('role', 'driver')->findOrFail($id);

        // Check if already linked
        if (!$miller->drivers()->where('driver_id', $id)->exists()) {
            $miller->drivers()->attach($id, ['is_active' => true]);
            $driver->update(['is_verified_driver' => true]);
        }

        return redirect()->back()->with('message', 'Driver added to your fleet successfully!');
    }

    /**
     * Phase 3: Miller Dispatches (Handover to public road)
     */
    public function dispatchDelivery($id)
    {
        $order = \App\Models\Order::where('id', $id)
            ->where('miller_id', auth()->id())
            ->firstOrFail();

        if ($order->delivery_status !== 'In Transit') {
            return redirect()->back()->withErrors('Order must be In Transit (started by driver) before dispatching.');
        }

        $order->update([
            'status' => 'dispatched',
            'updated_at' => now()
        ]);

        return redirect()->back()->with('message', 'Rice Order dispatched! Driver is now on the way to the retailer.');
    }

    public function markDelivered($id)
    {
        return redirect()->back()->withErrors('Only the Retailer can confirm the final receipt.');
    }

    public function shippingSettings(): Response
    {
        $settings = \App\Models\MillerDeliverySetting::where('miller_id', auth()->id())->first();
 
         return Inertia::render('Miller::ShippingSettings', [
             'settings' => $settings,
             'municipalities' => \App\Models\Municipality::orderBy('distance_index')->get(),
             'current_municipality_id' => auth()->user()->municipality_id
         ]);
    }

    public function authorizePayment($id)
    {
        $batch = HarvestBatch::where('accepted_miller_id', auth()->id())->findOrFail($id);

        if ($batch->delivery_status !== 'Payment Pending') {
            return redirect()->back()->withErrors('Batch is not awaiting payment authorization.');
        }

        $batch->update([
            'status' => 'payment_authorized',
            'delivery_status' => 'Payment Authorized',
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('message', 'Payment authorized! The driver has been given the go-signal to pay the farmer and start transit.');
    }

    public function updateShippingSettings(Request $request)
    {
        $request->validate([
            'base_delivery_fee' => 'required|numeric|min:0',
            'extra_fee_per_municipality' => 'required|numeric|min:0',
            'municipality_id' => 'required|exists:municipalities,id'
        ]);

        \App\Models\MillerDeliverySetting::updateOrCreate(
            ['miller_id' => auth()->id()],
            [
                'base_delivery_fee' => $request->base_delivery_fee,
                'extra_fee_per_municipality' => $request->extra_fee_per_municipality,
                'municipality_id' => $request->municipality_id,
            ]
        );

        $muniRec = \App\Models\Municipality::find($request->municipality_id);
        
        auth()->user()->update([
            'municipality_id' => $request->municipality_id,
            'municipality' => $muniRec?->name ?? auth()->user()->municipality
        ]);

        return redirect()->back()->with('message', 'Shipping settings updated successfully!');
    }

    public function schedulePickup(Request $request, $id)
    {
        $request->validate([
            'scheduled_pickup_date' => 'required|date',
        ]);

        $batch = HarvestBatch::where('accepted_miller_id', auth()->id())->findOrFail($id);
        $batch->update(['scheduled_pickup_date' => $request->scheduled_pickup_date]);

        $batch->user->notify(new \App\Notifications\PickupScheduledNotification($request->scheduled_pickup_date, $batch->id));

        return redirect()->back()->with('message', 'Pickup scheduled successfully!');
    }

    public function scheduleDelivery(Request $request, $id)
    {
        $request->validate([
            'scheduled_delivery_date' => 'required|date',
        ]);

        $order = \App\Models\Order::where('miller_id', auth()->id())->findOrFail($id);
        $order->update(['scheduled_delivery_date' => $request->scheduled_delivery_date]);

        $order->retailer->notify(new \App\Notifications\DeliveryScheduledNotification($request->scheduled_delivery_date, $order->id));

        return redirect()->back()->with('message', 'Delivery scheduled successfully!');
    }
}
