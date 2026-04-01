"use client";

import { FileDown } from "lucide-react";
import { exportToExcel } from "@/lib/utils/excelExport";
import { cn } from "@/lib/utils/cn";

interface ExportButtonProps {
    data: any[];
    filename: string;
    sheetName?: string;
    className?: string;
    label?: string;
}

export function ExportButton({ data, filename, sheetName, className, label = "Export Excel" }: ExportButtonProps) {
    const handleExport = () => {
        // Simple data cleaning for better Excel display
        const cleanData = data.map(item => {
            const newItem = { ...item };

            // Remove MongoDB internal fields
            delete newItem._id;
            delete newItem.__v;

            // Flatten or stringsify objects/arrays for Excel
            Object.keys(newItem).forEach(key => {
                if (Array.isArray(newItem[key])) {
                    newItem[key] = newItem[key].join(", ");
                } else if (typeof newItem[key] === 'object' && newItem[key] !== null) {
                    // Try to use a 'name' or 'title' if it exists, else stringify
                    newItem[key] = newItem[key].name || newItem[key].title || JSON.stringify(newItem[key]);
                }
            });

            return newItem;
        });

        exportToExcel(cleanData, filename, sheetName);
    };

    return (
        <button
            onClick={handleExport}
            disabled={!data || data.length === 0}
            className={cn(
                "flex items-center gap-2 px-6 py-3 bg-green-600/10 border border-green-600/20 text-green-600 dark:text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:grayscale",
                className
            )}
            title="Download formatted Excel report"
        >
            <FileDown className="w-4 h-4" />
            {label}
        </button>
    );
}
