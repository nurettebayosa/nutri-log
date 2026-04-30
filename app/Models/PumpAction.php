<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PumpAction extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'block_id',
        'action',
        'mode',
        'triggered_by',
        'trigger_reason',
        'duration_seconds',
        'executed_at',
    ];

    protected function casts(): array
    {
        return [
            'executed_at' => 'datetime',
            'created_at' => 'datetime',
            'duration_seconds' => 'integer',
        ];
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function trigger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by');
    }
}
