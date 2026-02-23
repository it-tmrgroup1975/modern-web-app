// resources/js/Pages/Admin/Products/Partials/ProductForm.tsx

import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react'; //
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Progress } from '@/Components/ui/progress'; // สมมติว่ามีคอมโพเนนต์ Progress จาก ShadCN
import { ImageIcon, XCircle } from 'lucide-react'; //

export default function ProductForm({ product, categories }: any) {
    // สร้าง State สำหรับเก็บ URL ของรูปภาพตัวอย่าง
    const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image_url || null); //

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: product ? 'put' : 'post', // สำหรับการส่งไฟล์ภาพด้วยวิธี PUT ใน Laravel
        name: product?.name || '',
        category_id: product?.category_id || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        description: product?.description || '',
        image: null as File | null, //
    });

    // ฟังก์ชันจัดการเมื่อเลือกไฟล์ภาพ
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; //
        if (file) {
            setData('image', file); //
            setPreviewUrl(URL.createObjectURL(file)); // สร้าง Preview URL
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // ใช้ post เสมอเมื่อมีการส่งไฟล์ (และใช้ _method: 'put' ด้านบนถ้าเป็นการแก้ไข)
        post(product ? route('admin.products.update', product.id) : route('admin.products.store'), {
            forceFormData: true, // บังคับส่งแบบ FormData เพื่อรองรับไฟล์ภาพ
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4">
                {/* ส่วนการจัดการรูปภาพ */}
                <div className="space-y-2">
                    <Label>รูปภาพสินค้า (รองรับ .webp, .jpg, .png ไม่เกิน 2MB)</Label>

                    {/* แสดงรูปตัวอย่าง (Preview) */}
                    <div className="relative w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                        {previewUrl ? (
                            <>
                                <img src={`/storage/${previewUrl}`} className="object-cover w-full h-full" alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => { setPreviewUrl(null); setData('image', null); }}
                                    className="absolute top-1 right-1 text-red-500 bg-white rounded-full"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                        )}
                    </div>

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                    />
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                    {/* แสดง Progress Bar เมื่อกำลังอัปโหลด */}
                    {progress && (
                        <div className="mt-2">
                            <Progress value={progress.percentage} />
                            <p className="text-xs text-center mt-1">กำลังอัปโหลด {progress.percentage}%</p>
                        </div>
                    )}
                </div>



                <Button type="submit" disabled={processing} className="w-full">
                    {processing ? 'กำลังบันทึก...' : (product ? 'อัปเดตสินค้า' : 'เพิ่มสินค้า')}
                </Button>
            </div>
        </form>
    );
}
