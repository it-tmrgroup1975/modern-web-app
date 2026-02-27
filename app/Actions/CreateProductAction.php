<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CreateProductAction
{
    public function execute(array $data, $imageFile = null): Product
    {
        return DB::transaction(function () use ($data, $imageFile) {
            $product = Product::create($data);

            if ($imageFile) {
                $path = $imageFile->store('products', 'public');
                $product->images()->create([
                    'image_path' => '/storage/' . $path,
                    'is_primary' => true,
                    'sort_order' => 1
                ]);
            }

            return $product;
        });
    }
}
