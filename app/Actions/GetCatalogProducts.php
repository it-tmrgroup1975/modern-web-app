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
     */
    public function execute(): LengthAwarePaginator
    {
        return app(Pipeline::class)
            ->send(Product::query()->with('category'))
            ->through([
                // กรองเฉพาะสินค้าที่เปิดใช้งาน (สามารถแยกเป็น Active::class ได้ในอนาคต)
                fn($query, $next) => $next($query->where('is_active', true)),

                // Pipeline Filters สำหรับการค้นหาและหมวดหมู่
                Category::class,
                Search::class,
            ])
            ->thenReturn()
            ->when(request()->filled('search'), 
                // หากมีการค้นหา ให้เรียงตามคะแนนความเกี่ยวข้อง (Relevance Score)
                // ซึ่งถูกคำนวณและ orderBy มาจากใน Search Filter แล้ว
                fn($query) => $query,

                // หากไม่มีการค้นหา ให้เรียงตามรายการล่าสุด
                fn($query) => $query->latest()
            )
            ->paginate(12)
            ->withQueryString();
    }
}
