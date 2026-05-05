<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\PumpAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PumpStateController extends Controller
{
    /**
     * GET /api/pump-state?device_id=ESP32_A1_001&device_token=xxx
     *
     * Response:
     * {
     *   "success": true,
     *   "block_code": "A1",
     *   "should_be_on": true,
     *   "mode": "manual",
     *   "last_action_id": 123
     * }
     */
    public function show(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string',
            'device_token' => 'required|string',
        ]);

        $block = Block::where('device_id', $request->device_id)
            ->where('device_token', $request->device_token)
            ->first();

        if (!$block) {
            return response()->json([
                'success' => false,
                'message' => 'Device authentication failed.',
            ], 401);
        }

        $latestAction = PumpAction::where('block_id', $block->id)
            ->latest('executed_at')
            ->first();

        return response()->json([
            'success' => true,
            'block_id' => $block->id,
            'block_code' => $block->code,
            'should_be_on' => $latestAction && $latestAction->action === 'on',
            'mode' => $latestAction?->mode,
            'last_action_id' => $latestAction?->id,
            'last_action_at' => $latestAction?->executed_at?->toIso8601String(),
        ]);
    }
}
