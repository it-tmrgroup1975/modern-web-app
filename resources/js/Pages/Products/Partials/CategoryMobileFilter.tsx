import React from 'react';
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { router } from '@inertiajs/react';

export default function CategoryMobileFilter({ categories }: { categories: any[] }) {
    const handleCategoryChange = (slug: string) => {
        slug === "all" ? router.get(route('products.index')) : router.get(route('products.index', { category: slug }));
    };

    const getCurrentCategory = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('category') || "all";
    };

    return (
        <div className="md:hidden sticky top-0 z-40 -mx-4 px-4 py-4 bg-gray-50/80 backdrop-blur-md border-b border-slate-200 mb-6">
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                    <Filter className="w-3 h-3 text-primary" /> เลือกหมวดหมู่สินค้า
                </label>
                <Select onValueChange={handleCategoryChange} defaultValue={getCurrentCategory()}>
                    <SelectTrigger className="w-full h-12 bg-white rounded-xl shadow-lg shadow-slate-200/50 border-slate-200 focus:ring-primary">
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent className="z-[50]">
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
