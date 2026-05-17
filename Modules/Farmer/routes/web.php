<?php

use Modules\Farmer\Http\Controllers\FarmerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:farmer'])->group(function () {
    Route::get('/farmer/harvest', [FarmerController::class, 'index'])->name('farmer.harvest');
    Route::get('/farmer/harvest/create', [FarmerController::class, 'create'])->name('farmer.harvest.create');
    Route::post('/farmer/harvest', [FarmerController::class, 'store'])->name('farmer.harvest.store');
    Route::get('/farmer/harvest/{id}/edit', [FarmerController::class, 'edit'])->name('farmer.harvest.edit');
    Route::delete('/farmer/harvest/{id}', [FarmerController::class, 'destroy'])->name('farmer.harvest.destroy');
    Route::patch('/farmer/harvest/{id}', [FarmerController::class, 'update'])->name('farmer.harvest.update');
    Route::get('/farmer/offers', [FarmerController::class, 'offers'])->name('farmer.offers');
    Route::post('/farmer/accept/{id}', [FarmerController::class, 'acceptHandshake'])->name('farmer.accept-handshake');
});
