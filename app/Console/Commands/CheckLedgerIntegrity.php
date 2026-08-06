<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\LedgerEntry;
use App\Models\Wallet;

/**
 * Verifies the ledger invariant that the payment flows rely on:
 *
 *   wallet.balance == sum(credits) - sum(debits)   (per wallet)
 *   sum(debits)    <= sum(credits)                 (money is never created)
 *
 * Opening balances are real ledger credits, so this holds by construction and
 * catches double-payments, orphaned writes, or balance drift on day one.
 */
class CheckLedgerIntegrity extends Command
{
    protected $signature = 'ledger:check {--fix : Recompute each wallet balance from its ledger entries}';

    protected $description = 'Verify every wallet balance equals its ledger history and that money is never created.';

    public function handle(): int
    {
        $fix = $this->option('fix');
        $violations = [];
        $wallets = Wallet::with('user')->get();

        foreach ($wallets as $wallet) {
            $credits = (float) LedgerEntry::where('user_id', $wallet->user_id)->where('type', 'credit')->sum('amount');
            $debits = (float) LedgerEntry::where('user_id', $wallet->user_id)->where('type', 'debit')->sum('amount');
            $expected = $credits - $debits;
            $current = (float) $wallet->balance;

            if (abs($current - $expected) > 0.01) {
                $who = $wallet->user ? ($wallet->user->role . ' #' . $wallet->user_id) : ('user #' . $wallet->user_id);
                $violations[] = sprintf(
                    'Wallet for %s: balance %s does not match ledger (%s credits - %s debits = %s)',
                    $who,
                    number_format($current, 2),
                    number_format($credits, 2),
                    number_format($debits, 2),
                    number_format($expected, 2)
                );

                if ($fix) {
                    $wallet->balance = $expected;
                    $wallet->save();
                    $this->line("  -> reconciled to " . number_format($expected, 2));
                }
            }
        }

        $totalCredits = (float) LedgerEntry::where('type', 'credit')->sum('amount');
        $totalDebits = (float) LedgerEntry::where('type', 'debit')->sum('amount');

        if ($totalDebits > $totalCredits + 0.01) {
            $this->error(sprintf(
                'Global imbalance: total debits (%s) exceed total credits (%s) - money was created.',
                number_format($totalDebits, 2),
                number_format($totalCredits, 2)
            ));
            return 1;
        }

        foreach ($violations as $violation) {
            $this->error($violation);
        }

        if (!empty($violations)) {
            $this->error('Ledger integrity check FAILED.');
            return 1;
        }

        $this->info(sprintf(
            'Ledger integrity OK: %d wallet(s) reconciled. credits %s >= debits %s.',
            $wallets->count(),
            number_format($totalCredits, 2),
            number_format($totalDebits, 2)
        ));

        return 0;
    }
}
