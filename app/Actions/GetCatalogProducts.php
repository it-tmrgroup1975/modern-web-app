<?php

// app/Actions/GetCatalogProducts.php
namespace App\Actions;

use App\Models\Product;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Pagination\LengthAwarePaginator;
use App\QueryFilters\{Active, Category, Search};

class GetCatalogProducts
{
    public function execute(): LengthAwarePaginator
    {
        return app(Pipeline::class)
            ->send(Product::query()->with('category'))
            ->through([
                // กรองเฉพาะสินค้าที่ใช้งานอยู่ (is_active = true)
                fn ($query, $next) => $next($query->where('is_active', true)),
                Category::class,
                Search::class,
            ])
            ->thenReturn()
            ->latest()
            ->paginate(12)
            ->withQueryString();
    }
}
