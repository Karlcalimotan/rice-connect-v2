<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Single source of truth for moving money.
 *
 * Every movement writes a ledger entry AND mutates the wallet balance in the
 * same transaction, so the invariant
 *
 *     wallet.balance == sum(credits) - sum(debits)
 *
 * holds by construction. Movements that reference a business object (a
 * HarvestBatch or an Order) are idempotent: re-running the same
 * (user, type, reference) combination never moves funds twice.
 */
class PaymentService
{
    /**
     * Atomically move money from one user to another.
     *
     * @param  int  $fromUserId
     * @param  int  $toUserId
     * @param  float  $amount
     * @param  string  $debitDescription  description on the payer's ledger entry
     * @param  string|null  $creditDescription  description on the payee's entry (defaults to debit description)
     * @param  Model|null  $reference  business object (HarvestBatch/Order) for idempotency + audit
     * @param  array  $options  ['check_balance' => bool, 'created_at' => Carbon]
     * @return bool  true when funds actually moved, false when already recorded
     */
    public static function transfer(
        int $fromUserId,
        int $toUserId,
        float $amount,
        string $debitDescription,
        ?string $creditDescription = null,
        ?Model $reference = null,
        array $options = []
    ): bool {
        self::assertMovable($amount, $fromUserId, $toUserId);

        $creditDescription ??= $debitDescription;

        return DB::transaction(function () use ($fromUserId, $toUserId, $amount, $debitDescription, $creditDescription, $reference, $options) {
            $debited = self::debit($fromUserId, $amount, $debitDescription, $reference, $options);
            $credited = self::credit($toUserId, $amount, $creditDescription, $reference, $options);

            return $debited || $credited;
        });
    }

    /**
     * Record a credit (incoming money) for a user.
     */
    public static function credit(int $userId, float $amount, string $description, ?Model $reference = null, array $options = []): bool
    {
        self::assertMovable($amount);

        return DB::transaction(function () use ($userId, $amount, $description, $reference, $options) {
            if (self::alreadyRecorded($userId, 'credit', $reference)) {
                return false;
            }

            self::wallet($userId)->increment('balance', $amount);
            self::writeEntry($userId, $amount, 'credit', $description, $reference, $options);

            return true;
        });
    }

    /**
     * Record a debit (outgoing money) for a user.
     */
    public static function debit(int $userId, float $amount, string $description, ?Model $reference = null, array $options = []): bool
    {
        self::assertMovable($amount);

        return DB::transaction(function () use ($userId, $amount, $description, $reference, $options) {
            if (self::alreadyRecorded($userId, 'debit', $reference)) {
                return false;
            }

            $wallet = self::wallet($userId);

            if (($options['check_balance'] ?? false) && (float) $wallet->balance < $amount) {
                throw new \DomainException('Insufficient funds for user #' . $userId);
            }

            $wallet->decrement('balance', $amount);
            self::writeEntry($userId, $amount, 'debit', $description, $reference, $options);

            return true;
        });
    }

    /**
     * Whether a ledger entry already exists for this user/type/reference.
     */
    public static function alreadyRecorded(int $userId, string $type, ?Model $reference): bool
    {
        if (!$reference) {
            return false;
        }

        return LedgerEntry::where('user_id', $userId)
            ->where('type', $type)
            ->where('reference_type', get_class($reference))
            ->where('reference_id', $reference->getKey())
            ->exists();
    }

    private static function wallet(int $userId): Wallet
    {
        return Wallet::firstOrCreate(['user_id' => $userId], ['balance' => 0]);
    }

    private static function writeEntry(int $userId, float $amount, string $type, string $description, ?Model $reference, array $options): void
    {
        $entry = [
            'user_id' => $userId,
            'amount' => $amount,
            'type' => $type,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference ? $reference->getKey() : null,
            'description' => $description,
        ];

        if (isset($options['created_at'])) {
            $entry['created_at'] = $options['created_at'];
            $entry['updated_at'] = $options['created_at'];
        }

        LedgerEntry::create($entry);
    }

    private static function assertMovable(float $amount, ?int $fromUserId = null, ?int $toUserId = null): void
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Payment amount must be greater than zero.');
        }

        if ($fromUserId !== null && $fromUserId === $toUserId) {
            throw new \InvalidArgumentException('Cannot transfer money to the same user.');
        }
    }
}
