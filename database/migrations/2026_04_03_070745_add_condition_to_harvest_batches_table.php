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
        if (!Schema::hasColumn('harvest_batches', 'condition')) {
            $table->string('condition')->default('fresh')->after('rice_variety');
        }
    });
}

public function down(): void
{
    Schema::table('harvest_batches', function (Blueprint $table) {
        $table->dropColumn('condition');
    });
}
};
