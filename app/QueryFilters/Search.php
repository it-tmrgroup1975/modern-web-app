<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    /**
     * Handle the incoming query for product search.
     * * @param Builder $query
     * @param Closure $next
     * @return mixed
     */
    public function handle(Builder $query, Closure $next)
    {
        $term = request('search');

        // ตรวจสอบว่ามีการส่งคำค้นหามาหรือไม่
        if (blank($term)) {
            return $next($query);
        }

        // ใช้ Pipeline ในการจัดการ Query
        // 1. select('*') เพื่อดึงข้อมูลพื้นฐานทั้งหมด
        // 2. selectRaw เพื่อคำนวณคะแนนความเกี่ยวข้อง (Relevance Score)
        // 3. whereFullText เพื่อใช้ความสามารถของ Full-Text Index ใน Database
        // 4. orderByRaw เพื่อเรียงลำดับสินค้าที่ตรงประเด็นที่สุดขึ้นก่อน
        $query->select('*')
            ->selectRaw(
                "MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance",
                [$term]
            )
            ->whereFullText(['name', 'description'], $term)
            ->orderByRaw("relevance DESC");

        return $next($query);
    }
}
