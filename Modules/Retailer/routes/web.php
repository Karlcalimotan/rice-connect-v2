<?php

use Illuminate\Support\Facades\Route;
use Modules\Retailer\Http\Controllers\RetailerController;

Route::middleware(['auth', 'verified', 'role:retailer'])->group(function () {
    Route::get('/retailer/marketplace', [RetailerController::class, 'index'])->name('retailer.marketplace');
    Route::post('/retailer/place-order', [RetailerController::class, 'placeOrder'])->name('retailer.place_order');
    Route::get('/retailer/purchases', [RetailerController::class, 'myPurchases'])->name('retailer.purchases');
    Route::get('/retailer/orders', [RetailerController::class, 'myOrders'])->name('retailer.orders');
    Route::get('/retailer/orders/{id}/drivers', [RetailerController::class, 'drivers'])->name('retailer.order.drivers');
    Route::post('/retailer/orders/{id}/book', [RetailerController::class, 'bookDriver'])->name('retailer.order.book_driver');
    Route::patch('/retailer/orders/{id}/receive', [RetailerController::class, 'confirmReceived'])->name('retailer.order.confirm_received');
    Route::delete('/retailer/orders/{id}', [RetailerController::class, 'deleteOrder'])->name('retailer.order.delete');
    Route::resource('retailers', RetailerController::class)->names('retailer');
});
