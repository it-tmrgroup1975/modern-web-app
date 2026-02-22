import React from 'react';
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ArrowUpRight, Box, Tag } from "lucide-react";
// 1. นำเข้า Link จาก @inertiajs/react เพื่อการโหลดหน้าแบบ SPA ไม่ Refresh
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }: { product: any }) {
    return (
        <Card className="group border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white flex flex-col border border-slate-50">

            {/* 2. หุ้มส่วนรูปภาพด้วย Link เพื่อให้คลิกที่รูปแล้วไปหน้าสินค้าได้ทันที */}
            <Link href={route('products.show', product.id)} className="block aspect-square bg-[#F8FAFC] relative overflow-hidden m-3 rounded-[2rem] cursor-pointer">
                <img
                    src={product.image_url || `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="object-contain w-full h-full p-10 transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {product.stock <= 5 ? (
                        <Badge variant="destructive" className="backdrop-blur-md bg-red-500/80 border-none px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                            Limited
                        </Badge>
                    ) : (
                        <div />
                    )}

                    <div className="bg-white/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
            </Link>

            <CardContent className="px-7 pt-2 pb-6 flex-grow">
                <div className="flex items-center gap-1.5 mb-3">
                    <Box className="w-3 h-3 text-primary/60" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {product.category?.name || 'General'}
                    </span>
                </div>

                {/* 3. หุ้มชื่อสินค้าด้วย Link */}
                <Link href={route('products.show', product.id)}>
                    <h3 className="font-bold text-slate-800 text-xl tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-1 cursor-pointer">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium text-slate-400">฿</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            {Number(product.price).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-300">
                        <Tag className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Standard</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-7 pb-7 pt-0">
                {/* 4. ใช้ Link หุ้ม Button หรือเปลี่ยน Button เป็น Link component ของ Inertia */}
                <Link href={route('products.show', product.id)} className="w-full">
                    <Button className="w-full rounded-2xl py-6 text-sm font-bold bg-slate-900 hover:bg-primary text-white shadow-none transition-all duration-300 flex gap-2 overflow-hidden">
                       <span>Specifications</span>
                       <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
