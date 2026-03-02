import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Factory, ShieldCheck, Truck, ChevronRight,
    Facebook, LineChart, Mail, MapPin, Phone,
    Instagram, Twitter
} from 'lucide-react';
import ProductCard from './Products/Partials/ProductCard';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface WelcomeProps extends PageProps {
    bestSellers: any[];
}

export default function Welcome({ auth, bestSellers }: WelcomeProps) {
    const heroSlides = [
        {
            title: "นวัตกรรมเฟอร์นิเจอร์พลาสติก",
            subtitle: "เพื่อความยั่งยืนและความทนทาน",
            desc: "เราใช้เทคโนโลยีการฉีดขึ้นรูปขั้นสูง พร้อมวัตถุดิบ Virgin PP เกรดที่ดีที่สุดในอุตสาหกรรม",
            bg: "bg-slate-900"
        },
        {
            title: "มาตรฐานการผลิตส่งออก",
            subtitle: "ผ่านการทดสอบคุณภาพทุกชิ้น",
            desc: "รองรับการใช้งานหนักทั้งในร่มและกลางแจ้ง ทนต่อรังสี UV และการกัดกร่อน",
            bg: "bg-blue-900"
        }
    ];

    return (
        <>
            <Head title="Modern Furniture | Premium Plastic Furniture Factory" />

            <div className="min-h-screen bg-white font-sans antialiased text-slate-900">

                {/* 1. Header Navigation (Glassmorphism) */}
                <header className="fixed w-full top-0 z-[100] transition-all duration-300 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Factory className="text-white w-6 h-6" />
                            </div>
                            <div className="text-2xl font-black tracking-tighter">
                                MODERN <span className="text-blue-600 italic font-black">FURNITURE</span>
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center space-x-10 text-[15px] font-semibold text-slate-600">
                            <Link href="/" className="text-blue-600">หน้าแรก</Link>
                            <Link href={route('products.index')} className="hover:text-blue-600 transition-colors">แคตตาล็อกสินค้า</Link>
                            <Link href="#" className="hover:text-blue-600 transition-colors">กระบวนการผลิต</Link>
                            <Link href="#" className="hover:text-blue-600 transition-colors">ติดต่อเรา</Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button variant="outline" className="rounded-full px-6">แดชบอร์ดจัดการ</Button>
                                </Link>
                            ) : (
                                <Link href={route('login')}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                                        เข้าสู่ระบบ
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {/* 2. Modern Carousel Hero Section */}
                    <section className="relative pt-20">
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation, EffectFade]}
                            effect="fade"
                            autoplay={{ delay: 5000 }}
                            pagination={{ clickable: true }}
                            navigation
                            className="h-[600px] lg:h-[750px] w-full"
                        >
                            {heroSlides.map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className={`relative w-full h-full flex items-center ${slide.bg}`}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                                        {/* Placeholder for real product/factory image */}
                                        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070')] bg-cover bg-center" />

                                        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
                                            <div className="max-w-2xl space-y-6 text-white">
                                                <div className="inline-block py-1 px-4 rounded-full bg-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
                                                    {slide.subtitle}
                                                </div>
                                                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                                                    {slide.title}
                                                </h1>
                                                <p className="text-lg lg:text-xl text-slate-300 font-light leading-relaxed">
                                                    {slide.desc}
                                                </p>
                                                <div className="flex flex-wrap gap-4 pt-4">
                                                    <Link href={route('products.index')}>
                                                        <Button size="lg" className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-500 rounded-full">
                                                            สั่งซื้อสินค้าออนไลน์ <ChevronRight className="ml-2" />
                                                        </Button>
                                                    </Link>
                                                    <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full text-white border-white/30 hover:bg-white/10">
                                                        ชมโรงงานเสมือนจริง
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>

                    {/* 3. Best Seller Section (Data-Driven) */}
                    <section className="py-24 bg-white relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                <div className="space-y-4">
                                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Best Sellers</span>
                                    <h2 className="text-4xl font-black text-slate-900 italic">สินค้าขายดีตลอดกาล</h2>
                                    <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                                </div>
                                <Link href={route('products.index')}>
                                    <Button variant="link" className="text-blue-600 text-lg font-bold group p-0">
                                        ดูรายการสินค้าทั้งหมด
                                        <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                                {bestSellers.length > 0 ? (
                                    bestSellers.map((product) => (
                                        <div key={product.id} className="transform transition-all duration-300 hover:-translate-y-2">
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-24 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <p className="text-slate-400 font-medium">ไม่มีข้อมูลสินค้าที่เปิดใช้งานในขณะนี้</p>
                                            <Button variant="outline" size="sm">อัปเดตสต็อกสินค้า</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 4. Quality Standard Section */}
                    <section className="py-24 bg-slate-950 text-white overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="grid lg:grid-cols-3 gap-12">
                                {[
                                    { icon: Factory, title: 'โรงงานมาตรฐาน ISO', desc: 'ทุกขั้นตอนการผลิตได้รับการรับรองมาตรฐานสากล' },
                                    { icon: ShieldCheck, title: 'รับประกันความแข็งแรง', desc: 'ทดสอบด้วยน้ำหนักเกินเกณฑ์มาตรฐาน 2 เท่า' },
                                    { icon: Truck, title: 'Express Delivery', desc: 'จัดส่งถึงหน้างานรวดเร็ว พร้อมทีมติดตั้งมืออาชีพ' }
                                ].map((item, idx) => (
                                    <div key={idx} className="group p-8 rounded-3xl bg-white/5 hover:bg-white/10 transition-all">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 transform group-hover:rotate-12 transition-transform">
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                        <p className="text-slate-400 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                {/* 5. Enterprise Footer */}
                <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                            {/* Brand Info */}
                            <div className="space-y-6">
                                <div className="text-2xl font-black italic tracking-tighter">
                                    MODERN <span className="text-blue-600">FURNITURE</span>
                                </div>
                                <p className="text-slate-500 font-light leading-relaxed">
                                    ผู้นำด้านการผลิตเฟอร์นิเจอร์พลาสติกอุตสาหกรรมในไทย ด้วยประสบการณ์มากกว่า 40 ปี ส่งออกทั่วอาเซียน
                                </p>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                        <Facebook size={20} />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                        <Instagram size={20} />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                        <Twitter size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold">เมนูหลัก</h4>
                                <ul className="space-y-4 text-slate-500 font-light">
                                    <li><Link href="/" className="hover:text-blue-600">หน้าแรก</Link></li>
                                    <li><Link href={route('products.index')} className="hover:text-blue-600">แคตตาล็อกสินค้า</Link></li>
                                    <li><Link href="#" className="hover:text-blue-600">โครงการของเรา</Link></li>
                                    <li><Link href="#" className="hover:text-blue-600">ร่วมงานกับเรา</Link></li>
                                </ul>
                            </div>

                            {/* Help */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold">ช่วยเหลือ & ติดต่อ</h4>
                                <ul className="space-y-4 text-slate-500 font-light">
                                    <li className="flex items-start gap-3">
                                        <Phone size={18} className="text-blue-600 mt-1" />
                                        <span>+66 2 123 4567</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Mail size={18} className="text-blue-600 mt-1" />
                                        <span>sales@modernfurniture.com</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <MapPin size={18} className="text-blue-600 mt-1" />
                                        <span>123 นิคมอุตสาหกรรมฯ กรุงเทพฯ 10520</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold">รับข่าวสารโปรโมชั่น</h4>
                                <p className="text-slate-500 text-sm font-light">กรอกอีเมลเพื่อรับสิทธิพิเศษและแคตตาล็อกเล่มใหม่ก่อนใคร</p>
                                <div className="flex gap-2">
                                    <input type="email" placeholder="อีเมลของคุณ" className="bg-white border border-slate-200 rounded-lg px-4 flex-1 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                                    <Button className="bg-blue-600 hover:bg-blue-700">ส่ง</Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
                            <p>© 2026 Modern Furniture Industrial Co., Ltd. All rights reserved.</p>
                            <div className="flex gap-8">
                                <Link href="#" className="hover:text-slate-600">นโยบายความเป็นส่วนตัว</Link>
                                <Link href="#" className="hover:text-slate-600">ข้อกำหนดการใช้งาน</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
