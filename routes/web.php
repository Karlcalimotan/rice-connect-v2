<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('landing');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Role-based Dashboard Aliases
Route::middleware(['auth'])->group(function () {
    Route::get('/farmer/dashboard', function() { return redirect()->route('farmer.harvest'); })->name('farmer.dashboard');
    Route::get('/miller/dashboard', function() { return redirect()->route('miller.marketplace'); })->name('miller.dashboard');
    Route::get('/retailer/dashboard', function() { return redirect()->route('retailer.marketplace'); })->name('retailer.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark_as_read');
});

// Analytics pages (Inertia)
Route::middleware(['auth'])->group(function () {
    Route::get('/analytics/farmer', [\App\Http\Controllers\AnalyticsPageController::class, 'farmer'])->name('analytics.farmer');
    Route::get('/analytics/miller', [\App\Http\Controllers\AnalyticsPageController::class, 'miller'])->name('analytics.miller');
    Route::get('/analytics/retailer', [\App\Http\Controllers\AnalyticsPageController::class, 'retailer'])->name('analytics.retailer');
    Route::get('/analytics/admin', [\App\Http\Controllers\AnalyticsPageController::class, 'admin'])->name('analytics.admin');
    
    // Unified Analytics Data API (Web-accessible for Inertia)
    Route::get('/api/analytics/data', [\App\Http\Controllers\AnalyticsController::class, 'getData'])->name('api.analytics.data');
});

// Admin Dashboard
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/analytics', function() { return Inertia::render('Analytics/AdminDashboard'); })->name('admin.analytics');
});

require __DIR__.'/auth.php';
