<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Municipalities Table
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->integer('distance_index'); // Leon=1, Alimodian=2, etc.
            $table->timestamps();
        });

        // 2. Add municipality_id to users (Everyone)
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('municipality_id')->nullable()->after('municipality')->constrained('municipalities')->onDelete('set null');
        });

        // 3. Miller Shipping Settings Table
        Schema::create('miller_delivery_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miller_id')->constrained('users')->onDelete('cascade');
            $table->decimal('base_delivery_fee', 10, 2)->default(150.00);
            $table->decimal('extra_fee_per_municipality', 10, 2)->default(50.00);
            $table->foreignId('municipality_id')->nullable()->constrained('municipalities')->onDelete('set null');
            $table->timestamps();
        });

        // 4. Update Orders Table (Snapshot delivery charge)
        if (!Schema::hasColumn('orders', 'delivery_charge')) {
            Schema::table('orders', function (Blueprint $table) {
                // Drop old delivery_fee if it existed as a leftover
                if (Schema::hasColumn('orders', 'delivery_fee')) {
                    $table->dropColumn('delivery_fee');
                }
                $table->decimal('delivery_charge', 15, 2)->default(0.00);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('miller_delivery_settings');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['municipality_id']);
            $table->dropColumn('municipality_id');
        });
        Schema::dropIfExists('municipalities');
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('delivery_charge');
        });
    }
};
