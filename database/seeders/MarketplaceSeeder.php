<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Modules\Farmer\Models\HarvestBatch;
use App\Models\FinishedRiceStock;
use App\Models\Order;
use Illuminate\Support\Facades\Hash;

class MarketplaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure users exist
        $farmer = User::where('role', 'farmer')->first();
        if (!$farmer) {
            $farmer = User::create([
                'first_name' => 'Demo',
                'last_name' => 'Farmer',
                'username' => 'demo_farmer',
                'email' => 'farmer_demo@example.com',
                'role' => 'farmer',
                'contact' => '09123456789',
                'password' => Hash::make('password'),
                'province' => 'Iloilo',
                'municipality' => 'Iloilo City',
                'municipality_id' => 1
            ]);
        }

        $miller = User::where('role', 'miller')->first();
        if (!$miller) {
            $miller = User::create([
                'first_name' => 'Demo',
                'last_name' => 'Miller',
                'username' => 'demo_miller',
                'email' => 'miller_demo@example.com',
                'role' => 'miller',
                'contact' => '09987654321',
                'password' => Hash::make('password'),
                'province' => 'Iloilo',
                'municipality' => 'Iloilo City',
                'municipality_id' => 1
            ]);
        }

        // 2. Create Batches for the Marketplace (Available for Millers)
        $varieties = ['Dinorado', '7-tonner', 'RC160', 'Jasmine'];
        
        foreach ($varieties as $index => $variety) {
            HarvestBatch::create([
                'user_id' => $farmer->id,
                'rice_variety' => $variety,
                'number_of_bags' => 20 + $index,
                'total_weight' => (20 + $index) * 50,
                'harvest_date' => now()->subDays(rand(1, 10))->toDateString(),
                'status' => 'available',
                'condition' => $index % 2 == 0 ? 'fresh' : 'ready',
                'location' => 'Pavia, Iloilo',
                'delivery_status' => 'Pending',
                'total_sacks' => 20 + $index,
            ]);
        }

        // 3. Create Batches for Miller Inventory (Received/Processing)
        //    Guarded so re-seeding never creates duplicate received batches, which
        //    would otherwise generate phantom payment pairs in FinancialLedgerSeeder.
        $hasInventoryBatch = HarvestBatch::where('user_id', $farmer->id)
            ->whereNotNull('buyer_id')
            ->exists();

        if (!$hasInventoryBatch) {
            HarvestBatch::create([
                'user_id' => $farmer->id,
                'buyer_id' => $miller->id,
                'accepted_miller_id' => $miller->id,
                'rice_variety' => 'RC160',
                'number_of_bags' => 50,
                'total_weight' => 2500,
                'harvest_date' => now()->subDays(15)->toDateString(),
                'status' => 'received',
                'drying_status' => 'received',
                'condition' => 'fresh',
                'location' => 'Zarraga, Iloilo',
                'delivery_status' => 'Received',
                'total_sacks' => 50,
                'actual_weight_kg' => 2500,
                'final_price_per_kg' => 20,
            ]);

            HarvestBatch::create([
                'user_id' => $farmer->id,
                'buyer_id' => $miller->id,
                'accepted_miller_id' => $miller->id,
                'rice_variety' => 'Dinorado',
                'number_of_bags' => 30,
                'total_weight' => 1500,
                'harvest_date' => now()->subDays(20)->toDateString(),
                'status' => 'processing',
                'drying_status' => 'ready_to_process',
                'condition' => 'fresh',
                'location' => 'Santa Barbara, Iloilo',
                'delivery_status' => 'Received',
                'total_sacks' => 30,
            ]);
        }

        // 4. Create Finished Rice Stock for Retailer Marketplace
        FinishedRiceStock::updateOrCreate(
            ['miller_id' => $miller->id, 'rice_variety' => 'Dinorado Premium'],
            [
                'total_sacks' => 100,
                'unpacked_weight_kg' => 5000,
                'price_per_sack' => 1350,
                'low_stock_threshold' => 10,
            ]
        );

        FinishedRiceStock::updateOrCreate(
            ['miller_id' => $miller->id, 'rice_variety' => 'RC160 Milled'],
            [
                'total_sacks' => 45,
                'unpacked_weight_kg' => 2250,
                'price_per_sack' => 1200,
                'low_stock_threshold' => 5,
            ]
        );
    }
}
