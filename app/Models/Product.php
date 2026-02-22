<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // ต้องมีบรรทัดนี้
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes; // ใส่ Trait เข้าไปใน Class

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image_url',
        'attributes',
        'stock',
        'is_active'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected $casts = [
        'attributes' => 'array', // บังคับให้ attributes กลับมาเป็น array อัตโนมัติ
    ];
}
