// resources/js/Pages/Products/Index.tsx

import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Filter, Printer, CheckSquare, Square } from "lucide-react";
import { Button } from "@/Components/ui/button";
import CategoryMobileFilter from './Partials/CategoryMobileFilter';
import CategorySidebar from './Partials/CategorySidebar';
import ProductCard from './Partials/ProductCard';
import LoadMoreButton from './Partials/LoadMoreButton';
import SearchFilter from './Partials/SearchFilter';
import { ProductsIndexProps } from '@/types';
import { useDebounce } from '@/Hooks/useDebounce';
import { Checkbox } from "@/Components/ui/checkbox";

export default function Index({ products: initialProducts, categories, filters }: ProductsIndexProps) {
    const { url } = usePage();
    const [allProducts, setAllProducts] = useState(initialProducts.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialProducts.next_page_url);
    const [isLoading, setIsLoading] = useState(false);

    // --- ระบบจัดการการเลือกสินค้า (Print Selection) ---
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAllInPage = () => {
        if (selectedIds.length === allProducts.length && allProducts.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allProducts.map((p: any) => p.id));
        }
    };

    const handlePrintSelected = () => {
        if (selectedIds.length === 0) return;

        router.post(route('products.print-labels'),
            { ids: selectedIds },
            {
                // เพิ่ม preserveState เพื่อรักษาค่า Checkbox และ Filter ต่างๆ ไว้
                preserveState: true,
                // เพิ่ม preserveScroll เพื่อไม่ให้หน้า Catalog เด้งไปบนสุด
                preserveScroll: true,
                onSuccess: () => {
                    // ตัวเลือกเสริม: หากพิมพ์สำเร็จแล้วต้องการล้างค่าที่เลือกไว้
                    // setSelectedIds([]);
                }
            }
        );
    };

    // อัปเดตข้อมูลเมื่อมีการเปลี่ยนผลลัพธ์จาก Server (Filter/Search)
    useEffect(() => {
        setAllProducts(initialProducts.data);
        setNextPageUrl(initialProducts.next_page_url);
    }, [initialProducts]);

    const handleSearch = (value: string | null) => {
        router.get(route('products.index'),
            { ...filters, search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleLoadMore = () => {
        if (nextPageUrl && !isLoading) {
            setIsLoading(true);
            router.get(nextPageUrl, {}, {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                onSuccess: (page) => {
                    const newProducts = page.props.products as any;
                    setAllProducts([...allProducts, ...newProducts.data]);
                    setNextPageUrl(newProducts.next_page_url);
                    setIsLoading(false);
                }
            });
        }
    };

    return (
        <div className="py-8 bg-gray-50/50 min-h-screen">
            <Head title="Premium Industrial Catalog | Modern Furniture" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Our Collection</h1>
                        <p className="text-slate-500 mt-2 font-medium">เฟอร์นิเจอร์พลาสติกมาตรฐานสากล ทนทาน และดีไซน์ทันสมัย</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* เครื่องมือจัดการ Selection */}
                        <div className="flex items-center gap-2 mr-2">
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleSelectAllInPage}
                                className="rounded-xl border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest"
                            >
                                {selectedIds.length === allProducts.length && allProducts.length > 0 ? (
                                    <CheckSquare className="w-3 h-3 mr-2" />
                                ) : (
                                    <Square className="w-3 h-3 mr-2" />
                                )}
                                Select All
                            </Button> */}

                            {selectedIds.length > 0 && (
                                <Button
                                    onClick={handlePrintSelected}
                                    className="bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl shadow-lg shadow-purple-200 animate-in zoom-in-95"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    พิมพ์ ({selectedIds.length})
                                </Button>
                            )}
                        </div>

                        {/* ส่ง Categories ไปยัง Filter พร้อมระบบป้องกัน Error value เป็นสตริงว่าง */}
                        <CategoryMobileFilter
                            categories={categories.filter((c: any) => c.slug)}
                        />

                        <SearchFilter
                            initialValue={filters.search || ''}
                            onSearch={handleSearch}
                        />

                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-72 shrink-0">
                        <div className="md:sticky md:top-24 space-y-8 animate-in fade-in duration-1000">
                            <CategorySidebar
                                categories={categories.filter((c: any) => c.slug)}
                                url={url}
                            />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1 flex flex-col gap-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allProducts.map((product: any) => (
                                <div key={product.id} className="relative group transition-all duration-300">
                                    {/* Selection Checkbox Overlay */}
                                    <div className="absolute top-6 left-6 z-20 transition-transform duration-300 group-hover:scale-110">
                                        <Checkbox
                                            checked={selectedIds.includes(product.id)}
                                            onCheckedChange={() => toggleSelect(product.id)}
                                            className="w-7 h-7 border-2 border-slate-200 bg-white/90 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 shadow-xl rounded-xl"
                                        />
                                    </div>

                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        <LoadMoreButton
                            nextPageUrl={nextPageUrl}
                            isLoading={isLoading}
                            total={initialProducts.total}
                            currentCount={allProducts.length}
                            onLoadMore={handleLoadMore}
                        />

                        {/* Empty State */}
                        {allProducts.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in zoom-in-95">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Filter className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">ไม่พบสินค้าที่คุณค้นหา</h3>
                                <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">ลองเลือกหมวดหมู่สินค้าอื่น หรือล้างตัวกรอง</p>
                                <Button
                                    variant="link"
                                    onClick={() => router.get(route('products.index'))}
                                    className="mt-6 text-purple-600 font-black uppercase text-xs tracking-widest hover:no-underline"
                                >
                                    Reset All Filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
