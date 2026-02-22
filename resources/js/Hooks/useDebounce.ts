import { useState, useEffect } from 'react';

// ใช้ Strict Typing ตามมาตรฐานที่เราตกลงกันไว้
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // ตั้งเวลาหน่วง
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // ล้าง Timeout เก่าทิ้งถ้ามีการพิมพ์ตัวใหม่เข้ามา (Cleanup function)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
