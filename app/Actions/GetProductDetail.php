<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class GetProductDetail
{
    /**
     * ดึงรายละเอียดสินค้าและสินค้าที่เกี่ยวข้อง
     * * @return array{product: Product, relatedProducts: Collection}
     */
    public function execute(string $slug): array
    {
        $product = Product::with(['category'])
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Product::with(['category'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ];
    }
}
