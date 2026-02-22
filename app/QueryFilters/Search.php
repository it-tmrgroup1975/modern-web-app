<?php
// app/QueryFilters/Search.php

namespace App\QueryFilters;

use Closure;

class Search
{
    public function handle($request, Closure $next)
    {
        if (!request()->has('search')) {
            return $next($request);
        }
        return $next($request)->where('name', 'like', '%' . request('search') . '%');
    }
}
