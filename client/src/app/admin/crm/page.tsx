"use client";

import { useEffect, useState, useMemo } from "react";
import { CustomersTable } from "@/components/features/CustomersTable";
import { Download, Heart, Loader2, Sparkles } from "lucide-react";
import { AdminTableControls } from "@/components/ui/AdminTableControls";

export default function CRMPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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

    const processedCustomers = useMemo(() => {
        let filtered = [...customers];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name?.toLowerCase().includes(q) ||
                c.phone?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q)
            );
        }
        if (startDate) {
            filtered = filtered.filter(c => new Date(c.createdAt || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(c => new Date(c.createdAt || 0) <= end);
        }
        return filtered.sort((a, b) => {
            if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }, [customers, searchQuery, sortBy, startDate, endDate]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-gray-500 uppercase tracking-tighter">
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

            <AdminTableControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: "Newest Joined", value: "newest" },
                    { label: "Oldest Joined", value: "oldest" },
                    { label: "Name A-Z", value: "name" }
                ]}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                placeholder="Search customers by name, phone or email..."
            />

            <div className="bg-background/90 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing CRM Core...</span>
                    </div>
                ) : (
                    <CustomersTable customers={processedCustomers} />
                )}
            </div>
        </div>
    );
}
