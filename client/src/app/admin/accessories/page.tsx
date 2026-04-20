"use client";

import AccessoryBilling from "@/components/features/AccessoryBilling";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminAccessoriesPage() {
    return (
        <div className="p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href="/admin"
                            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter italic">
                            ACCESSORIES <span className="text-gradient-orange">BILLING</span>
                        </h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] ml-11">Instant part sales and inventory sync</p>
                </div>

                <div className="flex items-center gap-4 ml-11 md:ml-0">
                    <div className="px-6 py-3 bg-muted/50 border border-border rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Stock Status</span>
                            <span className="text-sm font-display font-black text-foreground tracking-tight">REAL-TIME SYNC</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <AccessoryBilling />
            </div>
        </div>
    );
}
