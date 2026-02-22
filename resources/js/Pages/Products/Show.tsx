import React from 'react';
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
import ProductCard from './Partials/ProductCard'; // ใช้ Component ที่เรา Refactor ไว้

interface Props {
    product: any;
    relatedProducts: any[];
}

export default function Show({ product, relatedProducts }: Props) {
    return (
        <div className="bg-white min-h-screen pb-20">
            <Head title={`${product.name} | Modern Furniture`} />

            {/* Top Navigation */}
            <nav className="max-w-7xl mx-auto px-4 py-6">
                <Link
                    href={route('products.index')}
                    className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> BACK TO CATALOG
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Product Image Showcase */}
                    <section className="space-y-4">
                        <div className="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden flex items-center justify-center p-12 border border-slate-100">
                            <img
                                src={`/storage/${product.image_url}` || `https://via.placeholder.com/800x800?text=${product.name}`}
                                alt={product.name}
                                className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Image Thumbnails (ถ้ามีหลายรูปในอนาคต) */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1,2,3,4].map((i) => (
                                // <div key={i} className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                                <img
                                src={`/storage/${product.image_url}` || `https://via.placeholder.com/800x800?text=${product.name}`}
                                alt={product.name}
                                className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-700"
                            />
                            ))}
                        </div>
                    </section>

                    {/* Right: Product Info & Specs */}
                    <section className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-widest text-[10px]">
                                {product.category.name}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-slate-400">THB</span>
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                    {Number(product.price).toLocaleString()}
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
                                    <p className="text-sm font-bold text-slate-700">Standard Size</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Palette className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color Options</p>
                                    <p className="text-sm font-bold text-slate-700">{product.attributes?.color || 'Multi-color'}</p>
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
                                    <p className="text-sm font-bold text-slate-700">High-Grade PP</p>
                                </div>
                            </div>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button className="flex-1 h-16 rounded-2xl bg-slate-900 hover:bg-primary text-lg font-black transition-all">
                                ENQUIRE NOW
                            </Button>
                            <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 font-black flex gap-2">
                                <Truck className="w-5 h-5" /> SHIPPING INFO
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="mt-32 space-y-10">
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Related Collection</h2>
                            <Link href={route('products.index')} className="text-sm font-bold text-primary hover:underline">VIEW ALL</Link>
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
