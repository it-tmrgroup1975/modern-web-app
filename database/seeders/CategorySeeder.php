<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'เก้าอี้พลาสติก', 'desc' => 'เก้าอี้พลาสติกทุกรุ่น (K5, 320, 323, Venus, Modern)'],
            ['name' => 'ตู้ลิ้นชักและตู้เสื้อผ้า', 'desc' => 'ตู้ลิ้นชัก A58, B28, C72 และตู้บานเปิด'],
            ['name' => 'ถังขยะ', 'desc' => 'ถังขยะทุกขนาด (12L - 240L) และทุกประเภทฝา'],
            ['name' => 'อุปกรณ์น้ำและกะละมัง', 'desc' => 'ถังน้ำ (BK1), กะละมัง (BS1)'],
            ['name' => 'โต๊ะพลาสติก', 'desc' => 'โต๊ะจีน (T120), โต๊ะเหลี่ยม (T8, T180)'],
            ['name' => 'โซฟาและเฟอร์นิเจอร์สนาม', 'desc' => 'โซฟา Sherwood, Montana และเก้าอี้ Amazon'],
            ['name' => 'กล่องอเนกประสงค์', 'desc' => 'กล่องเก็บของ CS120, M65 และกล่องรองเท้า'],
            ['name' => 'ชั้นวางของ', 'desc' => 'ชั้นฮาร์ดแวร์, ชั้น Alize และชั้นสมปรารถนา'],
            ['name' => 'อุปกรณ์ก่อสร้างและเบ็ดเตล็ด', 'desc' => 'แผ่น Plate, แฟลชชิ่ง, โครงกันสาด'],
            ['name' => 'สินค้าลิขสิทธิ์', 'desc' => 'สินค้าลาย Doraemon และลายลิขสิทธิ์อื่นๆ'],
            ['name' => 'สินค้ามีตำหนิ/เกรด B', 'desc' => 'สินค้าคละสี เกรด B หรือสินค้ามีตำหนิ'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                ['name' => $cat['name'], 'description' => $cat['desc']]
            );
        }
    }
}
