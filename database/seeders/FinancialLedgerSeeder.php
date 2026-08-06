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
     *
     * Idempotency notes:
     *  - Starting capital is backed by a real "Opening Balance" ledger entry, so
     *    `sum(credits) - sum(debits) == wallet.balance` holds by construction and
     *    the audit command can reconcile wallets without zeroing seeded funds.
     *  - Historic batch/order ledgers and the standalone analytics entries are
     *    guarded so re-running this seeder never double-pays or re-inflates.
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

        // 1. Wallets + ledger-backed opening balances
        $millerWallet = $this->ensureWalletWithOpeningBalance($miller, 500000, 'Opening Balance (miller startup capital)');
        $retailerWallet = $this->ensureWalletWithOpeningBalance($retailer, 200000, 'Opening Balance (retailer startup capital)');
        $farmerWallet = Wallet::firstOrCreate(['user_id' => $farmer->id], ['balance' => 0]);
        $driverWallet = Wallet::firstOrCreate(['user_id' => $driver->id], ['balance' => 0]);

        // 2. Historic ledgers for completed palay batches (Farmer -> Miller)
        $completedBatches = HarvestBatch::where('status', 'received')->get();

        foreach ($completedBatches as $batch) {
            if (empty($batch->actual_weight_kg) || $batch->actual_weight_kg <= 0) {
                $this->command->warn("Skipping unweighed batch #{$batch->id} (actual_weight_kg is empty). Backfill it before generating its ledger.");
                continue;
            }

            $payment = $batch->actual_weight_kg * ($batch->final_price_per_kg ?? 20);

            if ($this->hasLedgerFor($batch)) {
                continue;
            }

            \App\Services\PaymentService::transfer(
                $miller->id,
                $batch->user_id,
                $payment,
                'Payment for Harvest Batch #' . $batch->id,
                'Payment received for Harvest Batch #' . $batch->id,
                $batch,
                ['created_at' => $batch->updated_at]
            );
        }

        // 3. Historic ledgers for completed rice orders (Retailer -> Miller -> Driver)
        $completedOrders = Order::where('status', 'completed')->get();

        foreach ($completedOrders as $order) {
            if ($this->hasLedgerFor($order)) {
                continue;
            }

            \App\Services\PaymentService::transfer(
                $order->retailer_id,
                $order->miller_id,
                $order->total_price,
                'Payment for Rice Order #' . $order->id,
                'Payment received for Rice Order #' . $order->id,
                $order,
                ['created_at' => $order->updated_at]
            );

            if ($order->driver_id && $order->delivery_fee > 0) {
                \App\Services\PaymentService::transfer(
                    $order->miller_id,
                    $order->driver_id,
                    $order->delivery_fee,
                    'Delivery fee payout for Order #' . $order->id,
                    'Commission received for Order #' . $order->id,
                    $order,
                    ['created_at' => $order->updated_at]
                );
            }
        }

        // 4. Standalone dummy ledger entries for analytics views (idempotent).
        //    Guarded as a single unit: if any farmer bonus already exists, skip.
        $alreadySeeded = LedgerEntry::where('user_id', $farmer->id)
            ->whereNull('reference_type')
            ->where('description', 'External Palay Sale Bonus')
            ->exists();

        if (!$alreadySeeded) {
            for ($i = 1; $i <= 5; $i++) {
                $amount = rand(500, 5000);
                $date = Carbon::now()->subDays(rand(1, 14));

                \App\Services\PaymentService::credit(
                    $farmer->id,
                    $amount,
                    "External Palay Sale Bonus",
                    null,
                    ['created_at' => $date]
                );

                $tip = rand(50, 200);
                \App\Services\PaymentService::credit(
                    $driver->id,
                    $tip,
                    "Cash Tip #{$i}",
                    null,
                    ['created_at' => $date]
                );
            }
        }
    }

    private function ensureWalletWithOpeningBalance(User $user, float $amount, string $description): Wallet
    {
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);

        $openingExists = LedgerEntry::where('user_id', $user->id)
            ->whereNull('reference_type')
            ->whereNull('reference_id')
            ->where('type', 'credit')
            ->where('description', $description)
            ->exists();

        if (!$openingExists) {
            LedgerEntry::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'type' => 'credit',
                'reference_type' => null,
                'reference_id' => null,
                'description' => $description,
            ]);

            // Only bump the balance when the wallet was freshly created (balance 0);
            // a pre-existing wallet (e.g. on a partially seeded DB) already holds
            // its capital, we are only backfilling the backing ledger entry.
            if ((float) $wallet->balance === 0.0) {
                $wallet->credit($amount);
            }
        }

        return $wallet;
    }

    private function hasLedgerFor($model): bool
    {
        return LedgerEntry::where('reference_type', get_class($model))
            ->where('reference_id', $model->id)
            ->exists();
    }
}
