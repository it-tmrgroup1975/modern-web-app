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
     * เพิ่มระบบ Priority: สินค้าที่มีรูปภาพจะถูกจัดลำดับขึ้นก่อนเสมอ
     *
     * @param bool $onlyActive กำหนดว่าจะกรองเฉพาะสินค้าที่ Active หรือไม่ (Default: true)
     * @return LengthAwarePaginator
     */
    public function execute(bool $onlyActive = true): LengthAwarePaginator
    {
        return app(Pipeline::class)
            /** * Performance Tip:
             * 1. with(['category', 'images']) เพื่อแก้ปัญหา N+1
             * 2. withCount('images') เพื่อใช้ในการจัดลำดับ (Sorting) ที่ระดับ Database
             */
            ->send(Product::query()->with(['category', 'images'])->withCount('images'))
            ->through([
                // กรองเฉพาะสินค้าที่กำลังวางจำหน่าย (Active)
                fn($query, $next) => $onlyActive
                    ? $next($query->where('is_active', true))
                    : $next($query),

                // ตัวกรองขั้นสูงผ่าน Pipeline
                Category::class,
                Search::class,
            ])
            ->thenReturn()
            /** * Core Logic Improvement:
             * จัดลำดับสินค้าที่มีรูปภาพ (images_count > 0) ขึ้นก่อน
             * จากนั้นตามด้วยความใหม่ (latest) หากไม่มีการระบุการค้นหา
             */
            ->orderByRaw('images_count > 0 DESC')
            ->when(
                !request()->filled('search'),
                fn($query) => $query->latest()
            )
            /** * กำหนดจำนวนรายการต่อหน้า และรักษาค่า Query String ไว้
             */
            ->paginate(12)
            ->withQueryString();
    }
}
