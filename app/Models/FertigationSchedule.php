<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FertigationSchedule extends Model
{
    protected $fillable = [
        'block_id',
        'time_of_day',
        'target_ppm',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'time_of_day' => 'string', // simpan as TIME string "HH:MM:SS"
            'target_ppm' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(FertigationLog::class, 'schedule_id');
    }
}
