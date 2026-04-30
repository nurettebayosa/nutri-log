<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/akses', function () {
    return Inertia::render('Auth/AccessRequest');
})->name('access-request');

Route::middleware(['auth', 'verified'])->group(function () {

    // === ROUTES BATCH 1 (UDAH NYAMBUNG CONTROLLER) ===
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/riwayat-sensor', [\App\Http\Controllers\SensorHistoryController::class, 'index'])->name('sensor.history');

    Route::get('/blok', [\App\Http\Controllers\BlockController::class, 'index'])->name('blocks.index');
    Route::get('/blok/{id}', [\App\Http\Controllers\BlockController::class, 'show'])->name('blocks.show');

    Route::get('/jadwal-fertigasi', [\App\Http\Controllers\FertigationScheduleController::class, 'index'])->name('fertigation.schedule');
    Route::post('/jadwal-fertigasi/{logId}/done', [\App\Http\Controllers\FertigationScheduleController::class, 'markDone'])->name('fertigation.markDone');

    // === ROUTES STUB (BELUM ADA CONTROLLERNYA) ===
    Route::get('/laporan', function () {
        return Inertia::render('Reports/Index');
    })->name('reports.index');

    Route::get('/kontrol-pompa', function () {
        return Inertia::render('Pump/Control');
    })->name('pump.control');

    Route::get('/maintenance', function () {
        return Inertia::render('Maintenance/Journal');
    })->name('maintenance.journal');

    Route::get('/notifikasi', function () {
        return Inertia::render('Notifications/Index');
    })->name('notifications.index');

    Route::get('/threshold', function () {
        return Inertia::render('Settings/Threshold');
    })->name('settings.threshold');

    Route::get('/tampilan', function () {
        return Inertia::render('Settings/Display');
    })->name('settings.display');

    Route::get('/kelola-pengguna', function () {
        return Inertia::render('Admin/Users');
    })->name('admin.users');

    Route::get('/permintaan-akses', function () {
        return Inertia::render('Admin/AccessRequests');
    })->name('admin.access-requests');

    Route::get('/log-aktivitas', function () {
        return Inertia::render('Admin/ActivityLog');
    })->name('admin.activity-log');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
