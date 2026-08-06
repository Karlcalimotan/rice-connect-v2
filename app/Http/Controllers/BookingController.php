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
            return redirect()->back()->withErrors('Only drivers can accept jobs.');
        }

        return DB::transaction(function () use ($bookingId, $driverId) {
            // Lock the selected row for update to isolate competing requests
            $booking = Booking::where('id', $bookingId)->lockForUpdate()->first();

            if (!$booking || $booking->status !== BookingStatus::Pending->value) {
                return redirect()->back()->withErrors('Job taken or unavailable.');
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
                $booking->harvestBatch->user?->notify(new \App\Notifications\DriverAssignedNotification($booking->harvestBatch, $driverId));
            } elseif ($booking->order_id && $booking->order) {
                $booking->order->update([
                    'driver_id' => $driverId,
                    'delivery_status' => 'Pending'
                ]);
                $booking->order->retailer?->notify(new \App\Notifications\DriverAssignedNotification($booking->order, $driverId));
            }

            return redirect()->back()->with('message', 'Job successfully claimed!');
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

        $isPalay = $booking->harvest_batch_id && $booking->harvestBatch;

        // Money-gate for palay: transit cannot start until the driver has logged
        // the weight/price and the Miller has authorized the payment.
        if ($isPalay && $newStatus === BookingStatus::InTransit->value && $booking->harvestBatch->delivery_status !== 'Payment Authorized') {
            return redirect()->back()->withErrors('Miller must authorize payment before transit can start.');
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
                $updateData['delivery_status'] = 'Received';
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
