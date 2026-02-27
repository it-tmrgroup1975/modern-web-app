<?php

// app/Actions/CreateProductAction.php
namespace App\Actions;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CreateProductAction
{
    public function execute(array $data, array $imageFiles = []): Product
    {
        return DB::transaction(function () use ($data, $imageFiles) {
            $product = Product::create($data);

            // วนลูปบันทึกหลายรูปภาพ
            foreach ($imageFiles as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_path' => '/storage/' . $path,
                    'is_primary' => ($index === 0), // รูปแรกเป็นรูปหลัก
                    'sort_order' => $index + 1
                ]);
            }

            return $product;
        });
    }
}
