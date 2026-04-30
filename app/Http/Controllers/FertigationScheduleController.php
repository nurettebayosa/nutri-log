<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\FertigationLog;
use App\Models\FertigationSchedule;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FertigationScheduleController extends Controller
{
    public function index()
    {
        $today = today();
        $now = now();

        $logs = FertigationLog::with(['block', 'executor', 'schedule'])
            ->whereDate('scheduled_at', $today)
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($log) use ($now) {
                // Tentukan status display
                $displayStatus = $log['status'];
                if ($displayStatus === 'pending' && $log['scheduled_at']->gt($now)) {
                    $displayStatus = 'belum-waktunya';
                }

                return [
                    'id' => $log['id'],
                    'time' => $log['scheduled_at']->format('H:i'),
                    'block_id' => $log['block_id'],
                    'block_name' => $log->block->name ?? '-',
                    'block_code' => $log->block->code ?? '-',
                    'target_ppm' => $log->schedule->target_ppm ?? 1100,
                    'actual_ppm' => $log['actual_ppm'],
                    'status' => $displayStatus,
                    'executor_name' => $log->executor->name ?? null,
                    'executed_at' => $log['executed_at'] ? $log['executed_at']->format('H:i') : null,
                ];
            });

        // Schedules templates (untuk tab Pengaturan)
        $schedules = FertigationSchedule::with('block')
            ->orderBy('block_id')
            ->orderBy('time_of_day')
            ->get()
            ->groupBy('block_id')
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'block_id' => $first['block_id'],
                    'block_name' => $first->block->name ?? '-',
                    'is_active' => $items->where('is_active', true)->count() > 0,
                    // FIX: Pakai gaya Array biar Intelephense mingkem
                    'slots' => $items->map(function ($s) {
                        return [
                            'id' => $s['id'],
                            'time' => substr($s['time_of_day'], 0, 5),
                            'target_ppm' => $s['target_ppm'],
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('Fertigation/Schedule', [
            'logs_today' => $logs,
            'schedules' => $schedules,
        ]);
    }

    public function markDone(Request $request, int $logId)
    {
        $request->validate([
            'actual_ppm' => 'required|integer|min:0|max:5000',
            'notes' => 'nullable|string|max:1000',
        ]);

        /** @var \App\Models\FertigationLog $log */
        $log = FertigationLog::findOrFail($logId);

        if ($log['status'] === 'done') {
            return back()->with('error', 'Jadwal ini sudah ditandai selesai sebelumnya.');
        }

        $log->update([
            'status' => 'done',
            'executed_at' => now(),
            'executed_by' => auth()->id(),
            'actual_ppm' => $request->actual_ppm,
            'notes' => $request->notes,
        ]);

        ActivityLog::record(
            'TANDAI_FERTIGASI',
            'FertigationLog',
            $log['id'],
            "Menandai fertigasi {$log['scheduled_at']->format('H:i')} Blok {$log->block->code} selesai",
            null,
            ['actual_ppm' => $request->actual_ppm]
        );

        return back()->with('success', 'Fertigasi berhasil ditandai selesai.');
    }
}
