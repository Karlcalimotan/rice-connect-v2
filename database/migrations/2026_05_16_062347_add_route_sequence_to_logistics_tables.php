<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('harvest_batches', function (Blueprint $table) {
            $table->integer('route_sequence')->nullable()->after('scheduled_pickup_date');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->integer('route_sequence')->nullable()->after('scheduled_delivery_date');
        });
    }

    public function down(): void
    {
        Schema::table('harvest_batches', function (Blueprint $table) {
            $table->dropColumn('route_sequence');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('route_sequence');
        });
    }
};
