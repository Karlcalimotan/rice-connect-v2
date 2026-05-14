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
        Schema::create('finished_rice_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miller_id')->constrained('users')->onDelete('cascade');
            $table->string('rice_variety');
            $table->integer('total_sacks')->default(0);
            $table->decimal('unpacked_weight_kg', 8, 2)->default(0);
            $table->decimal('price_per_sack', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finished_rice_stocks');
    }
};
