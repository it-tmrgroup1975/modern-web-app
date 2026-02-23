// resources/js/Pages/Admin/Products/Partials/ProductForm.tsx
import { useForm } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';

export default function ProductForm({ product, categories }: any) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        category_id: product?.category_id || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        description: product?.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        product ? put(route('admin.products.update', product.id)) : post(route('admin.products.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                {/* เพิ่ม Select Category และ Field อื่นๆ ตาม Schema */}
                <Button type="submit" disabled={processing}>
                    {product ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
