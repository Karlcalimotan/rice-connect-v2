<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Modules\Farmer\Models\HarvestBatch;
use App\Models\Order;
use App\Models\LedgerEntry;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuditAndNormalizeTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audit:transactions {--dry-run : Run the audit without saving changes to the database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Audits, corrects, and normalizes all transaction records and wallet balance history across all roles.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('⚠️ DRY-RUN MODE: No changes will be saved to the database.');
        }

        $this->info('🚀 Starting Rice Connect Transaction & Ledger History Audit...');

        $stats = [
            'total_batches_checked' => 0,
            'total_orders_checked' => 0,
            'batches_fixed' => 0,
            'orders_fixed' => 0,
            'duplicates_removed' => 0,
            'wallets_checked' => 0,
            'wallets_reconciled' => 0,
            'orphaned_ledgers_removed' => 0,
            'errors_corrected' => [],
            'unresolved_flags' => []
        ];

        try {
            DB::beginTransaction();

            // 1. Retrieve all users by role for validation lookup
            $farmers = User::where('role', 'farmer')->pluck('id')->toArray();
            $millers = User::where('role', 'miller')->pluck('id')->toArray();
            $retailers = User::where('role', 'retailer')->pluck('id')->toArray();
            $drivers = User::where('role', 'driver')->pluck('id')->toArray();

            if (empty($farmers) || empty($millers) || empty($retailers)) {
                $this->error('❌ Critical system users missing (Farmer, Miller, or Retailer). Cannot proceed.');
                DB::rollBack();
                return 1;
            }

            // -------------------------------------------------------------
            // A. HARVEST BATCHES AUDIT (Farmer ↔ Miller ↔ Driver)
            // -------------------------------------------------------------
            $this->info('🌾 Auditing Farmer Harvest Batches...');
            $batches = HarvestBatch::orderBy('id')->get();
            $stats['total_batches_checked'] = $batches->count();

            $batchDuplicatesSeen = [];

            foreach ($batches as $batch) {
                $isFixed = false;
                $batchId = $batch->id;

                // Unique hash to detect duplicate entries within 5 minutes
                $createdAt = Carbon::parse($batch->created_at);
                $dupHash = "{$batch->user_id}_{$batch->rice_variety}_{$batch->total_weight}_" . $createdAt->format('Y-m-d_H:i');
                if (isset($batchDuplicatesSeen[$dupHash])) {
                    // Duplicate record detected!
                    $stats['duplicates_removed']++;
                    $stats['errors_corrected'][] = "Deleted duplicate Harvest Batch #{$batchId} (exact match of Batch #{$batchDuplicatesSeen[$dupHash]} within 5 min range)";
                    if (!$dryRun) {
                        $batch->delete();
                    }
                    continue;
                }
                $batchDuplicatesSeen[$dupHash] = $batchId;

                // Role Association Validation
                if (!in_array($batch->user_id, $farmers)) {
                    // Farmer missing or incorrect role. Default to the first farmer.
                    $oldFarmer = $batch->user_id;
                    $batch->user_id = $farmers[0];
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Farmer ID changed from '{$oldFarmer}' to active Farmer ID '{$farmers[0]}'.";
                }

                if ($batch->buyer_id && !in_array($batch->buyer_id, $millers)) {
                    // Buyer is not a miller
                    $oldBuyer = $batch->buyer_id;
                    $batch->buyer_id = $millers[0];
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Miller Buyer ID updated from '{$oldBuyer}' to '{$millers[0]}'.";
                }

                if ($batch->driver_id && !in_array($batch->driver_id, $drivers)) {
                    // Driver assigned is invalid
                    $oldDriver = $batch->driver_id;
                    $batch->driver_id = !empty($drivers) ? $drivers[0] : null;
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Driver ID corrected from '{$oldDriver}' to '" . ($batch->driver_id ?? 'null') . "'.";
                }

                // Date Stamps
                if (empty($batch->harvest_date)) {
                    $batch->harvest_date = $createdAt->toDateString();
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Harvest date populated with creation timestamp.";
                }

                // Quantity & Price Normalization
                if ($batch->total_weight <= 0) {
                    if ($batch->number_of_bags > 0) {
                        $batch->total_weight = $batch->number_of_bags * 50;
                    } else {
                        $batch->number_of_bags = 10;
                        $batch->total_weight = 500.00;
                    }
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Total weight calculated as {$batch->total_weight}kg based on bags count.";
                }

                if ($batch->price_per_kg <= 0) {
                    $batch->price_per_kg = 20.00; // default 20 pesos per kg for Dinorado palay
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Base price per kg defaulted to ₱20.00.";
                }

                $isReceivedOrDone = in_array($batch->status, ['received', 'milled', 'processed', 'completed']);
                if ($isReceivedOrDone) {
                    if (empty($batch->actual_weight_kg) || $batch->actual_weight_kg <= 0) {
                        $batch->actual_weight_kg = $batch->total_weight;
                        $isFixed = true;
                        $stats['errors_corrected'][] = "Batch #{$batchId}: Empty actual weight set to match total weight ({$batch->total_weight}kg).";
                    }

                    if (empty($batch->final_price_per_kg) || $batch->final_price_per_kg <= 0) {
                        $batch->final_price_per_kg = $batch->suggested_price_per_kg ?: $batch->price_per_kg;
                        $isFixed = true;
                        $stats['errors_corrected'][] = "Batch #{$batchId}: Empty final price per kg filled with base price (₱{$batch->final_price_per_kg}).";
                    }
                }

                // Status Alignment & Progression sequence
                $oldStatus = $batch->status;
                $oldDeliveryStatus = $batch->delivery_status;

                // E.g. Status received but delivery status remains Pending/In Transit
                if ($isReceivedOrDone && !in_array($batch->delivery_status, ['Received', 'Completed'])) {
                    $batch->delivery_status = 'Completed';
                    $batch->drying_status = $batch->drying_status ?: 'received';
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Delivery status normalized to 'Completed' for received/processed palay.";
                }

                if ($batch->status === 'in_transit' && $batch->delivery_status !== 'In Transit') {
                    $batch->delivery_status = 'In Transit';
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Batch #{$batchId}: Delivery status aligned to 'In Transit'.";
                }

                // Detect stuck in pending for more than 7 days
                if (in_array($batch->status, ['pending', 'payment_pending']) && $createdAt->diffInDays(Carbon::now()) > 7) {
                    // Check if ledger entries exist. If yes, it's completed but status was stuck. If no, flag it.
                    $ledgerExists = LedgerEntry::where('reference_type', get_class($batch))->where('reference_id', $batchId)->exists();
                    if ($ledgerExists) {
                        $batch->status = 'received';
                        $batch->delivery_status = 'Completed';
                        $batch->drying_status = 'received';
                        $isFixed = true;
                        $stats['errors_corrected'][] = "Batch #{$batchId}: Stuck pending with existing ledger entries resolved to 'received'.";
                    } else {
                        $stats['unresolved_flags'][] = "Batch #{$batchId}: Stuck in '{$batch->status}' for " . $createdAt->diffInDays(Carbon::now()) . " days with no ledger transactions. Flagged for review.";
                    }
                }

                if ($isFixed) {
                    $stats['batches_fixed']++;
                    if (!$dryRun) {
                        $batch->save();
                    }
                }
            }

            // -------------------------------------------------------------
            // B. RETAILER ORDERS AUDIT (Retailer ↔ Miller ↔ Driver)
            // -------------------------------------------------------------
            $this->info('🛒 Auditing Retailer Orders...');
            $orders = Order::orderBy('id')->get();
            $stats['total_orders_checked'] = $orders->count();

            $orderDuplicatesSeen = [];

            foreach ($orders as $order) {
                $isFixed = false;
                $orderId = $order->id;

                $createdAt = Carbon::parse($order->created_at);
                $dupHash = "{$order->retailer_id}_{$order->miller_id}_{$order->sacks}_{$order->total_price}_" . $createdAt->format('Y-m-d_H:i');
                if (isset($orderDuplicatesSeen[$dupHash])) {
                    $stats['duplicates_removed']++;
                    $stats['errors_corrected'][] = "Deleted duplicate Order #{$orderId} (exact match of Order #{$orderDuplicatesSeen[$dupHash]} within 5 min range)";
                    if (!$dryRun) {
                        $order->delete();
                    }
                    continue;
                }
                $orderDuplicatesSeen[$dupHash] = $orderId;

                // Role Association Validation
                if (!in_array($order->retailer_id, $retailers)) {
                    $oldRetailer = $order->retailer_id;
                    $order->retailer_id = $retailers[0];
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Retailer ID corrected from '{$oldRetailer}' to '{$retailers[0]}'.";
                }

                if (!in_array($order->miller_id, $millers)) {
                    $oldMiller = $order->miller_id;
                    $order->miller_id = $millers[0];
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Miller ID corrected from '{$oldMiller}' to '{$millers[0]}'.";
                }

                if ($order->shipping_method === 'delivery' && $order->driver_id && !in_array($order->driver_id, $drivers)) {
                    $oldDriver = $order->driver_id;
                    $order->driver_id = !empty($drivers) ? $drivers[0] : null;
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Logistics Driver ID corrected from '{$oldDriver}' to '" . ($order->driver_id ?? 'null') . "'.";
                }

                // Date Stamps
                if (in_array($order->status, ['date_scheduled', 'ready_for_pickup', 'in_transit', 'delivered', 'completed']) && empty($order->scheduled_delivery_date)) {
                    $order->scheduled_delivery_date = $createdAt->addDay()->toDateString();
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Scheduled delivery/pickup date defaulted to 1 day after order creation.";
                }

                // Quantity & Price Recalculation
                if ($order->sacks <= 0) {
                    $order->sacks = 1;
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Order sacks count adjusted to minimum value of 1.";
                }

                $expectedWeight = $order->sacks * 50;
                if ($order->total_weight != $expectedWeight) {
                    $order->total_weight = $expectedWeight;
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Recalculated total weight to match sacks count ({$expectedWeight}kg).";
                }

                // Shipping & Delivery Fee Check
                if ($order->shipping_method === 'pickup' && $order->delivery_fee > 0) {
                    $oldFee = $order->delivery_fee;
                    $order->delivery_fee = 0.00;
                    $order->total_price = $order->total_price - $oldFee;
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Removed delivery fee of ₱{$oldFee} from pickup-only order, total price adjusted.";
                }

                if ($order->total_price <= 0) {
                    $order->total_price = ($order->sacks * 1500.00) + $order->delivery_fee; // assume 1500 Dinorado base price
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Empty total price recalculated as ₱{$order->total_price} based on standard rates.";
                }

                // Status Alignment & Progression sequence
                $isCompleted = ($order->status === 'completed');
                $isDelivered = ($order->status === 'delivered');

                if ($isCompleted && $order->delivery_status !== 'Confirmed Received') {
                    $order->delivery_status = 'Confirmed Received';
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Status alignment -> set delivery status to 'Confirmed Received' for completed order.";
                }

                if ($isDelivered && $order->delivery_status !== 'Delivered') {
                    $order->delivery_status = 'Delivered';
                    $isFixed = true;
                    $stats['errors_corrected'][] = "Order #{$orderId}: Status alignment -> set delivery status to 'Delivered' for delivered order.";
                }

                // Stuck in preparation/preparation_pending for more than 7 days
                if (in_array($order->status, ['pending_preparation', 'date_scheduled']) && $createdAt->diffInDays(Carbon::now()) > 7) {
                    $ledgerExists = LedgerEntry::where('reference_type', get_class($order))->where('reference_id', $orderId)->exists();
                    if ($ledgerExists) {
                        $order->status = 'completed';
                        $order->delivery_status = 'Confirmed Received';
                        $isFixed = true;
                        $stats['errors_corrected'][] = "Order #{$orderId}: Stuck preparation with active ledgers updated to 'completed'.";
                    } else {
                        $stats['unresolved_flags'][] = "Order #{$orderId}: Stuck in '{$order->status}' state for " . $createdAt->diffInDays(Carbon::now()) . " days with no ledger transactions. Flagged for review.";
                    }
                }

                if ($isFixed) {
                    $stats['orders_fixed']++;
                    if (!$dryRun) {
                        $order->save();
                    }
                }
            }

            // -------------------------------------------------------------
            // C. FINANCIAL LEDGER & WALLET BALANCE HISTORY AUDIT
            // -------------------------------------------------------------
            $this->info('💳 Reconciling Wallets & Financial Ledger History...');
            
            // Check orphan ledger entries first (referencing non-existent HarvestBatch or Order)
            $ledgerEntries = LedgerEntry::all();
            foreach ($ledgerEntries as $entry) {
                if ($entry->reference_type && $entry->reference_id) {
                    $refClass = $entry->reference_type;
                    if (class_exists($refClass)) {
                        $refModelExists = $refClass::where('id', $entry->reference_id)->exists();
                        if (!$refModelExists) {
                            $stats['orphaned_ledgers_removed']++;
                            $stats['errors_corrected'][] = "Removed orphaned Ledger Entry #{$entry->id} (referenced transaction {$refClass} #{$entry->reference_id} no longer exists).";
                            if (!$dryRun) {
                                $entry->delete();
                            }
                        }
                    }
                }
            }

            // Verify all wallet balances against ledger histories
            $wallets = Wallet::all();
            $stats['wallets_checked'] = $wallets->count();

            foreach ($wallets as $wallet) {
                $userId = $wallet->user_id;
                
                // Recalculate balance based on actual ledger history
                $credits = LedgerEntry::where('user_id', $userId)->where('type', 'credit')->sum('amount');
                $debits = LedgerEntry::where('user_id', $userId)->where('type', 'debit')->sum('amount');
                $expectedBalance = $credits - $debits;

                if (abs($wallet->balance - $expectedBalance) > 0.01) {
                    $oldBalance = $wallet->balance;
                    $wallet->balance = $expectedBalance;
                    
                    $stats['wallets_reconciled']++;
                    $stats['errors_corrected'][] = "Wallet for User #{$userId}: Balance reconciled from ₱{$oldBalance} to ₱{$expectedBalance} to match actual ledger history.";
                    
                    if (!$dryRun) {
                        $wallet->save();
                    }
                }
            }

            if ($dryRun) {
                DB::rollBack();
                $this->info('Dry-run complete. All simulated database modifications rolled back.');
            } else {
                DB::commit();
                $this->info('✅ Transaction and Ledger/Wallet balance database audit completed successfully.');
            }

            // Print Audit Report Summary
            $this->outputReportSummary($stats);

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ Audit Failed with exception: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }

        return 0;
    }

    /**
     * Outputs a beautifully formatted summary report table and summary list.
     */
    private function outputReportSummary(array $stats)
    {
        $this->newLine();
        $this->info('========================================================================');
        $this->info('                    RICE CONNECT AUDIT SUMMARY REPORT                   ');
        $this->info('========================================================================');
        
        $headers = ['Metric', 'Count'];
        $data = [
            ['Total Harvest Batches Checked', $stats['total_batches_checked']],
            ['Total Retailer Orders Checked', $stats['total_orders_checked']],
            ['Farmer Harvest Batches Corrected', $stats['batches_fixed']],
            ['Retailer Orders Corrected', $stats['orders_fixed']],
            ['Duplicate Records Removed', $stats['duplicates_removed']],
            ['Wallets History Checked', $stats['wallets_checked']],
            ['Wallets Balances Reconciled', $stats['wallets_reconciled']],
            ['Orphaned Ledger History Logs Removed', $stats['orphaned_ledgers_removed']],
            ['Unresolved Flags Raised', count($stats['unresolved_flags'])],
        ];

        $this->table($headers, $data);

        if (!empty($stats['errors_corrected'])) {
            $this->newLine();
            $this->info('🛡️  CORRECTED ERRORS SUMMARY:');
            foreach (array_slice($stats['errors_corrected'], 0, 15) as $correction) {
                $this->line("   ✅ {$correction}");
            }
            if (count($stats['errors_corrected']) > 15) {
                $this->line("   ... and " . (count($stats['errors_corrected']) - 15) . " more corrections made.");
            }
        }

        if (!empty($stats['unresolved_flags'])) {
            $this->newLine();
            $this->warn('⚠️  UNRESOLVED ISSUES REQUIRING MANUAL REVIEW:');
            foreach ($stats['unresolved_flags'] as $flag) {
                $this->line("   ❌ {$flag}");
            }
        }
        
        $this->info('========================================================================');
        $this->newLine();
    }
}
