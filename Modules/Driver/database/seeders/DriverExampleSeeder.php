<?php

namespace Modules\Driver\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DriverExampleSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'driver_a@example.test'],
            [
                'first_name' => 'Sample',
                'last_name' => 'Driver A',
                'username' => 'sample_driver_a',
                'role' => 'driver',
                'contact' => '09123456784',
                'password' => Hash::make('password'),
            ]
        );
    }
}
