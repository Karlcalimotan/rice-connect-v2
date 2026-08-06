<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Order;
use Modules\Farmer\Models\HarvestBatch;

class BookingBroadcastService
{
    /**
     * Broadcast a Palay pickup booking (Farmer -> Miller)
     */
    public static function broadcastPalayPickup(HarvestBatch $batch): Booking
    {
        $farmer = $batch->user;
        $miller = $batch->buyer ?? $batch->acceptedMiller;

        $origin = $batch->location ?: self::getMunicipalityName($farmer);
        $destination = $miller ? self::getMunicipalityName($miller) : 'Unknown';

        // A driver assigned at creation is honored: the booking skips the pool
        // and goes straight to that driver. Null keeps it in the pool.
        $driverId = $batch->driver_id;

        $batch->update(['delivery_status' => 'Pending']);

        return Booking::create([
            'bookable_type' => get_class($farmer),
            'bookable_id' => $farmer->id,
            'origin_address' => $origin,
            'destination_address' => $destination,
            'total_weight_kg' => $batch->total_weight > 0 ? $batch->total_weight : ($batch->total_sacks * 50),
            'estimated_sacks' => $batch->total_sacks ?: $batch->number_of_bags,
            'driver_id' => $driverId,
            'status' => $driverId ? BookingStatus::Assigned->value : BookingStatus::Pending->value,
            'harvest_batch_id' => $batch->id,
        ]);
    }

    /**
     * Broadcast a Rice delivery booking (Miller -> Retailer)
     */
    public static function broadcastRiceDelivery(Order $order): Booking
    {
        $miller = $order->miller;
        $retailer = $order->retailer;

        $origin = self::getMunicipalityName($miller);
        $destination = self::getMunicipalityName($retailer);

        // A driver assigned at creation is honored: the booking skips the pool
        // and goes straight to that driver. Null keeps it in the pool.
        $driverId = $order->driver_id;

        $order->update(['delivery_status' => 'Pending']);

        return Booking::create([
            'bookable_type' => get_class($miller),
            'bookable_id' => $miller->id,
            'origin_address' => $origin,
            'destination_address' => $destination,
            'total_weight_kg' => $order->total_weight > 0 ? $order->total_weight : ($order->sacks * 50),
            'estimated_sacks' => $order->sacks,
            'driver_id' => $driverId,
            'status' => $driverId ? BookingStatus::Assigned->value : BookingStatus::Pending->value,
            'order_id' => $order->id,
        ]);
    }

    /**
     * Helper to retrieve municipality name from a User model
     */
    private static function getMunicipalityName($user): string
    {
        if (!$user) {
            return 'Unknown';
        }
        
        if ($user->municipality) {
            if (is_string($user->municipality)) {
                return $user->municipality;
            }
            if (is_object($user->municipality) && isset($user->municipality->name)) {
                return $user->municipality->name;
            }
        }

        // Fallback to loaded relationship
        $muniRelation = $user->municipality()->first();
        if ($muniRelation) {
            return $muniRelation->name;
        }

        return 'Iloilo';
    }
}
