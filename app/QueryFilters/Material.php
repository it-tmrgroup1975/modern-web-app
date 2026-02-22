<?php
// app/QueryFilters/Material.php

namespace App\QueryFilters;

use Closure;

class Material
{
    public function handle($request, Closure $next)
    {
        if (!request()->filled('material')) {
            return $next($request);
        }

        // กรองข้อมูลจาก JSON field 'specifications' โดยระบุ key เป็น 'material'
        return $next($request)->where('specifications->material', request('material'));
    }
}
