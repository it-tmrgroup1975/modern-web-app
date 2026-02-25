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
     * ยกระดับการดึงข้อมูลเพื่อรองรับ Multiple Images และ Industrial Catalog
     *
     * @param bool $onlyActive กำหนดว่าจะกรองเฉพาะสินค้าที่ Active หรือไม่ (Default: true)
     * @return LengthAwarePaginator
     */
    public function execute(bool $onlyActive = true): LengthAwarePaginator
    {
        return app(Pipeline::class)
            /** * Performance Tip: ใช้ with(['category', 'images']) เพื่อโหลดข้อมูลหมวดหมู่และรูปภาพทั้งหมด
             * ลดปัญหา N+1 Query และรองรับการดึงรูปหลัก (Primary Image) มาแสดงในหน้า Catalog
             */
            ->send(Product::query()->with(['category', 'images']))
            ->through([
                // กรองเฉพาะสินค้าที่กำลังวางจำหน่าย (Active) ตามมาตรฐานระบบ Catalog
                fn($query, $next) => $onlyActive
                    ? $next($query->where('is_active', true))
                    : $next($query),

                // ตัวกรองขั้นสูงผ่าน Pipeline สำหรับ Enterprise Scalability
                Category::class,
                Search::class,
            ])
            ->thenReturn()
            /** * จัดเรียงสินค้าล่าสุดเสมอ หากไม่มีการระบุคำค้นหา
             * เพื่อให้หน้า Catalog แสดงเฟอร์นิเจอร์คอลเลกชันใหม่ก่อน
             */
            ->when(
                !request()->filled('search'),
                fn($query) => $query->latest()
            )
            /** * กำหนดจำนวนรายการต่อหน้า และรักษาค่า Query String ไว้
             * เพื่อให้ระบบ Pagination ทำงานร่วมกับ Filter และ Search ได้อย่างสมบูรณ์
             */
            ->paginate(12)
            ->withQueryString();
    }
}
