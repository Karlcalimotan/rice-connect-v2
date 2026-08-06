<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\FarmerAnalyticsController;
use App\Http\Controllers\Api\MillerAnalyticsController;
use App\Http\Controllers\Api\RetailerAnalyticsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    /**
     * Fetch role-specific analytics data using a central match expression.
     * Backed by the same queries as the granular api.analytics.* endpoints.
     */
    public function getData(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return match ($user->role) {
            'farmer'   => $this->farmerData(),
            'miller'   => $this->millerData(),
            'retailer' => $this->retailerData(),
            'admin'    => $this->adminData(),
            default    => response()->json(['error' => 'Role not recognized'], 403),
        };
    }

    /**
     * Extract the inner `data` payload from an api.analytics.* JsonResponse.
     */
    private function unwrap($jsonResponse): array
    {
        $body = $jsonResponse->getData(true);

        return $body['data'] ?? [];
    }

    /**
     * Data for Farmer Dashboard.
     */
    private function farmerData()
    {
        $api = app(FarmerAnalyticsController::class);

        return response()->json([
            'summary' => $this->unwrap($api->summary()),
            'yieldData' => $this->unwrap($api->yieldVsTarget()),
            'healthData' => $this->unwrap($api->cropHealthTrends()),
            'pricesData' => $this->unwrap($api->marketPrices()),
        ]);
    }

    /**
     * Data for Miller Dashboard.
     */
    private function millerData()
    {
        $api = app(MillerAnalyticsController::class);

        return response()->json([
            'summary' => $this->unwrap($api->summary()),
            'efficiencyData' => $this->unwrap($api->processingEfficiency()),
            'recoveryData' => $this->unwrap($api->recoveryRates()),
            'storageData' => $this->unwrap($api->storageUtilization()),
            'queueData' => $this->unwrap($api->millingQueue()),
        ]);
    }

    /**
     * Data for Retailer Dashboard.
     */
    private function retailerData()
    {
        $api = app(RetailerAnalyticsController::class);

        return response()->json([
            'summary' => $this->unwrap($api->summary()),
            'turnoverData' => $this->unwrap($api->stockTurnover()),
            'heatmapData' => $this->unwrap($api->demandHeatmap()),
            'profitsData' => $this->unwrap($api->profitMargins()),
        ]);
    }

    /**
     * Data for Admin Dashboard.
     */
    private function adminData()
    {
        $api = app(AdminAnalyticsController::class);

        return response()->json([
            'summary' => $this->unwrap($api->summary()),
            'volumeData' => $this->unwrap($api->totalVolumeMoved()),
            'supplyChain' => $this->unwrap($api->supplyChainOverview()),
            'deliveryPerf' => $this->unwrap($api->deliveryPerformance()),
            'bottlenecks' => $this->unwrap($api->regionalsBottlenecks()),
        ]);
    }
}
