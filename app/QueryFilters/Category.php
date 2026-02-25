<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Category
{
    /**
     * Handle the incoming query for category filtering via Pipeline.
     * ยกระดับการกรองให้รองรับทั้ง ID และ Slug เพื่อความยืดหยุ่นสูงสุด
     *
     * @param Builder $query
     * @param Closure $next
     * @return mixed
     */
    public function handle(Builder $query, Closure $next)
    {
        // ตรวจสอบว่ามีการส่งค่า category มาใน Request หรือไม่
        if (!request()->filled('category')) {
            return $next($query);
        }

        $categoryParam = request('category');

        /**
         * Logic การกรองแบบ Multi-Format:
         * 1. หากค่าที่ส่งมาเป็นตัวเลข (Numeric) -> กรองด้วย category_id โดยตรง (Performance สูงสุด)
         * 2. หากเป็นข้อความ (String/Slug) -> กรองผ่านความสัมพันธ์ 'category' โดยใช้ Slug (SEO Friendly)
         */
        $query->where(function ($q) use ($categoryParam) {
            if (is_numeric($categoryParam)) {
                $q->where('category_id', $categoryParam);
            } else {
                $q->whereHas('category', fn($subQuery) =>
                    $subQuery->where('slug', $categoryParam)
                );
            }
        });

        return $next($query);
    }
}
