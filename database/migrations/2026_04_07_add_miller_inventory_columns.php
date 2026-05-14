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
            if (!Schema::hasColumn('harvest_batches', 'drying_status')) {
                $table->enum('drying_status', ['received','drying','ready_to_process'])->nullable()->after('status');
            }

            if (!Schema::hasColumn('harvest_batches', 'unpacked_weight_kg')) {
                $table->decimal('unpacked_weight_kg', 8, 2)->nullable()->after('total_weight');
            }

            if (!Schema::hasColumn('harvest_batches', 'total_sacks')) {
                $table->integer('total_sacks')->default(0)->after('unpacked_weight_kg');
            }

            if (!Schema::hasColumn('harvest_batches', 'price_per_sack')) {
                $table->decimal('price_per_sack', 8, 2)->nullable()->after('price_per_kg');
            }

            if (!Schema::hasColumn('harvest_batches', 'delivery_method')) {
                $table->string('delivery_method')->nullable()->after('total_sacks');
            }

            if (!Schema::hasColumn('harvest_batches', 'delivery_status')) {
                $table->string('delivery_status')->nullable()->after('delivery_method');
            }

            if (!Schema::hasColumn('harvest_batches', 'hidden_from_farmer')) {
                $table->boolean('hidden_from_farmer')->default(false)->after('delivery_status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('harvest_batches', function (Blueprint $table) {
            if (Schema::hasColumn('harvest_batches', 'drying_status')) $table->dropColumn('drying_status');
            if (Schema::hasColumn('harvest_batches', 'unpacked_weight_kg')) $table->dropColumn('unpacked_weight_kg');
            if (Schema::hasColumn('harvest_batches', 'total_sacks')) $table->dropColumn('total_sacks');
            if (Schema::hasColumn('harvest_batches', 'price_per_sack')) $table->dropColumn('price_per_sack');
            if (Schema::hasColumn('harvest_batches', 'delivery_method')) $table->dropColumn('delivery_method');
            if (Schema::hasColumn('harvest_batches', 'delivery_status')) $table->dropColumn('delivery_status');
            if (Schema::hasColumn('harvest_batches', 'hidden_from_farmer')) $table->dropColumn('hidden_from_farmer');
        });
    }
};
