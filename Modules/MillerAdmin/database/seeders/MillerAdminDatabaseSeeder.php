<?php

namespace Modules\MillerAdmin\Database\Seeders;

use Illuminate\Database\Seeder;

class MillerAdminDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            MillerAdminExampleSeeder::class,
        ]);
    }
}
