// resources/js/Pages/Admin/Products/Index.tsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Pencil, Trash2, FileUp } from 'lucide-react';

export default function Index({ auth, products }: any) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Products" />
            <div className="py-12 px-4 max-w-7xl mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Product Catalog</CardTitle>
                        <div className="flex gap-2">
                            {/* ปุ่มสำหรับ Import */}
                            <Button variant="outline">
                                <FileUp className="w-4 h-4 mr-2" /> Import
                            </Button>
                            {/* ปุ่มสำหรับสร้างใหม่ */}
                            <Link href={route('admin.products.create')}>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" /> New Product
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Name</th>
                                    <th className="text-left p-4">Category</th>
                                    <th className="text-left p-4">Price</th>
                                    <th className="text-left p-4">Stock</th>
                                    <th className="text-center p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((product: any) => (
                                    <tr key={product.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4 font-medium">{product.name}</td>
                                        <td className="p-4">{product.category?.name}</td>
                                        <td className="p-4">฿{product.price}</td>
                                        <td className="p-4">{product.stock}</td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <Link href={route('admin.products.edit', product.id)}>
                                                <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
