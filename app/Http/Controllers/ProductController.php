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
        return Inertia::render('Products/Index', [
            'products' => $getCatalogProducts->execute(),
            'categories' => Category::all(),
            // ส่ง filters กลับไป เพื่อให้ SearchFilter แสดงค่าเดิมที่ค้นหาอยู่
            'filters' => $request->only(['category', 'search'])
        ]);
    }

    public function printLabels(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        $products = \App\Models\Product::whereIn('id', $validated['ids'])
            ->with('category')
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
        // เรียกใช้ Action เพื่อดึงข้อมูลสินค้าและสินค้าที่เกี่ยวข้อง
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
