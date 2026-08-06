<?php

use Illuminate\Support\Facades\Route;
use Modules\Driver\Http\Controllers\DriverController;

Route::middleware(['auth', 'verified', 'role:driver'])->group(function () {
    Route::get('/driver/dashboard', [DriverController::class, 'index'])->name('driver.dashboard');
    
    // Palay Actions (Farmer -> Miller)
    Route::post('/driver/palay/{id}/request-pickup', [DriverController::class, 'requestPickup'])->name('driver.palay.request_pickup');
    
    // Rice Actions (Miller -> Retailer)
    Route::post('/driver/orders/{id}/final-sign-off', [DriverController::class, 'finalSignOff'])->name('driver.order.final_sign_off');

    Route::resource('drivers', DriverController::class)->names('driver');
});
