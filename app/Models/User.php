<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'username',
        'contact',
        'role',
        'municipality',
        'province',
        'phone_number',
        'password',
        'town_id',
        'municipality_id',
        'vehicle_type',
        'license_number',
        'is_verified_driver',
    ];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    /**
     * Relationship: Miller can have many drivers.
     */
    public function drivers()
    {
        return $this->belongsToMany(User::class, 'miller_driver', 'miller_id', 'driver_id')
                    ->withPivot('is_active')
                    ->withTimestamps();
    }

    /**
     * Relationship: Driver can work for many millers.
     */
    public function millers()
    {
        return $this->belongsToMany(User::class, 'miller_driver', 'driver_id', 'miller_id')
                    ->withPivot('is_active')
                    ->withTimestamps();
    }

    public function harvestBatches()
    {
        return $this->hasMany(\Modules\Farmer\Models\HarvestBatch::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified_driver' => 'boolean',
        ];
    }
}
