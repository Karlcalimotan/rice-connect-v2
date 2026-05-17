<?php

use Illuminate\Support\Facades\Route;
use Modules\MillerAdmin\Http\Controllers\MillerAdminController;

Route::middleware(['web', 'auth', 'verified', 'role:admin'])->group(function () {
    // Global Dashboard (Admin View)
    Route::get('/admin/dashboard', [MillerAdminController::class, 'index'])->name('admin.dashboard');
    
    // Global Municipality & Logistics Management
    Route::get('/admin/municipalities', [MillerAdminController::class, 'municipalities'])->name('admin.municipalities.index');
    Route::post('/admin/municipalities', [MillerAdminController::class, 'store'])->name('admin.municipalities.store');
    Route::patch('/admin/municipalities/{id}', [MillerAdminController::class, 'update'])->name('admin.municipalities.update');
    Route::delete('/admin/municipalities/{id}', [MillerAdminController::class, 'destroy'])->name('admin.municipalities.destroy');
    
    // Administrative Actions
    Route::delete('/admin/harvest-batches/{id}', [MillerAdminController::class, 'destroyHarvestBatch'])->name('admin.harvest_batches.destroy');
});
