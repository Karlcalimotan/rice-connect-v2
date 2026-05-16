<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Wallet;
use App\Models\LedgerEntry;
use App\Models\Order;
use Modules\Farmer\Models\HarvestBatch;
use Carbon\Carbon;

class FinancialLedgerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $farmer = User::where('role', 'farmer')->first();
        $miller = User::where('role', 'miller')->first();
        $retailer = User::where('role', 'retailer')->first();
        $driver = User::where('role', 'driver')->first();

        if (!$farmer || !$miller || !$retailer || !$driver) {
            $this->command->warn('Missing required users for FinancialLedgerSeeder. Please ensure other seeders run first.');
            return;
        }

        // 1. Give users some starting balances if wallets don't exist
        $millerWallet = Wallet::firstOrCreate(['user_id' => $miller->id], ['balance' => 500000]);
        $farmerWallet = Wallet::firstOrCreate(['user_id' => $farmer->id], ['balance' => 0]);
        $retailerWallet = Wallet::firstOrCreate(['user_id' => $retailer->id], ['balance' => 200000]);
        $driverWallet = Wallet::firstOrCreate(['user_id' => $driver->id], ['balance' => 0]);

        // 2. Fetch existing completed batches and orders to generate historic ledgers for them
        $completedBatches = HarvestBatch::where('status', 'received')->get();
        
        foreach ($completedBatches as $batch) {
            $payment = $batch->actual_weight_kg * ($batch->final_price_per_kg ?? 20);

            // Avoid duplicate ledgers
            if (LedgerEntry::where('reference_type', get_class($batch))->where('reference_id', $batch->id)->exists()) {
                continue;
            }

            $millerWallet->debit($payment);
            $farmerWallet->credit($payment);

            LedgerEntry::create([
                'user_id' => $miller->id,
                'amount' => $payment,
                'type' => 'debit',
                'reference_type' => get_class($batch),
                'reference_id' => $batch->id,
                'description' => 'Payment for Harvest Batch #' . $batch->id,
                'created_at' => $batch->updated_at,
                'updated_at' => $batch->updated_at,
            ]);

            LedgerEntry::create([
                'user_id' => $batch->user_id,
                'amount' => $payment,
                'type' => 'credit',
                'reference_type' => get_class($batch),
                'reference_id' => $batch->id,
                'description' => 'Payment received for Harvest Batch #' . $batch->id,
                'created_at' => $batch->updated_at,
                'updated_at' => $batch->updated_at,
            ]);
        }

        // 3. Retailer -> Miller -> Driver Orders
        $completedOrders = Order::where('status', 'completed')->get();
        
        foreach ($completedOrders as $order) {
            if (LedgerEntry::where('reference_type', get_class($order))->where('reference_id', $order->id)->exists()) {
                continue;
            }

            $retailerWallet->debit($order->total_price);
            $millerWallet->credit($order->total_price);

            LedgerEntry::create([
                'user_id' => $order->retailer_id,
                'amount' => $order->total_price,
                'type' => 'debit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment for Rice Order #' . $order->id,
                'created_at' => $order->updated_at,
                'updated_at' => $order->updated_at,
            ]);

            LedgerEntry::create([
                'user_id' => $order->miller_id,
                'amount' => $order->total_price,
                'type' => 'credit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment received for Rice Order #' . $order->id,
                'created_at' => $order->updated_at,
                'updated_at' => $order->updated_at,
            ]);

            if ($order->driver_id && $order->delivery_fee > 0) {
                $orderDriverWallet = Wallet::firstOrCreate(['user_id' => $order->driver_id]);
                
                $millerWallet->debit($order->delivery_fee);
                $orderDriverWallet->credit($order->delivery_fee);

                LedgerEntry::create([
                    'user_id' => $order->miller_id,
                    'amount' => $order->delivery_fee,
                    'type' => 'debit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Delivery fee payout for Order #' . $order->id,
                    'created_at' => $order->updated_at,
                    'updated_at' => $order->updated_at,
                ]);

                LedgerEntry::create([
                    'user_id' => $order->driver_id,
                    'amount' => $order->delivery_fee,
                    'type' => 'credit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Commission received for Order #' . $order->id,
                    'created_at' => $order->updated_at,
                    'updated_at' => $order->updated_at,
                ]);
            }
        }

        // 4. Standalone dummy ledger entries for analytics views
        for ($i = 1; $i <= 5; $i++) {
            $amount = rand(500, 5000);
            $date = Carbon::now()->subDays(rand(1, 14));
            
            // Farmer random credit
            $farmerWallet->credit($amount);
            LedgerEntry::create([
                'user_id' => $farmer->id,
                'amount' => $amount,
                'type' => 'credit',
                'description' => "External Palay Sale Bonus",
                'created_at' => $date,
                'updated_at' => $date,
            ]);

            // Driver random delivery tip
            $tip = rand(50, 200);
            $driverWallet->credit($tip);
            LedgerEntry::create([
                'user_id' => $driver->id,
                'amount' => $tip,
                'type' => 'credit',
                'description' => "Cash Tip #{$i}",
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }
}
