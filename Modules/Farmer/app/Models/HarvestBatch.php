<?php

namespace Modules\Farmer\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class HarvestBatch extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * (Optional: Laravel usually finds 'harvest_batches' automatically)
     */
    protected $table = 'harvest_batches';

    /**
     * The attributes that are mass assignable.
     * This allows these fields to be saved from your React form.
     */
    protected $fillable = [
        'user_id',
        'buyer_id',
        'driver_id',
        'rice_variety',
        'number_of_bags',
        'total_weight',
        'harvest_date',
        'price_per_kg',
        'condition', 
        'status',
        'drying_status',
        'unpacked_weight_kg',
        'actual_weight_kg',
        'suggested_price_per_kg',
        'final_price_per_kg',
        'total_sacks',
        'price_per_sack',
        'delivery_method',
        'delivery_status',
        'delivery_type',
        'hidden_from_farmer',
        'location',
        'accepted_miller_id',
        'scheduled_pickup_date',
    ];

    public function acceptedMiller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_miller_id');
    }

    public function interests()
    {
        return $this->hasMany(\App\Models\HarvestInterest::class, 'harvest_id');
    }

    protected $casts = [
        'total_weight' => 'decimal:2',
        'unpacked_weight_kg' => 'decimal:2',
        'actual_weight_kg' => 'decimal:2',
        'price_per_kg' => 'decimal:2',
        'suggested_price_per_kg' => 'decimal:2',
        'final_price_per_kg' => 'decimal:2',
        'price_per_sack' => 'decimal:2',
        'total_sacks' => 'integer',
        'hidden_from_farmer' => 'boolean',
    ];

    /**
     * Relationship: Each harvest batch belongs to one Farmer (User).
     * * This allows you to do: $batch->user->first_name
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'buyer_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'driver_id');
    }
}