// resources/js/Pages/Admin/Products/Partials/ProductImportModal.tsx

import React, { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { FileUp, Loader2, Download, AlertCircle } from 'lucide-react';

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
                // อาจจะเพิ่ม Toast Notification ที่นี่
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
                    <DialogTitle className="text-2xl font-black">Import Products</DialogTitle>
                    <DialogDescription>
                        อัปโหลดไฟล์ Excel (.xlsx, .csv) เพื่อนำเข้าข้อมูลสินค้าจำนวนมาก
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6 pt-4">
                    <div
                        onClick={() => fileInput.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                        <input
                            type="file"
                            ref={fileInput}
                            className="hidden"
                            accept=".xlsx, .xls, .csv"
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        />

                        <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <FileUp className="w-6 h-6 text-purple-600" />
                        </div>

                        <p className="text-sm font-bold text-slate-700">
                            {data.file ? data.file.name : 'คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวาง'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">รองรับไฟล์ Excel และ CSV</p>
                    </div>

                    {errors.file && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                            <AlertCircle className="w-4 h-4" />
                            {errors.file}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={!data.file || processing}
                            className="w-full rounded-2xl bg-purple-900 hover:bg-purple-800 py-6 h-auto shadow-lg shadow-purple-100"
                        >
                            {processing ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังประมวลผล...</>
                            ) : (
                                'เริ่มนำเข้าข้อมูล'
                            )}
                        </Button>

                        {/* แก้ไขส่วนนี้: เปลี่ยนเป็น <a> tag เพื่อให้ Browser ทำการ Download ไฟล์ */}
                        <a
                            href={route('admin.products.template')}
                            className="inline-flex items-center justify-center text-slate-500 text-xs font-medium hover:text-purple-600 transition-colors py-2"
                        >
                            <Download className="w-3 h-3 mr-2" />
                            ดาวน์โหลดไฟล์ Template สำหรับอัปโหลด (.xlsx)
                        </a>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
