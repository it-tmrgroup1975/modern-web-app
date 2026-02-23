<?php
// app/Services/ProductService.php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Str;

class ProductService
{
    public function create(array $data): Product
    {
        $data['slug'] = Str::slug($data['name']);
        return Product::create($data); //
    }

    public function update(Product $product, array $data): bool
    {
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        return $product->update($data); //
    }
}
