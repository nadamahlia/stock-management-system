<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Product extends Model
{
    protected $fillable = [
        'name',
        'family_id',
        'image_link',
        'user_id',
        'price',
        'description',
        'status',
    ];

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    // Commandes associées à ce produit
public function orders(): HasMany
{
    return $this->hasMany(Order::class);
}
}