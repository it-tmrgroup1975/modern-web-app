<?php
// app/Imports/ProductsImport.php

namespace App\Imports;

use App\Models\Product;
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

        // >>> จุดสำคัญ: กำจัด SKU ที่ซ้ำกันภายในไฟล์ Excel ออกก่อนเริ่ม Process <<<
        $uniqueRows = $rows->unique('sku');

        foreach ($uniqueRows as $row) {
            // ข้ามแถวที่ SKU เป็นค่าว่าง (ถ้ามี)
            if (empty($row['sku'])) continue;

            $categoryId = $categoryAction->execute($row['category_name']);

            Product::updateOrCreate(
                ['sku' => (string) $row['sku']], // ตรวจสอบว่าเป็น String เพื่อความแม่นยำ
                [
                    'category_id' => $categoryId,
                    'name'        => $row['product_name'],
                    'slug'        => Str::slug($row['product_name']) . '-' . uniqid(),
                    'description' => $row['description'] ?? 'สินค้าพลาสติกคุณภาพดี',
                    'price'       => $row['price'],
                    'stock'       => $row['stock'] ?? 0,
                    'is_active'   => true,
                    'attributes'  => [
                        'color'       => $row['color'] ?? 'N/A',
                        'material'    => 'Plastic',
                        'imported_at' => now()->toDateTimeString(),
                    ]
                ]
            );
        }
    }

    public function rules(): array {
        return [
            'sku' => 'required',
            'product_name' => 'required',
            'price' => 'required|numeric',
            'category_name' => 'required',
        ];
    }
}
