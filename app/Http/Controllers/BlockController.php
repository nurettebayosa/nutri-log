<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Block;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BlockController extends Controller
{
    public function index()
    {
        $blocks = Block::with('activeCycle')->orderBy('code')->get()->map(function ($block) {
            $cycle = $block->activeCycle;
            $hst = $cycle ? (int) $cycle->start_date->diffInDays(now()) : null;

            $statusLabel = 'Idle';
            if ($cycle) {
                if ($hst >= 28) $statusLabel = 'Siap Panen';
                elseif ($hst >= 14 && $hst <= 21) $statusLabel = 'Tumbuh (Fase Rawan)';
                else $statusLabel = 'Tumbuh';
            }

            return [
                'id' => $block->id,
                'code' => $block->code,
                'name' => $block->name,
                'plant_type' => $block->plant_type,
                'location' => $block->location,
                'polybag_count' => $block->polybag_count,
                'has_sensor' => $block->has_sensor,
                'photo_path' => $block->photo_path,
                'photo_url' => $block->photo_path ? Storage::url($block->photo_path) : null,
                'notes' => $block->notes,
                'device_id' => $block->device_id,
                // device_token sengaja TIDAK di-expose ke frontend (security).
                'hst' => $hst,
                'status_label' => $statusLabel,
            ];
        });

        return Inertia::render('Blocks/Index', [
            'blocks' => $blocks,
        ]);
    }

    public function show(int $id)
    {
        /** @var \App\Models\Block $block */
        $block = Block::with('activeCycle')->findOrFail($id);
        $cycle = $block->activeCycle;
        $hst = $cycle ? (int) $cycle->start_date->diffInDays(now()) : null;

        $latestTds = $block->sensorReadings()->where('sensor_type', 'tds')->latest('recorded_at')->first();
        $latestMoisture = $block->sensorReadings()->where('sensor_type', 'moisture')->latest('recorded_at')->first();
        $latestTurbidity = $block->sensorReadings()->where('sensor_type', 'turbidity')->latest('recorded_at')->first();

        return Inertia::render('Blocks/Show', [
            'block' => [
                'id' => $block->id,
                'code' => $block->code,
                'name' => $block->name,
                'plant_type' => $block->plant_type,
                'location' => $block->location,
                'polybag_count' => $block->polybag_count,
                'has_sensor' => $block->has_sensor,
                'photo_path' => $block->photo_path,
                'photo_url' => $block->photo_path ? Storage::url($block->photo_path) : null,
                'notes' => $block->notes,
                'hst' => $hst,
                'start_date' => $cycle?->start_date?->translatedFormat('d F Y'),
                'expected_harvest_date' => $cycle?->expected_harvest_date?->translatedFormat('d F Y'),
                'cycle_number' => $cycle?->cycle_number,
                'sensors' => [
                    'tds' => $latestTds?->value,
                    'moisture' => $latestMoisture?->value,
                    'turbidity' => $latestTurbidity?->value,
                    'last_update' => $latestTds?->recorded_at?->diffForHumans()
                        ?? $latestMoisture?->recorded_at?->diffForHumans()
                        ?? $latestTurbidity?->recorded_at?->diffForHumans(),
                ],
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20', 'unique:blocks,code'],
            'name' => ['required', 'string', 'max:100'],
            'plant_type' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:150'],
            'polybag_count' => ['nullable', 'integer', 'min:0', 'max:99999'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'has_sensor' => ['nullable', 'boolean'],
            'device_id' => ['nullable', 'string', 'max:50'],
            'device_token' => ['nullable', 'string', 'max:100'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'code.unique' => 'Kode blok ini sudah dipakai. Pakai kode lain (contoh: A1, B2).',
            'photo.max' => 'Ukuran foto maksimal 2 MB.',
            'photo.image' => 'File harus berupa gambar.',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('blocks', 'public');
        }
        unset($validated['photo']);

        $validated['has_sensor'] = (bool) ($validated['has_sensor'] ?? false);
        if (empty($validated['plant_type'])) {
            $validated['plant_type'] = 'Pakcoy';
        }

        $block = Block::create($validated);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'CREATE_BLOCK',
            'target_type' => 'Block',
            'target_id' => $block->id,
            'description' => "Membuat blok baru: {$block->code} — {$block->name}",
            'new_value' => $block->only(['code', 'name', 'plant_type', 'location', 'polybag_count', 'has_sensor', 'device_id']),
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return redirect()->route('blocks.index')->with('success', "Blok {$block->code} berhasil ditambahkan.");
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        /** @var Block $block */
        $block = Block::findOrFail($id);

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20', Rule::unique('blocks', 'code')->ignore($block->id)],
            'name' => ['required', 'string', 'max:100'],
            'plant_type' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:150'],
            'polybag_count' => ['nullable', 'integer', 'min:0', 'max:99999'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'has_sensor' => ['nullable', 'boolean'],
            'device_id' => ['nullable', 'string', 'max:50'],
            'device_token' => ['nullable', 'string', 'max:100'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_photo' => ['nullable', 'boolean'],
        ], [
            'code.unique' => 'Kode blok ini sudah dipakai oleh blok lain.',
            'photo.max' => 'Ukuran foto maksimal 2 MB.',
            'photo.image' => 'File harus berupa gambar.',
        ]);

        $original = $block->only(['code', 'name', 'plant_type', 'location', 'polybag_count', 'has_sensor', 'device_id']);

        // Hapus foto lama bila diminta atau ada upload baru.
        if ($request->boolean('remove_photo') && $block->photo_path) {
            Storage::disk('public')->delete($block->photo_path);
            $validated['photo_path'] = null;
        }

        if ($request->hasFile('photo')) {
            if ($block->photo_path) {
                Storage::disk('public')->delete($block->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('blocks', 'public');
        }

        unset($validated['photo'], $validated['remove_photo']);

        $validated['has_sensor'] = (bool) ($validated['has_sensor'] ?? false);
        if (empty($validated['plant_type'])) {
            $validated['plant_type'] = 'Pakcoy';
        }

        // Jangan timpa device_token kalau field-nya dikosongkan saat edit.
        if (!filled($request->input('device_token'))) {
            unset($validated['device_token']);
        }

        $block->update($validated);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'UPDATE_BLOCK',
            'target_type' => 'Block',
            'target_id' => $block->id,
            'description' => "Memperbarui blok: {$block->code} — {$block->name}",
            'old_value' => $original,
            'new_value' => $block->only(['code', 'name', 'plant_type', 'location', 'polybag_count', 'has_sensor', 'device_id']),
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return redirect()->route('blocks.index')->with('success', "Blok {$block->code} berhasil diperbarui.");
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        /** @var Block $block */
        $block = Block::findOrFail($id);
        $snapshot = $block->only(['code', 'name', 'plant_type', 'location', 'polybag_count', 'has_sensor', 'device_id']);

        if ($block->photo_path) {
            Storage::disk('public')->delete($block->photo_path);
        }

        // Cascade delete via FK akan menghapus planting_cycles, sensor_readings,
        // thresholds, alerts, fertigation_schedules, fertigation_logs, pump_actions.
        $block->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'DELETE_BLOCK',
            'target_type' => 'Block',
            'target_id' => $id,
            'description' => "Menghapus blok: {$snapshot['code']} — {$snapshot['name']}",
            'old_value' => $snapshot,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return redirect()->route('blocks.index')->with('success', "Blok {$snapshot['code']} berhasil dihapus.");
    }
}
