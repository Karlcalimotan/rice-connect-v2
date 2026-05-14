<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
