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
        Schema::create('harvest_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('harvest_id')->constrained('harvest_batches')->onDelete('cascade');
            $table->foreignId('miller_id')->constrained('users')->onDelete('cascade');
            $table->unique(['harvest_id', 'miller_id']); // One miller, one interest per batch
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harvest_interests');
    }
};
