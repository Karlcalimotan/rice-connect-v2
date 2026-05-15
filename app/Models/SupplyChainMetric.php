<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplyChainMetric extends Model
{
    protected $fillable = [
        'region',
        'total_volume_kg',
        'farmers_count',
        'millers_count',
        'retailers_count',
        'distribution_bottleneck_score',
        'bottleneck_type',
        'metric_date',
    ];

    protected $casts = [
        'metric_date' => 'date',
        'distribution_bottleneck_score' => 'decimal:2',
    ];
}
