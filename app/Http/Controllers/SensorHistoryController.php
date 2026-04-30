<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SensorHistoryController extends Controller
{
    public function index(Request $request)
    {
        $blocks = Block::orderBy('code')->get(['id', 'code', 'name']);

        // Default: blok pertama yang ada sensor, kalau gak ada ya blok pertama
        $defaultBlockId = Block::where('has_sensor', true)->value('id') ?? Block::value('id');

        $blockId = $request->input('block_id', $defaultBlockId);
        $sensorType = $request->input('sensor_type', 'all');
        $period = $request->input('period', 'today');

        $query = SensorReading::with(['block', 'recorder'])
            ->when($blockId, fn($q) => $q->where('block_id', $blockId))
            ->when($sensorType !== 'all', fn($q) => $q->where('sensor_type', $sensorType));

        // Period filter
        if ($period === 'today') {
            $query->whereDate('recorded_at', today());
        } elseif ($period === 'yesterday') {
            $query->whereDate('recorded_at', today()->subDay());
        } elseif ($period === '7days') {
            $query->where('recorded_at', '>=', now()->subDays(7));
        } elseif ($period === '30days') {
            $query->where('recorded_at', '>=', now()->subDays(30));
        }

        $readings = $query->orderBy('recorded_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('Sensor/History', [
            'blocks' => $blocks,
            'readings' => $readings->through(function ($r) {
                return [
                    'id' => $r->id,
                    'recorded_at' => $r->recorded_at->format('d/m/Y H:i'),
                    'block_name' => $r->block->name ?? '-',
                    'block_code' => $r->block->code ?? '-',
                    'sensor_type' => $r->sensor_type,
                    'value' => $r->value,
                    'unit' => $r->unit,
                    'source' => $r->source,
                    'recorder_name' => $r->recorder?->name,
                ];
            }),
            'filters' => [
                'block_id' => (int) $blockId,
                'sensor_type' => $sensorType,
                'period' => $period,
            ],
        ]);
    }
}
