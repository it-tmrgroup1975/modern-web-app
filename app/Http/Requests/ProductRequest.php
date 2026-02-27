<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * กำหนดสิทธิ์การเข้าถึง (Authorize)
     */
    public function authorize(): bool
    {
        // ตรวจสอบว่าผู้ใช้ที่ล็อกอินอยู่เป็น Admin หรือไม่ (อ้างอิงจาก Middleware ที่เราสร้างไว้)
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * กฎการตรวจสอบข้อมูล (Validation Rules)
     */
    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50|unique:products,sku', // เพิ่มบรรทัดนี้
            'slug' => 'required|string|max:255|unique:products,slug', // เพิ่มบรรทัดนี้
            'description' => 'required|string|min:10',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'attributes' => 'nullable|array',

            // กฎการจัดการรูปภาพ:
            // 1. ต้องเป็นไฟล์ภาพ (jpg, jpeg, png, webp)
            // 2. ขนาดไม่เกิน 2MB (2048 KB) เพื่อประหยัดพื้นที่เซิร์ฟเวอร์
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            // 3. เป็นแบบ nullable เพราะบางครั้งอาจแก้ไขข้อมูลโดยไม่เปลี่ยนรูป
            // รองรับการกรองคุณสมบัติสินค้า (JSON Attributes)
            'attributes.material' => 'nullable|string',
            'attributes.drawers' => 'nullable|integer',
            'attributes.max_height' => 'nullable|numeric',
            'attributes.color' => 'nullable|string|max:50',
        ];
    }

    /**
     * ข้อความแจ้งเตือนเมื่อเกิด Error (Custom Messages)
     */
    public function messages(): array
    {
        return [
            'image.image' => 'ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น',
            'image.max' => 'รูปภาพต้องมีขนาดไม่เกิน 2MB',
            'image.mimes' => 'รองรับเฉพาะไฟล์นามสกุล jpg, jpeg, png และ webp',
            'category_id.exists' => 'ไม่พบหมวดหมู่สินค้าที่เลือกในระบบ',
        ];
    }
}
