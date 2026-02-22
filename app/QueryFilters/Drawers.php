<?php
// app/QueryFilters/Drawers.php

namespace App\QueryFilters;

use Closure;

class Drawers
{
    public function handle($request, Closure $next)
    {
        if (!request()->filled('drawers')) {
            return $next($request);
        }

        return $next($request)->where('specifications->drawers', (int) request('drawers'));
    }
}
