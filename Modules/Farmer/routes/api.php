<?php

use Illuminate\Support\Facades\Route;
use Modules\Farmer\Http\Controllers\FarmerController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('farmers', FarmerController::class)->names('farmer');
});
