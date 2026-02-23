// resources/js/Pages/Products/Partials/ProductCard.tsx

import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ArrowRight, Box } from "lucide-react";
import { Link } from '@inertiajs/react';

interface ProductProps {
    id: number;
    name: string;
    slug: string;
    price: number | string;
    stock: number;
    image_url?: string;
    category?: { name: string };
}

export default function ProductCard({ product }: { product: ProductProps }) {
    const productUrl = product?.slug ? route('products.show', { product: product.slug }) : '#';

    if (!product) return null;

    return (
        <Card className="group relative border-none shadow-none bg-transparent overflow-hidden transition-all duration-500">
            {/* Image Section - เน้นความกว้างและสะอาด */}
            <Link href={productUrl} className="relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#F1F5F9] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-200/50">
                <img
                    src={product.image_url ? `/storage/${product.image_url}` : `https://placehold.co/600x750?text=${encodeURIComponent(product.name || 'Product')}`}
                    alt={product.name}
                    className="object-contain w-full h-full p-2 transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Overlay Button - จะปรากฏขึ้นเมื่อ Hover อย่างนุ่มนวล */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Button className="rounded-full bg-white text-slate-900 hover:bg-white px-6 py-5 shadow-xl border-none font-bold flex gap-2">
                            View Details <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Link>

            {/* Content Section - Minimal & Balanced */}
            <div className="pt-6 px-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        {/* Category - ตัวเล็ก เรียบหรู */}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                            {product.category?.name || 'Modern Collection'}
                        </p>

                        {/* Product Name */}
                        <Link href={productUrl}>
                            <h3 className="font-semibold text-slate-800 text-lg leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                {product.name}
                            </h3>
                        </Link>
                    </div>

                    {/* Price - เน้นให้ดูแพงด้วยการจัดวางที่เรียบง่าย */}
                    <div className="text-right">
                        <p className="text-xl font-bold text-slate-900 tracking-tight">
                            <span className="text-sm font-medium mr-0.5">฿</span>
                            {Number(product.price || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
