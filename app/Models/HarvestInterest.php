<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HarvestInterest extends Model
{
    protected $fillable = ['harvest_id', 'miller_id'];

    public function miller()
    {
        return $this->belongsTo(\App\Models\User::class, 'miller_id');
    }

    public function harvest()
    {
        return $this->belongsTo(\Modules\Farmer\Models\HarvestBatch::class, 'harvest_id');
    }
}
