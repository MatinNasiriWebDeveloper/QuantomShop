<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_id',
        'recipient_name',
        'recipient_phone',
        'delivery_address',
        'delivery_date',
        'delivery_time',
        'subtotal',
        'discount',
        'tax',
        'delivery_cost',
        'total',
        'coupon_code',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'subtotal' => 'integer',
        'discount' => 'integer',
        'tax' => 'integer',
        'delivery_cost' => 'integer',
        'total' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
