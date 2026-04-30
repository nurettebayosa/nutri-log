<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Threshold extends Model
{
    protected $fillable = [
        'block_id',
        'sensor_type',
        'critical_min',
        'optimal_min',
        'optimal_max',
        'critical_max',
        'tolerance_minutes',
        'is_active',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'critical_min' => 'decimal:2',
            'optimal_min' => 'decimal:2',
            'optimal_max' => 'decimal:2',
            'critical_max' => 'decimal:2',
            'tolerance_minutes' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Helper: cek apakah nilai sensor masuk kategori apa
     */
    public function evaluate(float $value): string
    {
        if ($this->critical_min !== null && $value < $this->critical_min) return 'critical_low';
        if ($this->critical_max !== null && $value > $this->critical_max) return 'critical_high';
        if ($this->optimal_min !== null && $value < $this->optimal_min) return 'warning_low';
        if ($this->optimal_max !== null && $value > $this->optimal_max) return 'warning_high';
        return 'optimal';
    }
}
