import React from 'react';
import { Button } from "@/Components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface LoadMoreProps {
    nextPageUrl: string | null;
    isLoading: boolean;
    total: number;
    currentCount: number;
    onLoadMore: () => void;
}

export default function LoadMoreButton({ nextPageUrl, isLoading, total, currentCount, onLoadMore }: LoadMoreProps) {
    if (!nextPageUrl) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-4 mb-20 py-10 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-medium italic">
                You've viewed {currentCount} of {total} products
            </p>
            <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
                className="w-full md:w-[280px] h-14 md:h-16 rounded-2xl border-2 border-primary/20 hover:bg-purple-900 hover:text-white transition-all duration-300 group shadow-lg shadow-slate-200"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                )}
                <span className="font-black tracking-wider uppercase text-sm md:text-base">Load More Products</span>
            </Button>
        </div>
    );
}
