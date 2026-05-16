<?php

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\FarmerAnalyticsController;
use App\Http\Controllers\Api\MillerAnalyticsController;
use App\Http\Controllers\Api\RetailerAnalyticsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('analytics')->name('api.analytics.')->group(function () {
    
    // Farmer Analytics
    Route::prefix('farmer')->middleware(['auth'])->group(function () {
        Route::get('yield-vs-target', [FarmerAnalyticsController::class, 'yieldVsTarget'])->name('farmer.yield');
        Route::get('crop-health-trends', [FarmerAnalyticsController::class, 'cropHealthTrends'])->name('farmer.health');
        Route::get('market-prices', [FarmerAnalyticsController::class, 'marketPrices'])->name('farmer.prices');
        Route::get('summary', [FarmerAnalyticsController::class, 'summary'])->name('farmer.summary');
    });

    // Miller Analytics
    Route::prefix('miller')->middleware(['auth'])->group(function () {
        Route::get('processing-efficiency', [MillerAnalyticsController::class, 'processingEfficiency'])->name('miller.efficiency');
        Route::get('recovery-rates', [MillerAnalyticsController::class, 'recoveryRates'])->name('miller.recovery');
        Route::get('storage-utilization', [MillerAnalyticsController::class, 'storageUtilization'])->name('miller.storage');
        Route::get('milling-queue', [MillerAnalyticsController::class, 'millingQueue'])->name('miller.queue');
        Route::get('summary', [MillerAnalyticsController::class, 'summary'])->name('miller.summary');
    });

    // Retailer Analytics
    Route::prefix('retailer')->middleware(['auth'])->group(function () {
        Route::get('stock-turnover', [RetailerAnalyticsController::class, 'stockTurnover'])->name('retailer.turnover');
        Route::get('demand-heatmap', [RetailerAnalyticsController::class, 'demandHeatmap'])->name('retailer.demand');
        Route::get('profit-margins', [RetailerAnalyticsController::class, 'profitMargins'])->name('retailer.margins');
        Route::get('summary', [RetailerAnalyticsController::class, 'summary'])->name('retailer.summary');
    });

    // Admin Analytics
    Route::prefix('admin')->middleware(['auth'])->group(function () {
        Route::get('supply-chain-overview', [AdminAnalyticsController::class, 'supplyChainOverview'])->name('admin.supply_chain');
        Route::get('total-volume-moved', [AdminAnalyticsController::class, 'totalVolumeMoved'])->name('admin.volume');
        Route::get('regional-bottlenecks', [AdminAnalyticsController::class, 'regionalsBottlenecks'])->name('admin.bottlenecks');
        Route::get('delivery-performance', [AdminAnalyticsController::class, 'deliveryPerformance'])->name('admin.delivery');
        Route::get('summary', [AdminAnalyticsController::class, 'summary'])->name('admin.summary');
    });
});
