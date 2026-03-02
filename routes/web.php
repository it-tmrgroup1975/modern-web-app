<?php

use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Actions\ExportProductTemplate;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Admin Routes (Protected & Prefixed)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Custom Product Routes (ต้องอยู่เหนือ resource เพื่อป้องกัน Route Conflict)
    Route::get('products/export', [AdminProductController::class, 'export'])->name('products.export');
    Route::get('products/download-template', fn() => (new ExportProductTemplate)->download())->name('products.template');
    Route::post('products/import', [AdminProductController::class, 'import'])->name('products.import');
    Route::patch('products/{product}/images/{image}/set-main', [AdminProductController::class, 'setMainImage'])
        ->name('products.images.set-main');

    // Standard Resource Route
    Route::resource('products', AdminProductController::class);
});

// ปรับจาก Route::redirect('/', '/products'); เป็น:
Route::get('/', function () {
    // 1. ดึงสินค้า 4 รายการล่าสุดที่เปิดใช้งานอยู่ (is_active = 1)
    // 2. ดึงรูปภาพหลัก (is_primary = 1) ของสินค้านั้นๆ มาด้วย
    $bestSellers = Product::query()
        ->where('is_active', true)
        ->with(['images' => function ($query) {
            // แก้ไข: คอลัมน์ในตาราง product_images คือ is_primary ไม่ใช่ is_active
            $query->where('is_primary', true);
        }])
        ->latest()
        ->take(4)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register'),
        'bestSellers' => $bestSellers,
        'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// 2. Public Routes (สินค้าหน้าร้าน)
Route::resource('products', ProductController::class)->only(['index', 'show']);
Route::post('/products/print-labels', [ProductController::class, 'printLabels'])->name('products.print-labels');

// 3. Authenticated Routes (Dashboard & Profile)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });
});

Route::fallback(fn() => inertia('Errors/NotFound'));

require __DIR__ . '/auth.php';
