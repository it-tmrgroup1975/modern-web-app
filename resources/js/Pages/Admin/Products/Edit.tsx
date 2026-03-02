// resources/js/Pages/Admin/Products/Edit.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ProductForm from './Partials/ProductForm';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Edit({ auth, product, categories }: any) {
    // ดึง query parameters ปัจจุบันจาก URL (ถ้ามี)
    const queryParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        toast.info(`กำลังเข้าสู่โหมดแก้ไข: ${product.name}`, { duration: 2000 });
    }, []);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">แก้ไขสินค้า: {product.name}</h2>}
        >
            <Head title={`แก้ไข - ${product.name}`} />

            <div className="py-12 px-4 max-w-4xl mx-auto">
                <div className="mb-4">
                    {/* Performance Option: ส่งพารามิเตอร์ search, category, page กลับไปที่หน้า Index */}
                    <Link
                        href={route('admin.products.index')}
                        data={{
                            search: queryParams.get('search'),
                            category: queryParams.get('category'),
                            page: queryParams.get('page')
                        }}
                        preserveState
                    >
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="w-4 h-4 mr-1" /> กลับหน้าจัดการ
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>รายละเอียดสินค้า</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* ส่งข้อมูล product และ categories เพื่อทำการแก้ไข */}
                        <ProductForm product={product} categories={categories} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
