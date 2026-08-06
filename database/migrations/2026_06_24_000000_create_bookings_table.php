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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->morphs('bookable'); // Associates with Farmer, Miller, or Retailer models (Users)
            $table->string('origin_address');
            $table->string('destination_address');
            $table->decimal('total_weight_kg', 8, 2);
            $table->integer('estimated_sacks');
            $table->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete(); 
            $table->enum('status', ['pending', 'assigned', 'at_pickup', 'in_transit', 'delivered'])->default('pending');
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('harvest_batch_id')->nullable()->constrained('harvest_batches')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
