<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Municipality extends Model
{
    protected $fillable = ['name', 'distance_index'];

    /**
     * Users belonging to this municipality.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
