<?php

namespace App\Enums;

/**
 * Canonical status values for orders.status.
 */
enum OrderStatus: string
{
    case PendingPickup = 'pending_pickup';
    case ReadyForPickup = 'ready_for_pickup';
    case PendingPreparation = 'pending_preparation';
    case Dispatched = 'dispatched';
    case Delivered = 'delivered';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case DateScheduled = 'date_scheduled';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
