<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmerYieldMetric;
use App\Models\MarketPrice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FarmerAnalyticsController extends Controller
{
    /**
     * Get Yield vs Target data for current farmer
     */
    public function yieldVsTarget(): JsonResponse
    {
        $farmer = Auth::user();
        
        $data = FarmerYieldMetric::where('user_id', $farmer->id)
            ->selectRaw('crop_variety, season, year, target_yield_kg, actual_yield_kg')
            ->orderBy('year', 'desc')
            ->orderBy('season', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($metric) {
                return [
                    'variety' => $metric->crop_variety,
                    'season' => $metric->season,
                    'year' => $metric->year,
                    'target' => $metric->target_yield_kg,
                    'actual' => $metric->actual_yield_kg,
                    'variance' => $metric->actual_yield_kg - $metric->target_yield_kg,
                    'performance' => $metric->target_yield_kg > 0 
                        ? round(($metric->actual_yield_kg / $metric->target_yield_kg) * 100, 2)
                        : 0,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Get crop health trends
     */
    public function cropHealthTrends(): JsonResponse
    {
        $farmer = Auth::user();
        
        $data = FarmerYieldMetric::where('user_id', $farmer->id)
            ->selectRaw('DATE(created_at) as date, AVG(health_score) as avg_health, crop_variety')
            ->groupBy('date', 'crop_variety')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get()
            ->groupBy('crop_variety')
            ->map(function ($metrics) {
                return $metrics->map(function ($m) {
                    return [
                        'date' => $m->date,
                        'health' => round($m->avg_health, 2),
                    ];
                });
            });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Get current market prices for all rice varieties
     */
    public function marketPrices(): JsonResponse
    {
        $farmer = Auth::user();

        $region = $farmer->getAttribute('municipality') ?: $farmer->municipality?->name;

        // Get latest prices for each variety (region-scoped when known)
        $query = MarketPrice::selectRaw('rice_variety, price_per_kg, price_date')
            ->where('price_date', '>=', now()->subDays(30))
            ->orderBy('price_date', 'desc');

        if ($region) {
            $query->where('market_region', $region);
        }

        $data = $query->get()
            ->groupBy('rice_variety')
            ->map(function ($prices) {
                $priceValues = $prices->pluck('price_per_kg')->toArray();
                return [
                    'variety' => $prices->first()->rice_variety,
                    'current_price' => $prices->first()->price_per_kg,
                    'avg_price_30d' => round(array_sum($priceValues) / count($priceValues), 2),
                    'min_price' => min($priceValues),
                    'max_price' => max($priceValues),
                    'trend' => $priceValues[0] > $priceValues[array_key_last($priceValues)] ? 'up' : 'down',
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Get farmer summary statistics
     */
    public function summary(): JsonResponse
    {
        $farmer = Auth::user();
        
        $totalYield = FarmerYieldMetric::where('user_id', $farmer->id)
            ->sum('actual_yield_kg');
        
        $avgHealth = FarmerYieldMetric::where('user_id', $farmer->id)
            ->avg('health_score');
        
        $varietyCount = FarmerYieldMetric::where('user_id', $farmer->id)
            ->distinct('crop_variety')
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_yield_kg' => $totalYield,
                'avg_crop_health' => round($avgHealth ?? 0, 2),
                'varieties_grown' => $varietyCount,
            ],
        ]);
    }
}
