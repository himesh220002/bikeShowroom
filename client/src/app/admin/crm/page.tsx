"use client";

import { useEffect, useState } from "react";
import { CustomersTable } from "@/components/features/CustomersTable";
import { Download, Filter, Search, Heart, Loader2, Sparkles } from "lucide-react";

export default function CRMPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/customers");
                const data = await res.json();
                if (data.success) setCustomers(data.data);
            } catch (err) {
                console.error("Failed to fetch CRM data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                        CUSTOMER <span className="text-gradient">RELATIONSHIP</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Nurture and track long-term customer satisfaction</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-card border border-border text-muted-foreground rounded-xl hover:text-foreground transition-all">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20">
                        <Sparkles className="w-4 h-4" />
                        Campaign Mode
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border border-border rounded-2xl shadow-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Customers</h4>
                    <p className="text-2xl font-display font-black text-foreground italic">{customers.length}</p>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl shadow-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Service Retention</h4>
                    <p className="text-2xl font-display font-black text-foreground italic">84%</p>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl shadow-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Sentiment Score</h4>
                    <p className="text-2xl font-display font-black text-racing-blue italic flex items-center gap-2">
                        GREAT <Heart className="w-4 h-4 fill-racing-blue" />
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                    <input
                        placeholder="Search by name, phone or vehicle..."
                        className="w-full bg-card border border-border rounded-xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-racing-blue transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 bg-card border border-border text-muted-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-foreground hover:border-muted-foreground/30 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            <div className="bg-background/90 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing CRM Core...</span>
                    </div>
                ) : (
                    <CustomersTable customers={customers} />
                )}
            </div>
        </div>
    );
}
