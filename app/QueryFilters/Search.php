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

        // 1. ตรวจสอบคำสั้น (เหมือนเดิม)
        if (mb_strlen($term) < 3) {
            $query->where(function ($q) use ($term) {
                $q->where('name', 'LIKE', "%{$term}%")
                    ->orWhere('description', 'LIKE', "%{$term}%");
            });
            return $next($query);
        }

        /**
         * >>> เพิ่ม/แก้ไข ส่วนนี้ครับ <<<
         * นำคำค้นหามาแยกช่องว่าง แล้วเติม * ต่อท้ายทุกคำ
         * ตัวอย่าง: "ตู้ สีขาว" -> "ตู้* สีขาว*"
         */
        $booleanTerm = collect(explode(' ', $term))
            ->filter() // กรองช่องว่างทิ้งกรณีเคาะซ้ำ
            ->map(fn($word) => $word . '*')
            ->implode(' ');

        // 2. นำ $booleanTerm ที่เตรียมเสร็จแล้วไปใช้ใน Query
        $query->select('*')
            ->selectRaw(
                "MATCH(name, description) AGAINST(? IN BOOLEAN MODE) AS relevance",
                [$booleanTerm]
            )
            ->whereFullText(['name', 'description'], $booleanTerm, ['mode' => 'boolean'])
            ->orderByRaw("relevance DESC");

        return $next($query);
    }
}
