<?php
// app/Actions/FindOrCreateCategory.php

namespace App\Actions;

use App\Models\Category;
use Illuminate\Support\Str;

class FindOrCreateCategory {
    public function execute(string $name): int {
        // ใช้ firstOrCreate โดยกำหนดค่าที่จะค้นหา (name)
        // และค่าที่จะใช้สร้างหากหาไม่เจอ (name + slug)
        $category = Category::firstOrCreate(
            ['name' => trim($name)],
            ['slug' => Str::slug($name) ?: Str::random(8)] // ป้องกัน slug ว่างกรณีชื่อเป็นภาษาไทยล้วน
        );

        return $category->id;
    }
}
