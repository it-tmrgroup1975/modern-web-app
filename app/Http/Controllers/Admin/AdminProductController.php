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
        // 1. Validation: รองรับหลายรูปภาพ
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // ลบรูปภาพที่ถูกเลือกให้ลบ (ถ้ามีส่งมา)
        if ($request->has('deleted_images')) {
            $imagesToDelete = $product->images()->whereIn('id', $request->deleted_images)->get();
            foreach ($imagesToDelete as $img) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $img->image_path));
                $img->delete();
            }
        }

        // บันทึกรูปใหม่ที่อัปโหลด (ถ้ามี)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $product->images()->create(['image_path' => '/storage/' . $path]);
            }
        }

        $slug = $request->filled('slug') ? Str::slug($request->slug) : Str::slug($request->name);

        // 2. ใช้ Transaction เพื่อป้องกันข้อมูลพังกรณีอัปเดตล้มเหลว
        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $product, $validated, $slug) {

            // อัปเดตข้อมูลทั่วไป
            $product->update(array_merge($validated, ['slug' => $slug]));

            // 3. ตรวจสอบว่ามีการอัปโหลดรูปภาพใหม่เข้ามาหรือไม่
            if ($request->hasFile('images')) {
                // ลบรูปภาพเก่าทั้งหมดออกจาก Storage และ Database
                foreach ($product->images as $image) {
                    $oldPath = str_replace('/storage/', '', $image->image_path);
                    Storage::disk('public')->delete($oldPath);
                }
                $product->images()->delete();

                // อัปโหลดและบันทึกรูปภาพใหม่
                foreach ($request->file('images') as $index => $file) {
                    $path = $file->store('products', 'public');
                    $product->images()->create([
                        'image_path' => '/storage/' . $path,
                        'is_primary' => ($index === 0), // รูปแรกเป็นรูปหลัก
                        'sort_order' => $index + 1
                    ]);
                }
            }
        });

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

    public function setMainImage(Product $product, $imageId)
    {
        // ใช้ DB Transaction เพื่อความปลอดภัยของข้อมูล
        \Illuminate\Support\Facades\DB::transaction(function () use ($product, $imageId) {
            // 1. ถอดสถานะรูปหลักเดิมออกทั้งหมด
            $product->images()->update(['is_primary' => false]);

            // 2. ตั้งค่ารูปที่เลือกเป็นรูปหลัก
            $product->images()->where('id', $imageId)->update(['is_primary' => true]);
        });

        return back()->with('success', 'เปลี่ยนรูปภาพหลักเรียบร้อยแล้ว');
    }
}
