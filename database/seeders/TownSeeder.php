<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class TownSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('towns')->insert([
            ['name' => 'Town A', 'distance_index' => 0],
            ['name' => 'Town B', 'distance_index' => 1],
            ['name' => 'Town C', 'distance_index' => 2],
            ['name' => 'Town D', 'distance_index' => 3],
        ]);

        $towns = DB::table('towns')->get();
        
        User::all()->each(function($u, $i) use ($towns) {
            $u->update(['town_id' => $towns->get($i % 4)->id]);
        });

        User::where('role', 'miller')->each(function($m) {
            DB::table('miller_delivery_settings')->insert([
                'miller_id' => $m->id,
                'base_delivery_fee' => 150.00,
                'extra_fee_per_town' => 50.00,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }
}
