<?php

namespace Modules\Retailer\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\FinishedRiceStock;
use Illuminate\Support\Facades\Hash;

class RetailerExampleSeeder extends Seeder
{
    public function run(): void
    {
        $retailer = User::updateOrCreate(
            ['email' => 'retailer_a@example.test'],
            [
                'first_name' => 'Sample',
                'last_name' => 'Retailer A',
                'username' => 'sample_retailer_a',
                'role' => 'retailer',
                'contact' => '09123456783',
                'password' => Hash::make('password'),
            ]
        );

        // We need a miller and a stock entry to create an order
        $stock = FinishedRiceStock::first();

        if ($stock) {
            Order::updateOrCreate(
                ['retailer_id' => $retailer->id, 'rice_variety' => 'Retailer Order Example'],
                [
                    'miller_id' => $stock->miller_id,
                    'stock_id' => $stock->id,
                    'sacks' => 5,
                    'total_weight' => 250.00,
                    'total_price' => 7500.00,
                    'status' => 'pending_pickup',
                ]
            );
        }
    }
}
