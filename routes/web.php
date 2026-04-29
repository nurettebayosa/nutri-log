<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/akses', function () {
    return Inertia::render('Auth/AccessRequest');
})->name('access-request');

// KUMPULAN HALAMAN YANG WAJIB LOGIN
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/riwayat-sensor', function () {
        return Inertia::render('Sensor/History');
    })->name('sensor.history');

    Route::get('/blok', function () {
        return Inertia::render('Blocks/Index');
    })->name('blocks.index');

    // === TAMBAHAN 4 ROUTES BARU DARI BATCH 2 ===

    Route::get('/laporan', function () {
        return Inertia::render('Reports/Index');
    })->name('reports.index');

    Route::get('/blok/{id}', function ($id) {
        return Inertia::render('Blocks/Show', ['blockId' => $id]);
    })->name('blocks.show');

    Route::get('/jadwal-fertigasi', function () {
        return Inertia::render('Fertigation/Schedule');
    })->name('fertigation.schedule');

    Route::get('/kontrol-pompa', function () {
        return Inertia::render('Pump/Control');
    })->name('pump.control');

});

// KUMPULAN HALAMAN PROFILE BAWAAN BREEZE
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
