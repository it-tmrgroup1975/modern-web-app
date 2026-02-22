<?php
// app/QueryFilters/Category.php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Category
{
    public function handle($request, Closure $next)
    {
        // ถ้าไม่มีการส่งค่า category มา ให้ข้ามไปขั้นตอนถัดไปใน Pipeline
        if (!request()->filled('category')) {
            return $next($request);
        }

        return $next($request)->whereHas('category', function (Builder $query) {
            $query->where('slug', request('category'));
        });
    }
}
