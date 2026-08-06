<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('harvest_batches', function (Blueprint $table) {
        // We change the column to a simple string first to remove the old constraint
        // Or if you used an enum, we redefine the allowed values
        $table->string('status')->default('unsold')->change();
    });

    // On PostgreSQL, Laravel implements enum() as a CHECK constraint. Changing
    // the column to string does not drop it, so it would still reject the
    // canonical status vocabulary. Drop it explicitly.
    if (DB::connection()->getDriverName() === 'pgsql') {
        DB::statement('ALTER TABLE harvest_batches DROP CONSTRAINT IF EXISTS harvest_batches_status_check');
    }
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
  {
     Schema::table('harvest_batches', function (Blueprint $table) {
        // This is how you would put the constraint back if needed
        $table->string('status')->default('unsold')->change();
    });
  }
};
