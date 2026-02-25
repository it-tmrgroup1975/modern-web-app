<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use App\Http\Requests\ProductRequest;
use App\Actions\GetCatalogProducts; // ใช้ Action เดิมที่เราทำไว้เพื่อความ Consistent
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Imports\ProductsImport;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, GetCatalogProducts $getCatalogProducts)
    {
        return Inertia::render('Admin/Products/Index', [
            // ส่ง false เพื่อบอกว่า "ไม่ต้องกรองเฉพาะสินค้าที่ active"
            'products' => $getCatalogProducts->execute(false),
            'categories' => Category::all(),
            // ส่งค่า filters กลับไป โดยใช้ default เป็น array เปล่าถ้าไม่มีข้อมูล
            'filters' => $request->only(['search', 'category']) ?: new \stdClass(),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        // จัดการอัปโหลดรูปภาพ
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $this->productService->create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'เพิ่มสินค้าและอัปโหลดรูปภาพเรียบร้อยแล้ว');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('category'),
            'categories' => Category::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // 1. Validation เพิ่มการตรวจสอบรูปภาพ
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // จำกัด 2MB
        ]);

        // 2. จัดการ Slug (คงเดิมจากโค้ดของคุณ)
        $slug = $request->filled('slug') ? Str::slug($request->slug) : Str::slug($request->name);
        // ... Logic ตรวจสอบ slug ซ้ำ ...

        // 3. จัดการรูปภาพ (Image Update Logic)
        if ($request->hasFile('image')) {
            // ลบรูปภาพเก่าถ้ามี
            if ($product->image_url) {
                Storage::disk('public')->delete($product->image_url);
            }

            // เก็บรูปภาพใหม่ใน folder 'products'
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/'.$path; // อัปเดต path ลงใน array ข้อมูล
        }

        // 4. อัปเดตข้อมูล
        $product->update(array_merge($validated, ['slug' => $slug]));

        return back()->with('success', 'อัปเดตข้อมูลสินค้าและรูปภาพเรียบร้อยแล้ว');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // ลบรูปภาพออกจาก Storage เมื่อลบสินค้า
        if ($product->image_url) {
            $path = str_replace('/storage/', '', $product->image_url);
            Storage::disk('public')->delete($path);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'ลบสินค้าและไฟล์รูปภาพเรียบร้อยแล้ว');
    }

    /**
     * Handle Excel Import
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // จำกัด 10MB
        ]);

        // เรียกใช้ Import Class (ตามแผนที่วางไว้ก่อนหน้า)
        \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\ProductsImport, $request->file('file'));

        return back()->with('success', 'นำเข้าข้อมูลสินค้าเรียบร้อยแล้ว');
    }
}
