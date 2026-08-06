<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Modules\Farmer\Models\HarvestBatch;

class Booking extends Model
{
    protected $fillable = [
        'bookable_type',
        'bookable_id',
        'origin_address',
        'destination_address',
        'total_weight_kg',
        'estimated_sacks',
        'driver_id',
        'status',
        'order_id',
        'harvest_batch_id',
    ];

    protected $casts = [
        'total_weight_kg' => 'decimal:2',
        'estimated_sacks' => 'integer',
    ];

    /**
     * Polymorphic relation: associates with Farmer, Miller, or Retailer models (Users)
     */
    public function bookable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The driver assigned to this booking.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * The order associated with this booking (if outbound rice).
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * The harvest batch associated with this booking (if inbound palay).
     */
    public function harvestBatch(): BelongsTo
    {
        return $this->belongsTo(HarvestBatch::class, 'harvest_batch_id');
    }
}
