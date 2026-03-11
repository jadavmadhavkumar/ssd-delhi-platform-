"use client";

import { Shield } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 bg-slate-50 dark:bg-slate-950">
            <div className="relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-[#003285]/10 border-t-[#FF7F3E] animate-spin h-24 w-24" />

                {/* Brand Icon */}
                <div className="relative h-24 w-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200/50 scale-75 animate-pulse">
                    <Shield className="h-10 w-10 text-[#003285]" />
                </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
                <span className="text-[10px] font-black text-[#003285] uppercase tracking-[0.3em] animate-pulse">Initializing Module</span>
                <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#FF7F3E] w-1/3 animate-[loading_1.5s_infinite_ease-in-out]" />
                </div>
            </div>
        </div>
    );
}
