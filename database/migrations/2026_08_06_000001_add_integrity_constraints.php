<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Money-integrity constraints.
 *
 * The unique index below is cross-database (works on SQLite + MySQL) and is the
 * primary idempotency guard: a user may have at most one credit and one debit
 * per referenced business object (HarvestBatch/Order).
 *
 * CHECK constraints cannot be added via ALTER TABLE on SQLite, so the stronger
 * checks are applied on MySQL and PostgreSQL (production). SQLite dev/CI keeps
 * the index-level guarantee and relies on PaymentService for the rest.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ledger_entries', function (Blueprint $table) {
            $table->unique(['reference_type', 'reference_id', 'user_id', 'type'], 'ledger_entries_ref_user_type_unique');
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE ledger_entries ADD CONSTRAINT ledger_entries_amount_positive CHECK (amount > 0)');
            DB::statement('ALTER TABLE bookings ADD CONSTRAINT bookings_weights_non_negative CHECK (total_weight_kg >= 0 AND estimated_sacks >= 0)');
        }

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE ledger_entries ADD CONSTRAINT ledger_entries_amount_positive CHECK (amount > 0)');
            DB::statement('ALTER TABLE bookings ADD CONSTRAINT bookings_weights_non_negative CHECK (total_weight_kg >= 0 AND estimated_sacks >= 0)');
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE bookings DROP CONSTRAINT bookings_weights_non_negative');
            DB::statement('ALTER TABLE ledger_entries DROP CONSTRAINT ledger_entries_amount_positive');
        }

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE bookings DROP CONSTRAINT bookings_weights_non_negative');
            DB::statement('ALTER TABLE ledger_entries DROP CONSTRAINT ledger_entries_amount_positive');
        }

        Schema::table('ledger_entries', function (Blueprint $table) {
            $table->dropUnique('ledger_entries_ref_user_type_unique');
        });
    }
};
