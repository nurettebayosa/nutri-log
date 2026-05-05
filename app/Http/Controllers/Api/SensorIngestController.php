<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\SensorReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SensorIngestController extends Controller
{
    /**
     * POST /api/sensor-ingest
     *
     * Body:
     * {
     *   "device_id": "ESP32_A1_001",
     *   "device_token": "...",
     *   "readings": [
     *     {"sensor_type": "tds", "value": 1080, "unit": "ppm"},
     *     {"sensor_type": "moisture", "value": 68, "unit": "%"},
     *     {"sensor_type": "turbidity", "value": 12, "unit": "NTU"}
     *   ]
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'device_id' => 'required|string',
            'device_token' => 'required|string',
            'readings' => 'required|array|min:1|max:10',
            'readings.*.sensor_type' => 'required|in:tds,moisture,turbidity',
            'readings.*.value' => 'required|numeric',
            'readings.*.unit' => 'nullable|string|max:10',
        ]);

        // Authenticate device
        $block = Block::where('device_id', $validated['device_id'])
            ->where('device_token', $validated['device_token'])
            ->first();

        if (!$block) {
            return response()->json([
                'success' => false,
                'message' => 'Device authentication failed.',
            ], 401);
        }

        // Insert all readings
        $inserted = [];
        foreach ($validated['readings'] as $r) {
            $reading = SensorReading::create([
                'block_id' => $block->id,
                'sensor_type' => $r['sensor_type'],
                'value' => $r['value'],
                'unit' => $r['unit'] ?? $this->defaultUnit($r['sensor_type']),
                'source' => 'automatic',
                'recorded_by' => null,
                'recorded_at' => now(),
            ]);
            $inserted[] = $reading->id;
        }

        return response()->json([
            'success' => true,
            'block_id' => $block->id,
            'block_code' => $block->code,
            'inserted_ids' => $inserted,
            'count' => count($inserted),
        ], 201);
    }

    private function defaultUnit(string $type): string
    {
        return match ($type) {
            'tds' => 'ppm',
            'moisture' => '%',
            'turbidity' => 'NTU',
            default => '',
        };
    }
}
