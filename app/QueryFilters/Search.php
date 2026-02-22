<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    public function handle(Builder $query, Closure $next)
    {
        $term = request('search');

        // 1. ตรวจสอบว่ามีค่า search ส่งมาจริงๆ และไม่เป็นค่าว่าง
        if (blank($term)) {
            return $next($query);
        }

        // 2. ใช้ Full-Text Search แทน LIKE
        // หมายเหตุ: คอลัมน์ ['name', 'description'] ต้องทำ Full-Text Index ใน Migration ไว้แล้ว
        return $next($query->whereFullText(['name', 'description'], $term));
    }
}
