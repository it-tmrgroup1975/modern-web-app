<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. ตรวจสอบหรือสร้างหมวดหมู่สินค้า
        $catChairs = Category::firstOrCreate(
            ['slug' => 'plastic-chairs'],
            ['name' => 'เก้าอี้พลาสติก', 'description' => 'หมวดหมู่เก้าอี้พลาสติก']
        )->id;

        $catCabinets = Category::firstOrCreate(
            ['slug' => 'storage-cabinets'],
            ['name' => 'ตู้ลิ้นชักและตู้เสื้อผ้า', 'description' => 'หมวดหมู่ตู้ลิ้นชัก']
        )->id;

        $catBins = Category::firstOrCreate(
            ['slug' => 'waste-bins'],
            ['name' => 'ถังขยะ', 'description' => 'หมวดหมู่ถังขยะ']
        )->id;

        $catWater = Category::firstOrCreate(
            ['slug' => 'water-containers'],
            ['name' => 'อุปกรณ์น้ำและกะละมัง', 'description' => 'หมวดหมู่กะละมัง']
        )->id;

        // 2. รายการข้อมูลสินค้า
        $products = [
            ['sku' => '3032520060000100', 'cat' => $catChairs, 'name' => 'เก้าอี้ K5 ไซด์ M สีเขียว', 'price' => 250, 'attr' => ['size' => 'M', 'color' => 'เขียว', 'material' => 'PP Grade A']],
            ['sku' => '3032510060000100', 'cat' => $catChairs, 'name' => 'เก้าอี้ K5 ไซด์ S สีเขียว', 'price' => 190, 'attr' => ['size' => 'S', 'color' => 'เขียว', 'material' => 'PP Grade A']],
            ['sku' => '3012600000060100', 'cat' => $catChairs, 'name' => 'เก้าอี้ 320 สีเขียว (มียางกันลื่น)', 'price' => 320, 'attr' => ['rubber_feet' => true, 'color' => 'เขียว', 'material' => 'PP Grade A']],
        ];

        foreach ($products as $item) {
            $product = Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $item['cat'],
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']) . '-' . $item['sku'],
                    'description' => 'สินค้าคุณภาพ ' . $item['name'] . ' ออกแบบมาเพื่อการใช้งานหนักโดยเฉพาะ',
                    'price' => $item['price'],
                    'stock' => rand(10, 100),
                    'is_active' => true,
                    'attributes' => $item['attr'],
                ]
            );

            // 3. จัดการรูปภาพ (ล้างข้อมูลเก่าและสร้างใหม่)
            $product->images()->delete();

            /**
             * กลยุทธ์แก้ไขปัญหา Data too long:
             * ใช้ SKU เป็นข้อความบน Placeholder แทนการใช้ชื่อสินค้าภาษาไทยที่ยาวและซับซ้อน
             * วิธีนี้จะทำให้ URL สั้นลงและไม่เกินขีดจำกัด 255 ตัวอักษรของคอลัมน์แบบ String
             */
            $product->images()->createMany([
                [
                    'image_path' => "https://placehold.co/800x800/F1F5F9/64748B?text=SKU-" . $product->sku . "-Main",
                    'is_primary' => true,
                    'sort_order' => 1
                ],
                [
                    'image_path' => "https://placehold.co/800x800/F1F5F9/64748B?text=SKU-" . $product->sku . "-Side",
                    'is_primary' => false,
                    'sort_order' => 2
                ],
                [
                    'image_path' => "https://placehold.co/800x800/F1F5F9/64748B?text=SKU-" . $product->sku . "-Detail",
                    'is_primary' => false,
                    'sort_order' => 3
                ],
            ]);
        }

        $this->command->info('ProductSeeder: นำเข้าข้อมูลสินค้าและรูปภาพสำเร็จ (URL ปลอดภัยต่อฐานข้อมูล)');
    }
}
