import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    products_count?: number; // สำหรับแสดงจำนวนสินค้าใน Sidebar
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    image_url: string;
    stock_quantity: number;
    specifications?: {
        material?: string;
        dimensions?: string;
        weight_capacity?: string;
        is_uv_resistant?: boolean;
    };
    category?: Category;
    created_at: string;
    updated_at: string;
}

// สำหรับข้อมูลที่ส่งมาจาก Inertia ในหน้า Index
export interface ProductsIndexProps {
    products: {
        data: Product[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
    };
}
