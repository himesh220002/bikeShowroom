"use client";

import { useEffect, useState, useMemo } from "react";
import { LeadsTable } from "@/components/features/LeadsTable";
import { RideRequestTable } from "@/components/features/RideRequestTable";
import { API_URL } from "@/lib/config";
import { Download, Plus, Loader2 } from "lucide-react";
import { AdminTableControls } from "@/components/ui/AdminTableControls";
import { LeadAddModal } from "@/components/features/LeadAddModal";

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filterStatus, setFilterStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/leads`);
            const data = await res.json();
            if (data.success) setLeads(data.data);
        } catch (err) {
            console.error("Failed to fetch leads:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const processedLeads = useMemo(() => {
        let filtered = [...leads];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.name?.toLowerCase().includes(q) ||
                l.phone?.toLowerCase().includes(q) ||
                l.interests?.join(" ").toLowerCase().includes(q)
            );
        }
        if (filterStatus !== "all") {
            filtered = filtered.filter(l => l.status === filterStatus);
        }
        if (startDate) {
            filtered = filtered.filter(l => new Date(l.createdAt || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(l => new Date(l.createdAt || 0) <= end);
        }
        return filtered.sort((a, b) => {
            if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }, [leads, searchQuery, filterStatus, sortBy, startDate, endDate]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-0 gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                        INQUIRY STREAM
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Central feed for all customer pre-sales inquiries</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-card border border-border text-muted-foreground rounded-xl hover:text-foreground transition-all">
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Lead
                    </button>
                </div>
            </div>

            <AdminTableControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: "Newest First", value: "newest" },
                    { label: "Oldest First", value: "oldest" },
                    { label: "Name A-Z", value: "name" }
                ]}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                filterOptions={[
                    { label: "All Status", value: "all" },
                    { label: "New", value: "New" },
                    { label: "Contacted", value: "Contacted" },
                    { label: "Test Ride", value: "Test Ride" },
                    { label: "Closed", value: "Closed" }
                ]}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                placeholder="Search leads by name, phone or bike..."
            />

            <div className="bg-background border border-border rounded-[1rem] pt-6 overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing CRM Data...</span>
                    </div>
                ) : (
                    <LeadsTable leads={processedLeads} />
                )}
            </div>

            {/* Ride Request Section */}
            <div className="pt-12 border-t border-border">
                <div className="bg-background border border-border rounded-[1rem] p-8 shadow-2xl overflow-hidden">
                    <RideRequestTable />
                </div>
            </div>

            <LeadAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onUpdate={fetchLeads}
            />
        </div>
    );
}
