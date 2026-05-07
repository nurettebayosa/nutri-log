<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SensorHistoryController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\FertigationScheduleController;
use App\Http\Controllers\PumpControlController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ThresholdController;
use App\Http\Controllers\DisplaySettingController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\AccessRequestController;
use App\Http\Controllers\Admin\ActivityLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

// PUBLIC: Permintaan Akses (Guest)
Route::get('/akses', [AccessRequestController::class, 'showForm'])->name('access-request');
Route::post('/akses', [AccessRequestController::class, 'submit'])->name('access-request.submit');

Route::middleware(['auth', 'verified'])->group(function () {

    // === ROUTE UNTUK SEMUA USER (Karyawan & Owner) ===
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/riwayat-sensor', [SensorHistoryController::class, 'index'])->name('sensor.history');
    Route::get('/blok', [BlockController::class, 'index'])->name('blocks.index');
    Route::get('/blok/{id}', [BlockController::class, 'show'])->name('blocks.show');

    Route::get('/jadwal-fertigasi', [FertigationScheduleController::class, 'index'])->name('fertigation.schedule');
    Route::post('/jadwal-fertigasi/{logId}/done', [FertigationScheduleController::class, 'markDone'])->name('fertigation.markDone');

    Route::get('/kontrol-pompa', [PumpControlController::class, 'index'])->name('pump.control');
    Route::post('/kontrol-pompa/{blockId}/toggle', [PumpControlController::class, 'toggle'])->name('pump.toggle');

    Route::get('/maintenance', [MaintenanceController::class, 'index'])->name('maintenance.journal');
    Route::post('/maintenance', [MaintenanceController::class, 'store'])->name('maintenance.store');
    Route::delete('/maintenance/{id}', [MaintenanceController::class, 'destroy'])->name('maintenance.destroy');

    Route::get('/notifikasi', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifikasi/{id}/resolve', [NotificationController::class, 'resolve'])->name('notifications.resolve');
    Route::post('/notifikasi/{id}/ignore', [NotificationController::class, 'ignore'])->name('notifications.ignore');

    Route::get('/tampilan', [DisplaySettingController::class, 'index'])->name('settings.display');
    Route::patch('/tampilan', [DisplaySettingController::class, 'update'])->name('settings.display.update');

    Route::get('/laporan', function () {
        return Inertia::render('Reports/Index');
    })->name('reports.index');

    // === ROUTE KHUSUS OWNER (OWNER-ONLY) ===
    Route::middleware('owner')->group(function () {
        // ── B2 Revisi: CRUD Blok (Owner-only) ──
        Route::post('/blok', [BlockController::class, 'store'])->name('blocks.store');
        Route::patch('/blok/{id}', [BlockController::class, 'update'])->name('blocks.update');
        Route::delete('/blok/{id}', [BlockController::class, 'destroy'])->name('blocks.destroy');

        Route::get('/threshold', [ThresholdController::class, 'index'])->name('settings.threshold');
        Route::post('/threshold/{blockId}/{sensorType}', [ThresholdController::class, 'update'])->name('settings.threshold.update');

        Route::get('/kelola-pengguna', [UserManagementController::class, 'index'])->name('admin.users');
        Route::post('/kelola-pengguna', [UserManagementController::class, 'store'])->name('admin.users.store');
        Route::patch('/kelola-pengguna/{id}', [UserManagementController::class, 'update'])->name('admin.users.update');
        Route::delete('/kelola-pengguna/{id}', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');

        Route::get('/permintaan-akses', [AccessRequestController::class, 'index'])->name('admin.access-requests');
        Route::post('/permintaan-akses/{id}/approve', [AccessRequestController::class, 'approve'])->name('admin.access-requests.approve');
        Route::post('/permintaan-akses/{id}/reject', [AccessRequestController::class, 'reject'])->name('admin.access-requests.reject');

        Route::get('/log-aktivitas', [ActivityLogController::class, 'index'])->name('admin.activity-log');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
