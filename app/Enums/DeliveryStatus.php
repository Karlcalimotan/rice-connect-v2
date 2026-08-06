<?php

namespace App\Enums;

/**
 * Canonical values for harvest_batches.delivery_status and orders.delivery_status.
 *
 * These are user-facing labels (Title Case) shared by both the palay and
 * rice shipping lifecycles.
 */
enum DeliveryStatus: string
{
    case Pending = 'Pending';
    case InTransit = 'In Transit';
    case PaymentPending = 'Payment Pending';
    case PaymentAuthorized = 'Payment Authorized';
    case Received = 'Received';
    case ConfirmedReceived = 'Confirmed Received';
    case Delivered = 'Delivered';
    case Completed = 'Completed';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
