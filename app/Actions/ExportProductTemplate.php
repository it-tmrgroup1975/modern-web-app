<?php
// app/Actions/ExportProductTemplate.php

namespace App\Actions;

use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportProductTemplate implements FromArray, WithHeadings, WithStyles
{
    public function headings(): array
    {
        return [
            'product_name',  // ชื่อสินค้า (จำเป็น)
            'sku',           // SKU สินค้า
            'category_name', // หมวดหมู่ (เช่น เก้าอี้, ตู้ลิ้นชัก)
            'description',   // รายละเอียด
            'price',         // ราคา (ตัวเลข)
            'stock',         // จำนวนสต็อก
            'color',         // คุณลักษณะ: สี
            'levels',        // คุณลักษณะ: จำนวนชั้น (สำหรับตู้)
        ];
    }

    public function array(): array
    {
        // ใส่ข้อมูลตัวอย่าง 1 แถวเพื่อให้ User เข้าใจ Format
        return [
            [
                'ตู้ลิ้นชักพลาสติก รุ่น Modern-01',
                'ตู้ลิ้นชัก',
                'ตู้ลิ้นชักพลาสติกเกรด A ทนทาน ดีไซน์ทันสมัย',
                '1250.00',
                '50',
                'White',
                '5'
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // จัดการ Header ให้เป็นตัวหนาและมีสีพื้นหลัง (UX สำหรับ Admin)
            1 => ['font' => ['bold' => true], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'E2E8F0']]],
        ];
    }

    public function download()
    {
        return Excel::download($this, 'products_template_' . date('Ymd') . '.xlsx');
    }
}
