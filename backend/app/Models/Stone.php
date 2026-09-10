<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'origin',
        'price',
        'image_url',
        'description',
    ];

    protected $casts = [
        'price' => 'integer',
    ];
}
