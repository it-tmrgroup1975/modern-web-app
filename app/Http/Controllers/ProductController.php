<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * ปรับปรุงการดึงข้อมูลเพื่อรองรับการใช้งาน Slug และ UI Optimization
     */
    public function index(Request $request)
    {
        // ดึงข้อมูลสินค้าพร้อมหมวดหมู่ (Eager Loading) เพื่อป้องกัน N+1 Problem
        // มั่นใจได้ว่าข้อมูล category จะถูกส่งไปยัง ProductCard.tsx ทุกใบ
        $products = Product::with('category')
            ->when($request->category, function ($query, $slug) {
                // กรองสินค้าตาม slug ของหมวดหมู่ที่ได้รับจาก Request
                $query->whereHas('category', fn($q) => $q->where('slug', $slug));
            })
            ->where('is_active', true) // ดึงเฉพาะสินค้าที่พร้อมจำหน่าย
            ->latest() // เรียงตามสินค้าใหม่ล่าสุด
            ->paginate(12) // ทำ Pagination 12 ชิ้นต่อหน้าตามมาตรฐาน
            ->withQueryString(); // รักษาค่า Filter ใน URL เมื่อเปลี่ยนหน้า

        return Inertia::render('Products/Index', [
            'products' => $products, // ส่งข้อมูลสินค้าที่มี field 'slug' อยู่ในตัว
            'categories' => Category::all(), // ส่งหมวดหมู่ทั้งหมดสำหรับ Sidebar/Mobile Filter
            'filters' => $request->only(['category']) // ส่งสถานะ Filter ปัจจุบันกลับไป
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * แสดงรายละเอียดสินค้าโดยใช้ Slug
     * ปรับปรุงให้รองรับ Eager Loading เพื่อใช้กับ UI Optimization
     */
    public function show(string $slug)
    {
        // 1. ดึงข้อมูลสินค้าพร้อมความสัมพันธ์ (Category)
        // เพื่อป้องกัน Error "undefined" ใน ProductCard หรือหน้า Show
        $product = Product::with(['category'])
            ->where('slug', $slug)
            ->firstOrFail();

        // 2. ดึงสินค้าที่เกี่ยวข้อง (Related Products) ในหมวดหมู่เดียวกัน
        // เพื่อนำไปแสดงในส่วน Product Gallery ด้านล่าง (UI Optimization)
        $relatedProducts = Product::with(['category'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id) // ไม่เอาตัวปัจจุบัน
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
