<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class MunicipalityHelper
{
    /**
     * Neighbors graph for Iloilo municipalities.
     */
    protected static $iloiloNeighbors = [
        "Passi City" => ["San Enrique", "Dueñas", "Dumarao", "Calinog", "Mina", "Bingawan"],
        "San Enrique" => ["Passi City", "Dueñas", "Banate", "Barotac Nuevo"],
        "Dueñas" => ["Passi City", "San Enrique", "Dingle", "Pototan"],
        "Calinog" => ["Passi City", "Bingawan", "Lambunao"],
        "Bingawan" => ["Calinog", "Passi City"],
        "Lambunao" => ["Calinog", "Janiuay", "Badiangan", "Maasin"],
        "Badiangan" => ["Lambunao", "Janiuay", "Mina", "Pototan"],
        "Janiuay" => ["Lambunao", "Badiangan", "Maasin", "Mina"],
        "Maasin" => ["Janiuay", "Lambunao", "Alimodian", "Cabatuan"],
        "Pototan" => ["Dueñas", "Dingle", "Barotac Nuevo", "Mina", "Badiangan", "New Lucena", "Zarraga"],
        "Dingle" => ["Dueñas", "Pototan", "Barotac Nuevo", "Anilao"],
        "Mina" => ["Pototan", "Badiangan", "Janiuay", "Cabatuan"],
        "Cabatuan" => ["Mina", "Maasin", "Janiuay", "New Lucena", "Santa Barbara", "Alimodian"],
        "New Lucena" => ["Cabatuan", "Pototan", "Santa Barbara", "Zarraga"],
        "Santa Barbara" => ["Cabatuan", "New Lucena", "Pavia", "Zarraga", "San Miguel", "Alimodian"],
        "Zarraga" => ["New Lucena", "Pototan", "Santa Barbara", "Leganes", "Dumangas", "Barotac Nuevo"],
        "Pavia" => ["Santa Barbara", "San Miguel", "Iloilo City", "Leganes"],
        "Leganes" => ["Pavia", "Iloilo City", "Zarraga", "Dumangas"],
        "Iloilo City" => ["Pavia", "Leganes", "Oton", "San Miguel"],
        "Oton" => ["Iloilo City", "San Miguel", "Tigbauan"],
        "San Miguel" => ["Oton", "Iloilo City", "Pavia", "Santa Barbara", "Alimodian", "Leon"],
        "Alimodian" => ["San Miguel", "Santa Barbara", "Cabatuan", "Maasin", "Leon"],
        "Leon" => ["San Miguel", "Alimodian", "Tigbauan", "Tubungan"],
        "Tigbauan" => ["Oton", "Leon", "Guimbal", "Tubungan"],
        "Guimbal" => ["Tigbauan", "Tubungan", "Igbaras", "Miagao"],
        "Tubungan" => ["Leon", "Tigbauan", "Guimbal", "Igbaras"],
        "Igbaras" => ["Guimbal", "Tubungan", "Miagao"],
        "Miagao" => ["Guimbal", "Igbaras", "San Joaquin"],
        "San Joaquin" => ["Miagao"],
        "Dumangas" => ["Zarraga", "Leganes", "Barotac Nuevo"],
        "Barotac Nuevo" => ["Zarraga", "Pototan", "Dingle", "Anilao", "Banate", "Dumangas", "San Enrique"],
        "Anilao" => ["Barotac Nuevo", "Dingle", "Banate"],
        "Banate" => ["Anilao", "Barotac Nuevo", "San Enrique", "Barotac Viejo"],
        "Barotac Viejo" => ["Banate", "San Rafael", "Ajuy"],
        "San Rafael" => ["Barotac Viejo", "Lemery"],
        "Ajuy" => ["Barotac Viejo", "Lemery", "Sara", "Concepcion"],
        "Sara" => ["Ajuy", "Lemery", "San Dionisio", "Concepcion"],
        "Lemery" => ["Sara", "Ajuy", "San Rafael"],
        "Concepcion" => ["Ajuy", "Sara"],
        "San Dionisio" => ["Sara", "Batad"],
        "Batad" => ["San Dionisio", "Balasan", "Estancia"],
        "Balasan" => ["Batad", "Estancia", "Carles"],
        "Estancia" => ["Batad", "Balasan", "Carles"],
        "Carles" => ["Balasan", "Estancia"]
    ];

    public static function calculateFee($millerId, $retailerMunicipalityId)
    {
        $miller = DB::table('users')->where('id', $millerId)->first();
        
        $start = $miller?->municipality ?: 'Iloilo City';
        $retailerMuniRec = DB::table('municipalities')->find($retailerMunicipalityId);
        $end = $retailerMuniRec?->name ?: 'Iloilo City';

        $jumps = (int) self::bfs($start, $end);
        
        if ($start === $end) return 0.00;
        if ($jumps === 0) $jumps = 1;

        $settings = DB::table('miller_delivery_settings')->where('miller_id', $millerId)->first();
        $base = $settings ? (float) $settings->base_delivery_fee : 150.00;
        $extra = $settings ? (float) $settings->extra_fee_per_municipality : 50.00;

        return $base + floor(($jumps - 1) / 2) * $extra;
    }

    protected static function bfs($start, $end)
    {
        if (!isset(self::$iloiloNeighbors[$start]) || !isset(self::$iloiloNeighbors[$end])) {
            return 3;
        }

        $queue = [[$start, 0]];
        $visited = [$start];

        while (!empty($queue)) {
            [$current, $dist] = array_shift($queue);

            if ($current === $end) {
                return $dist;
            }

            if (!isset(self::$iloiloNeighbors[$current])) {
                continue;
            }

            foreach (self::$iloiloNeighbors[$current] as $neighbor) {
                if (!in_array($neighbor, $visited)) {
                    $visited[] = $neighbor;
                    $queue[] = [$neighbor, $dist + 1];
                }
            }
        }

        return 3; 
    }
}
