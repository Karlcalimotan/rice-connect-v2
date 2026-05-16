<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MillerDeliverySetting extends Model
{
    protected $fillable = [
        'miller_id',
        'base_delivery_fee',
        'extra_fee_per_municipality',
        'municipality_id',
    ];

    /**
     * The miller this setting belongs to.
     */
    public function miller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'miller_id');
    }

    /**
     * The municipality where the miller's facility is located.
     */
    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }
}
