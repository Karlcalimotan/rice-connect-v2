<?php

namespace Modules\MillerAdmin\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Municipality;
use App\Models\MillerDeliverySetting;
use Illuminate\Support\Facades\Hash;

class MillerAdminExampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create a dedicated Miller Admin user
        $admin = User::updateOrCreate(
            ['email' => 'milleradmin@rice.com'],
            [
                'first_name' => 'Miller',
                'last_name' => 'Administrator',
                'username' => 'miller_admin',
                'contact' => '0987654321',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Ensure some sample municipalities have consistent data
        $passi = Municipality::where('name', 'Passi City')->first();
        if ($passi) {
            $passi->update(['distance_index' => 1]);
        }

        $iloilo = Municipality::where('name', 'Iloilo City')->first();
        if ($iloilo) {
            $iloilo->update(['distance_index' => 19]);
        }

        // 3. Create sample Miller Delivery Settings for existing millers
        $millers = User::where('role', 'miller')->get();
        foreach ($millers as $miller) {
            MillerDeliverySetting::updateOrCreate(
                ['miller_id' => $miller->id],
                [
                    'base_delivery_fee' => 200.00,
                    'extra_fee_per_municipality' => 75.00,
                    'municipality_id' => $miller->municipality_id ?: $passi?->id,
                ]
            );
        }
    }
}
