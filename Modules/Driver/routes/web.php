<?php

use Illuminate\Support\Facades\Route;
use Modules\Driver\Http\Controllers\DriverController;

Route::middleware(['auth', 'verified', 'role:driver'])->group(function () {
    Route::get('/driver/dashboard', [DriverController::class, 'index'])->name('driver.dashboard');
    
    // Palay Actions (Farmer -> Miller)
    Route::post('/driver/palay/{id}/request-pickup', [DriverController::class, 'requestPickup'])->name('driver.palay.request_pickup');
    Route::post('/driver/palay/{id}/start-trip', [DriverController::class, 'startPalayTrip'])->name('driver.palay.start_trip');
    Route::post('/driver/palay/{id}/request-payment', [DriverController::class, 'requestPayment'])->name('driver.palay.request_payment');
    Route::post('/driver/palay/{id}/pay-farmer', [DriverController::class, 'payFarmer'])->name('driver.palay.pay_farmer');
    Route::post('/driver/palay/{id}/arrive-at-miller', [DriverController::class, 'arriveAtMiller'])->name('driver.palay.arrive_at_miller');
    
    // Rice Actions (Miller -> Retailer)
    Route::post('/driver/orders/{id}/start-trip', [DriverController::class, 'startRiceTrip'])->name('driver.order.start_trip');
    Route::post('/driver/orders/{id}/deliver', [DriverController::class, 'deliverRice'])->name('driver.order.deliver');
    Route::post('/driver/orders/{id}/final-sign-off', [DriverController::class, 'finalSignOff'])->name('driver.order.final_sign_off');
    Route::delete('/driver/history/{type}/{id}', [DriverController::class, 'deleteHistory'])->name('driver.history.delete');

    Route::resource('drivers', DriverController::class)->names('driver');
});
