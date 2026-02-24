<?php

namespace App\Http\Controllers;

use App\Imports\ProductsImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ProductImportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,csv']);

        // Performance Option: ใช้ Queue เพื่อไม่ให้หน้าเว็บค้าง
        Excel::queueImport(new ProductsImport, $request->file('file'));

        return back()->with('success', 'ระบบกำลังนำเข้าข้อมูลสินค้าในพื้นหลัง...');
    }
}
