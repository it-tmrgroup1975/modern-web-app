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
     */
    public function index(Request $request)
    {
        // ดึงข้อมูลสินค้าพร้อมหมวดหมู่ และทำ Pagination 12 ชิ้นต่อหน้า
        // ใช้ Query Scope หรือ Simple Query สำหรับระบบ Filter เบื้องต้น
        $products = Product::with('category')
            ->when($request->category, function ($query, $slug) {
                $query->whereHas('category', fn($q) => $q->where('slug', $slug));
            })
            ->where('is_active', true)
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['category'])
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
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // ต้องมั่นใจว่าโหลด relation 'category' มาด้วย
        $product->load('category');

        // สำหรับ Related Products ก็ต้องโหลด category เช่นกัน
        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
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
