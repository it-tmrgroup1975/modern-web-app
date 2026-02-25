<?php
// app/Imports/ProductsImport.php

namespace App\Imports;

use App\Models\Product;
use App\Models\ProductImage;
use App\Actions\FindOrCreateCategory;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ProductsImport implements ToCollection, WithHeadingRow, WithValidation
{
    public function collection(Collection $rows)
    {
        $categoryAction = new FindOrCreateCategory();

        // กำจัด SKU ที่ซ้ำกันภายในไฟล์ Excel ออกก่อนเริ่ม Process เพื่อป้องกันการเขียนทับซ้ำซ้อน
        $uniqueRows = $rows->unique('sku');

        foreach ($uniqueRows as $row) {
            if (empty($row['sku'])) continue;

            $categoryId = $categoryAction->execute($row['category_name']);

            // 1. สร้างหรืออัปเดตข้อมูลสินค้าหลัก (Product)
            $product = Product::updateOrCreate(
                ['sku' => (string) $row['sku']],
                [
                    'category_id' => $categoryId,
                    'name'        => $row['product_name'],
                    'slug'        => Str::slug($row['product_name']) . '-' . (string) $row['sku'],
                    'description' => $row['description'] ?? 'สินค้าพลาสติกคุณภาพดี',
                    'price'       => $row['price'],
                    'stock'       => $row['stock'] ?? 0,
                    'is_active'   => true,
                    'attributes'  => [
                        'color'       => $row['color'] ?? 'N/A',
                        'material'    => $row['material'] ?? 'Plastic',
                        'imported_at' => now()->toDateTimeString(),
                    ]
                ]
            );

            // 2. ลอจิกจัดการ "1 สินค้าหลายรูปภาพ"
            if (!empty($row['images'])) {
                /**
                 * รูปแบบข้อมูลใน Excel คอลัมน์ images: "path/img1.jpg, path/img2.jpg"
                 * ทำการแยกพาธด้วยเครื่องหมายคอมม่า
                 */
                $imagePaths = explode(',', $row['images']);

                // ล้างข้อมูลรูปภาพเก่าของสินค้านี้ออกก่อน เพื่ออัปเดตชุดรูปภาพใหม่จาก Excel
                $product->images()->delete();

                foreach ($imagePaths as $index => $path) {
                    $trimmedPath = trim($path);
                    if ($trimmedPath) {
                        $product->images()->create([
                            'image_path' => $trimmedPath,
                            'sort_order' => $index + 1,
                            'is_primary' => ($index === 0), // กำหนดให้รูปแรกในรายการเป็นรูปหลัก (Cover)
                        ]);
                    }
                }
            }
        }
    }

    public function rules(): array {
        return [
            'sku'           => 'required',
            'product_name'  => 'required',
            'price'         => 'required|numeric',
            'category_name' => 'required',
            // images ไม่บังคับใส่ แต่ถ้ามีต้องเป็นข้อความ
            'images'        => 'nullable|string',
        ];
    }
}
