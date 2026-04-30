<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantingCycle extends Model
{
    protected $fillable = [
        'block_id',
        'cycle_number',
        'plant_type',
        'start_date',
        'expected_harvest_date',
        'actual_harvest_date',
        'harvest_kg',
        'quality_grade',
        'notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'expected_harvest_date' => 'date',
            'actual_harvest_date' => 'date',
            'harvest_kg' => 'decimal:2',
        ];
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    /**
     * Hari Setelah Tanam (HST) — dihitung dari start_date sampai hari ini
     */
    public function getHstAttribute(): int
    {
        return (int) $this->start_date->diffInDays(now());
    }
}
