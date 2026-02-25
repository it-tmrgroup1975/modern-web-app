// resources/js/Pages/Admin/Products/Partials/ProductImportModal.tsx

import React, { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { FileUp, Loader2, Download, AlertCircle, Info } from 'lucide-react';

export default function ProductImportModal() {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const fileInput = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.import'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <Dialog onOpenChange={() => reset()}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-2xl border-slate-200">
                    <FileUp className="w-4 h-4 mr-2 text-slate-500" /> Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900">Import Products</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        อัปโหลดไฟล์ Excel เพื่อนำเข้าสินค้าจำนวนมากพร้อมแกลเลอรีรูปภาพ
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6 pt-4">
                    {/* ข้อมูลแนะนำรูปแบบไฟล์ */}
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-700 leading-relaxed">
                            <p className="font-bold mb-1">คำแนะนำสำหรับรูปภาพ:</p>
                            <p>ในคอลัมน์ <strong>images</strong> สามารถใส่ได้หลายรูปโดยแยกด้วยเครื่องหมายคอมม่า (,) เช่น: <code>/path/img1.jpg, /path/img2.jpg</code></p>
                        </div>
                    </div>

                    <div
                        onClick={() => fileInput.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center hover:bg-slate-50 transition-all cursor-pointer group"
                    >
                        <input
                            type="file"
                            ref={fileInput}
                            className="hidden"
                            accept=".xlsx, .xls, .csv"
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        />

                        <div className="bg-purple-100/50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <FileUp className="w-7 h-7 text-purple-600" />
                        </div>

                        <p className="text-sm font-bold text-slate-700">
                            {data.file ? data.file.name : 'คลิกเพื่อเลือกไฟล์ Excel หรือ CSV'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Max size: 10MB</p>
                    </div>

                    {errors.file && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {errors.file}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={!data.file || processing}
                            className="w-full rounded-2xl bg-slate-900 hover:bg-primary py-7 h-auto shadow-xl text-base font-bold transition-all"
                        >
                            {processing ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> ประมวลผลข้อมูล...</>
                            ) : (
                                'เริ่มนำเข้าข้อมูลสินค้า'
                            )}
                        </Button>

                        <a
                            href={route('admin.products.template')}
                            className="inline-flex items-center justify-center text-slate-400 text-xs font-bold hover:text-primary transition-colors py-2 uppercase tracking-widest"
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Download Template (.xlsx)
                        </a>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
