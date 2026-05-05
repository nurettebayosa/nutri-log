<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\MaintenanceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $blocks = Block::orderBy('code')->get(['id', 'code', 'name']);

        $query = MaintenanceLog::with(['user', 'blocks', 'photos'])
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->when($request->block_id, function ($q, $blockId) {
                $q->whereHas('blocks', fn($subQ) => $subQ->where('blocks.id', $blockId));
            })
            ->when($request->search, function ($q, $term) {
                $q->where(function ($subQ) use ($term) {
                    $subQ->where('description', 'like', "%{$term}%")
                         ->orWhere('title', 'like', "%{$term}%");
                });
            })
            ->when($request->date, fn($q, $date) => $q->whereDate('occurred_at', $date))
            ->orderBy('occurred_at', 'desc')
            ->limit(50);

        $entries = $query->get()->map(function ($log) {
            return [
                'id' => $log->id,
                'occurred_at' => $log->occurred_at->format('d/m H:i'),
                'user_name' => $log->user->name ?? '-',
                'category' => $log->category,
                'category_label' => $this->categoryLabel($log->category),
                'title' => $log->title,
                'description' => $log->description,
                'block_codes' => $log->blocks->pluck('code')->toArray(),
                'block_names' => $log->blocks->pluck('name')->toArray(),
                'photo_count' => $log->photos->count(),
                'can_delete' => Auth::id() === $log->user_id || (Auth::user()?->role === 'owner'),
            ];
        });

        return Inertia::render('Maintenance/Journal', [
            'blocks' => $blocks,
            'entries' => $entries,
            'filters' => [
                'category' => $request->category ?? '',
                'block_id' => $request->block_id ?? '',
                'search' => $request->search ?? '',
                'date' => $request->date ?? '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|in:fertigasi,hama,penyakit,panen,pruning,alat,lainnya',
            'title' => 'nullable|string|max:200',
            'description' => 'required|string|max:5000',
            'occurred_at' => 'required|date',
            'block_ids' => 'nullable|array',
            'block_ids.*' => 'exists:blocks,id',
        ]);

        $log = MaintenanceLog::create([
            'user_id' => Auth::id(),
            'category' => $validated['category'],
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'],
            'occurred_at' => $validated['occurred_at'],
        ]);

        if (!empty($validated['block_ids'])) {
            $log->blocks()->attach($validated['block_ids']);
        }

        \App\Models\ActivityLog::record(
            'TAMBAH_MAINTENANCE',
            'MaintenanceLog',
            $log->id,
            "Menambah catatan {$this->categoryLabel($log->category)}"
        );

        return back()->with('success', 'Catatan berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        $log = MaintenanceLog::findOrFail($id);

        // Hanya pemilik catatan atau owner yang bisa hapus
        if (Auth::id() !== $log->user_id && Auth::user()?->role !== 'owner') {
            abort(403);
        }

        $log->delete();

        \App\Models\ActivityLog::record(
            'HAPUS_MAINTENANCE',
            'MaintenanceLog',
            $id,
            "Menghapus catatan maintenance"
        );

        return back()->with('success', 'Catatan berhasil dihapus.');
    }

    private function categoryLabel(string $cat): string
    {
        return match ($cat) {
            'fertigasi' => 'Pemupukan / Fertigasi',
            'hama' => 'Hama',
            'penyakit' => 'Penyakit',
            'panen' => 'Panen',
            'pruning' => 'Pruning',
            'alat' => 'Maintenance Alat',
            'lainnya' => 'Lainnya',
            default => $cat,
        };
    }
}
