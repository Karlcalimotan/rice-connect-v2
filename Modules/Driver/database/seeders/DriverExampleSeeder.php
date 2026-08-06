<?php

namespace Modules\Driver\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Municipality;
use Illuminate\Support\Facades\Hash;

class DriverExampleSeeder extends Seeder
{
    public function run(): void
    {
        $dingle = Municipality::where('name', 'Dingle')->first();
        $pototan = Municipality::where('name', 'Pototan')->first();
        $dumangas = Municipality::where('name', 'Dumangas')->first();

        // Seeding Dingle Driver
        User::updateOrCreate(
            ['email' => 'driver_dingle@example.test'],
            [
                'first_name' => 'Dingle',
                'last_name' => 'Driver',
                'username' => 'driver_dingle',
                'role' => 'driver',
                'contact' => '09123456781',
                'password' => Hash::make('password'),
                'municipality_id' => $dingle ? $dingle->id : null,
                'municipality' => 'Dingle',
                'province' => 'Iloilo',
                'vehicle_type' => 'Tricycle',
                'is_verified_driver' => true,
            ]
        );

        // Seeding Pototan Driver
        User::updateOrCreate(
            ['email' => 'driver_pototan@example.test'],
            [
                'first_name' => 'Pototan',
                'last_name' => 'Driver',
                'username' => 'driver_pototan',
                'role' => 'driver',
                'contact' => '09123456782',
                'password' => Hash::make('password'),
                'municipality_id' => $pototan ? $pototan->id : null,
                'municipality' => 'Pototan',
                'province' => 'Iloilo',
                'vehicle_type' => 'Jeepney',
                'is_verified_driver' => true,
            ]
        );

        // Seeding Dumangas Driver
        User::updateOrCreate(
            ['email' => 'driver_dumangas@example.test'],
            [
                'first_name' => 'Dumangas',
                'last_name' => 'Driver',
                'username' => 'driver_dumangas',
                'role' => 'driver',
                'contact' => '09123456783',
                'password' => Hash::make('password'),
                'municipality_id' => $dumangas ? $dumangas->id : null,
                'municipality' => 'Dumangas',
                'province' => 'Iloilo',
                'vehicle_type' => 'Truck',
                'is_verified_driver' => true,
            ]
        );

        // Seed default driver
        User::updateOrCreate(
            ['email' => 'driver_a@example.test'],
            [
                'first_name' => 'Sample',
                'last_name' => 'Driver A',
                'username' => 'sample_driver_a',
                'role' => 'driver',
                'contact' => '09123456784',
                'password' => Hash::make('password'),
                'municipality' => 'Pototan',
                'province' => 'Iloilo',
                'is_verified_driver' => true,
            ]
        );
    }
}
