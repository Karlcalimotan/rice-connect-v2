<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsumerDemandHeatmap extends Model
{
    protected $fillable = [
        'retailer_id',
        'rice_variety',
        'time_slot',
        'day_of_week',
        'demand_count',
        'avg_quantity_purchased',
        'metric_date',
    ];

    public function retailer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'retailer_id');
    }

    protected $casts = [
        'metric_date' => 'date',
        'avg_quantity_purchased' => 'decimal:2',
    ];
}
