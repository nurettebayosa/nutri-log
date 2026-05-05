<?php

use App\Http\Controllers\Api\PumpStateController;
use App\Http\Controllers\Api\SensorIngestController;
use Illuminate\Support\Facades\Route;

Route::post('/sensor-ingest', [SensorIngestController::class, 'store']);
Route::get('/pump-state', [PumpStateController::class, 'show']);
