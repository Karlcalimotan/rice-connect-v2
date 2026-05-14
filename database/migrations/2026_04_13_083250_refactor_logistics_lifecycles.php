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
            if (!Schema::hasColumn('harvest_batches', 'actual_weight_kg')) {
                $table->decimal('actual_weight_kg', 10, 2)->nullable()->after('total_weight');
            }
            if (!Schema::hasColumn('harvest_batches', 'suggested_price_per_kg')) {
                $table->decimal('suggested_price_per_kg', 10, 2)->nullable()->after('price_per_kg');
            }
            if (!Schema::hasColumn('harvest_batches', 'final_price_per_kg')) {
                $table->decimal('final_price_per_kg', 10, 2)->nullable()->after('suggested_price_per_kg');
            }
            if (!Schema::hasColumn('harvest_batches', 'delivery_type')) {
                $table->string('delivery_type')->default('palay')->index();
            }
            if (!Schema::hasColumn('harvest_batches', 'driver_id')) {
                $table->unsignedBigInteger('driver_id')->nullable()->after('buyer_id');
            }
            // Ensure delivery_status is present and has default
            if (Schema::hasColumn('harvest_batches', 'delivery_status')) {
                $table->string('delivery_status')->default('Pending')->change();
            } else {
                $table->string('delivery_status')->default('Pending');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'delivery_status')) {
                $table->string('delivery_status')->default('Pending')->after('status');
            }
            if (!Schema::hasColumn('orders', 'delivery_type')) {
                $table->string('delivery_type')->default('rice')->index();
            }
            if (!Schema::hasColumn('orders', 'driver_id')) {
                $table->unsignedBigInteger('driver_id')->nullable()->after('miller_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('harvest_batches', function (Blueprint $table) {
            $table->dropColumn(['actual_weight_kg', 'suggested_price_per_kg', 'final_price_per_kg', 'delivery_type', 'driver_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['delivery_status', 'delivery_type', 'driver_id']);
        });
    }
};
