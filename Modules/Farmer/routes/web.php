<?php

use Illuminate\Support\Facades\Route;
use Modules\Farmer\Http\Controllers\FarmerController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('farmers', FarmerController::class)->names('farmer');
});
