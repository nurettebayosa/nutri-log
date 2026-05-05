<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->when($request->search, function ($q, $term) {
                $q->where(function ($subQ) use ($term) {
                    $subQ->where('name', 'like', "%{$term}%")
                         ->orWhere('email', 'like', "%{$term}%");
                });
            })
            ->when($request->role, fn($q, $role) => $q->where('role', $role))
            ->orderBy('role')
            ->orderBy('name');

        $users = $query->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => ucfirst($u->role),
                'wa_number' => $u->wa_number ?? '-',
                'last_login' => $u->last_login_at?->format('d/m H:i') ?? '-',
                'is_active' => $u->is_active,
                'status_label' => $u->is_active ? 'Aktif' : 'Nonaktif',
            ];
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:150',
            'wa_number' => 'nullable|string|max:20',
            'role' => 'required|in:owner,karyawan',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'wa_number' => $validated['wa_number'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        ActivityLog::record(
            'TAMBAH_PENGGUNA',
            'User',
            $user->id,
            "Menambah pengguna {$user->name} (role: {$user->role})"
        );

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:150|unique:users,email,' . $id,
            'wa_number' => 'nullable|string|max:20',
            'role' => 'required|in:owner,karyawan',
            'is_active' => 'nullable|boolean',
        ]);

        $oldData = ['role' => $user->role, 'is_active' => $user->is_active];

        $user->update($validated);

        ActivityLog::record(
            'EDIT_PENGGUNA',
            'User',
            $user->id,
            "Update pengguna {$user->name}",
            $oldData,
            ['role' => $user->role, 'is_active' => $user->is_active]
        );

        return back()->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Tidak boleh hapus diri sendiri
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Tidak bisa menghapus akun sendiri.');
        }

        // Tidak boleh hapus owner terakhir
        if ($user->role === 'owner' && User::where('role', 'owner')->count() <= 1) {
            return back()->with('error', 'Tidak bisa menghapus satu-satunya owner.');
        }

        $userName = $user->name;
        $user->delete();

        ActivityLog::record(
            'HAPUS_PENGGUNA',
            'User',
            $id,
            "Menghapus pengguna {$userName}"
        );

        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
