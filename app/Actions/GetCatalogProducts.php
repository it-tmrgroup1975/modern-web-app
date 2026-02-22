<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Pagination\LengthAwarePaginator;

class GetCatalogProducts
{
    public function execute(): LengthAwarePaginator
    {
        return app(Pipeline::class)
            ->send(Product::query()->with(['category'])) // เริ่มต้นด้วย Query Builder
            ->through([
                \App\QueryFilters\Search::class,
                \App\QueryFilters\Category::class,
                \App\QueryFilters\MaxHeight::class,
                \App\QueryFilters\Material::class,
                \App\QueryFilters\Drawers::class,
            ])
            ->thenReturn()
            ->paginate(12)
            ->withQueryString(); // รักษาค่า Filter ไว้เมื่อกดเปลี่ยนหน้า (Pagination)
    }
}
