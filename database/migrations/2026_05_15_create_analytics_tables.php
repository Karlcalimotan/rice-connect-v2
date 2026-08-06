<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Farmer analytics: yield tracking
        Schema::create('farmer_yield_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('target_yield_kg'); // Target yield in kg
            $table->integer('actual_yield_kg'); // Actual yield in kg
            $table->string('crop_variety'); // Rice variety
            $table->string('season'); // dry_season, wet_season
            $table->integer('year');
            $table->decimal('health_score', 5, 2)->default(0); // 0-100 crop health
            $table->string('health_status')->default('good'); // good, fair, poor
            $table->timestamps();
            $table->index(['user_id', 'year', 'season']);
        });

        // Market price tracking
        Schema::create('market_prices', function (Blueprint $table) {
            $table->id();
            $table->string('rice_variety'); // White Rice, Brown Rice, Jasmine, Parboiled, etc.
            $table->decimal('price_per_kg', 10, 2);
            $table->string('market_region'); // Municipality/region
            $table->date('price_date');
            $table->timestamps();
            $table->index(['rice_variety', 'price_date']);
        });

        // Miller analytics: processing efficiency
        Schema::create('miller_processing_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // Miller user
            $table->integer('input_palay_kg'); // Input palay (unmilled rice)
            $table->integer('output_rice_kg'); // Output milled rice
            $table->integer('husk_waste_kg'); // Husk waste
            $table->decimal('recovery_rate', 5, 2); // Recovery rate percentage (output/input)
            $table->decimal('processing_efficiency', 5, 2)->default(0); // Efficiency score
            $table->timestamp('processing_start');
            $table->timestamp('processing_end')->nullable();
            $table->string('status')->default('processing'); // processing, completed, failed
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });

        // Miller storage capacity
        Schema::create('miller_storage_capacity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('total_capacity_kg'); // Total storage capacity
            $table->integer('current_stock_kg')->default(0); // Current stock
            $table->integer('available_capacity_kg')->default(0); // Available capacity
            $table->decimal('utilization_rate', 5, 2)->default(0); // Percentage
            $table->timestamps();
            $table->unique('user_id');
        });

        // Miller milling queue
        Schema::create('milling_queues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miller_id')->constrained('users')->cascadeOnDelete();
            $table->integer('palay_kg');
            $table->string('status')->default('pending'); // pending, processing, completed
            $table->integer('priority')->default(5); // 1-10, 1 highest
            $table->timestamp('queued_at');
            $table->timestamp('processing_started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['miller_id', 'status']);
        });

        // Retailer analytics: stock and sales
        Schema::create('retailer_stock_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('rice_variety');
            $table->integer('stock_units'); // Number of units (bags/boxes)
            $table->integer('units_sold_monthly');
            $table->decimal('turnover_rate', 5, 2); // Times per month
            $table->decimal('profit_margin_percentage', 5, 2); // Profit margin %
            $table->decimal('cost_per_unit', 10, 2);
            $table->decimal('selling_price_per_unit', 10, 2);
            $table->date('metric_date');
            $table->timestamps();
            $table->index(['user_id', 'rice_variety', 'metric_date']);
        });

        // Consumer demand heatmap
        Schema::create('consumer_demand_heatmap', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retailer_id')->constrained('users')->cascadeOnDelete();
            $table->string('rice_variety');
            $table->string('time_slot'); // morning, afternoon, evening, night
            $table->string('day_of_week'); // Monday, Tuesday, etc.
            $table->integer('demand_count'); // Number of purchases
            $table->decimal('avg_quantity_purchased', 8, 2);
            $table->date('metric_date');
            $table->timestamps();
            $table->index(['retailer_id', 'day_of_week']);
        });

        // Supply chain overview (for admin)
        Schema::create('supply_chain_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('region'); // Municipality or province
            $table->integer('total_volume_kg'); // Total rice moved in region
            $table->integer('farmers_count');
            $table->integer('millers_count');
            $table->integer('retailers_count');
            $table->decimal('distribution_bottleneck_score', 5, 2)->default(0); // 0-100
            $table->string('bottleneck_type')->nullable(); // logistics, pricing, quality, etc.
            $table->date('metric_date');
            $table->timestamps();
            $table->index(['region', 'metric_date']);
        });

        // Regional distribution tracking
        Schema::create('regional_distribution_logs', function (Blueprint $table) {
            $table->id();
            $table->string('source_region'); // Where rice came from
            $table->string('destination_region'); // Where rice went
            $table->integer('volume_kg');
            $table->string('status')->default('shipped'); // shipped, in_transit, delivered
            $table->timestamp('shipped_date');
            $table->timestamp('delivered_date')->nullable();
            $table->decimal('delay_hours', 10, 2)->default(0); // Hours delayed
            $table->timestamps();
            $table->index(['source_region', 'destination_region', 'shipped_date'], 'regional_distribution_logs_src_dst_date_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_yield_metrics');
        Schema::dropIfExists('market_prices');
        Schema::dropIfExists('miller_processing_logs');
        Schema::dropIfExists('miller_storage_capacity');
        Schema::dropIfExists('milling_queues');
        Schema::dropIfExists('retailer_stock_metrics');
        Schema::dropIfExists('consumer_demand_heatmap');
        Schema::dropIfExists('supply_chain_metrics');
        Schema::dropIfExists('regional_distribution_logs');
    }
};
