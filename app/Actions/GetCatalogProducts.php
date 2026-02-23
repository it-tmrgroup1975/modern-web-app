<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Pagination\LengthAwarePaginator;
use App\QueryFilters\{Category, Search};

class GetCatalogProducts
{
    /**
     * Execute the action to get filtered and paginated products.
     * * @return LengthAwarePaginator
     * * @param bool $onlyActive กำหนดว่าจะกรองเฉพาะสินค้าที่ Active หรือไม่ (Default: true)
     */
    public function execute(bool $onlyActive = true): LengthAwarePaginator
    {
        return app(Pipeline::class)
            ->send(Product::query()->with('category'))
            ->through([
                // แก้ไข: กรอง is_active เฉพาะเมื่อ $onlyActive เป็น true เท่านั้น
                fn($query, $next) => $onlyActive
                    ? $next($query->where('is_active', true))
                    : $next($query),

                Category::class,
                Search::class,
            ])
            ->thenReturn()
            ->when(
                !request()->filled('search'),
                fn($query) => $query->latest()
            )
            ->paginate(12)
            ->withQueryString();
    }
}
