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
        // This adds the column SQLite is complaining about
        $table->unsignedBigInteger('buyer_id')->nullable()->after('user_id');
    });
}

public function down(): void
{
    Schema::table('harvest_batches', function (Blueprint $table) {
        $table->dropColumn('buyer_id');
    });
}
};
