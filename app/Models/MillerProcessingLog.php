<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MillerProcessingLog extends Model
{
    protected $fillable = [
        'user_id',
        'input_palay_kg',
        'output_rice_kg',
        'husk_waste_kg',
        'recovery_rate',
        'processing_efficiency',
        'processing_start',
        'processing_end',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'processing_start' => 'datetime',
        'processing_end' => 'datetime',
        'recovery_rate' => 'decimal:2',
        'processing_efficiency' => 'decimal:2',
    ];
}
