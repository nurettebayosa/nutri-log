<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')
            ->when($request->user_id, fn($q, $uid) => $q->where('user_id', $uid))
            ->when($request->action, fn($q, $action) => $q->where('action', 'like', "{$action}%"))
            ->when($request->date, fn($q, $date) => $q->whereDate('created_at', $date))
            ->when($request->search, function ($q, $term) {
                $q->where(function ($subQ) use ($term) {
                    $subQ->where('description', 'like', "%{$term}%")
                         ->orWhere('action', 'like', "%{$term}%");
                });
            })
            ->orderBy('created_at', 'desc');

        $logs = $query->paginate(15)->withQueryString();

        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/ActivityLog', [
            'logs' => $logs->through(function ($log) {
                return [
                    'id' => $log->id,
                    'created_at' => $log->created_at->format('d/m H:i'),
                    'user_name' => $log->user?->name ?? 'Sistem',
                    'action' => $log->action,
                    'target' => $log->target_type
                        ? "{$log->target_type}#{$log->target_id}"
                        : '-',
                    'description' => $log->description ?? '-',
                    'ip_address' => $log->ip_address ?? '-',
                ];
            }),
            'users' => $users,
            'filters' => [
                'user_id' => $request->user_id ?? '',
                'action' => $request->action ?? '',
                'date' => $request->date ?? '',
                'search' => $request->search ?? '',
            ],
        ]);
    }
}
