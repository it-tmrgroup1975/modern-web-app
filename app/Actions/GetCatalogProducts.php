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
            ->send(\App\Models\Product::query()->with('category'))
            ->through([
                fn($query, $next) => $next($query->where('is_active', true)),
                Category::class,
                Search::class,
            ])
            ->thenReturn()
            // ถ้ามีการ search ให้เรียงตามความแม่นยำ ถ้าไม่มีให้เรียงล่าสุด
            ->when(request('search'), function ($query) {
                return $query->orderBy('relevance', 'desc');
            }, function ($query) {
                return $query->latest();
            })
            ->paginate(12)
            ->withQueryString();
    }
}
