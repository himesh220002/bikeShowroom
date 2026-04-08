"use client";

import { useEffect, useState, useMemo } from "react";
import { CustomersTable } from "@/components/features/CustomersTable";
import { CampaignModal } from "@/components/features/CampaignModal";
import { API_URL } from "@/lib/config";
import { Loader2, Sparkles, X, MessageSquare, BarChart3 } from "lucide-react";
import { AdminTableControls } from "@/components/ui/AdminTableControls";
import { useRouter } from "next/navigation";
import { ExportButton } from "@/components/ui/ExportButton";
import { cn } from "@/lib/utils/cn";

export default function CRMPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isCampaignMode, setIsCampaignMode] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const router = useRouter();

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${API_URL}/customers`);
            const data = await res.json();
            if (data.success) setCustomers(data.data);
        } catch (err) {
            console.error("Failed to fetch CRM data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Handle URL search param for cross-linking
        const params = new URLSearchParams(window.location.search);
        const urlSearch = params.get('search');
        if (urlSearch) setSearchQuery(urlSearch);

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
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-racing-blue/10 rounded-2xl">
                        <BarChart3 className="w-6 h-6 text-racing-blue" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-black text-gradient uppercase tracking-tighter italic">
                            Relationship CRM
                        </h2>

                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Nurturing Relationships • Driving Growth</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/admin/crm/insights")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted hover:border-racing-blue/50 transition-all shadow-xl shadow-black/5"
                    >
                        <BarChart3 className="w-4 h-4 text-racing-blue" />
                        Intelligence
                    </button>

                    <button
                        onClick={() => {
                            setIsCampaignMode(!isCampaignMode);
                            if (isCampaignMode) setSelectedCustomers([]);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl",
                            isCampaignMode
                                ? "bg-red-600 text-white hover:bg-red-700 shadow-red-900/20"
                                : "bg-card border border-border text-foreground hover:bg-muted hover:border-racing-blue/50"
                        )}
                    >
                        {isCampaignMode ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-racing-blue" />}
                        {isCampaignMode ? "Exit Campaign" : "Campaign Blast"}
                    </button>

                    <ExportButton
                        data={processedCustomers}
                        filename="Yamaha_CRM_Export"
                        sheetName="Customers"
                    />
                </div>
            </div>

            {/* Controls */}
            <AdminTableControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: "Latest Joined", value: "newest" },
                    { label: "Early Adopters", value: "oldest" },
                    { label: "Alpha (A-Z)", value: "name" }
                ]}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                placeholder="Find customers by name, digits or email..."
            />

            {/* Main Table Container */}
            <div className="bg-background border border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px] relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-10 h-10 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Data Stream...</span>
                    </div>
                ) : (
                    <CustomersTable
                        customers={processedCustomers}
                        isCampaignMode={isCampaignMode}
                        selectedCustomers={selectedCustomers}
                        onSelectionChange={setSelectedCustomers}
                        onUpdate={fetchCustomers}
                    />

                )}
            </div>

            {/* Custom Bulk Action Bar */}
            {isCampaignMode && selectedCustomers.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-foreground text-background px-10 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-10 border border-white/10 backdrop-blur-2xl">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Audience Selected</span>
                            <span className="text-2xl font-display font-black italic tracking-tighter">{selectedCustomers.length} Profiles</span>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <button
                            onClick={() => setIsCampaignModalOpen(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-racing-blue text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-racing-blue/30"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Draft Campaign
                        </button>
                    </div>
                </div>
            )}

            <CampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
                recipientIds={selectedCustomers}
                onSuccess={() => {
                    setSelectedCustomers([]);
                    setIsCampaignMode(false);
                }}
            />
        </div>
    );
}
