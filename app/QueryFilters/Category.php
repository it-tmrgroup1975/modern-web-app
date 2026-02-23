<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Category
{
    /**
     * Handle the incoming query for category filtering.
     * * @param Builder $query
     * @param Closure $next
     * @return mixed
     */
    public function handle(Builder $query, Closure $next)
    {
        // ใช้ request()->filled() เพื่อตรวจสอบทั้งการมีอยู่ของ key และค่าที่ไม่เป็นค่าว่าง (non-empty)
        if (!request()->filled('category')) {
            return $next($query);
        }

        // ใช้ arrow function เพื่อความกระชับ
        // และแยก logic การ query ออกมาให้ชัดเจน
        $query->whereHas('category', fn($q) =>
            $q->where('slug', request('category'))
        );

        return $next($query);
    }
}
