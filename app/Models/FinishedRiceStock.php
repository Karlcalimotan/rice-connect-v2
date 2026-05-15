<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinishedRiceStock extends Model
{
    protected $fillable = [
        'miller_id',
        'rice_variety',
        'total_sacks',
        'unpacked_weight_kg',
        'price_per_sack',
        'low_stock_threshold',
    ];

    public function miller()
    {
        return $this->belongsTo(User::class, 'miller_id');
    }

    public function deliverySetting()
    {
        return $this->hasOne(MillerDeliverySetting::class, 'miller_id', 'miller_id');
    }
}
