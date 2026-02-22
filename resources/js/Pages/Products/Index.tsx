import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Filter } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { router } from '@inertiajs/react';
import CategoryMobileFilter from './Partials/CategoryMobileFilter';
import CategorySidebar from './Partials/CategorySidebar';
import ProductCard from './Partials/ProductCard';
import LoadMoreButton from './Partials/LoadMoreButton';

// Import Sub-Components

interface Props {
    products: any;
    categories: any[];
}

export default function Index({ products: initialProducts, categories }: Props) {
    const { url } = usePage();
    const [allProducts, setAllProducts] = useState(initialProducts.data);
    const [nextPageUrl, setNextPageUrl] = useState(initialProducts.next_page_url);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setAllProducts(initialProducts.data);
        setNextPageUrl(initialProducts.next_page_url);
    }, [initialProducts]);

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
                {/* Header Section */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Collection</h1>
                        <p className="text-slate-500 mt-2">เฟอร์นิเจอร์พลาสติกมาตรฐานสากล ทนทาน และดีไซน์ทันสมัย</p>
                    </div>
                    <div className="text-sm text-slate-400 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                        Showing <span className="text-slate-900 font-bold">{allProducts.length}</span> of <span className="text-slate-900 font-bold">{initialProducts.total}</span> products
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
                            <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Filter className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">ไม่พบสินค้า</h3>
                                <p className="text-slate-400 mt-2 font-medium">ลองเลือกหมวดหมู่สินค้าอื่น หรือแสดงทั้งหมด</p>
                                <Button variant="link" onClick={() => router.get(route('products.index'))} className="mt-4 text-primary font-bold">
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
