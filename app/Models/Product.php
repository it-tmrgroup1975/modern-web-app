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
        'name',
        'sku',    // ตรวจสอบว่ามีบรรทัดนี้
        'slug',   // ตรวจสอบว่ามีบรรทัดนี้
        'category_id',
        'price',
        'stock',
        'is_active',
        'description',
        'attributes', // หากเก็บเป็น JSON ต้องตรวจสอบว่ามี $casts เป็น 'array' ด้วย
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
        'is_active' => 'boolean',
    ];
}
