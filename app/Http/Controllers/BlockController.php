<?php

namespace App\Http\Controllers;

use App\Models\Block;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlockController extends Controller
{
    public function index()
    {
        $blocks = Block::with('activeCycle')->get()->map(function ($block) {
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

        // Latest sensor readings
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
}
