<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Farmer\Models\HarvestBatch;
use Illuminate\Support\Facades\DB;

class SupplyChainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create users
        $admin = User::updateOrCreate(['email' => 'admin@123'], [
            'first_name' => 'System',
            'last_name' => 'Admin',
            'username' => 'admin',
            'role' => 'admin',
            'contact' => '09000000000',
            'password' => Hash::make('admin123'),
        ]);

        $farmer = User::updateOrCreate(['email' => 'farmer@example.test'], [
            'first_name' => 'Farmer',
            'last_name' => 'Joe',
            'username' => 'farmer',
            'role' => 'farmer',
            'contact' => '09170000001',
            'password' => Hash::make('password'),
        ]);

        $miller = User::updateOrCreate(['email' => 'miller@example.test'], [
            'first_name' => 'Miller',
            'last_name' => 'Mary',
            'username' => 'miller',
            'role' => 'miller',
            'contact' => '09170000002',
            'password' => Hash::make('password'),
        ]);

        $retailer = User::updateOrCreate(['email' => 'retailer@example.test'], [
            'first_name' => 'Retailer',
            'last_name' => 'Rex',
            'username' => 'retailer',
            'role' => 'retailer',
            'contact' => '09170000003',
            'password' => Hash::make('password'),
        ]);

        $driver = User::updateOrCreate(['email' => 'driver@example.test'], [
            'first_name' => 'Driver',
            'last_name' => 'Dan',
            'username' => 'driver',
            'role' => 'driver',
            'contact' => '09170000004',
            'password' => Hash::make('password'),
        ]);

        // Farmer creates a harvest batch
        $batch = HarvestBatch::create([
            'user_id' => $farmer->id,
            'rice_variety' => 'Dinorado',
            'number_of_bags' => 10,
            'total_weight' => 500.00,
            'unpacked_weight_kg' => 0,
            'total_sacks' => 0,
            'harvest_date' => now()->toDateString(),
            'status' => 'unsold',
            'condition' => 'fresh',
        ]);

        // Miller expresses interest and buys the batch
        $batch->update(['status' => 'pending', 'buyer_id' => $miller->id]);
        $batch->update(['status' => 'sold']);

        // Miller marks received -> start drying -> ready_to_process
        $batch->update(['drying_status' => 'received']);
        $batch->update(['drying_status' => 'drying']);
        $batch->update(['drying_status' => 'ready_to_process']);

        // Miller processes: convert palay into polished rice (simulate recovery)
        // Assume recovery yields 60% of total_weight in polished rice
        $polished = round($batch->total_weight * 0.6, 2);
        $sacks = (int) floor($polished / 50);

        $batch->update([
            'unpacked_weight_kg' => $polished,
            'total_sacks' => $sacks,
            'status' => 'processed',
        ]);

        // Miller packs one sack
        if ($batch->unpacked_weight_kg >= 50) {
            $batch->decrement('unpacked_weight_kg', 50);
            $batch->increment('total_sacks', 1);
        }

        // Miller lists for sale with price per sack
        $batch->update(['price_per_sack' => 1500.00, 'price_per_kg' => 1500.00 / 50, 'status' => 'for_sale']);

        // Create Finished Rice Stock entry
        $stock = \App\Models\FinishedRiceStock::create([
            'miller_id' => $batch->buyer_id,
            'rice_variety' => $batch->rice_variety,
            'total_sacks' => $batch->total_sacks,
            'unpacked_weight_kg' => $batch->unpacked_weight_kg,
            'price_per_sack' => $batch->price_per_sack,
            'low_stock_threshold' => 10,
        ]);

        // Retailer places an order for 1 sack
        $requestedSacks = 1;
        DB::transaction(function () use ($retailer, $batch, $stock, $requestedSacks) {
            $stock->decrement('total_sacks', $requestedSacks);
            $stock->decrement('unpacked_weight_kg', $requestedSacks * 50);

            DB::table('orders')->insert([
                'retailer_id' => $retailer->id,
                'miller_id' => $batch->buyer_id,
                'stock_id' => $stock->id,
                'rice_variety' => $batch->rice_variety,
                'sacks' => $requestedSacks,
                'total_weight' => $requestedSacks * 50,
                'total_price' => $requestedSacks * $batch->price_per_sack,
                'shipping_method' => 'pickup',
                'delivery_fee' => 0,
                'status' => 'pending_preparation',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }
}
