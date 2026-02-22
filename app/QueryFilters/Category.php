<?php
// app/QueryFilters/Category.php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Category
{
    public function handle(Builder $query, Closure $next)
    {
        $slug = request('category');

        if (!$slug) {
            return $next($query);
        }

        return $next($query->whereHas('category', fn($q) => $q->where('slug', $slug)));
    }
}
