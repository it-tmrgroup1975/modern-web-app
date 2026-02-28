import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

/**
 * เพิ่ม Interface สำหรับรูปภาพสินค้า
 */
export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    sort_order: number;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    slug: string;
    description: string;
    price: number;

    // เปลี่ยนจาก image_url: string เป็น images: ProductImage[]
    images: ProductImage[];

    attributes: {
        color?: string;
        material?: string;
        dimensions?: string;
        [key: string]: any;
    } | null;

    stock: number;
    is_active: boolean;
    category?: Category;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

// สำหรับข้อมูลที่ส่งมาจาก Inertia ในหน้า Index
export interface ProductsIndexProps {
    products: {
        data: Product[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    categories: Category[];
};
