<?php

namespace App\Enums;

/**
 * Canonical status values for harvest_batches.status.
 *
 * All writers should reference this enum instead of raw strings so the
 * lifecycle stays consistent across Farmer / Miller / Driver flows.
 */
enum HarvestBatchStatus: string
{
    case Unsold = 'unsold';
    case Available = 'available';
    case InterestReceived = 'interest_received';
    case Sold = 'sold';
    case Pending = 'pending';
    case Accepted = 'accepted';
    case InTransit = 'in_transit';
    case Received = 'received';
    case Processing = 'processing';
    case Processed = 'processed';
    case Milled = 'milled';
    case PaymentPending = 'payment_pending';
    case PaymentAuthorized = 'payment_authorized';
    case ForSale = 'for_sale';
    case Dispatched = 'dispatched';
    case Completed = 'completed';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Legacy rows written with non-canonical casing (e.g. "Accepted").
     */
    public static function normalize(string $value): string
    {
        $value = strtolower(trim($value));

        return match ($value) {
            'accepted' => self::Accepted->value,
            default => in_array($value, self::values(), true) ? $value : self::Available->value,
        };
    }
}
