import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Filter } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { router } from '@inertiajs/react';
import CategoryMobileFilter from './Partials/CategoryMobileFilter';
import CategorySidebar from './Partials/CategorySidebar';
import ProductCard from './Partials/ProductCard';
import LoadMoreButton from './Partials/LoadMoreButton';
import SearchFilter from './Partials/SearchFilter'; // นำเข้า Component ใหม่
import { ProductsIndexProps } from '@/types';
import { useDebounce } from '@/Hooks/useDebounce';

export default function Index({ products: initialProducts, categories, filters }: ProductsIndexProps) {
    const { url } = usePage();
    const [allProducts, setAllProducts] = useState(initialProducts.data);

    // แก้ไข Type Warning: ยอมรับ string หรือ null
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialProducts.next_page_url);

    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        // อัปเดต State เมื่อข้อมูลจาก Server เปลี่ยนแปลง (เช่น หลังจากการ Filter)
        setAllProducts(initialProducts.data);
        setNextPageUrl(initialProducts.next_page_url);
    }, [initialProducts]);

    const handleFilterChange = (key: string, value: string | number | null) => {
        const newFilters = {
            ...filters,
            [key]: value
        };

        if (!value) delete newFilters[key as keyof typeof filters];

        router.get(route('products.index'), newFilters, {
            preserveState: true,
            replace: true,
            only: ['products', 'filters'],
        });
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
                {/* Header Section พร้อม SearchFilter */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Our Collection</h1>
                        <p className="text-slate-500 mt-2 font-medium">เฟอร์นิเจอร์พลาสติกมาตรฐานสากล ทนทาน และดีไซน์ทันสมัย</p>
                    </div>

                    {/* การใช้งาน SearchFilter Component */}
                    <SearchFilter
                        initialValue={filters.search || ''}
                        onSearch={(value) => handleFilterChange('search', value)}
                    />

                    <div className="hidden lg:block text-sm text-slate-400 font-bold bg-white px-5 py-3 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100">
                        Showing <span className="text-slate-900 font-black">{allProducts.length}</span> of <span className="text-slate-900 font-black">{initialProducts.total}</span> products
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-10">
                    <aside className="w-full md:w-72 shrink-0">
                        <div className="md:sticky md:top-24 space-y-8">
                            <CategoryMobileFilter categories={categories} />
                            <CategorySidebar categories={categories} url={url} />
                        </div>
                    </aside>

                    <main className="flex-1 flex flex-col gap-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allProducts.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <LoadMoreButton
                            nextPageUrl={nextPageUrl}
                            isLoading={isLoading}
                            total={initialProducts.total}
                            currentCount={allProducts.length}
                            onLoadMore={handleLoadMore}
                        />

                        {allProducts.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Filter className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">ไม่พบสินค้าที่คุณค้นหา</h3>
                                <p className="text-slate-400 mt-2 font-bold uppercase text-xs tracking-widest">ลองเลือกหมวดหมู่สินค้าอื่น หรือแสดงทั้งหมด</p>
                                <Button variant="link" onClick={() => router.get(route('products.index'))} className="mt-6 text-primary font-black uppercase text-sm tracking-tight">
                                    แสดงสินค้าทั้งหมด
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
