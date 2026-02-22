<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    public function handle(Builder $query, Closure $next)
    {
        // ตรวจสอบว่ามีการส่งค่า search มาหรือไม่
        if (!request()->has('search') || empty(request('search'))) {
            return $next($query);
        }

        $term = request('search');

        // ใช้ LIKE เพื่อค้นหาคำบางส่วนจากชื่อและรายละเอียดสินค้า
        return $next($query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        }));
    }
}
