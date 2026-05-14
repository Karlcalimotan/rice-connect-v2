<?php

namespace Modules\Retailer\Database\Seeders;

use Illuminate\Database\Seeder;

class RetailerDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            RetailerExampleSeeder::class,
        ]);
    }
}
