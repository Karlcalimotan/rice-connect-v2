<?php

use Illuminate\Support\Facades\Route;
use Modules\Miller\Http\Controllers\MillerController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('millers', MillerController::class)->names('miller');
});
