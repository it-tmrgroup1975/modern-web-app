<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetCatalogProducts
{
    /**
     * ดึงรายการสินค้าพร้อมการกรองและแบ่งหน้า
     */
    public function execute(?string $categorySlug = null): LengthAwarePaginator
    {
        return Product::with('category')
            ->when($categorySlug, function ($query, $slug) {
                $query->whereHas('category', fn($q) => $q->where('slug', $slug));
            })
            ->where('is_active', true)
            ->latest()
            ->paginate(12)
            ->withQueryString();
    }
}
