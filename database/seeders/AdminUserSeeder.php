<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // สร้างบัญชี Admin สำหรับระบบ Modern Furniture
        User::updateOrCreate(
            ['email' => 'admin@modernfurniture.co.th'], // ตรวจสอบจาก email เพื่อไม่ให้สร้างซ้ำ
            [
                'name' => 'System Administrator',
                'password' => Hash::make('@ynyp2013'), // อย่าลืมเปลี่ยนรหัสผ่านในระบบจริง
                'is_admin' => true, // กำหนดค่าสถานะเป็น Admin
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin account created: admin@modernfurniture.co.th / @ynyp2013');
    }
}
