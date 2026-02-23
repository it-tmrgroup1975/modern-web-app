<?php
// app/Imports/ProductsImport.php

namespace App\Imports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProductsImport implements ToModel, WithHeadingRow, WithChunkReading, ShouldQueue
{
    public function model(array $row)
    {
        return new Product([
            'category_id' => $row['category_id'],
            'name'        => $row['name'],
            'slug'        => \Illuminate\Support\Str::slug($row['name']),
            'price'       => $row['price'],
            'stock'       => $row['stock'],
            'is_active'   => true,
        ]); //
    }

    public function chunkSize(): int
    {
        return 1000; // แบ่งประมวลผลทีละ 1,000 แถวเพื่อลดการใช้ Memory
    }
}
