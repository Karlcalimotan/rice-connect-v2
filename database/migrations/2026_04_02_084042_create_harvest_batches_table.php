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
        Schema::create('harvest_batches', function (Blueprint $table) {
        $table->id();
        // Links the batch to the specific Farmer who logged it
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
        $table->string('rice_variety');   // e.g., RC218, Dinorado
        $table->integer('number_of_bags'); 
        $table->decimal('total_weight', 8, 2); 
        $table->date('harvest_date');
        $table->enum('status', ['unsold', 'sold', 'milling'])->default('unsold');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harvest_batches');
    }
};
