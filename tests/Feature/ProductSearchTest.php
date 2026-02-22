<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Category; // อย่าลืม Import Model Category
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ProductSearchTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_search_products_using_fulltext()
    {
        // สร้างสินค้าโดยเพิ่มภาษาอังกฤษเข้าไปช่วยในกรณีที่ MySQL ตัดคำไทยไม่ได้
        Product::factory()->create([
            'name' => 'เก้าอี้พลาสติกสีขาว PlasticChair',
            'description' => 'เก้าอี้ทนทานสำหรับใช้ภายนอก Outdoor'
        ]);

        Product::factory()->create([
            'name' => 'โต๊ะทำงานไม้ WoodenTable',
            'description' => 'โต๊ะสำหรับใช้ในออฟฟิศ Office'
        ]);

        // ลองค้นหาด้วยคำภาษาอังกฤษที่ยาวกว่า 3 ตัวอักษร
        $response = $this->get('/products?search=PlasticChair');

        $response->assertStatus(200);
        $response->assertSee('PlasticChair');
        $response->assertDontSee('WoodenTable');
    }
}
