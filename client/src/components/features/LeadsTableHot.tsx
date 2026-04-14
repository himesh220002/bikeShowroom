"use client";
import { Rocket, Phone, MessageSquare, MoreVertical, Flame, Calendar, Users, Clock, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ExportButton } from "@/components/ui/ExportButton";
import { useState, useMemo } from "react";
import { API_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "@/components/providers/ConfigProvider";
import { BIKES } from "@/lib/constants/bikes";

export interface Lead {
    _id: string;
    customerId: {
        _id: string;
        name: string;
        phone: string;
    };
    inquiryIds: any[];
    leadStage: string;
    updatedAt: string;
}

interface LeadsTableHotProps {
    leads: Lead[];
    onUpdate?: () => void;
}

export function LeadsTableHot({ leads, onUpdate }: LeadsTableHotProps) {
    const { config } = useConfig();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const refreshLeads = () => {
        if (onUpdate) onUpdate();
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedLeads = useMemo(() => {
        return [...leads].sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            let aVal: any = "";
            let bVal: any = "";

            if (key === 'name') {
                aVal = a.customerId.name.toLowerCase();
                bVal = b.customerId.name.toLowerCase();
            } else if (key === 'phone') {
                aVal = a.customerId.phone;
                bVal = b.customerId.phone;
            } else if (key === 'leadStage') {
                aVal = a.leadStage.toLowerCase();
                bVal = b.leadStage.toLowerCase();
            } else if (key === 'updatedAt') {
                aVal = new Date(a.updatedAt).getTime();
                bVal = new Date(b.updatedAt).getTime();
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [leads, sortConfig]);

    const totalPages = Math.ceil(leads.length / pageSize);
    const currentLeads = sortedLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleWhatsApp = (lead: Lead) => {
        // Find the last inquiry bike or a default
        const bikeName = "Yamaha Bikes";
        const { showroomPhone, showroomEmail, showroomAddress, showroomMap } = config || {};
        const displayPhone = showroomPhone || "7004100062";
        const displayEmail = showroomEmail || "choudharyyamaha.ktr@gmail.com";

        const intro = `Hello ${lead.customerId.name}! This is Choudhary Yamaha.\n\nWe noticed your recurring interest! We'd love to invite you for a priority VIP experience at our showroom.`;
        const showroomDetails = `\n\n🏍️ Choudhary Yamaha Showroom\nAddress: ${showroomAddress || "Manihari Mor, Mirchaibari, Katihar"}\nContact: ${displayPhone}\nEmail: ${displayEmail}`;
        const footer = `\n\nWhen would you like to visit? We're ready to assist you!`;

        const message = intro + showroomDetails + footer;
        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = lead.customerId.phone.replace(/\D/g, '');
        const phoneWithCountry = (cleanPhone.length === 10) ? `91${cleanPhone}` : cleanPhone;
        const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCall = (lead: Lead) => {
        window.location.href = `tel:${lead.customerId.phone}`;
    };

    const handleDiscardLead = async (id: string) => {
        if (!window.confirm("Are you sure you want to discard this hot lead? This action cannot be undone.")) return;
        try {
            const res = await fetch(`${API_URL}/qualified-leads/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) refreshLeads();
        } catch (err) {
            console.error("Error discarding hot lead:", err);
        }
    };

    const handleStageUpdate = async (id: string, stage: string) => {
        try {
            const res = await fetch(`${API_URL}/qualified-leads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadStage: stage })
            });
            const data = await res.json();
            if (data.success) refreshLeads();
        } catch (err) {
            console.error("Error updating lead stage:", err);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                            PRIORITY PROSPECTS
                        </h2>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">High conversion repeat inquiries ({leads.length} Records)</p>
                    </div>
                </div>

                <ExportButton
                    data={leads}
                    filename="Yamaha_HotLeads_Report"
                    sheetName="HotLeads"
                />
            </div>

            <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse min-w-[1400px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[250px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">
                                    Prospect Name
                                    {sortConfig?.key === 'name' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('phone')}>
                                <div className="flex items-center gap-1">
                                    Phone Number
                                    {sortConfig?.key === 'phone' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px] text-center">Inquiry Velovity</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('leadStage')}>
                                <div className="flex items-center justify-center gap-1">
                                    Engagement Status
                                    {sortConfig?.key === 'leadStage' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('updatedAt')}>
                                <div className="flex items-center gap-1">
                                    Last Activity
                                    {sortConfig?.key === 'updatedAt' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[150px] text-center">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLeads.map((lead) => (
                            <tr key={lead._id} className="border-b border-border/30 group hover:bg-orange-500/[0.02] transition-colors">
                                <td className="py-3 px-4 border-r border-border/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-orange-500/20">
                                            {lead.customerId.name.charAt(0)}
                                        </div>
                                        <p className="text-[13px] font-black text-foreground uppercase tracking-tight truncate">{lead.customerId.name}</p>
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10">
                                    <div
                                        className="inline-flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-colors uppercase tracking-wider text-[12px] font-bold text-muted-foreground"
                                        onClick={() => handleCall(lead)}
                                    >
                                        <Phone className="w-3.5 h-3.5 opacity-40" />
                                        {lead.customerId.phone}
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[14px] font-black text-orange-600">
                                                {lead.inquiryIds.length}
                                            </div>
                                            {lead.inquiryIds.length > 2 && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Inquiries</span>
                                            <span className="text-[7px] font-bold text-orange-500 uppercase tracking-widest opacity-60">High Priority</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <select
                                        value={lead.leadStage}
                                        onChange={(e) => handleStageUpdate(lead._id, e.target.value)}
                                        className={cn(
                                            "border text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full outline-none cursor-pointer transition-all",
                                            lead.leadStage === "hot" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                                lead.leadStage === "already converted" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                                    "bg-muted text-muted-foreground border-border"
                                        )}
                                    >
                                        <option value="hot">🔥 HOT</option>
                                        <option value="cold">❄️ COLD</option>
                                        <option value="already converted">✅ CONVERTED</option>
                                        <option value="discarded by customer">❌ DISCARDED</option>
                                    </select>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-muted-foreground/40" />
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                            {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            <span className="ml-1 opacity-50">{new Date(lead.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </span>
                                    </div>
                                </td>

                                <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleWhatsApp(lead)}
                                            className="p-2.5 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 text-racing-blue transition-all group/btn"
                                            title="WhatsApp Pulse"
                                        >
                                            <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleCall(lead)}
                                            className="p-2.5 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 text-green-600 transition-all group/btn"
                                            title="Direct Line"
                                        >
                                            <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        </button>

                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === lead._id ? null : lead._id)}
                                                className={cn(
                                                    "p-2.5 rounded-xl border border-border hover:bg-muted/30 transition-all text-muted-foreground",
                                                    openMenuId === lead._id && "bg-muted"
                                                )}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            <AnimatePresence>
                                                {openMenuId === lead._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 py-1 overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDiscardLead(lead._id); setOpenMenuId(null); }}
                                                                className="flex items-center gap-2 w-full px-4 py-3 text-[9px] font-black uppercase text-left hover:bg-red-500/10 transition-colors text-red-500/80 hover:text-red-500"
                                                            >
                                                                <Rocket className="w-4 h-4" />
                                                                Discard Action
                                                            </button>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border border-border rounded-xl">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        Prospects Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1.5 bg-card border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 transition-all"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1.5 bg-card border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 bg-orange-500/[0.03] border border-orange-500/10 rounded-2xl">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600/60 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    High Velocity Prospects • Priority Accelerated View
                </div>
            </div>
        </div>
    );
}
