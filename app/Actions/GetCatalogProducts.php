<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Pagination\LengthAwarePaginator;
use App\QueryFilters\{Category, Search};
use Illuminate\Support\Facades\DB;

class GetCatalogProducts
{
    /**
     * Execute the action to get filtered and paginated products.
     * * @param bool $onlyActive
     * @return LengthAwarePaginator
     */
    public function execute(bool $onlyActive = true): LengthAwarePaginator
    {
        return app(Pipeline::class)
            ->send(
                Product::query()
                    ->with(['category', 'images'])
                    // ใช้ selectRaw และระบุ products.id เพื่อป้องกัน ambiguity
                    ->selectRaw('products.*, EXISTS(SELECT 1 FROM product_images WHERE product_images.product_id = products.id) as has_images')
                    // Join category เพื่อใช้เรียงลำดับ Priority
                    ->join('categories', 'products.category_id', '=', 'categories.id')
            )
            ->through([
                // กรอง Active โดยระบุชื่อตาราง
                fn($query, $next) => $onlyActive
                    ? $next($query->where('products.is_active', true))
                    : $next($query),

                Category::class,
                Search::class,
            ])
            ->thenReturn()
            /** * Business Priority Sorting
             */
            ->orderByDesc('has_images')
            ->orderByRaw("
                CASE
                    WHEN categories.name = 'เก้าอี้' THEN 1
                    WHEN categories.name = 'กล่อง' THEN 2
                    WHEN categories.name = 'อุปกรณ์เก็บของ' THEN 3
                    ELSE 4
                END ASC
            ")
            ->when(
                !request()->filled('search'),
                fn($query) => $query->latest('products.created_at')
            )
            ->paginate(12)
            ->withQueryString();
    }
}
