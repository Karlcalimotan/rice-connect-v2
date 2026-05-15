<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsumerDemandHeatmap;
use App\Models\RetailerStockMetric;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class RetailerAnalyticsController extends Controller
{
    /**
     * Get stock turnover rates
     */
    public function stockTurnover(): JsonResponse
    {
        $retailer = Auth::user();
        
        $data = RetailerStockMetric::where('user_id', $retailer->id)
            ->selectRaw('
                rice_variety,
                AVG(turnover_rate) as avg_turnover,
                AVG(units_sold_monthly) as avg_units_sold,
                MAX(metric_date) as latest_date
            ')
            ->groupBy('rice_variety')
            ->get()
            ->map(function ($metric) {
                return [
                    'variety' => $metric->rice_variety,
                    'turnover_rate' => round($metric->avg_turnover, 2),
                    'units_sold_monthly' => round($metric->avg_units_sold, 0),
                    'status' => match(true) {
                        $metric->avg_turnover >= 8 => 'high',
                        $metric->avg_turnover >= 4 => 'medium',
                        default => 'low',
                    },
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Get consumer demand heatmap
     */
    public function demandHeatmap(): JsonResponse
    {
        $retailer = Auth::user();
        
        $heatmapData = ConsumerDemandHeatmap::where('retailer_id', $retailer->id)
            ->selectRaw('
                day_of_week,
                time_slot,
                SUM(demand_count) as total_demand,
                AVG(avg_quantity_purchased) as avg_quantity
            ')
            ->groupBy('day_of_week', 'time_slot')
            ->get()
            ->groupBy('day_of_week')
            ->map(function ($dayData) {
                return $dayData->map(function ($slot) {
                    return [
                        'time_slot' => $slot->time_slot,
                        'demand' => $slot->total_demand,
                        'avg_quantity' => round($slot->avg_quantity, 2),
                        'intensity' => match(true) {
                            $slot->total_demand >= 100 => 'high',
                            $slot->total_demand >= 50 => 'medium',
                            default => 'low',
                        },
                    ];
                })->toArray();
            });

        return response()->json([
            'status' => 'success',
            'data' => $heatmapData,
        ]);
    }

    /**
     * Get profit margins by variety
     */
    public function profitMargins(): JsonResponse
    {
        $retailer = Auth::user();
        
        $data = RetailerStockMetric::where('user_id', $retailer->id)
            ->selectRaw('
                rice_variety,
                AVG(profit_margin_percentage) as avg_margin,
                AVG(cost_per_unit) as avg_cost,
                AVG(selling_price_per_unit) as avg_price,
                SUM(units_sold_monthly) as total_units
            ')
            ->groupBy('rice_variety')
            ->orderBy('total_units', 'desc')
            ->get()
            ->map(function ($metric) {
                return [
                    'variety' => $metric->rice_variety,
                    'margin_percentage' => round($metric->avg_margin, 2),
                    'cost_per_unit' => round($metric->avg_cost, 2),
                    'selling_price' => round($metric->avg_price, 2),
                    'total_units_sold' => $metric->total_units,
                    'total_profit' => round(($metric->avg_price - $metric->avg_cost) * $metric->total_units, 2),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Get retailer summary statistics
     */
    public function summary(): JsonResponse
    {
        $retailer = Auth::user();
        
        $avgTurnover = RetailerStockMetric::where('user_id', $retailer->id)
            ->avg('turnover_rate');
        
        $totalProfit = RetailerStockMetric::where('user_id', $retailer->id)
            ->selectRaw('SUM((selling_price_per_unit - cost_per_unit) * units_sold_monthly) as total_profit')
            ->first()?->total_profit ?? 0;
        
        $varietyCount = RetailerStockMetric::where('user_id', $retailer->id)
            ->distinct('rice_variety')
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'avg_turnover_rate' => round($avgTurnover, 2),
                'total_profit' => round($totalProfit, 2),
                'varieties_stocked' => $varietyCount,
            ],
        ]);
    }
}
