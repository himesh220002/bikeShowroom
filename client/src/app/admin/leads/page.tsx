"use client";

import { useEffect, useState } from "react";
import { LeadsTable } from "@/components/features/LeadsTable";
import { Download, Filter, Search, Plus, Loader2 } from "lucide-react";

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/leads");
                const data = await res.json();
                if (data.success) setLeads(data.data);
            } catch (err) {
                console.error("Failed to fetch leads:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                        SALES <span className="text-gradient">LEADS</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Manage and track pre-sales customer inquiries</p>
                </div>
                {/* ... rest of the header ... */}
                <div className="flex gap-2">
                    <button className="p-3 bg-zinc-900 border border-zinc-800 text-gray-400 rounded-xl hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20">
                        <Plus className="w-4 h-4" />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* ... search and filter ... */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-racing-blue transition-colors" />
                    <input
                        placeholder="Search by name, phone or bike..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-racing-blue transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 bg-zinc-900 border border-zinc-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Syncing CRM Data...</span>
                    </div>
                ) : (
                    <LeadsTable leads={leads} />
                )}
            </div>
        </div>
    );
}
