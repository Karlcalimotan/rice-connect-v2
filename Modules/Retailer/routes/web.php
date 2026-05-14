<?php

use Illuminate\Support\Facades\Route;
use Modules\Retailer\Http\Controllers\RetailerController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/retailer/marketplace', [RetailerController::class, 'index'])->name('retailer.marketplace');
    Route::post('/retailer/place-order', [RetailerController::class, 'placeOrder'])->name('retailer.place_order');
    Route::get('/retailer/purchases', [RetailerController::class, 'myPurchases'])->name('retailer.purchases');
    Route::get('/retailer/orders', [RetailerController::class, 'myOrders'])->name('retailer.orders');
    Route::post('/retailer/orders/{id}/receive', [RetailerController::class, 'confirmReceived'])->name('retailer.order.receive');
    Route::resource('retailers', RetailerController::class)->names('retailer');
});
