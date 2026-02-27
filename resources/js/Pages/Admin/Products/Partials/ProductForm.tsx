// resources/js/Pages/Admin/Products/Partials/ProductForm.tsx

import { useForm, router } from '@inertiajs/react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Progress } from '@/Components/ui/progress';
import { Checkbox } from '@/Components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/Components/ui/select';
import { ImageIcon, XCircle, Package, Info, Settings2 } from 'lucide-react';

// กำหนด Type ของรูปภาพเพื่อป้องกัน TS7006
interface ProductImage {
    id: number | null;
    url: string;
    is_primary: boolean;
    is_new: boolean;
}

export default function ProductForm({ product, categories }: any) {
    // 1. State หลักสำหรับแสดงผลใน UI
    const [images, setImages] = useState<ProductImage[]>(
        product?.images?.map((img: any) => ({
            id: img.id,
            url: img.image_path,
            is_primary: !!img.is_primary,
            is_new: false
        })) || []
    );

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: product ? 'put' : 'post',
        name: product?.name || '',
        sku: product?.sku || '',
        slug: product?.slug || '',
        category_id: String(product?.category_id || ''),
        price: product?.price || '',
        stock: product?.stock || '',
        description: product?.description || '',
        is_active: product ? Boolean(product.is_active) : true,
        attributes: {
            material: product?.attributes?.material || 'Plastic PP',
            drawers: product?.attributes?.drawers || 0,
            max_height: product?.attributes?.max_height || 0,
        },
        images: [] as File[],
        deleted_images: [] as number[],
    });

    // ฟังก์ชันสั่งเปลี่ยนรูปหลัก
    const setAsMain = (imageId: number) => {
        router.patch(route('admin.products.images.set-main', [product.id, imageId]), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // จัดการเพิ่มรูปใหม่
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // ตรวจสอบจำนวนรูปคงเหลือ (สูงสุด 5 รูป)
        const currentCount = images.length;
        const remainingSlots = 5 - currentCount;

        if (remainingSlots <= 0) {
            alert("คุณสามารถอัปโหลดรูปภาพได้สูงสุด 5 รูปเท่านั้นครับ");
            return;
        }

        const filesToAdd = files.slice(0, remainingSlots);

        if (filesToAdd.length > 0) {
            // อัปเดต File list ของ form
            setData('images', [...(data.images as File[]), ...filesToAdd]);

            // อัปเดต UI State
            const newPreviews: ProductImage[] = filesToAdd.map(file => ({
                id: null,
                url: URL.createObjectURL(file),
                is_primary: false,
                is_new: true
            }));
            setImages((prev: ProductImage[]) => [...prev, ...newPreviews]);
        }
    };

    // จัดการลบรูป
    const removeImage = (index: number) => {
        const itemToRemove = images[index];

        // 1. ถ้ามี ID (รูปเดิมใน DB) ให้บันทึก ID ไว้เพื่อลบที่ Backend
        if (itemToRemove.id) {
            setData('deleted_images', [...data.deleted_images, itemToRemove.id]);
        }

        // 2. ลบออกจาก UI State
        const updatedImages = images.filter((_: ProductImage, i: number) => i !== index);
        setImages(updatedImages);

        // 3. ถ้าเป็นรูปใหม่ (is_new) ต้องลบออกจาก File list ด้วย
        if (itemToRemove.is_new) {
            // วิธีที่ปลอดภัย: กรองเอาเฉพาะรูปใหม่ที่เหลืออยู่แล้วอัปเดต data.images
            const remainingNewFiles = images
                .filter((img: ProductImage, i: number) => img.is_new && i !== index)
                .map((_, i) => (data.images as File[])[i]);
            // หมายเหตุ: วิธีการจับคู่ index อาจมีความซับซ้อน แนะนำให้สร้าง logic ที่ผูกกับ object จริงจะแม่นยำกว่า
            // แต่สำหรับเคสนี้ เพื่อความง่าย ให้ลบโดย filter index ของ files ที่เหลือ
            const currentFiles = [...(data.images as File[])];
            // ลบไฟล์ใหม่ที่ถูกลบออกจาก UI ออกจาก Array ของ File Object
            const newImagesOnly = images.filter((img: ProductImage) => img.is_new);
            const indexInNewFiles = newImagesOnly.indexOf(itemToRemove);
            currentFiles.splice(indexInNewFiles, 1);
            setData('images', currentFiles);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(product ? route('admin.products.update', product.id) : route('admin.products.store'), {
            forceFormData: true,
            preserveState: true,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-8 animate-in fade-in duration-500">
            {/* Section 1: รูปภาพสินค้า */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold tracking-tight">สื่อและรูปภาพสินค้า ({images.length}/5)</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img: ProductImage, index: number) => (
                        <div key={img.id || index} className="group relative aspect-square bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:shadow-md">
                            <img src={img.url} className="object-cover w-full h-full" alt={`Preview ${index}`} />

                            {img.is_primary && (
                                <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    MAIN
                                </span>
                            )}

                            {!img.is_primary && img.id && (
                                <button
                                    type="button"
                                    onClick={() => setAsMain(img.id!)}
                                    className="absolute bottom-2 left-2 bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 shadow-sm"
                                >
                                    SET MAIN
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    {/* ปุ่ม Add Image แสดงเฉพาะเมื่อรูปน้อยกว่า 5 */}
                    {images.length < 5 && (
                        <label className="relative aspect-square bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* ส่วนข้อมูลอื่นๆ (คงเดิม) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex justify-between gap-2 text-slate-800">
                        <div className='flex items-center gap-2 text-slate-800'>
                            <Info className="w-4 h-4 text-blue-600" />
                            <h3 className="font-bold tracking-tight">ข้อมูลพื้นฐาน</h3>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="active" checked={data.is_active} onCheckedChange={(val: boolean) => setData('is_active', val)} />
                            <Label htmlFor="active" className="text-sm font-medium cursor-pointer">เปิดแสดงผลบนเว็บไซต์</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>ชื่อสินค้า</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="เช่น ตู้ลิ้นชัก Modern-01" className="rounded-xl" />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>SKU (รหัสสินค้า)</Label>
                            <Input value={data.sku} onChange={e => setData('sku', e.target.value)} placeholder="PROD-001" className="rounded-xl" />
                            {errors.sku && <p className="text-red-500 text-xs">{errors.sku}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Slug (URL)</Label>
                            <Input value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="prod-001" className="rounded-xl" />
                            {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
                        </div>
                    </div>

                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-800">
                        <Package className="w-4 h-4 text-green-600" />
                        <h3 className="font-bold tracking-tight">ราคาและคลังสินค้า</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ราคา (บาท)</Label>
                            <Input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>จำนวนสต็อก</Label>
                            <Input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="rounded-xl" />
                        </div>
                    </div>
                    {(errors.price || errors.stock) && <p className="text-red-500 text-xs">ตรวจสอบข้อมูลราคา/สต็อก</p>}

                    <div className="space-y-2">
                        <Label>หมวดหมู่สินค้า</Label>
                        <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="เลือกหมวดหมู่" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat: any) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-800">
                    <Settings2 className="w-4 h-4 text-orange-600" />
                    <h3 className="font-bold tracking-tight">รายละเอียดทางเทคนิค</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>วัสดุ</Label>
                        <Input value={data.attributes.material} onChange={e => setData('attributes', { ...data.attributes, material: e.target.value })} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label>จำนวนลิ้นชัก</Label>
                        <Input type="number" value={data.attributes.drawers} onChange={e => setData('attributes', { ...data.attributes, drawers: parseInt(e.target.value) })} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label>ความสูงรวม (ซม.)</Label>
                        <Input type="number" value={data.attributes.max_height} onChange={e => setData('attributes', { ...data.attributes, max_height: parseFloat(e.target.value) })} className="rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>คำอธิบายสินค้า</Label>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={processing} className="flex-grow h-14 rounded-2xl bg-purple-900 hover:bg-purple-800 text-lg font-bold shadow-lg transition-all">
                    {processing ? 'กำลังดำเนินการ...' : (product ? 'อัปเดตข้อมูลสินค้า' : 'ยืนยันการเพิ่มสินค้า')}
                </Button>
            </div>
        </form>
    );
}
