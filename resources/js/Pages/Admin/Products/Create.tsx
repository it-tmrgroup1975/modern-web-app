// resources/js/Pages/Admin/Products/Create.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ProductForm from './Partials/ProductForm';

export default function Create({ auth, categories }: any) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">เพิ่มสินค้าใหม่</h2>}
        >
            <Head title="เพิ่มสินค้าใหม่" />

            <div className="py-12 px-4 max-w-4xl mx-auto">
                <div className="mb-4">
                    <Link href={route('admin.products.index')}>
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="w-4 h-4 mr-1" /> กลับหน้าจัดการ
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>ข้อมูลสินค้าเบื้องต้น</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* เรียกใช้ ProductForm โดยไม่ส่งข้อมูล product เพื่อเป็นการสร้างใหม่ */}
                        <ProductForm categories={categories} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
