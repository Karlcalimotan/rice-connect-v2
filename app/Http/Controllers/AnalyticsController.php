<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    /**
     * Fetch role-specific analytics data using a central match expression.
     */
    public function getData(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return match ($user->role) {
            'farmer'   => $this->getFarmerAnalytics(),
            'miller'   => $this->getMillerAnalytics(),
            'retailer' => $this->getRetailerAnalytics(),
            'admin'    => $this->getAdminAnalytics(),
            default    => response()->json(['error' => 'Role not recognized'], 403),
        };
    }

    /**
     * Data for Farmer Dashboard.
     */
    private function getFarmerAnalytics()
    {
        return response()->json([
            'summary' => [
                'total_yield_kg' => 12500,
                'avg_crop_health' => 88.5,
                'varieties_grown' => 3,
            ],
            'yieldData' => [
                ['variety' => 'RC-222', 'actual' => 4500, 'target' => 5000],
                ['variety' => 'RC-160', 'actual' => 3800, 'target' => 3500],
                ['variety' => 'Dinorado', 'actual' => 4200, 'target' => 4000],
            ],
            'healthData' => [
                'RC-222' => [
                    ['date' => '2026-05-01', 'health' => 85],
                    ['date' => '2026-05-08', 'health' => 88],
                    ['date' => '2026-05-15', 'health' => 92],
                ],
                'RC-160' => [
                    ['date' => '2026-05-01', 'health' => 80],
                    ['date' => '2026-05-08', 'health' => 78],
                    ['date' => '2026-05-15', 'health' => 82],
                ],
            ],
            'pricesData' => [
                ['variety' => 'RC-222', 'current_price' => 18.50, 'avg_price_30d' => 17.80, 'min_price' => 16.50, 'max_price' => 19.20, 'trend' => 'up'],
                ['variety' => 'RC-160', 'current_price' => 22.00, 'avg_price_30d' => 22.50, 'min_price' => 21.00, 'max_price' => 24.00, 'trend' => 'down'],
                ['variety' => 'Dinorado', 'current_price' => 25.50, 'avg_price_30d' => 24.00, 'min_price' => 23.50, 'max_price' => 26.50, 'trend' => 'up'],
            ]
        ]);
    }

    /**
     * Data for Miller Dashboard.
     */
    private function getMillerAnalytics()
    {
        return response()->json([
            'summary' => [
                'total_processed_kg' => 45200,
                'avg_recovery_rate' => 64.8,
                'queued_batches' => 8,
            ],
            'efficiencyData' => [
                ['date' => '2026-05-10', 'recovery_rate' => 63.5, 'efficiency' => 85],
                ['date' => '2026-05-11', 'recovery_rate' => 64.2, 'efficiency' => 88],
                ['date' => '2026-05-12', 'recovery_rate' => 65.8, 'efficiency' => 92],
                ['date' => '2026-05-13', 'recovery_rate' => 64.9, 'efficiency' => 90],
                ['date' => '2026-05-14', 'recovery_rate' => 66.2, 'efficiency' => 94],
            ],
            'recoveryData' => [
                ['recovery_rate' => '60-62%', 'batch_count' => 12],
                ['recovery_rate' => '63-65%', 'batch_count' => 25],
                ['recovery_rate' => '66-68%', 'batch_count' => 8],
                ['recovery_rate' => '>68%', 'batch_count' => 3],
            ],
            'storageData' => [
                'utilization_rate' => 72,
                'status' => 'normal',
                'total_capacity_kg' => 100000,
                'current_stock_kg' => 72000,
            ],
            'queueData' => [
                'summary' => ['pending' => 5, 'processing' => 2, 'completed' => 15],
                'pending_queue' => [
                    ['id' => 1, 'palay_kg' => 2500, 'priority' => 'High', 'hours_waiting' => 4],
                    ['id' => 2, 'palay_kg' => 4000, 'priority' => 'Medium', 'hours_waiting' => 12],
                ]
            ]
        ]);
    }

    /**
     * Data for Retailer Dashboard.
     */
    private function getRetailerAnalytics()
    {
        return response()->json([
            'summary' => [
                'current_stock_bags' => 840,
                'monthly_sales' => 145000,
                'turnover_rate' => 12.5,
            ],
            'turnoverData' => [
                ['month' => 'Mar', 'rate' => 10.2],
                ['month' => 'Apr', 'rate' => 11.5],
                ['month' => 'May', 'rate' => 12.5],
            ],
            'demandData' => [
                ['region' => 'Pavia', 'demand' => 85],
                ['region' => 'Santa Barbara', 'demand' => 65],
                ['region' => 'Iloilo City', 'demand' => 95],
            ],
            'profitData' => [
                ['variety' => 'Premium', 'margin' => 15],
                ['variety' => 'Regular', 'margin' => 8],
                ['variety' => 'Well Milled', 'margin' => 12],
            ]
        ]);
    }

    /**
     * Data for Admin Dashboard.
     */
    private function getAdminAnalytics()
    {
        return response()->json([
            'summary' => [
                'total_volume_kg' => 12500000,
                'regions_active' => 12,
                'total_actors' => 1540,
                'avg_bottleneck_score' => 3.2,
            ],
            'volumeData' => [
                'trend_30d' => [
                    ['date' => '2026-05-01', 'volume' => 450000],
                    ['date' => '2026-05-08', 'volume' => 520000],
                    ['date' => '2026-05-15', 'volume' => 480000],
                ],
                'summary' => ['today' => 12000, 'week' => 85000, 'month' => 480000, 'year' => 12500000]
            ],
            'supplyChain' => [
                ['region' => 'Pavia', 'health' => 'low', 'actors' => ['farmers' => 45, 'millers' => 3, 'retailers' => 10], 'total_volume_kg' => 450000, 'bottleneck_score' => 1.2],
                ['region' => 'Santa Barbara', 'health' => 'medium', 'actors' => ['farmers' => 30, 'millers' => 2, 'retailers' => 8], 'total_volume_kg' => 320000, 'bottleneck_score' => 4.5],
            ],
            'deliveryPerf' => [
                ['date' => '2026-05-01', 'delivery_rate' => 98, 'avg_delay_hours' => 1.2],
                ['date' => '2026-05-15', 'delivery_rate' => 96, 'avg_delay_hours' => 2.5],
            ],
            'bottlenecks' => [
                ['region' => 'Santa Barbara', 'avg_delay_hours' => 4.5, 'delay_rate_percentage' => 12, 'total_shipments' => 150, 'volume_kg' => 320000, 'severity' => 'high'],
            ]
        ]);
    }
}
