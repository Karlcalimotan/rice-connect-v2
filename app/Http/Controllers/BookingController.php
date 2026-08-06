<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Driver claims a pending booking.
     */
    public function acceptJob(Request $request, $bookingId)
    {
        $driverId = auth()->id();

        if (auth()->user()->role !== 'driver') {
            return response()->json(['success' => false, 'message' => 'Only drivers can accept jobs.'], 403);
        }

        return DB::transaction(function () use ($bookingId, $driverId) {
            // Lock the selected row for update to isolate competing requests
            $booking = Booking::where('id', $bookingId)->lockForUpdate()->first();

            if (!$booking || $booking->status !== BookingStatus::Pending->value) {
                return response()->json(['success' => false, 'message' => 'Job taken or unavailable.'], 422);
            }

            $booking->update([
                'driver_id' => $driverId,
                'status' => BookingStatus::Assigned->value
            ]);

            // Sync driver_id back to HarvestBatch or Order
            if ($booking->harvest_batch_id && $booking->harvestBatch) {
                $booking->harvestBatch->update([
                    'driver_id' => $driverId,
                    'delivery_status' => 'Pending'
                ]);
            } elseif ($booking->order_id && $booking->order) {
                $booking->order->update([
                    'driver_id' => $driverId,
                    'delivery_status' => 'Pending'
                ]);
            }

            return response()->json(['success' => true, 'message' => 'Job successfully claimed!']);
        });
    }

    /**
     * Driver updates the status of their active booking.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', BookingStatus::values())
        ]);

        $booking = Booking::where('driver_id', auth()->id())->findOrFail($id);
        $newStatus = $request->status;

        // State machine: a job can only move one step forward. This prevents
        // skipping stages or rewinding a completed delivery.
        $allowed = match ($booking->status) {
            BookingStatus::Assigned->value => [BookingStatus::AtPickup->value],
            BookingStatus::AtPickup->value => [BookingStatus::InTransit->value],
            BookingStatus::InTransit->value => [BookingStatus::Delivered->value],
            default => [],
        };

        if (!in_array($newStatus, $allowed, true)) {
            return redirect()->back()->withErrors("Cannot transition booking from {$booking->status} to {$newStatus}.");
        }

        $booking->update(['status' => $newStatus]);

        // Map booking status to corresponding shipment states
        $deliveryStatusMap = [
            'pending' => 'Pending',
            'assigned' => 'Pending',
            'at_pickup' => 'Pending', // Awaiting loading/weighing
            'in_transit' => 'In Transit',
            'delivered' => 'Delivered',
        ];

        $mappedStatus = $deliveryStatusMap[$newStatus] ?? 'Pending';

        if ($booking->harvest_batch_id && $booking->harvestBatch) {
            $updateData = ['delivery_status' => $mappedStatus];
            if ($newStatus === 'in_transit') {
                $updateData['status'] = 'in_transit';
            } elseif ($newStatus === 'delivered') {
                $updateData['status'] = 'received';
            }
            $booking->harvestBatch->update($updateData);
        } elseif ($booking->order_id && $booking->order) {
            $updateData = ['delivery_status' => $mappedStatus];
            if ($newStatus === 'in_transit') {
                $updateData['status'] = 'in_transit';
            } elseif ($newStatus === 'delivered') {
                $updateData['status'] = 'delivered';
            }
            $booking->order->update($updateData);
        }

        return redirect()->back()->with('message', 'Booking status updated to ' . $newStatus);
    }
}
