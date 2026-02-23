// resources/js/Pages/Products/Partials/CategoryMobileFilter.tsx

import React from 'react';
import { router } from '@inertiajs/react';
import {
    LayoutGrid,
    Box,
    Trash2,
    Droplets,
    Table as TableIcon,
    Tent,
    ChevronDown,
    Filter,
    RockingChair
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"; // ใช้ DropdownMenu จาก ShadCN
import { cn } from "@/lib/utils";

// Mapping ไอคอนตามที่สกัดจาก qq.pdf
const getCategoryIcon = (slug: string | null) => {
    switch (slug) {
        case 'plastic-chairs': return <RockingChair className="w-4 h-4" />;
        case 'storage-cabinets': return <Box className="w-4 h-4" />;
        case 'waste-bins': return <Trash2 className="w-4 h-4" />;
        case 'water-containers': return <Droplets className="w-4 h-4" />;
        case 'plastic-tables': return <TableIcon className="w-4 h-4" />;
        case 'outdoor-furniture': return <Tent className="w-4 h-4" />;
        default: return <LayoutGrid className="w-4 h-4" />;
    }
};

export default function CategoryMobileFilter({ categories }: { categories: any[] }) {
    const params = new URLSearchParams(window.location.search);
    const currentCategorySlug = params.get('category');

    // หาชื่อหมวดหมู่ปัจจุบันเพื่อแสดงบนปุ่ม
    const currentCategory = categories.find(cat => cat.slug === currentCategorySlug);
    const displayName = currentCategory ? currentCategory.name : "หมวดหมู่ทั้งหมด";

    const handleCategoryChange = (slug: string) => {
        slug === "all"
            ? router.get(route('products.index'), {}, { preserveState: true })
            : router.get(route('products.index', { category: slug }), {}, { preserveState: true });
    };

    return (
        <div className="md:hidden top-0 z-40 -mx-4 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">หมวดหมู่</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 mt-0.5 group focus:outline-none">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                                {getCategoryIcon(currentCategorySlug)}
                            </div>
                            <span className="font-bold text-slate-900 tracking-tight text-sm">
                                {displayName}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-[280px] rounded-2xl p-2 shadow-2xl border-slate-100 z-[60]">
                        <DropdownMenuItem
                            onClick={() => handleCategoryChange('all')}
                            className={cn(
                                "rounded-xl py-3 px-4 flex items-center gap-3 font-bold text-sm",
                                !currentCategorySlug ? "bg-purple-50 text-purple-600" : "text-slate-600"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            ทั้งหมด
                        </DropdownMenuItem>

                        {categories.map((category) => (
                            category.slug && (
                                <DropdownMenuItem
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.slug)}
                                    className={cn(
                                        "rounded-xl py-3 px-4 flex items-center gap-3 font-bold text-sm mt-1",
                                        currentCategorySlug === category.slug ? "bg-purple-50 text-purple-600" : "text-slate-600"
                                    )}
                                >
                                    {getCategoryIcon(category.slug)}
                                    {category.name}
                                </DropdownMenuItem>
                            )
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* เพิ่มไอคอนฟิลเตอร์ด้านข้างเพื่อบอกใบ้ให้แอดมินรู้ว่านี่คือจุดปรับแต่ง */}
            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300">
                <Filter className="w-4 h-4" />
            </div>
        </div>
    );
}
