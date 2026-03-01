import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import {
    ChevronLeft,
    Box,
    ShieldCheck,
    Truck,
    Ruler,
    Palette
} from "lucide-react";
import ProductCard from './Partials/ProductCard';
import { Product } from '@/types'; // อ้างอิง Interface ที่เราปรับปรุงไว้

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function Show({ product, relatedProducts }: Props) {
    // กำหนดรูปหลักเริ่มต้น: หาจาก is_primary หรือใช้รูปแรกของ Array ถ้าไม่มีให้ใช้ Placeholder
    const [activeImage, setActiveImage] = useState(
        product.images?.find(img => img.is_primary)?.image_path ||
        product.images?.[0]?.image_path ||
        `https://placehold.co/800x800/FFFFFF/64748B?text=Modern Furniture`
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH').format(price);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <Head title={`${product.name} | Modern Furniture`} />

            {/* Top Navigation */}
            <nav className="max-w-7xl mx-auto px-4 py-6">
                <Link
                    href={route('products.index', {
                        category: product.category?.slug, // ส่ง slug กลับไปเพื่อให้หน้า Index กรองต่อได้ทันที
                        // หรือส่ง filters เดิมผ่าน props ถ้ามีการส่งมาจากหน้า Index
                    })}
                    className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> BACK TO CATALOG
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Product Image Showcase (Gallery Logic) */}
                    <section className="space-y-6">
                        {/* Main Large Image */}
                        <div className="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden flex items-center justify-center p-8 border border-slate-100 shadow-inner">
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="object-contain w-full h-full transform transition-all duration-700 ease-in-out"
                            />
                        </div>

                        {/* Image Thumbnails Grid */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(img.image_path)}
                                        className={`aspect-square bg-slate-50 rounded-2xl border-2 overflow-hidden transition-all
                                            ${activeImage === img.image_path
                                                ? 'border-primary ring-2 ring-primary/10 opacity-100'
                                                : 'border-slate-100 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img.image_path}
                                            alt={`${product.name} thumbnail`}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Right: Product Info & Specs */}
                    <section className="flex flex-col gap-8">
                        <div className="space-y-4">
                            {product.category && (
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-widest text-[10px]">
                                    {product.category.name}
                                </Badge>
                            )}
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-slate-400">THB</span>
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-500 leading-relaxed text-lg">
                            {product.description || "สัมผัสประสบการณ์ความทนทานระดับพรีเมียมด้วยเฟอร์นิเจอร์พลาสติกเกรดอุตสาหกรรม ออกแบบมาเพื่อการใช้งานที่ยาวนานและดีไซน์ที่เข้ากับทุกพื้นที่"}
                        </p>

                        {/* Technical Specifications Grid */}
                        <Card className="p-8 rounded-[2rem] border-slate-100 bg-slate-50/50 shadow-none grid grid-cols-2 gap-8">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Ruler className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dimensions</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {product.attributes?.dimensions || 'Standard Size'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Palette className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color Option</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {product.attributes?.color || 'Multi-color'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warranty</p>
                                    <p className="text-sm font-bold text-slate-700">1 Year Factory</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Box className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {product.attributes?.material || 'High-Grade PP'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button className="flex-1 h-16 rounded-2xl bg-slate-900 hover:bg-primary text-lg font-black transition-all group">
                                ENQUIRE NOW
                                <Box className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </Button>
                            <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 font-black flex gap-2 hover:bg-slate-50">
                                <Truck className="w-5 h-5" /> SHIPPING INFO
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Related Products Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <section className="mt-32 space-y-10">
                        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Related Collection</h2>
                                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">More from {product.category?.name}</p>
                            </div>
                            <Link
                                href={route('products.index', { category: product.category?.id })}
                                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors border-b-2 border-primary"
                            >
                                VIEW ALL
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
