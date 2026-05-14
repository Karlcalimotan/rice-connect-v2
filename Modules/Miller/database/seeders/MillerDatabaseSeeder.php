<?php

namespace Modules\Miller\Database\Seeders;

use Illuminate\Database\Seeder;

class MillerDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            MillerExampleSeeder::class,
        ]);
    }
}
