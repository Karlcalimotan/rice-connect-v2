<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Modules\Farmer\Models\HarvestBatch;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\LedgerEntry;
use App\Models\FinishedRiceStock;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class TestLedgerFlow extends Command
{
    protected $signature = 'test:ledger-flow';
    protected $description = 'Tests the new ledger logic without UI intervention.';

    public function handle()
    {
        $this->info('Starting Simulation Test...');

        try {
            DB::beginTransaction();

            // 1. Create Mock Users
            $farmer = User::factory()->create(['role' => 'farmer']);
            $miller = User::factory()->create(['role' => 'miller']);
            $retailer = User::factory()->create(['role' => 'retailer']);
            $driver = User::factory()->create(['role' => 'driver']);

            $this->info('Users created.');

            // 2. Mock Farmer -> Miller Transaction
            $batch = HarvestBatch::create([
                'user_id' => $farmer->id,
                'buyer_id' => $miller->id,
                'location' => 'Test Location',
                'rice_variety' => 'Dinorado',
                'harvest_date' => now(),
                'condition' => 'fresh',
                'total_sacks' => 10,
                'number_of_bags' => 10,
                'status' => 'payment_pending',
                'delivery_status' => 'Payment Pending',
                'delivery_type' => 'palay',
                'actual_weight_kg' => 500,
                'total_weight' => 500,
                'price_per_kg' => 20,
                'suggested_price_per_kg' => 20,
            ]);

            // Simulate MillerController@finalizeTransaction logic
            $totalPayment = $batch->actual_weight_kg * 22; // final price 22

            $batch->update([
                'final_price_per_kg' => 22,
                'price_per_kg' => 22,
                'total_weight' => $batch->actual_weight_kg,
                'delivery_status' => 'Completed',
                'status' => 'received',
                'drying_status' => 'received',
            ]);

            $millerWallet = Wallet::firstOrCreate(['user_id' => $miller->id]);
            $farmerWallet = Wallet::firstOrCreate(['user_id' => $farmer->id]);

            $millerWallet->debit($totalPayment);
            $farmerWallet->credit($totalPayment);

            LedgerEntry::create([
                'user_id' => $miller->id,
                'amount' => $totalPayment,
                'type' => 'debit',
                'reference_type' => get_class($batch),
                'reference_id' => $batch->id,
                'description' => 'Payment for Harvest Batch #' . $batch->id
            ]);

            LedgerEntry::create([
                'user_id' => $farmer->id,
                'amount' => $totalPayment,
                'type' => 'credit',
                'reference_type' => get_class($batch),
                'reference_id' => $batch->id,
                'description' => 'Payment received for Harvest Batch #' . $batch->id
            ]);

            $this->info("Miller paid Farmer: {$totalPayment}");
            $this->assertEquals($totalPayment, Wallet::where('user_id', $farmer->id)->value('balance'));
            $this->assertEquals(-$totalPayment, Wallet::where('user_id', $miller->id)->value('balance'));

            // 3. Miller Milled Rice and Listed it
            $stock = FinishedRiceStock::create([
                'miller_id' => $miller->id,
                'rice_variety' => 'Dinorado',
                'total_sacks' => 20,
                'unpacked_weight_kg' => 1000,
                'price_per_sack' => 1200,
                'low_stock_threshold' => 5
            ]);

            // 4. Mock Retailer -> Miller -> Driver Transaction
            $order = Order::create([
                'retailer_id' => $retailer->id,
                'miller_id' => $miller->id,
                'driver_id' => $driver->id,
                'stock_id' => $stock->id,
                'rice_variety' => 'Dinorado',
                'sacks' => 5,
                'total_weight' => 250,
                'total_price' => (5 * 1200) + 500, // 500 delivery fee
                'delivery_fee' => 500,
                'delivery_status' => 'Delivered',
                'status' => 'delivered'
            ]);

            // Simulate RetailerController@confirmReceived logic
            $order->update([
                'delivery_status' => 'Confirmed Received',
                'status' => 'completed',
            ]);

            $retailerWallet = Wallet::firstOrCreate(['user_id' => $retailer->id]);
            // refresh miller wallet
            $millerWallet = Wallet::where('user_id', $miller->id)->first();

            $retailerWallet->debit($order->total_price);
            $millerWallet->credit($order->total_price);

            LedgerEntry::create([
                'user_id' => $retailer->id,
                'amount' => $order->total_price,
                'type' => 'debit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment for Rice Order #' . $order->id
            ]);

            LedgerEntry::create([
                'user_id' => $miller->id,
                'amount' => $order->total_price,
                'type' => 'credit',
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'description' => 'Payment received for Rice Order #' . $order->id
            ]);

            if ($order->driver_id && $order->delivery_fee > 0) {
                $driverWallet = Wallet::firstOrCreate(['user_id' => $order->driver_id]);
                
                $millerWallet->debit($order->delivery_fee);
                $driverWallet->credit($order->delivery_fee);

                LedgerEntry::create([
                    'user_id' => $miller->id,
                    'amount' => $order->delivery_fee,
                    'type' => 'debit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Delivery fee payout for Order #' . $order->id
                ]);

                LedgerEntry::create([
                    'user_id' => $driver->id,
                    'amount' => $order->delivery_fee,
                    'type' => 'credit',
                    'reference_type' => get_class($order),
                    'reference_id' => $order->id,
                    'description' => 'Commission received for Order #' . $order->id
                ]);
            }

            $this->info("Retailer paid Miller: {$order->total_price}");
            $this->info("Miller paid Driver: {$order->delivery_fee}");
            
            $this->assertEquals(-$order->total_price, Wallet::where('user_id', $retailer->id)->value('balance'));
            $this->assertEquals($order->delivery_fee, Wallet::where('user_id', $driver->id)->value('balance'));

            DB::rollBack();
            $this->info('Simulation successful! No errors found. Rolling back test data.');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Simulation Failed: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }

    private function assertEquals($expected, $actual) {
        if (abs($expected - $actual) > 0.01) {
            throw new \Exception("Assertion failed: Expected {$expected}, got {$actual}");
        }
    }
}
