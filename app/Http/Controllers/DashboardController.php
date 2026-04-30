<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Block;
use App\Models\FertigationLog;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // ============================
        // 1. Summary Cards (4 metrics)
        // ============================
        $totalBlocks = Block::count();
        $blocksWithSensor = Block::where('has_sensor', true)->count();

        $tdsToday = SensorReading::where('sensor_type', 'tds')
            ->whereDate('recorded_at', $today)
            ->avg('value');

        $latestMoisture = SensorReading::where('sensor_type', 'moisture')
            ->latest('recorded_at')
            ->value('value');

        $latestTurbidity = SensorReading::where('sensor_type', 'turbidity')
            ->latest('recorded_at')
            ->value('value');

        // ============================
        // 2. Active Alert (paling baru, severity tertinggi)
        // ============================
        $activeAlert = Alert::with('block')
            ->where('status', 'active')
            ->orderByRaw("FIELD(severity, 'critical','warning','info')")
            ->latest('triggered_at')
            ->first();

        // ============================
        // 3. Block Cards (semua blok dengan latest sensor + cycle)
        // ============================
        $blocks = Block::with(['activeCycle'])->get()->map(function ($block) {
            $latestTds = $block->sensorReadings()
                ->where('sensor_type', 'tds')
                ->latest('recorded_at')->first();
            $latestMoisture = $block->sensorReadings()
                ->where('sensor_type', 'moisture')
                ->latest('recorded_at')->first();
            $latestTurbidity = $block->sensorReadings()
                ->where('sensor_type', 'turbidity')
                ->latest('recorded_at')->first();

            $cycle = $block->activeCycle;
            $hst = $cycle ? (int) $cycle->start_date->diffInDays(now()) : null;

            return [
                'id' => $block->id,
                'code' => $block->code,
                'name' => $block->name,
                'plant_type' => $block->plant_type,
                'has_sensor' => $block->has_sensor,
                'hst' => $hst,
                'start_date' => $cycle?->start_date?->translatedFormat('d F Y'),
                'expected_harvest_date' => $cycle?->expected_harvest_date?->translatedFormat('d F Y'),
                'tds' => $latestTds?->value,
                'moisture' => $latestMoisture?->value,
                'turbidity' => $latestTurbidity?->value,
            ];
        });

        // ============================
        // 4. Fertigation Schedules Hari Ini
        // ============================
        $schedules = FertigationLog::with(['block', 'executor'])
            ->whereDate('scheduled_at', $today)
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'time' => $log->scheduled_at->format('H:i'),
                    'block_name' => $log->block->name ?? '-',
                    'block_code' => $log->block->code ?? '-',
                    'target_ppm' => 1100, // dari schedule template — sederhanain dulu
                    'actual_ppm' => $log->actual_ppm,
                    'status' => $log->status,
                    'executor_name' => $log->executor?->name,
                    'executed_at' => $log->executed_at?->format('H:i'),
                ];
            });

        // ============================
        // 5. Recent Activities (dari activity_logs)
        // ============================
        $activities = \App\Models\ActivityLog::with('user')
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user?->name ?? 'Sistem',
                    'action' => $log->action,
                    'description' => $log->description,
                    'time_ago' => $log->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Dashboard', [
            'summary' => [
                'total_blocks' => $totalBlocks,
                'blocks_with_sensor' => $blocksWithSensor,
                'avg_tds_today' => $tdsToday ? round($tdsToday) : null,
                'latest_moisture' => $latestMoisture,
                'latest_turbidity' => $latestTurbidity,
            ],
            'active_alert' => $activeAlert ? [
                'id' => $activeAlert->id,
                'title' => $activeAlert->title,
                'message' => $activeAlert->message,
                'severity' => $activeAlert->severity,
                'block_name' => $activeAlert->block?->name ?? 'Sistem',
                'triggered_ago' => $activeAlert->triggered_at->diffForHumans(),
            ] : null,
            'blocks' => $blocks,
            'schedules' => $schedules,
            'activities' => $activities,
        ]);
    }
}
