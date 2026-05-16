<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wallet extends Model
{
    protected $fillable = ['user_id', 'balance'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function credit($amount)
    {
        $this->increment('balance', $amount);
    }

    public function debit($amount)
    {
        $this->decrement('balance', $amount);
    }
}
