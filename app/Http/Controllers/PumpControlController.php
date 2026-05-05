<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Block;
use App\Models\PumpAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PumpControlController extends Controller
{
    public function index()
    {
        // Semua blok dengan informasi pompa terkini
        $blocks = Block::orderBy('code')->get()->map(function ($block) {
            // Cari aksi pompa terbaru untuk blok ini
            $latestAction = PumpAction::where('block_id', $block->id)
                ->latest('executed_at')
                ->first();

            // Hitung durasi nyala kalau lagi ON (cari pasangan ON-OFF terdekat)
            $isOn = $latestAction && $latestAction->action === 'on';
            $currentDurationSec = $isOn ? now()->diffInSeconds($latestAction->executed_at) : null;

            // Last activation: kalau lagi OFF, kapan terakhir aksi ON?
            $lastOn = PumpAction::where('block_id', $block->id)
                ->where('action', 'on')
                ->latest('executed_at')
                ->first();

            return [
                'id' => $block->id,
                'code' => $block->code,
                'name' => $block->name,
                'has_sensor' => $block->has_sensor,
                'is_on' => $isOn,
                'current_mode' => $latestAction?->mode,
                'current_duration_seconds' => $currentDurationSec,
                'last_action_ago' => $latestAction?->executed_at?->diffForHumans(),
                'last_on_ago' => $lastOn?->executed_at?->diffForHumans(),
            ];
        });

        // Pump activation history (semua blok, paginated)
        $history = PumpAction::with(['block', 'trigger'])
            ->latest('executed_at')
            ->limit(50)
            ->get()
            ->map(function ($action) {
                $modeLabel = match ($action->mode) {
                    'manual' => 'Manual',
                    'auto_schedule' => 'Auto (Jadwal Fertigasi)',
                    'auto_threshold' => 'Auto (Threshold)',
                    default => $action->mode,
                };

                return [
                    'id' => $action->id,
                    'executed_at' => $action->executed_at->format('d/m H:i'),
                    'block_code' => $action->block->code ?? '-',
                    'action' => $action->action,
                    'mode' => $modeLabel,
                    'duration' => $action->duration_seconds
                        ? sprintf('%dm %ds', floor($action->duration_seconds / 60), $action->duration_seconds % 60)
                        : '-',
                    'trigger_reason' => $action->trigger_reason ?? '-',
                    'trigger_name' => $action->trigger?->name ?? 'Sistem',
                ];
            });

        return Inertia::render('Pump/Control', [
            'blocks' => $blocks,
            'history' => $history,
        ]);
    }

    public function toggle(Request $request, $blockId)
    {
        $request->validate([
            'action' => 'required|in:on,off',
        ]);

        $block = Block::findOrFail($blockId);

        if (!$block->has_sensor) {
            return back()->with('error', 'Blok ini belum memiliki hardware pompa.');
        }

        $action = $request->action;

        // Kalau OFF, hitung duration dari ON sebelumnya
        $durationSec = null;
        if ($action === 'off') {
            $lastOn = PumpAction::where('block_id', $blockId)
                ->where('action', 'on')
                ->latest('executed_at')
                ->first();
            if ($lastOn) {
                $durationSec = now()->diffInSeconds($lastOn->executed_at);
            }
        }

        $pumpAction = PumpAction::create([
            'block_id' => $blockId,
            'action' => $action,
            'mode' => 'manual',
            'triggered_by' => Auth::id(),
            'trigger_reason' => 'Tombol manual',
            'duration_seconds' => $durationSec,
            'executed_at' => now(),
        ]);

        ActivityLog::record(
            $action === 'on' ? 'KONTROL_POMPA_ON' : 'KONTROL_POMPA_OFF',
            'PumpAction',
            $pumpAction->id,
            "Manual " . strtoupper($action) . " pompa Blok {$block->code}",
            null,
            ['mode' => 'manual', 'duration_seconds' => $durationSec]
        );

        return back()->with('success', 'Status pompa berhasil diubah.');
    }
}
