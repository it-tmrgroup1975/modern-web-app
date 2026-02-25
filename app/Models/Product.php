<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany; // เพิ่มการนำเข้า HasMany
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'slug',
        'description',
        'price',
        'image_url', // ยังคงไว้เพื่อความ Compatible หรือใช้เก็บรูปสำรอง
        'attributes',
        'stock',
        'is_active'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * เพิ่มความสัมพันธ์ One-to-Many กับรูปภาพสินค้า
     * เรียงลำดับตาม sort_order เพื่อใช้ในการทำ Gallery
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    protected $casts = [
        'attributes' => 'array',
    ];
}
