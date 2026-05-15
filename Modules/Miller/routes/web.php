<?php

use Illuminate\Support\Facades\Route;
use Modules\Miller\Http\Controllers\MillerController;

Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. The Marketplace (Browse local rice)
    Route::get('/miller/marketplace', [MillerController::class, 'index'])->name('miller.marketplace');

    // 2. The Interest Action (POST request when clicking the button)
    Route::post('/miller/interest/{id}', [MillerController::class, 'interest'])->name('miller.interest');

    // 3. Incoming Palay (The list of rice the Miller is buying/waiting for)
    Route::get('/miller/incoming', [MillerController::class, 'incoming'])->name('miller.incoming');

    // 4. Inventory (The Miller's processed stock)
    Route::get('/miller/inventory', [MillerController::class, 'inventory'])->name('miller.inventory');

    // 5. General Resource
    Route::resource('millers', MillerController::class)->names('miller');
    Route::get('/miller/processed-inventory', [MillerController::class, 'processedInventory'])->name('miller.processed_inventory');
    Route::post('/miller/list-for-sale/{id}', [MillerController::class, 'listForSale'])->name('miller.list_for_sale');
    Route::patch('/miller/threshold/{id}', [MillerController::class, 'updateThreshold'])->name('miller.update_threshold');
    
    // New 4-step queue and packing actions
    Route::patch('/miller/contact-farmer/{id}', [MillerController::class, 'contactFarmer'])->name('miller.contact_farmer');
    Route::patch('/miller/mark-received/{id}', [MillerController::class, 'markReceived'])->name('miller.mark_received');
    Route::patch('/miller/start-drying/{id}', [MillerController::class, 'startDrying'])->name('miller.start_drying');
    Route::patch('/miller/ready-to-process/{id}', [MillerController::class, 'setReadyToProcess'])->name('miller.ready_to_process');
    Route::patch('/miller/start-processing/{id}', [MillerController::class, 'startProcessing'])->name('miller.start_processing');
    Route::patch('/miller/mill-to-rice/{id}', [MillerController::class, 'millToRice'])->name('miller.mill_to_rice');

    // Miller Order Management (Logistics)
    Route::get('/miller/orders', [MillerController::class, 'millerOrders'])->name('miller.orders');
    Route::post('/miller/orders/{id}/ready', [MillerController::class, 'readyForPickup'])->name('miller.order.ready');
    
    // Unified Transport Hub
    Route::get('/miller/transport', [MillerController::class, 'transport'])->name('miller.transport');
    Route::post('/miller/transport/assign-driver/{id}', [MillerController::class, 'assignDriver'])->name('miller.transport.assign_driver');
    Route::post('/miller/transport/link-driver/{id}', [MillerController::class, 'linkDriver'])->name('miller.transport.link_driver');
    
    // Palay Logistics (Farmer -> Miller)
    Route::post('/miller/palay/confirm-pickup/{id}', [MillerController::class, 'confirmPickup'])->name('miller.palay.confirm_pickup');
    Route::post('/miller/palay/authorize/{id}', [MillerController::class, 'authorizePayment'])->name('miller.palay.authorize');
    Route::post('/miller/palay/finalize/{id}', [MillerController::class, 'finalizeTransaction'])->name('miller.palay.finalize');
    
    // Rice Logistics (Miller -> Retailer)
    Route::post('/miller/orders/{id}/dispatch', [MillerController::class, 'dispatchDelivery'])->name('miller.order.dispatch');
    Route::post('/miller/orders/{id}/delivered', [MillerController::class, 'markDelivered'])->name('miller.order.delivered');

    // Scheduling
    Route::post('/miller/palay/schedule-pickup/{id}', [MillerController::class, 'schedulePickup'])->name('miller.palay.schedule_pickup');
    Route::post('/miller/orders/schedule-delivery/{id}', [MillerController::class, 'scheduleDelivery'])->name('miller.order.schedule_delivery');

    // 6. Shipping & Delivery Settings
    Route::get('/miller/shipping-settings', [MillerController::class, 'shippingSettings'])->name('miller.shipping_settings');
    Route::patch('/miller/shipping-settings', [MillerController::class, 'updateShippingSettings'])->name('miller.shipping_settings.update');
});
