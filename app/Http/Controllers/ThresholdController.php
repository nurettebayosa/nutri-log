<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Block;
use App\Models\Threshold;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ThresholdController extends Controller
{
    public function index()
    {
        $blocks = Block::orderBy('code')->get();

        $data = $blocks->map(function ($block) {
            $thresholds = Threshold::where('block_id', $block->id)
                ->get()
                ->keyBy('sensor_type');

            return [
                'id' => $block->id,
                'code' => $block->code,
                'name' => $block->name,
                'tds' => $this->thresholdData($thresholds->get('tds')),
                'moisture' => $this->thresholdData($thresholds->get('moisture')),
                'turbidity' => $this->thresholdData($thresholds->get('turbidity')),
            ];
        });

        return Inertia::render('Settings/Threshold', [
            'blocks' => $data,
        ]);
    }

    public function update(Request $request, $blockId, $sensorType)
    {
        if (!in_array($sensorType, ['tds', 'moisture', 'turbidity'])) {
            abort(404);
        }

        $validated = $request->validate([
            'critical_min' => 'nullable|numeric',
            'optimal_min' => 'nullable|numeric',
            'optimal_max' => 'nullable|numeric',
            'critical_max' => 'nullable|numeric',
            'tolerance_minutes' => 'nullable|integer|min:0|max:120',
            'is_active' => 'nullable|boolean',
        ]);

        $threshold = Threshold::updateOrCreate(
            ['block_id' => $blockId, 'sensor_type' => $sensorType],
            array_merge($validated, ['updated_by' => Auth::id()])
        );

        ActivityLog::record(
            'EDIT_THRESHOLD',
            'Threshold',
            $threshold->id,
            "Update threshold {$sensorType} Blok " . Block::find($blockId)?->code,
            null,
            $validated
        );

        return back()->with('success', 'Threshold berhasil disimpan.');
    }

    private function thresholdData(?Threshold $t): array
    {
        return [
            'critical_min' => $t?->critical_min,
            'optimal_min' => $t?->optimal_min,
            'optimal_max' => $t?->optimal_max,
            'critical_max' => $t?->critical_max,
            'tolerance_minutes' => $t?->tolerance_minutes ?? 5,
            'is_active' => $t?->is_active ?? true,
            'updated_by_name' => $t?->updater?->name,
            'updated_at' => $t?->updated_at?->format('d/m H:i'),
        ];
    }
}
