<?php

namespace App\Http\Controllers;

use App\Actions\GetCatalogProducts;
use App\Actions\GetProductDetail;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * ปรับปรุงการดึงข้อมูลเพื่อรองรับการใช้งาน Slug และ UI Optimization
     */
    public function index(Request $request, GetCatalogProducts $getCatalogProducts)
    {
        // โครงสร้าง Controller ยังคงสะอาดเหมือนเดิม
        // เพราะ Business Logic ในการจัดการลำดับถูกย้ายไปที่ Action แล้ว
        return Inertia::render('Products/Index', [
            'products' => $getCatalogProducts->execute(),
            'categories' => Category::all(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function printLabels(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $validated['ids'])
            ->with(['category', 'images']) // เพิ่มการโหลด images สำหรับพิมพ์ป้าย
            ->get();

        return inertia('Products/PrintView', [
            'products' => $products
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
    public function show(string $slug, GetProductDetail $getProductDetail): Response
    {
        // ภายใน GetProductDetail Action ควรมีการโหลด with('images') ไว้แล้ว
        $data = $getProductDetail->execute($slug);

        return Inertia::render('Products/Show', [
            'product' => $data['product'],
            'relatedProducts' => $data['relatedProducts'],
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
