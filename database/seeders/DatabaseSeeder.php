<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MunicipalitySeeder::class,
            SupplyChainSeeder::class,
            \Modules\Farmer\Database\Seeders\FarmerDatabaseSeeder::class,
            \Modules\Miller\Database\Seeders\MillerDatabaseSeeder::class,
            \Modules\Retailer\Database\Seeders\RetailerDatabaseSeeder::class,
            \Modules\Driver\Database\Seeders\DriverDatabaseSeeder::class,
            \Modules\MillerAdmin\Database\Seeders\MillerAdminDatabaseSeeder::class,
        ]);

        User::factory()->create([
            'first_name' => 'Mary',
            'last_name' => 'Camille',
            'email' => 'camillemary213@gmail.com',
            'username' => 'Marycamille1616',
            'contact' => '09123456789',
        ]);
    }
}
