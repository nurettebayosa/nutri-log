<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->input('tab', 'semua');

        $query = Alert::with('block')
            ->when($tab === 'aktif', fn($q) => $q->where('status', 'active'))
            ->when($tab === 'selesai', fn($q) => $q->where('status', 'resolved'))
            ->when($tab === 'diabaikan', fn($q) => $q->where('status', 'ignored'))
            ->when($request->severity, fn($q, $sev) => $q->where('severity', $sev))
            ->when($request->block_id, fn($q, $bid) => $q->where('block_id', $bid))
            ->when($request->date, fn($q, $d) => $q->whereDate('triggered_at', $d))
            ->orderBy('triggered_at', 'desc');

        $alerts = $query->limit(50)->get()->map(function ($alert) {
            return [
                'id' => $alert->id,
                'severity' => $alert->severity,
                'title' => $alert->title,
                'message' => $alert->message,
                'block_name' => $alert->block?->name ?? 'Sistem',
                'time' => $alert->triggered_at->format('H:i'),
                'date' => $alert->triggered_at->format('d/m/Y'),
                'status' => $this->mapStatus($alert->status),
            ];
        });

        $blocks = \App\Models\Block::orderBy('code')->get(['id', 'name']);

        // Counts per tab
        $counts = [
            'semua' => Alert::count(),
            'aktif' => Alert::where('status', 'active')->count(),
            'selesai' => Alert::where('status', 'resolved')->count(),
            'diabaikan' => Alert::where('status', 'ignored')->count(),
        ];

        return Inertia::render('Notifications/Index', [
            'alerts' => $alerts,
            'blocks' => $blocks,
            'counts' => $counts,
            'filters' => [
                'tab' => $tab,
                'severity' => $request->severity ?? '',
                'block_id' => $request->block_id ?? '',
                'date' => $request->date ?? '',
            ],
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $alert = Alert::findOrFail($id);

        if ($alert->status !== 'active') {
            return back()->with('error', 'Alert ini sudah tidak aktif.');
        }

        $alert->update([
            'status' => 'resolved',
            'resolved_at' => now(),
            'resolved_by' => Auth::id(),
            'resolution_note' => $request->note,
        ]);

        ActivityLog::record(
            'RESOLVE_ALERT',
            'Alert',
            $alert->id,
            "Menandai selesai alert: {$alert->title}"
        );

        return back()->with('success', 'Alert berhasil ditandai selesai.');
    }

    public function ignore($id)
    {
        $alert = Alert::findOrFail($id);

        if ($alert->status !== 'active') {
            return back()->with('error', 'Alert ini sudah tidak aktif.');
        }

        $alert->update(['status' => 'ignored']);

        ActivityLog::record(
            'IGNORE_ALERT',
            'Alert',
            $alert->id,
            "Mengabaikan alert: {$alert->title}"
        );

        return back()->with('success', 'Alert diabaikan.');
    }

    private function mapStatus(string $dbStatus): string
    {
        return match ($dbStatus) {
            'active' => 'aktif',
            'resolved' => 'selesai',
            'ignored' => 'diabaikan',
            default => $dbStatus,
        };
    }
}
