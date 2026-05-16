<?php

namespace Modules\Miller\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\FinishedRiceStock;
use Illuminate\Support\Facades\Hash;

class MillerExampleSeeder extends Seeder
{
    public function run(): void
    {
        $miller = User::updateOrCreate(
            ['email' => 'miller_a@example.test'],
            [
                'first_name' => 'Sample',
                'last_name' => 'Miller A',
                'username' => 'sample_miller_a',
                'role' => 'miller',
                'contact' => '09123456782',
                'password' => Hash::make('password'),
            ]
        );

        FinishedRiceStock::updateOrCreate(
            ['miller_id' => $miller->id, 'rice_variety' => 'Sample Finished Stock A'],
            [
                'total_sacks' => 50,
                'unpacked_weight_kg' => 2500.00,
                'price_per_sack' => 1250.00,
            ]
        );
    }
}
