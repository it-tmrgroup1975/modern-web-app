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
    public function index(GetCatalogProducts $getCatalogProducts)
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => $getCatalogProducts->execute(),
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
    public function update(ProductRequest $request, Product $product)
    {
        $data = $request->validated();

        // จัดการเปลี่ยนรูปภาพใหม่
        if ($request->hasFile('image')) {
            // ลบรูปภาพเดิมถ้ามี
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $this->productService->update($product, $data);

        return redirect()->route('admin.products.index')
            ->with('success', 'แก้ไขข้อมูลสินค้าและรูปภาพเรียบร้อยแล้ว');
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
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new ProductsImport, $request->file('file'));

        return back()->with('success', 'Products are being imported in the background.');
    }
}
