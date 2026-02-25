<?php

namespace App\Http\Controllers;

use App\Imports\ProductsImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ProductImportController extends Controller
{
    /**
     * นำเข้าข้อมูลสินค้าผ่าน Background Job (Queue)
     * รองรับลอจิก Multiple Images ผ่านคอลัมน์ 'images' (comma separated)
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv|max:10240'
        ]);

        // นำเข้าข้อมูลสินค้าโดยใช้ลอจิกที่รองรับ 1 สินค้าหลายรูปภาพ
        Excel::queueImport(new ProductsImport, $request->file('file'));

        return back()->with('success', 'ระบบกำลังนำเข้าข้อมูลสินค้าและแกลเลอรีในพื้นหลัง...');
    }
}
