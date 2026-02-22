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
        return app(\Illuminate\Pipeline\Pipeline::class)
            ->send(\App\Models\Product::query()->with('category'))
            ->through([
                fn($query, $next) => $next($query->where('is_active', true)),
                \App\QueryFilters\Category::class,
                \App\QueryFilters\Search::class,
            ])
            ->thenReturn()
            ->latest()
            ->paginate(12)
            ->withQueryString();
    }
}
