<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Only run raw ALTER statements on MySQL. SQLite does not support ENUM/ALTER COLUMN.
        $driver = DB::getPdo() ? DB::getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME) : null;
        if ($driver === 'mysql') {
            Schema::table('users', function (Blueprint $table) {
                DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'farmer', 'miller', 'retailer', 'driver') DEFAULT 'farmer'");
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getPdo() ? DB::getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME) : null;
        if ($driver === 'mysql') {
            Schema::table('users', function (Blueprint $table) {
                DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'farmer', 'miller', 'retailer') DEFAULT 'farmer'");
            });
        }
    }
};
