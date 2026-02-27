<?php

use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('products/download-template', function () {
        return (new \App\Actions\ExportProductTemplate)->download();
    })->name('products.template');

    Route::resource('products', AdminProductController::class);

    Route::post('products/import', [AdminProductController::class, 'import'])->name('products.import');
    Route::patch('products/{product}/images/{image}/set-main', [AdminProductController::class, 'setMainImage'])
    ->name('products.images.set-main');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/products/print-labels', [ProductController::class, 'printLabels'])
    ->name('products.print-labels');

// สร้าง Route สำหรับ Catalog สินค้า (Public Access)
Route::resource('products', ProductController::class)->only(['index', 'show']);

// หน้าแรกให้ Redirect ไปที่หน้าสินค้าเลย
Route::get('/', function () {
    return redirect()->route('products.index');
});

require __DIR__ . '/auth.php';
