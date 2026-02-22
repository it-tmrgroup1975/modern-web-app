import React from 'react';
import { Link } from '@inertiajs/react';
import { LayoutGrid, ChevronRight } from "lucide-react";

export default function CategorySidebar({ categories, url }: { categories: any[], url: string }) {
    return (
        <section className="hidden md:block">
            <div className="flex items-center gap-2 mb-6 text-slate-900 border-b border-slate-200 pb-4">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight">Categories</h2>
            </div>
            <nav className="space-y-1.5">
                <Link
                    href={route('products.index')}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${!url.includes('category') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white text-slate-600 hover:text-primary hover:shadow-sm'}`}
                >
                    <span className="font-semibold text-sm">ทั้งหมด</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${!url.includes('category') ? 'opacity-100' : 'opacity-0'}`} />
                </Link>
                {categories.map((category) => {
                    const isActive = url.includes(`category=${category.slug}`);
                    return (
                        <Link
                            key={category.id}
                            href={route('products.index', { category: category.slug })}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white text-slate-600 hover:text-primary hover:shadow-sm'}`}
                        >
                            <span className="font-semibold text-sm">{category.name}</span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </Link>
                    );
                })}
            </nav>
        </section>
    );
}
