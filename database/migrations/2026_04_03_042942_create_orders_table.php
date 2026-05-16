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
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('retailer_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('miller_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('batch_id')->constrained('harvest_batches')->onDelete('cascade');
        
        $table->string('rice_variety');
        $table->integer('sacks');
        $table->decimal('total_weight', 10, 2);
        $table->decimal('total_price', 15, 2);
        
        // Status: pending_pickup, completed, cancelled
        $table->string('status')->default('pending_pickup');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
