<?php
// database\migrations\2026_02_22_044543_create_products_and_categories_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // เช่น เก้าอี้, ตู้ลิ้นชัก
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->engine = 'InnoDB'; // ระบุ Engine ให้ชัดเจน
            $table->id();
            $table->foreignId('category_id')->constrained();
            $table->string('name'); // เช่น ตู้ลิ้นชักพลาสติก รุ่น Modern-01
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('image_url')->nullable();
            $table->json('attributes')->nullable(); // เก็บข้อมูลเช่น ["color" => "white", "levels" => 5]
            $table->integer('stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes(); // ใช้ Soft Deletes เพื่อความปลอดภัยของข้อมูล
            $table->index('is_active');
            $table->fullText(['name', 'description'])->withParser('ngram');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
