<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketPrice extends Model
{
    protected $fillable = [
        'rice_variety',
        'price_per_kg',
        'market_region',
        'price_date',
    ];

    protected $casts = [
        'price_date' => 'date',
        'price_per_kg' => 'decimal:2',
    ];
}
