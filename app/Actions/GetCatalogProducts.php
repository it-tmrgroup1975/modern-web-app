<?php

// app/Actions/GetCatalogProducts.php
namespace App\Actions;

use App\Models\Product;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Pagination\LengthAwarePaginator;

class GetCatalogProducts
{
    public function execute(): LengthAwarePaginator
    {
        return app(Pipeline::class)
            ->send(Product::query()->with('category'))
            ->through([
                // 1. กรองเฉพาะสินค้าที่ Active
                fn ($query, $next) => $next($query->where('is_active', true)),

                // 2. กรองตามหมวดหมู่
                fn ($query, $next) => $next(
                    $query->when(request('category'), function ($q, $slug) {
                        $q->whereHas('category', fn($c) => $c->where('slug', $slug));
                    })
                ),

                // 3. กรองตามคำค้นหาจาก Component (เพิ่มใหม่)
                \App\QueryFilters\Search::class,
            ])
            ->thenReturn()
            ->latest()
            ->paginate(12)
            ->withQueryString(); // รักษาค่า search และ category ใน URL
    }
}
