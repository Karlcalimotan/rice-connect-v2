<?php

namespace App\Enums;

/**
 * Canonical status values for bookings.status (grab-style driver jobs).
 */
enum BookingStatus: string
{
    case Pending = 'pending';
    case Assigned = 'assigned';
    case AtPickup = 'at_pickup';
    case InTransit = 'in_transit';
    case Delivered = 'delivered';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
