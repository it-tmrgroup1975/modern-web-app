<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $categoryIds;

    // รับค่า categoryIds เป็น Array เพื่อรองรับการเลือกได้มากกว่า 1
    public function __construct(array $categoryIds = [])
    {
        $this->categoryIds = $categoryIds;
    }

    public function collection()
    {
        $query = Product::with(['images', 'category']);

        // กรองตามหมวดหมู่ถ้ามีการส่งค่ามา
        if (!empty($this->categoryIds)) {
            $query->whereIn('category_id', $this->categoryIds);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'product_name', 'sku', 'category_name', 'description',
            'price', 'stock', 'images', 'color', 'material',
            'dimensions', 'levels'
        ];
    }

    // ทำหน้าที่แปลงข้อมูลจาก Model ให้เป็นแถวใน Excel
    public function map($product): array
    {
        return [
            $product->name,
            $product->sku,
            $product->category->name ?? 'Uncategorized',
            $product->description,
            $product->price,
            $product->stock,
            // ดึงพาธรูปภาพมารวมกันด้วย comma
            $product->images->pluck('image_path')->implode(', '),
            $product->attributes['color'] ?? '',
            $product->attributes['material'] ?? '',
            $product->attributes['dimensions'] ?? '',
            $product->attributes['levels'] ?? '',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:K1')->getAlignment()->setHorizontal('center');
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => '1E293B']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'F1F5F9']],
            ],
        ];
    }
}
