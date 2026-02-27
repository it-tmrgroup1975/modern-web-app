<?php
// app/Actions/ExportProductTemplate.php

namespace App\Actions;

use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportProductTemplate implements FromArray, WithHeadings, WithStyles, ShouldAutoSize
{
    /**
     * กำหนดส่วนหัวของ Excel (Headings)
     * เพิ่มคอลัมน์ images เพื่อรองรับ Multiple Images Logic
     */
    public function headings(): array
    {
        return [
            'product_name',   // ชื่อสินค้า (จำเป็น)
            'sku',           // SKU สินค้า (Unique Key)
            'category_name', // หมวดหมู่สินค้า
            'description',   // รายละเอียดสินค้า
            'price',         // ราคาขาย
            'stock',         // จำนวนสินค้าในคลัง
            'images',        // พาธรูปภาพ (แยกด้วยคอมม่าสำหรับหลายรูป) **เพิ่มใหม่**
            'color',         // คุณลักษณะ: สี
            'material',      // คุณลักษณะ: วัสดุ (เช่น PP Grade A) **เพิ่มใหม่**
            'dimensions',    // คุณลักษณะ: ขนาด (กว้าง x ยาว x สูง) **เพิ่มใหม่**
            'levels',        // คุณลักษณะ: จำนวนชั้น (สำหรับตู้)
        ];
    }

    /**
     * ข้อมูลตัวอย่าง (Example Data)
     * ปรับปรุงให้ครอบคลุมลอจิก 1 สินค้าหลายรูปภาพ
     */
    public function array(): array
    {
        return [
            [
                'ตู้ลิ้นชักพลาสติก รุ่น Modern-01',
                'MOD-CAB-01-WH',
                'ตู้ลิ้นชักและตู้เสื้อผ้า',
                'ตู้ลิ้นชักพลาสติกเกรด A ทนทาน ดีไซน์ทันสมัย กันน้ำ กันปลวก 100%',
                '1250.00',
                '50',
                // ตัวอย่างการใส่หลายรูปภาพโดยแยกด้วย Comma
                'storage/products/modern-01-main.jpg, storage/products/modern-01-side.jpg, storage/products/modern-01-inside.jpg',
                'White',
                'High-Grade Polypropylene',
                '60x40x120 cm',
                '5'
            ],
            [
                'เก้าอี้พลาสติกทรงโมเดิร์น K5',
                'CHAIR-K5-GR',
                'เก้าอี้พลาสติก',
                'เก้าอี้พลาสติกดีไซน์มินิมอล แข็งแรง รับน้ำหนักได้ถึง 100 กก.',
                '350.00',
                '100',
                'storage/products/k5-green-1.webp, storage/products/k5-green-2.webp',
                'Green',
                'PP Plastic',
                '45x45x85 cm',
                '' // ว่างไว้สำหรับสินค้าที่ไม่มีจำนวนชั้น
            ]
        ];
    }

    /**
     * การปรับแต่งรูปแบบ (Styling)
     * จัดส่วนหัวให้น่าใช้งาน (User-Friendly Header)
     */
    public function styles(Worksheet $sheet)
    {
        // กำหนดให้แถวที่ 1 (Header) เป็นตัวหนา, พื้นหลังสีเทาอ่อน และข้อความอยู่กึ่งกลาง
        $sheet->getStyle('A1:K1')->getAlignment()->setHorizontal('center');

        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => '1E293B'],
                ],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => 'F1F5F9'],
                ],
            ],
        ];
    }

    /**
     * คำสั่งดาวน์โหลดไฟล์
     */
    public function download()
    {
        return Excel::download($this, 'products_template_' . date('Ymd_His') . '.xlsx');
    }
}
