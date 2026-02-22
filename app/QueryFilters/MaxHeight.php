<?php
// app/QueryFilters/MaxHeight.php

namespace App\QueryFilters;

use Closure;

class MaxHeight
{
    public function handle($request, Closure $next)
    {
        if (!request()->has('max_height')) {
            return $next($request);
        }
        // ค้นหาในฟิลด์ JSON specifications ที่คุณมีใน Migration
        return $next($request)->where('specifications->height', '<=', request('max_height'));
    }
}
