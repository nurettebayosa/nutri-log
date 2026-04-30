<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Block extends Model
{
    protected $fillable = [
        'code',
        'name',
        'plant_type',
        'location',
        'polybag_count',
        'photo_path',
        'notes',
        'has_sensor',
        'device_id',
        'device_token',
    ];

    protected function casts(): array
    {
        return [
            'has_sensor' => 'boolean',
            'polybag_count' => 'integer',
        ];
    }

    // ===== RELATIONSHIPS =====

    public function plantingCycles(): HasMany
    {
        return $this->hasMany(PlantingCycle::class);
    }

    public function activeCycle()
    {
        return $this->hasOne(PlantingCycle::class)->where('status', 'active')->latest('start_date');
    }

    public function sensorReadings(): HasMany
    {
        return $this->hasMany(SensorReading::class);
    }

    public function thresholds(): HasMany
    {
        return $this->hasMany(Threshold::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    public function fertigationSchedules(): HasMany
    {
        return $this->hasMany(FertigationSchedule::class);
    }

    public function fertigationLogs(): HasMany
    {
        return $this->hasMany(FertigationLog::class);
    }

    public function pumpActions(): HasMany
    {
        return $this->hasMany(PumpAction::class);
    }
}
