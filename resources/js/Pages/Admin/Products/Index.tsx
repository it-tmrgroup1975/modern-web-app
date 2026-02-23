// resources/js/Pages/Admin/Products/Index.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/Components/ui/select';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Plus, Pencil, Trash2, FileUp, Search,
    Filter, ChevronLeft, ChevronRight, Package
} from 'lucide-react';
import { useDebounce } from '@/Hooks/useDebounce'; // อ้างอิงจากไฟล์ที่มีในโปรเจกต์

export default function Index({ auth, products, categories, filters = {} }: any) { // กำหนด default value ให้ filters
    // ใช้ Optional Chaining หรือ nullish coalescing เพื่อความปลอดภัย
    const [search, setSearch] = useState(filters?.search ?? '');
    const debouncedSearch = useDebounce(search, 500);

    // ระบบค้นหาอัตโนมัติเมื่อพิมพ์ (Real-time Search)
    useEffect(() => {
        router.get(route('admin.products.index'),
            { search: debouncedSearch, category: filters.category },
            { preserveState: true, replace: true }
        );
    }, [debouncedSearch]);

    // ระบบกรองตามหมวดหมู่
    const handleCategoryChange = (value: string) => {
        router.get(route('admin.products.index'),
            { search: search, category: value === 'all' ? '' : value },
            { preserveState: true }
        );
    };

    // ระบบลบสินค้าพร้อมการยืนยัน
    const handleDelete = (id: number) => {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้? ข้อมูลจะหายไปถาวร')) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="คลังสินค้า - Modern Furniture" />

            <div className="py-12 px-4 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Management</h1>
                        <p className="text-slate-500 text-sm">จัดการรายการสินค้าและสต็อกของโรงงาน</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl border-slate-200">
                            <FileUp className="w-4 h-4 mr-2 text-slate-500" /> Import
                        </Button>
                        <Link href={route('admin.products.create')}>
                            <Button className="rounded-2xl bg-purple-900 hover:bg-purple-800 shadow-lg shadow-purple-200">
                                <Plus className="w-4 h-4 mr-2" /> New Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters Bar */}
                <Card className="border-none shadow-sm rounded-[2rem] bg-white/50 backdrop-blur">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="ค้นหาชื่อสินค้าหรือรายละเอียด..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-11 rounded-2xl border-none bg-slate-100/50 focus-visible:ring-purple-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select onValueChange={handleCategoryChange} defaultValue={filters.category || 'all'}>
                                <SelectTrigger className="w-[200px] rounded-2xl border-slate-200">
                                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                    <SelectValue placeholder="หมวดหมู่ทั้งหมด" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                    <SelectItem value="all">หมวดหมู่ทั้งหมด</SelectItem>
                                    {categories.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="text-left p-6 text-xs font-bold uppercase tracking-widest text-slate-400">สินค้า</th>
                                        <th className="text-left p-6 text-xs font-bold uppercase tracking-widest text-slate-400">หมวดหมู่</th>
                                        <th className="text-left p-6 text-xs font-bold uppercase tracking-widest text-slate-400">ราคา</th>
                                        <th className="text-left p-6 text-xs font-bold uppercase tracking-widest text-slate-400">สต็อก</th>
                                        <th className="text-left p-6 text-xs font-bold uppercase tracking-widest text-slate-400">สถานะ</th>
                                        <th className="text-center p-6 text-xs font-bold uppercase tracking-widest text-slate-400">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {products.data.map((product: any) => (
                                        <tr key={product.id} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden">
                                                        <img
                                                            src={`/storage/${product.image_url}` || `https://placehold.co/100?text=${product.name[0]}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 line-clamp-1">{product.name}</p>
                                                        <p className="text-xs text-slate-400 italic">SKU: {product.slug.toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-slate-600 font-medium">
                                                <Badge variant="outline" className="rounded-lg font-medium border-slate-100 text-slate-500">
                                                    {product.category?.name}
                                                </Badge>
                                            </td>
                                            <td className="p-6 font-black text-slate-900">
                                                ฿{Number(product.price).toLocaleString()}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                                                    <span className="font-bold text-slate-700">{product.stock}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <Badge className={product.is_active ? 'bg-green-50 text-green-700 hover:bg-green-50' : 'bg-slate-100 text-slate-400 hover:bg-slate-100'}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex justify-center gap-2">
                                                    <Link href={route('admin.products.edit', product.id)}>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(product.id)}
                                                        className="rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Section - ทันสมัยและสะอาด */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                    <p className="text-sm text-slate-400 font-medium">
                        Showing {products.from} to {products.to} of {products.total} products
                    </p>
                    <div className="flex gap-2">
                        {products.links.map((link: any, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`rounded-xl min-w-[40px] h-10 border-none shadow-none ${
                                    link.active ? 'bg-purple-900 hover:bg-purple-800' : 'bg-white hover:bg-slate-100 text-slate-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
