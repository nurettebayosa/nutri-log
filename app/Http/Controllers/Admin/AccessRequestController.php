<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccessRequestController extends Controller
{
    /**
     * Public: form akses (guest)
     */
    public function showForm()
    {
        return Inertia::render('Auth/AccessRequest');
    }

    /**
     * Public: submit form akses (guest)
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'wa_number' => 'required|string|max:20',
            'request_type' => 'required|in:reset_password,new_account',
            'reason' => 'nullable|string|max:1000',
        ]);

        AccessRequest::create($validated);

        return back()->with('success', 'Permintaan terkirim.');
    }

    /**
     * Admin: list permintaan
     */
    public function index(Request $request)
    {
        $tab = $request->input('tab', 'menunggu');
        $statusMap = ['menunggu' => 'pending', 'disetujui' => 'approved', 'ditolak' => 'rejected'];
        $dbStatus = $statusMap[$tab] ?? 'pending';

        $requests = AccessRequest::with('processor')
            ->where('status', $dbStatus)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'full_name' => $r->full_name,
                    'email' => $r->email,
                    'wa_number' => $r->wa_number,
                    'request_type' => $r->request_type === 'new_account' ? 'Akun Baru' : 'Reset Password',
                    'reason' => $r->reason,
                    'created_at' => $r->created_at->format('d/m H:i'),
                    'status' => $r->status,
                    'processor_name' => $r->processor?->name,
                    'processed_at' => $r->processed_at?->format('d/m H:i'),
                    'rejection_reason' => $r->rejection_reason,
                ];
            });

        $counts = [
            'menunggu' => AccessRequest::where('status', 'pending')->count(),
            'disetujui' => AccessRequest::where('status', 'approved')->count(),
            'ditolak' => AccessRequest::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/AccessRequests', [
            'requests' => $requests,
            'counts' => $counts,
            'filters' => ['tab' => $tab],
        ]);
    }

    public function approve($id)
    {
        $req = AccessRequest::findOrFail($id);

        if ($req->status !== 'pending') {
            return back()->with('error', 'Permintaan ini sudah diproses.');
        }

        $req->update([
            'status' => 'approved',
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);

        ActivityLog::record(
            'APPROVE_ACCESS',
            'AccessRequest',
            $req->id,
            "Menyetujui permintaan akses dari {$req->full_name}"
        );

        return back()->with('success', 'Permintaan disetujui. Hubungi user via WhatsApp untuk follow-up.');
    }

    public function reject(Request $request, $id)
    {
        $req = AccessRequest::findOrFail($id);

        if ($req->status !== 'pending') {
            return back()->with('error', 'Permintaan ini sudah diproses.');
        }

        $req->update([
            'status' => 'rejected',
            'processed_by' => Auth::id(),
            'processed_at' => now(),
            'rejection_reason' => $request->reason,
        ]);

        ActivityLog::record(
            'REJECT_ACCESS',
            'AccessRequest',
            $req->id,
            "Menolak permintaan akses dari {$req->full_name}"
        );

        return back()->with('success', 'Permintaan ditolak.');
    }
}
