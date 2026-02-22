import React, { useState } from 'react';
import { Search, X } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

interface SearchFilterProps {
    initialValue: string;
    onSearch: (value: string | null) => void;
}

export default function SearchFilter({ initialValue, onSearch }: SearchFilterProps) {
    const [inputValue, setInputValue] = useState(initialValue);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(inputValue || null);
        }
    };

    const handleClear = () => {
        setInputValue('');
        onSearch(null);
    };

    return (
        <div className="relative group w-full max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input
                type="text"
                placeholder="ค้นหาเก้าอี้, ตู้ลิ้นชัก..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-11 pr-12 h-12 w-full rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
            />
            {inputValue && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-16 flex items-center px-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            <Button
                onClick={() => onSearch(inputValue || null)}
                className="absolute right-1.5 top-1.5 h-9 px-4 rounded-xl bg-purple-900 hover:bg-purple-600 text-xs font-bold transition-all shadow-sm"
            >
                ค้นหา
            </Button>
        </div>
    );
}
