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

        // คำนวณคะแนนความแม่นยำและเก็บไว้ในชื่อ relevance
        $query->selectRaw("MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance", [$term])
            ->whereFullText(['name', 'description'], $term);

        return $next($query);
    }
}
