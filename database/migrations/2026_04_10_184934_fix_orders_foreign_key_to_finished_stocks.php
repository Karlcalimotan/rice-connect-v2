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
        Schema::table('orders', function (Blueprint $table) {
            // Drop existing foreign key on batch_id
            $table->dropForeign(['batch_id']);
            $table->dropColumn('batch_id');

            // Add new stock_id referencing finished_rice_stocks
            $table->foreignId('stock_id')->after('miller_id')->constrained('finished_rice_stocks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['stock_id']);
            $table->dropColumn('stock_id');
            $table->foreignId('batch_id')->constrained('harvest_batches')->onDelete('cascade');
        });
    }
};
