<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegionalDistributionLog extends Model
{
    protected $fillable = [
        'source_region',
        'destination_region',
        'volume_kg',
        'status',
        'shipped_date',
        'delivered_date',
        'delay_hours',
    ];

    protected $casts = [
        'shipped_date' => 'datetime',
        'delivered_date' => 'datetime',
        'delay_hours' => 'decimal:2',
    ];
}
