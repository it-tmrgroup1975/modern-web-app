// resources/js/Pages/Products/PrintView.tsx
import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

// 1. ปรับ Interface ให้รองรับโครงสร้างข้อมูลรูปภาพแบบ One-to-Many
interface ProductImage {
    image_path: string;
    is_primary: boolean | number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    image_url?: string; // เก็บไว้เผื่อกรณีข้อมูลเก่า
    images: ProductImage[]; // เพิ่มส่วนนี้สำหรับจัดการรูปภาพ
    price: number;
    [key: string]: any;
}

interface PrintViewProps {
    products: Product[];
}

export default function PrintView({ products }: PrintViewProps) {
    const placeholderText = "Modern Furniture";
    const fallbackImage = `https://placehold.co/600x250/FFFFFF/64748B?text=${placeholderText}`;

    // 2. Helper Function สำหรับดึงรูปภาพหลักมาแสดงผล
    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            // เลือกรูปที่เป็น Primary ถ้าไม่มีให้เลือกรูปแรก
            const primary = product.images.find(img => img.is_primary) || product.images[0];
            return primary.image_path;
        }
        return product.image_url || fallbackImage;
    };

    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, []);

    return (
        <div className="print-container p-0 bg-white min-h-screen">
            <Head title="พิมพ์ป้ายราคา - Modern Furniture" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .page-container {
                        page-break-after: always;
                        height: 297mm;
                        width: 210mm;
                        padding: 10mm;
                        display: flex;
                        flex-direction: column;
                        box-sizing: border-box;
                        background: white;
                    }
                    .page-container:last-child { page-break-after: auto; }
                }
            `}} />

            <div className="flex flex-col max-w-4xl mx-auto px-4">
                {products.map((product: Product) => (
                    <div key={product.id} className="page-container relative">
                        <div className="flex-1 flex flex-col border-[0.5pt] border-slate-200 p-8 m-2 relative">

                            {/* Brand Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black tracking-[0.2em] text-slate-900">MODERN</span>
                                    <span className="text-[10px] font-bold tracking-[0.4em] text-slate-400 -mt-1">FURNITURE</span>
                                </div>
                                <div className="text-right border-l-[1px] border-slate-900 pl-4">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Standard</span>
                                    <span className="block text-[12px] font-black text-slate-900 uppercase">ISO 9001:2015</span>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="mb-4">
                                <div className="h-1 w-12 bg-slate-900 mb-4" />
                                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-[1.1] max-w-[80%]">
                                    {product.name}
                                </h2>
                                <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">Premium Product Collection</p>
                            </div>

                            {/* Main Hero Image - ใช้ Helper Function */}
                            <div className="flex-[5] flex items-center justify-center relative my-2 min-h-0">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,_#f8fafc_0%,_transparent_70%)] opacity-60" />
                                <img
                                    src={getProductImage(product)}
                                    className="max-w-[95%] max-h-[175mm] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.12)]"
                                    alt={product.name}
                                />
                            </div>

                            {/* Bottom Info Grid */}
                            <div className="grid grid-cols-12 items-end mt-6 gap-6">

                                {/* Price Section */}
                                <div className="col-span-7 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-[1px] w-4 bg-red-600" />
                                        <span className="text-red-600 text-[11px] font-black uppercase tracking-[0.2em]">Net Price</span>
                                    </div>

                                    {/* ส่วนแสดงผลตัวเลขดิจิทัล 4 หลัก - สร้างด้วย CSS 7-Segment */}
                                    <div className="flex items-center mt-6 mb-4 select-none digital-lcd-wrapper group/price">

                                        {/* สัญลักษณ์เงินบาท - ดีไซน์ Gray Line */}
                                        <span className="text-5xl font-extralight text-gray-200 mr-4 transform -translate-y-1">
                                            ฿
                                        </span>

                                        {/* กลุ่มช่องดิจิทัล 4 หลัก (Digital Slots) */}
                                        <div className="flex items-center gap-2 bg-gray-50/30 p-2 rounded-xl border border-gray-100">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="digital-segment-container">

                                                    {/* วาดเลข 8 ครบทั้ง 7 Segments ด้วย CSS */}
                                                    <div className="segment seg-top" />
                                                    <div className="segment seg-top-l" />
                                                    <div className="segment seg-top-r" />
                                                    <div className="segment seg-mid" />
                                                    <div className="segment seg-bot-l" />
                                                    <div className="segment seg-bot-r" />
                                                    <div className="segment seg-bot" />
                                                    {/* เลเยอร์ Overlay เพิ่มมิติความลึก */}

                                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-400/5 to-transparent pointer-events-none" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* ส่วนท้ายราคา - ดีไซน์ Gray Line */}
                                        <span className="text-3xl font-bold text-gray-200 ml-3">
                                            .-
                                        </span>
                                    </div>

                                </div>

                                <div className="col-span-5 flex flex-col items-end">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="text-right flex flex-col justify-center h-full">
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Scan for Info</p>
                                            <p className="text-[8px] font-medium text-slate-400 leading-tight uppercase tracking-tighter">
                                                Product Specifications<br />& Direct Support
                                            </p>
                                        </div>
                                        <div className="p-2 border-[0.5pt] border-slate-100 rounded-lg shadow-sm bg-white">
                                            <QRCodeSVG
                                                value={route('products.show', product.slug)}
                                                size={85}
                                                level="H"
                                                includeMargin={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subdued Footer */}
                            <div className="mt-6 pt-6 border-t-[0.5pt] border-slate-100 flex justify-between items-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                                    Genuine Plastic Industrial Grade
                                </p>
                                <p className="text-[9px] font-black text-slate-900 italic tracking-wider">
                                    MODERNFURNITURE.CO.TH
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed top-4 right-4 print:hidden flex gap-2">
                <Button
                    onClick={() => window.history.back()}
                    variant="destructive"
                    size="icon"
                    className="rounded-full shadow-lg">
                    <X className="w-4 h-4" />
                </Button>
                <Button className="no-print fixed bottom-10 right-10 shadow-[0_15px_40px_rgba(0,0,0,0.2)] rounded-full px-10 py-7 text-sm font-black bg-slate-900 hover:bg-black text-white border-none transition-all active:scale-95 tracking-[0.15em]" onClick={() => window.print()}>
                    PRINT LABELS
                </Button>
            </div>
        </div>
    );
}
