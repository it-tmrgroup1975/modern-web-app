import { Link, useForm, usePage } from '@inertiajs/react';
import { Search, Home, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/Components/ui/button'; //
import { Input } from '@/Components/ui/input'; //
import { Card, CardContent } from '@/Components/ui/card'; //
import { PageProps } from '@/types';

export default function NotFound() {
    // ระบุ PageProps โดยไม่ต้องใส่ Generic ซ้ำซ้อน
    const { categories } = usePage<PageProps>().props;

    const { data, setData, get, processing } = useForm({
        search: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('products.index')); //
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="relative">
                    <h1 className="text-[12rem] font-bold text-slate-200 leading-none">404</h1>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">ไม่พบหน้าที่คุณต้องการ</h2>
                        <p className="text-slate-500">คุณอาจพิมพ์ที่อยู่ผิด หรือสินค้าชิ้นนี้ถูกย้ายไปแล้ว</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                    <CardContent className="pt-8 pb-8 px-10">
                        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="ค้นหาสินค้าที่ต้องการ..."
                                    className="pl-10 h-12"
                                    value={data.search}
                                    onChange={e => setData('search', e.target.value)}
                                />
                            </div>
                            <Button type="submit" size="lg" disabled={processing} className="bg-purple-900 hover:bg-purple-800">
                                ค้นหา
                            </Button>
                        </form>

                        {/* Dynamic Suggestions จาก Categories จริงใน DB */}
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-3">หมวดหมู่แนะนำ:</p>
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(0, 5).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={route('products.index', { category: cat.slug })}
                                        className="inline-flex items-center gap-1 text-sm bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:border-purple-300 hover:text-purple-700 transition-all"
                                    >
                                        <Tag className="h-3 w-3" />
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/"><Home className="mr-2 h-4 w-4" /> กลับหน้าแรก</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
