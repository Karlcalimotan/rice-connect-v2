<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Faker\Factory as Faker;
use Carbon\CarbonImmutable;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $now = CarbonImmutable::now();

        // Fetch users so we can satisfy NOT NULL foreign keys.
        $userIds = DB::table('users')->pluck('id')->all();
        $hasUsers = count($userIds) > 0;

        if (!$hasUsers) {
            return;
        }

        // Pick a user id, preferring a specific role so the seeded dashboards
        // have meaningful data for the demo accounts.
        $primaryEmails = [
            'farmer' => 'farmer@rice.com',
            'miller' => 'miller@rice.com',
            'retailer' => 'retailer@rice.com',
        ];

        $pickRoleUserId = function ($role) use ($userIds, $faker, $primaryEmails) {
            if (isset($primaryEmails[$role])) {
                $primary = DB::table('users')->where('email', $primaryEmails[$role])->value('id');
                if ($primary) {
                    return $primary;
                }
            }
            $roleUser = DB::table('users')->where('role', $role)->inRandomOrder()->value('id');
            if ($roleUser) {
                return $roleUser;
            }
            return $userIds[$faker->numberBetween(0, count($userIds) - 1)];
        };

        // Farmer yield metrics
        if (Schema::hasTable('farmer_yield_metrics')) {
            $farmerId = $pickRoleUserId('farmer');
            for ($i = 0; $i < 12; $i++) {
                DB::table('farmer_yield_metrics')->insert([
                    'user_id' => $farmerId,
                    'crop_variety' => $faker->randomElement(['White Rice', 'Brown Rice', 'Premium']),
                    'season' => $faker->randomElement(['dry', 'wet']),
                    'year' => $now->year,
                    'target_yield_kg' => $faker->numberBetween(2000, 8000),
                    'actual_yield_kg' => $faker->numberBetween(1000, 9000),
                    'health_score' => $faker->numberBetween(60, 100),
                    'health_status' => $faker->randomElement(['good', 'fair', 'poor']),
                    'created_at' => $now->subDays($i),
                    'updated_at' => $now->subDays($i),
                ]);
            }
        }

        // Market prices (scoped to a region the farmer may query)
        if (Schema::hasTable('market_prices')) {
            $farmerRegion = DB::table('users')->where('role', 'farmer')->value('municipality')
                ?: 'Iloilo';
            for ($i = 0; $i < 30; $i++) {
                DB::table('market_prices')->insert([
                    'rice_variety' => $faker->randomElement(['White Rice', 'Brown Rice', 'Premium']),
                    'price_per_kg' => $faker->randomFloat(2, 20, 80),
                    'market_region' => $faker->randomElement([$farmerRegion, 'Iloilo City', 'Oton']),
                    'price_date' => $now->subDays($i)->toDateString(),
                    'created_at' => $now->subDays($i),
                    'updated_at' => $now->subDays($i),
                ]);
            }
        }

        // Miller processing logs
        if (Schema::hasTable('miller_processing_logs')) {
            $millerId = $pickRoleUserId('miller');
            for ($i = 0; $i < 20; $i++) {
                $input = $faker->numberBetween(1000, 10000);
                $output = (int) ($input * ($faker->numberBetween(70, 95) / 100));
                $huskWaste = max(0, $input - $output);

                $processingStart = $now->copy()->subHours($i * 3);

                DB::table('miller_processing_logs')->insert([
                    'user_id' => $millerId,
                    'input_palay_kg' => $input,
                    'output_rice_kg' => $output,
                    'husk_waste_kg' => $huskWaste,
                    'recovery_rate' => round(($output / $input) * 100, 2),
                    'processing_efficiency' => $faker->numberBetween(60, 100),
                    'processing_start' => $processingStart,
                    'processing_end' => $processingStart->copy()->addMinutes($faker->numberBetween(30, 180)),
                    'status' => $faker->randomElement(['completed', 'processing', 'failed']),
                    'created_at' => $processingStart,
                    'updated_at' => $processingStart,
                ]);
            }
        }

        // Miller storage capacity
        if (Schema::hasTable('miller_storage_capacity')) {
            DB::table('miller_storage_capacity')->insertOrIgnore([
                'user_id' => $pickRoleUserId('miller'),
                'total_capacity_kg' => 100000,
                'current_stock_kg' => 65000,
                'available_capacity_kg' => 35000,
                'utilization_rate' => 65.0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Milling queues
        if (Schema::hasTable('milling_queues')) {
            $millerId = $pickRoleUserId('miller');
            $statuses = ['pending', 'pending', 'processing', 'completed'];
            foreach ($statuses as $idx => $status) {
                DB::table('milling_queues')->insert([
                    'miller_id' => $millerId,
                    'palay_kg' => $faker->numberBetween(200, 2000),
                    'status' => $status,
                    'priority' => $faker->numberBetween(1, 5),
                    'queued_at' => $now->copy()->subMinutes($idx * 30),
                    'processing_started_at' => $status === 'processing' || $status === 'completed' ? $now->copy()->subMinutes($idx * 30)->addMinutes(5) : null,
                    'completed_at' => $status === 'completed' ? $now->copy()->subMinutes($idx * 30)->addMinutes(25) : null,
                    'created_at' => $now->copy()->subMinutes($idx * 30),
                    'updated_at' => $now->copy()->subMinutes($idx * 30),
                ]);
            }
        }

        // Retailer stock metrics
        if (Schema::hasTable('retailer_stock_metrics')) {
            $retailerId = $pickRoleUserId('retailer');
            for ($i = 0; $i < 6; $i++) {
                DB::table('retailer_stock_metrics')->insert([
                    'user_id' => $retailerId,
                    'rice_variety' => $faker->randomElement(['White Rice', 'Brown Rice', 'Premium']),
                    'stock_units' => $faker->numberBetween(50, 2000),
                    'units_sold_monthly' => $faker->numberBetween(1, 500),
                    'turnover_rate' => $faker->numberBetween(1, 30),
                    'profit_margin_percentage' => $faker->randomFloat(2, 5, 40),
                    'cost_per_unit' => $faker->randomFloat(2, 10, 60),
                    'selling_price_per_unit' => $faker->randomFloat(2, 15, 90),
                    'metric_date' => $now->subDays($i)->toDateString(),
                    'created_at' => $now->subDays($i),
                    'updated_at' => $now->subDays($i),
                ]);
            }
        }

        // Consumer demand heatmap
        if (Schema::hasTable('consumer_demand_heatmap')) {
            $retailerId = $pickRoleUserId('retailer');
            $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            $slots = ['morning', 'afternoon', 'evening', 'night'];

            foreach ($days as $dIdx => $day) {
                foreach ($slots as $slot) {
                    DB::table('consumer_demand_heatmap')->insert([
                        'retailer_id' => $retailerId,
                        'rice_variety' => $faker->randomElement(['White Rice', 'Brown Rice', 'Premium']),
                        'time_slot' => $slot,
                        'day_of_week' => $day,
                        'demand_count' => $faker->numberBetween(0, 120),
                        'avg_quantity_purchased' => $faker->randomFloat(2, 0.5, 10),
                        'metric_date' => $now->copy()->subDays($dIdx)->toDateString(),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }
        }

        // Supply chain metrics
        if (Schema::hasTable('supply_chain_metrics')) {
            $regions = ['Iloilo City', 'Oton', 'Santa Barbara'];
            foreach ($regions as $idx => $region) {
                DB::table('supply_chain_metrics')->insert([
                    'region' => $region,
                    'total_volume_kg' => $faker->numberBetween(100000, 400000),
                    'farmers_count' => $faker->numberBetween(40, 200),
                    'millers_count' => $faker->numberBetween(5, 40),
                    'retailers_count' => $faker->numberBetween(10, 50),
                    'distribution_bottleneck_score' => $faker->numberBetween(5, 80),
                    'bottleneck_type' => $faker->randomElement(['logistics', 'pricing', 'quality']),
                    'metric_date' => $now->toDateString(),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        // Regional distribution logs
        if (Schema::hasTable('regional_distribution_logs')) {
            $regions = ['Iloilo City', 'Oton', 'Santa Barbara', 'Passi City'];
            for ($i = 0; $i < 10; $i++) {
                DB::table('regional_distribution_logs')->insert([
                    'source_region' => $faker->randomElement($regions),
                    'destination_region' => $faker->randomElement($regions),
                    'volume_kg' => $faker->numberBetween(500, 5000),
                    'status' => $faker->randomElement(['in_transit', 'delivered', 'delayed']),
                    'shipped_date' => $now->subDays($i),
                    'delay_hours' => $faker->numberBetween(0, 72),
                    'delivered_date' => $faker->boolean(50) ? $now->subDays($i)->addHours($faker->numberBetween(1, 48)) : null,
                    'created_at' => $now->subDays($i),
                    'updated_at' => $now->subDays($i),
                ]);
            }
        }
    }
}
