<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = ['Chairs', 'Tables', 'Storage Boxes', 'Drawers', 'Lockers'];

        foreach ($categories as $cat) {
            // ใช้ updateOrCreate เพื่อเช็คจาก slug ถ้ามีแล้วให้ update ถ้าไม่มีให้สร้างใหม่
            $category = \App\Models\Category::updateOrCreate(
                ['slug' => str($cat)->slug()], // เงื่อนไขที่ใช้เช็ค (Unique Key)
                ['name' => $cat]               // ข้อมูลที่ต้องการ insert/update
            );

            // สร้างสินค้า 10 ชิ้นต่อหมวดหมู่
            // แนะนำให้สร้างสินค้าใหม่เสมอ หรือใช้ count() เช็คก่อน
            if ($category->wasRecentlyCreated) {
                \App\Models\Product::factory(10)->create([
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
