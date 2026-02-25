<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class GetProductDetail
{
    /**
     * ดึงรายละเอียดสินค้าและสินค้าที่เกี่ยวข้อง พร้อมโหลดรูปภาพประกอบทั้งหมด
     *
     * @param string $slug
     * @return array{product: Product, relatedProducts: Collection}
     */
    public function execute(string $slug): array
    {
        /**
         * ดึงข้อมูลสินค้าหลักพร้อมหมวดหมู่และรูปภาพทั้งหมด
         * รูปภาพจะถูกจัดเรียงตาม sort_order อัตโนมัติ (ตามที่กำหนดใน Model Product)
         */
        $product = Product::with(['category', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        /**
         * ดึงสินค้าที่เกี่ยวข้อง (Related Products)
         * ต้องโหลด 'images' ติดไปด้วยเพื่อให้ ProductCard ในหน้า Show แสดงรูปภาพได้ถูกต้อง
         */
        $relatedProducts = Product::with(['category', 'images'])
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
