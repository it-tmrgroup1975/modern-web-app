<?php
// app/Actions/FindOrCreateCategory.php

namespace App\Actions;

use App\Models\Category;
use Illuminate\Support\Str;

class FindOrCreateCategory {
    public function execute(string $name): int {
        $category = Category::firstOrCreate(
            ['name' => $name],
            ['slug' => Str::slug($name)]
        );
        return $category->id;
    }
}
