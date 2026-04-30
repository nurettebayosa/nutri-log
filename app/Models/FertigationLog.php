<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FertigationLog extends Model
{
    public $timestamps = false; // hanya pakai created_at

    protected $fillable = [
        'schedule_id',
        'block_id',
        'scheduled_at',
        'executed_at',
        'executed_by',
        'actual_ppm',
        'notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'executed_at' => 'datetime',
            'created_at' => 'datetime',
            'actual_ppm' => 'integer',
        ];
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(FertigationSchedule::class, 'schedule_id');
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function executor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'executed_by');
    }
}
