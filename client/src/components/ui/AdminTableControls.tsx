"use client";

import { Search, ChevronDown, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Option {
    label: string;
    value: string;
}

interface AdminTableControlsProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    sortOptions: Option[];
    filterStatus?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: Option[];
    startDate?: string;
    onStartDateChange?: (value: string) => void;
    endDate?: string;
    onEndDateChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function AdminTableControls({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    sortOptions,
    filterStatus,
    onFilterChange,
    filterOptions,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    placeholder = "Search...",
    className
}: AdminTableControlsProps) {
    const clearDates = () => {
        if (onStartDateChange) onStartDateChange("");
        if (onEndDateChange) onEndDateChange("");
    };

    return (
        <div className={cn("flex flex-wrap items-center gap-4 w-full", className)}>
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all shadow-lg shadow-black/5"
                />
            </div>

            {/* Date Range Picker (Optional) */}
            {onStartDateChange && onEndDateChange && (
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2 shadow-lg shadow-black/5">
                    <div className="flex items-center gap-2 group/date">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground group-focus-within/date:text-racing-blue transition-colors" />
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none text-foreground w-[90px]"
                            />
                            <span className="text-muted-foreground text-[10px] font-black px-1">—</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => onEndDateChange(e.target.value)}
                                className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none text-foreground w-[90px]"
                            />
                        </div>
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={clearDates}
                            className="ml-2 p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-racing-blue"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative group/sort min-w-[140px]">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-racing-blue/50 transition-all shadow-lg shadow-black/5"
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Filter Dropdown (Optional) */}
            {filterStatus !== undefined && filterOptions && onFilterChange && (
                <div className="relative group/filter min-w-[140px]">
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-racing-blue/50 transition-all shadow-lg shadow-black/5"
                    >
                        {filterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
            )}
        </div>
    );
}
