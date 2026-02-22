<?php
// app/QueryFilters/Search.php
namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    public function handle(Builder $query, Closure $next)
    {
        // รับค่า 'search' จาก Request
        $search = request('search');

        if (!$search) {
            return $next($query);
        }

        // ค้นหาจากชื่อสินค้า หรือรายละเอียดสินค้า
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });

        return $next($query);
    }
}
