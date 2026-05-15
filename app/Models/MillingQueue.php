<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MillingQueue extends Model
{
    protected $fillable = [
        'miller_id',
        'palay_kg',
        'status',
        'priority',
        'queued_at',
        'processing_started_at',
        'completed_at',
    ];

    public function miller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'miller_id');
    }

    protected $casts = [
        'queued_at' => 'datetime',
        'processing_started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];
}
