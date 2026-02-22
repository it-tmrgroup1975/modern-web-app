<?php

// app/Actions/GetCatalogProducts.php
namespace App\Actions;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class GetCatalogProducts
{
    public function execute(?int $categoryId = null): LengthAwarePaginator
    {
        // ใช้ Eloquent Pipeline หรือ Simple Query พร้อม Pagination (อ้างอิงไฟล์ Laravel 12 - Add Pagination)
        return Product::query()
            ->when($categoryId, fn($q) => $q->where('category_id', $categoryId))
            ->where('is_active', true)
            ->with('category')
            ->latest()
            ->paginate(12);
    }
}
