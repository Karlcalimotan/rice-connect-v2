<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegionalDistributionLog;
use App\Models\SupplyChainMetric;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    /**
     * Get birds-eye view of supply chain
     */
    public function supplyChainOverview(): JsonResponse
    {
        $metrics = SupplyChainMetric::selectRaw('
            region,
            SUM(total_volume_kg) as total_volume,
            SUM(farmers_count) as farmers,
            SUM(millers_count) as millers,
            SUM(retailers_count) as retailers,
            AVG(distribution_bottleneck_score) as bottleneck_score,
            MAX(metric_date) as latest_date
        ')
            ->groupBy('region')
            ->orderBy('total_volume', 'desc')
            ->get()
            ->map(function ($metric) {
                return [
                    'region' => $metric->region,
                    'total_volume_kg' => $metric->total_volume,
                    'actors' => [
                        'farmers' => $metric->farmers,
                        'millers' => $metric->millers,
                        'retailers' => $metric->retailers,
                    ],
                    'bottleneck_score' => round($metric->bottleneck_score, 2),
                    'health' => match(true) {
                        $metric->bottleneck_score >= 70 => 'critical',
                        $metric->bottleneck_score >= 40 => 'warning',
                        default => 'healthy',
                    },
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $metrics,
        ]);
    }

    /**
     * Get total volume moved
     */
    public function totalVolumeMoved(): JsonResponse
    {
        $timeframes = [
            'today' => now()->startOfDay(),
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
        ];

        $data = [];
        foreach ($timeframes as $label => $date) {
            $data[$label] = RegionalDistributionLog::where('shipped_date', '>=', $date)
                ->sum('volume_kg');
        }

        // Volume trend (last 30 days)
        $trend = RegionalDistributionLog::selectRaw('DATE(shipped_date) as date, SUM(volume_kg) as volume')
            ->where('shipped_date', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => $data,
                'trend_30d' => $trend,
            ],
        ]);
    }

    /**
     * Get regional distribution bottlenecks
     */
    public function regionalsBottlenecks(): JsonResponse
    {
        $bottlenecks = RegionalDistributionLog::selectRaw('
            destination_region as region,
            COUNT(*) as shipment_count,
            AVG(delay_hours) as avg_delay,
            MAX(delay_hours) as max_delay,
            SUM(CASE WHEN status = "delayed" THEN 1 ELSE 0 END) as delayed_count,
            SUM(volume_kg) as total_volume
        ')
            ->where('shipped_date', '>=', now()->subDays(90))
            ->groupBy('destination_region')
            ->orderBy('avg_delay', 'desc')
            ->get()
            ->map(function ($log) {
                $delayRate = $log->shipment_count > 0 
                    ? ($log->delayed_count / $log->shipment_count) * 100 
                    : 0;
                return [
                    'region' => $log->region,
                    'avg_delay_hours' => round($log->avg_delay, 2),
                    'max_delay_hours' => round($log->max_delay, 2),
                    'delay_rate_percentage' => round($delayRate, 2),
                    'total_shipments' => $log->shipment_count,
                    'volume_kg' => $log->total_volume,
                    'severity' => match(true) {
                        $log->avg_delay >= 24 => 'critical',
                        $log->avg_delay >= 12 => 'high',
                        $log->avg_delay >= 6 => 'medium',
                        default => 'low',
                    },
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $bottlenecks,
        ]);
    }

    /**
     * Get delivery performance
     */
    public function deliveryPerformance(): JsonResponse
    {
        $performance = RegionalDistributionLog::selectRaw('
            DATE(shipped_date) as date,
            SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as delivered,
            SUM(CASE WHEN status = "in_transit" THEN 1 ELSE 0 END) as in_transit,
            COUNT(*) as total,
            AVG(delay_hours) as avg_delay
        ')
            ->where('shipped_date', '>=', now()->subDays(60))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($log) {
                return [
                    'date' => $log->date,
                    'delivered' => $log->delivered,
                    'in_transit' => $log->in_transit,
                    'total' => $log->total,
                    'delivery_rate' => $log->total > 0 ? round(($log->delivered / $log->total) * 100, 2) : 0,
                    'avg_delay_hours' => round($log->avg_delay, 2),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $performance,
        ]);
    }

    /**
     * Get admin summary statistics
     */
    public function summary(): JsonResponse
    {
        $totalVolume = RegionalDistributionLog::sum('volume_kg');
        $totalRegions = SupplyChainMetric::distinct('region')->count();
        $totalActors = User::whereIn('role', ['farmer', 'miller', 'retailer', 'driver'])->count();
        $avgBottleneck = SupplyChainMetric::avg('distribution_bottleneck_score');

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_volume_kg' => $totalVolume,
                'regions_active' => $totalRegions,
                'total_actors' => $totalActors,
                'avg_bottleneck_score' => round($avgBottleneck, 2),
            ],
        ]);
    }
}
