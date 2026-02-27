<?php

namespace App\Http\Controllers\Admin;

use App\Actions\CreateProductAction;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use App\Http\Requests\ProductRequest;
use App\Actions\GetCatalogProducts;
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

    public function index(Request $request, GetCatalogProducts $getCatalogProducts)
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => $getCatalogProducts->execute(false),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']) ?: new \stdClass(),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(ProductRequest $request, CreateProductAction $action)
    {
        // รับไฟล์ทั้งหมดที่อัปโหลด (ถ้ามี)
        $images = $request->file('images') ?? [];

        $action->execute(
            $request->validated(),
            $images
        );

        return redirect()->route('admin.products.index')
            ->with('success', 'เพิ่มสินค้าพร้อมรูปภาพเรียบร้อยแล้ว');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            // โหลดทั้ง category และ images เพื่อแสดงในหน้าแก้ไข
            'product' => $product->load(['category', 'images']),
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $slug = $request->filled('slug') ? Str::slug($request->slug) : Str::slug($request->name);

        if ($request->hasFile('image')) {
            // ลบรูปภาพเก่าใน Storage
            if ($product->image_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image_url));
            }

            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;

            // อัปเดตรูปหลักในตาราง product_images
            $product->images()->where('is_primary', true)->delete();
            $product->images()->create([
                'image_path' => $validated['image_url'],
                'is_primary' => true,
                'sort_order' => 1
            ]);
        }

        $product->update(array_merge($validated, ['slug' => $slug]));

        return back()->with('success', 'อัปเดตข้อมูลสินค้าและรูปภาพเรียบร้อยแล้ว');
    }

    public function destroy(Product $product)
    {
        // 1. ลบไฟล์รูปภาพทั้งหมดที่เกี่ยวข้องออกจาก Storage
        foreach ($product->images as $image) {
            $path = str_replace('/storage/', '', $image->image_path);
            Storage::disk('public')->delete($path);
        }

        // 2. ลบข้อมูลสินค้า (ความสัมพันธ์ใน DB จะถูกลบอัตโนมัติด้วย onDelete('cascade'))
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'ลบสินค้าและไฟล์รูปภาพทั้งหมดเรียบร้อยแล้ว');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        Excel::import(new ProductsImport, $request->file('file'));

        return back()->with('success', 'นำเข้าข้อมูลสินค้าและแกลเลอรีรูปภาพเรียบร้อยแล้ว');
    }
}
