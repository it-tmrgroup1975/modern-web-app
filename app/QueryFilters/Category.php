<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Category
{
    public function handle(Builder $query, Closure $next)
    {
        if (!request()->has('category') || empty(request('category'))) {
            return $next($query);
        }

        return $next($query->whereHas('category', function ($q) {
            $q->where('slug', request('category'));
        }));
    }
}
