<?php

namespace Tests\Feature;

use App\Models\LedgerEntry;
use App\Models\User;
use App\Models\Wallet;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_transfer_moves_funds_and_writes_both_ledger_entries(): void
    {
        $payer = User::factory()->create();
        $payee = User::factory()->create();
        PaymentService::credit($payer->id, 1000, 'Opening Balance (test capital)');

        $moved = PaymentService::transfer(
            $payer->id,
            $payee->id,
            250.50,
            'Payment for reference',
            'Payment received',
            $payer
        );

        $this->assertTrue($moved);
        $this->assertEqualsWithDelta(749.50, (float) Wallet::where('user_id', $payer->id)->value('balance'), 0.001);
        $this->assertEqualsWithDelta(250.50, (float) Wallet::where('user_id', $payee->id)->value('balance'), 0.001);

        $this->assertSame(1, LedgerEntry::where('user_id', $payer->id)->where('type', 'debit')->count());
        $this->assertSame(1, LedgerEntry::where('user_id', $payee->id)->where('type', 'credit')->count());
    }

    public function test_transfer_is_idempotent_per_reference(): void
    {
        $payer = User::factory()->create();
        $payee = User::factory()->create();
        Wallet::create(['user_id' => $payer->id, 'balance' => 1000]);
        $reference = User::factory()->create();

        $first = PaymentService::transfer($payer->id, $payee->id, 100, 'Payment', 'Received', $reference);
        $second = PaymentService::transfer($payer->id, $payee->id, 100, 'Payment', 'Received', $reference);

        $this->assertTrue($first);
        $this->assertFalse($second);
        $this->assertEqualsWithDelta(900.00, (float) Wallet::where('user_id', $payer->id)->value('balance'), 0.001);
        $this->assertEqualsWithDelta(100.00, (float) Wallet::where('user_id', $payee->id)->value('balance'), 0.001);
        $this->assertSame(1, LedgerEntry::where('user_id', $payer->id)->count());
        $this->assertSame(1, LedgerEntry::where('user_id', $payee->id)->count());
    }

    public function test_ledger_invariant_holds_after_transfers(): void
    {
        $alice = User::factory()->create();
        $bob = User::factory()->create();
        $carol = User::factory()->create();
        PaymentService::credit($alice->id, 1000, 'Opening Balance (test capital)');

        PaymentService::transfer($alice->id, $bob->id, 300, 'a -> b', 'b got', $alice);
        PaymentService::transfer($bob->id, $carol->id, 120, 'b -> c', 'c got', $bob);

        foreach ([$alice, $bob, $carol] as $user) {
            $balance = (float) Wallet::where('user_id', $user->id)->value('balance');
            $credits = (float) LedgerEntry::where('user_id', $user->id)->where('type', 'credit')->sum('amount');
            $debits = (float) LedgerEntry::where('user_id', $user->id)->where('type', 'debit')->sum('amount');

            $this->assertEqualsWithDelta($balance, $credits - $debits, 0.001, "Invariant broken for user {$user->id}");
        }
    }

    public function test_transfer_rejects_non_positive_amounts(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        PaymentService::transfer(1, 2, 0, 'no-op');
    }

    public function test_transfer_rejects_same_user(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        PaymentService::transfer(7, 7, 100, 'no-op');
    }
}
