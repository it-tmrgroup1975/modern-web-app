<?php
// app/Imports/ProductsImport.php
namespace App\Imports;

use App\Models\Product;
use App\Actions\FindOrCreateCategory;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Str;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        $categoryAction = new FindOrCreateCategory();
        $categoryId = $categoryAction->execute($row['category_name']);

        return new Product([
            'category_id' => $categoryId,
            'name'        => $row['product_name'],
            'sku'         => $row['sku'] ?? 'PROD-' . strtoupper(Str::random(8)), // เพิ่มบรรทัดนี้
            'slug'        => Str::slug($row['product_name']) . '-' . uniqid(),
            'description' => $row['description'],
            'price'       => $row['price'],
            'stock'       => $row['stock'] ?? 0,
            'is_active'   => true,
            'attributes'  => $this->parseAttributes($row),
        ]);
    }

    public function rules(): array
    {
        return [
            'product_name' => 'required|string|max:255',
            'category_name' => 'required|string',
            'price' => 'required|numeric|min:0',
        ];
    }

    private function parseAttributes($row): array
    {
        // ดึงข้อมูล เช่น สี หรือ จำนวนชั้น จาก Excel มาลง JSON
        return [
            'color' => $row['color'] ?? 'N/A',
            'material' => 'Plastic',
            'imported_at' => now()->toDateTimeString(),
        ];
    }
}
