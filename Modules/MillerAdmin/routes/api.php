<?php

use Illuminate\Support\Facades\Route;
use Modules\MillerAdmin\Http\Controllers\MillerAdminController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('milleradmins', MillerAdminController::class)->names('milleradmin');
});
