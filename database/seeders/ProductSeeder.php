<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // ใช้ firstOrCreate เพื่อความปลอดภัย: ถ้าไม่มีหมวดหมู่ ให้สร้างขึ้นมาเลย
        $catChairs = Category::firstOrCreate(
            ['name' => 'เก้าอี้พลาสติก'],
            ['slug' => 'plastic-chairs', 'description' => 'หมวดหมู่เก้าอี้พลาสติก']
        )->id;

        $catCabinets = Category::firstOrCreate(
            ['name' => 'ตู้ลิ้นชักและตู้เสื้อผ้า'],
            ['slug' => 'storage-cabinets', 'description' => 'หมวดหมู่ตู้ลิ้นชัก']
        )->id;

        $catBins = Category::firstOrCreate(
            ['name' => 'ถังขยะ'],
            ['slug' => 'waste-bins', 'description' => 'หมวดหมู่ถังขยะ']
        )->id;

        $catWater = Category::firstOrCreate(
            ['name' => 'อุปกรณ์น้ำและกะละมัง'],
            ['slug' => 'water-containers', 'description' => 'หมวดหมู่กะละมัง']
        )->id;

        $products = [
            // ข้อมูลสินค้าจากไฟล์ qq.pdf
            ['sku' => '3032520060000100', 'cat' => $catChairs, 'name' => 'เก้าอี้ K5 ไซด์ M สีเขียว', 'price' => 250, 'attr' => ['size' => 'M', 'color' => 'เขียว']],
            ['sku' => '3032510060000100', 'cat' => $catChairs, 'name' => 'เก้าอี้ K5 ไซด์ S สีเขียว', 'price' => 190, 'attr' => ['size' => 'S', 'color' => 'เขียว']],
            ['sku' => '3012600000060100', 'cat' => $catChairs, 'name' => 'เก้าอี้ 320 สีเขียว (มียางกันลื่น)', 'price' => 320, 'attr' => ['rubber_feet' => true, 'color' => 'เขียว']],
            // ... รายการอื่นๆ ...
        ];

        foreach ($products as $item) {
            Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $item['cat'],
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']) . '-' . $item['sku'],
                    'description' => 'สินค้าคุณภาพจากโรงงาน ' . $item['name'],
                    'price' => $item['price'],
                    'stock' => rand(10, 100),
                    'is_active' => true,
                    'attributes' => $item['attr'],
                ]
            );
        }

        $this->command->info('ProductSeeder: ข้อมูลสินค้าถูกนำเข้าเรียบร้อยแล้ว');
    }
}
