<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    public function handle(Builder $query, Closure $next)
    {
        $term = request('search');

        if (blank($term)) {
            return $next($query);
        }

        // แก้ไข: เพิ่ม select('*') เพื่อให้ได้ข้อมูล name, price, slug กลับมาด้วย
        // และใช้ whereFullText สำหรับการทำ Index Search
        return $next(
            $query->select('*')
                ->selectRaw("MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance", [$term])
                ->whereFullText(['name', 'description'], $term)
        );
    }
}
