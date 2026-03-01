<?php

namespace App\QueryFilters;

use Closure;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    /**
     * Handle the search filter via Pipeline.
     * เพิ่มประสิทธิภาพการค้นหาด้วย Full-Text Search และ Boolean Mode
     *
     * @param Builder $query
     * @param Closure $next
     * @return mixed
     */
    public function handle(Builder $query, Closure $next)
    {
        $term = request('search');

        // หากไม่มีการค้นหา ให้ข้ามไปทำงานส่วนถัดไปใน Pipeline
        if (blank($term)) {
            return $next($query);
        }

        /**
         * กลยุทธ์การค้นหาสำหรับ Industrial Product Catalog:
         * 1. หากคำค้นหาสั้น (น้อยกว่า 3 ตัวอักษร) ให้ใช้ LIKE เพื่อความยืดหยุ่น
         * 2. หากคำค้นหายาว ให้ใช้ Full-Text Search เพื่อความเร็วและลำดับความเกี่ยวข้อง
         */
        // if (mb_strlen($term) < 2) {
            $query->where(function ($q) use ($term) {
                $q->where('name', 'LIKE', "%{$term}%")
                    ->orWhere('description', 'LIKE', "%{$term}%");
            });
            return $next($query);
        // }

        /**
         * ปรับปรุงส่วน Boolean Mode:
         * นำคำค้นหามาแยกช่องว่าง แล้วเติม * (Wildcard) ต่อท้ายทุกคำ
         * ตัวอย่าง: "ตู้ สีขาว" -> "ตู้* สีขาว*"
         * ช่วยให้ค้นหาได้ทั้ง "ตู้เสื้อผ้า" และ "สีขาวนวล"
         */
        // $booleanTerm = collect(explode(' ', $term))
        //     ->filter() // กรองช่องว่างทิ้งกรณีเคาะซ้ำ
        //     ->map(fn($word) => $word . '*')
        //     ->implode(' ');

        /**
         * การทำ Full-Text Search ในระดับ Advanced:
         * - ใช้ selectRaw เพื่อคำนวณคะแนนความเกี่ยวข้อง (Relevance)
         * - ใช้ whereFullText เพื่อประสิทธิภาพการประมวลผลสูงสุด
         * - จัดลำดับตามความเกี่ยวข้อง (relevance DESC) เพื่อให้ลูกค้าเจอสินค้าที่ตรงใจที่สุด
         */
        // $query->select('*')
        //     ->selectRaw(
        //         "MATCH(name, description) AGAINST(? IN BOOLEAN MODE) AS relevance",
        //         [$booleanTerm]
        //     )
        //     ->whereFullText(['name', 'description'], $booleanTerm, ['mode' => 'boolean'])
        //     ->orderByRaw("relevance DESC");

        return $next($query);
    }
}
