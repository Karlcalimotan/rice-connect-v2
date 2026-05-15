<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MillerStorageCapacity extends Model
{
    protected $fillable = [
        'user_id',
        'total_capacity_kg',
        'current_stock_kg',
        'available_capacity_kg',
        'utilization_rate',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'utilization_rate' => 'decimal:2',
    ];
}
