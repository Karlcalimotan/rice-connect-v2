<?php

namespace Modules\Farmer\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Modules\Farmer\Models\HarvestBatch;
use Illuminate\Support\Facades\Hash;

class FarmerExampleSeeder extends Seeder
{
    public function run(): void
    {
        $farmer = User::updateOrCreate(
            ['email' => 'farmer_a@example.test'],
            [
                'first_name' => 'Sample',
                'last_name' => 'Farmer A',
                'username' => 'sample_farmer_a',
                'role' => 'farmer',
                'contact' => '09123456781',
                'password' => Hash::make('password'),
            ]
        );

        HarvestBatch::updateOrCreate(
            ['rice_variety' => 'Batch Example 001', 'user_id' => $farmer->id],
            [
                'number_of_bags' => 20,
                'total_weight' => 1000.00,
                'harvest_date' => now()->subDays(5)->toDateString(),
                'status' => 'unsold',
                'condition' => 'fresh',
                'location' => 'Sample Farm Location A',
            ]
        );

        HarvestBatch::updateOrCreate(
            ['rice_variety' => 'Batch Example 002', 'user_id' => $farmer->id],
            [
                'number_of_bags' => 15,
                'total_weight' => 750.00,
                'harvest_date' => now()->subDays(10)->toDateString(),
                'status' => 'sold',
                'condition' => 'ready',
                'location' => 'Sample Farm Location B',
            ]
        );
    }
}
