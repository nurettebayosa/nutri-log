<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaintenanceLog extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'title',
        'description',
        'occurred_at',
        'related_alert_id',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function relatedAlert(): BelongsTo
    {
        return $this->belongsTo(Alert::class, 'related_alert_id');
    }

    public function blocks(): BelongsToMany
    {
        return $this->belongsToMany(Block::class, 'maintenance_log_block');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(MaintenancePhoto::class);
    }
}
