<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RetailerStockMetric extends Model
{
    protected $fillable = [
        'user_id',
        'rice_variety',
        'stock_units',
        'units_sold_monthly',
        'turnover_rate',
        'profit_margin_percentage',
        'cost_per_unit',
        'selling_price_per_unit',
        'metric_date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'metric_date' => 'date',
        'turnover_rate' => 'decimal:2',
        'profit_margin_percentage' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'selling_price_per_unit' => 'decimal:2',
    ];
}
