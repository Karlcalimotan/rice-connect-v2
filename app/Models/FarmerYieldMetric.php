<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmerYieldMetric extends Model
{
    protected $fillable = [
        'user_id',
        'target_yield_kg',
        'actual_yield_kg',
        'crop_variety',
        'season',
        'year',
        'health_score',
        'health_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'health_score' => 'decimal:2',
    ];
}
