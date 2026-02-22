<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->engine = 'InnoDB'; // ระบุ Engine ให้ชัดเจน
            // Index สำหรับการกรองพื้นฐาน
            $table->index('is_active');

            // Fulltext Index สำหรับระบบ Search ที่มีประสิทธิภาพสูง
            // จะทำงานร่วมกับ SearchFilter Component ของคุณได้ดีมาก
            $table->fulltext(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropFulltext(['name', 'description']);
        });
    }
};
