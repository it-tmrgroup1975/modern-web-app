<?php
// app/QueryFilters/Search.php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    public function handle(Builder $query, Closure $next)
    {
        $term = request('search');

        if (!$term) {
            return $next($query);
        }

        return $next($query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        }));
    }
}
