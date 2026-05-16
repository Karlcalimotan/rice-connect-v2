<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'retailer_id',
        'miller_id',
        'driver_id',
        'stock_id',
        'rice_variety',
        'sacks',
        'total_weight',
        'total_price',
        'shipping_method',
        'delivery_fee',
        'delivery_status',
        'delivery_type',
        'status',
        'scheduled_delivery_date',
    ];

    protected $casts = [
        'total_weight' => 'decimal:2',
        'total_price' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'sacks' => 'integer',
    ];

    public function retailer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'retailer_id');
    }

    public function miller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'miller_id');
    }
}
