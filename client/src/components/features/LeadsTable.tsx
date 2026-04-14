"use client";

import { CheckCircle2, MoreVertical, Phone, MessageSquare, Users, Edit3, Save, Calendar, UserPlus, Clock, Hash, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BIKES } from "@/lib/constants/bikes";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/config";
import { ExportButton } from "@/components/ui/ExportButton";
import { LeadEditModal } from "./LeadEditModal";
import { LeadAddModal } from "./LeadAddModal";
import { useConfig } from "@/components/providers/ConfigProvider";

export interface Lead {
    _id?: string;
    id?: string;
    name: string;
    phone: string;
    interests: string[];
    status: string;
    source: string;
    followUpDate?: string;
    assignedAgent?: string;
    score?: number;
    heat?: string;
    notifyWhenAvailable?: boolean;
    preferredColor?: string;
    adminNotes?: string;
    createdAt?: string;
}

interface LeadsTableProps {
    leads: Lead[];
    onUpdate?: () => void;
}

export function LeadsTable({ leads, onUpdate }: LeadsTableProps) {
    const { config } = useConfig();
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedBrochure, setSelectedBrochure] = useState<{ [key: string]: string }>({});
    const [editingRemarks, setEditingRemarks] = useState<{ [key: string]: string }>({});
    const [showSaveIcon, setShowSaveIcon] = useState<{ [key: string]: boolean }>({});

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [escalationData, setEscalationData] = useState<any>(null);

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const sortedLeads = useMemo(() => {
        return [...leads].sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            let aVal: any = (a as any)[key] || "";
            let bVal: any = (b as any)[key] || "";

            if (key === 'heat') {
                const order: any = { 'HOT': 3, 'WARM': 2, 'COLD': 1 };
                aVal = order[a.heat || 'COLD'] || 0;
                bVal = order[b.heat || 'COLD'] || 0;
            } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [leads, sortConfig]);

    const totalPages = Math.ceil(sortedLeads.length / pageSize);
    const currentLeads = sortedLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const refreshLeads = () => {
        if (onUpdate) onUpdate();
    };

    const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
        try {
            const res = await fetch(`${API_URL}/leads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            if (data.success) {
                setShowSaveIcon(prev => ({ ...prev, [id]: false }));
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            console.error("Error updating lead:", err);
        }
    };

    const handleWhatsApp = (lead: Lead) => {
        const bikeName = lead.interests[0];
        let brochurePageUrl = "";
        let bike = null;

        const selected = selectedBrochure[lead._id || lead.id || ""];
        if (selected) {
            bike = BIKES.find(b => b.name === selected || b.slug === selected);
        } else {
            bike = BIKES.find(b =>
                b.name.toLowerCase() === bikeName?.toLowerCase() ||
                b.slug === bikeName?.toLowerCase().replace(/\s+/g, '-')
            );
        }

        if (bike && bike.brochureUrl) {
            brochurePageUrl = `${window.location.origin}/brochure/${bike.slug}`;
        }

        const { showroomPhone, showroomEmail, showroomAddress, showroomMap } = config || {};
        const displayPhone = showroomPhone || "7004100062";
        const displayEmail = showroomEmail || "choudharyyamaha.ktr@gmail.com";

        const intro = `Hello! Thank you for reaching out to Choudhary Yamaha.\n\nWe have received your inquiry and we’re excited to assist you.\nOur showroom details are as follows:`;
        const showroomDetails = `\n\n🏍️ Choudhary Yamaha Showroom\nAddress: ${showroomAddress || "Manihari Mor, Mirchaibari, Katihar"}\nContact: ${displayPhone}\nEmail: ${displayEmail}\n${showroomMap ? `Map: ${showroomMap}` : ""}`;
        const visitInvite = `\n\nWe invite you to visit our showroom to experience the Yamaha ${bikeName || "bikes"} and other models in person.\nYou can also book a free test ride and connect directly with our team for guidance.`;
        const brochurePart = brochurePageUrl ? `\n\nClick the link below for the official PDF brochure with full specs and features:\n${brochurePageUrl}` : "";
        const footer = `\n\nWe look forward to welcoming you soon at Choudhary Yamaha!`;

        const message = intro + showroomDetails + visitInvite + brochurePart + footer;
        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = lead.phone.replace(/\D/g, '');
        const phoneWithCountry = (cleanPhone.length === 10) ? `91${cleanPhone}` : cleanPhone;
        const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCall = (lead: Lead) => {
        window.location.href = `tel:${lead.phone}`;
    };

    const handleDiscardLead = async (id: string) => {
        if (!window.confirm("Are you sure you want to discard this lead? This action cannot be undone.")) return;
        try {
            const res = await fetch(`${API_URL}/leads/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) refreshLeads();
        } catch (err) {
            console.error("Error discarding lead:", err);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <Users className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                            INQUIRY STREAM
                        </h2>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Central feed for all customer pre-sales inquiries</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ExportButton
                        data={leads}
                        filename="Yamaha_Leads_Report"
                        sheetName="Leads"
                    />
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-racing-blue/20"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        Take Manual Inquiry
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[1800px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">
                                    Lead Name
                                    {sortConfig?.key === 'name' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('phone')}>
                                <div className="flex items-center gap-1">
                                    Phone Number
                                    {sortConfig?.key === 'phone' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[100px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('score')}>
                                <div className="flex items-center justify-center gap-1">
                                    Score
                                    {sortConfig?.key === 'score' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('heat')}>
                                <div className="flex items-center justify-center gap-1">
                                    Quality
                                    {sortConfig?.key === 'heat' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[200px]">Interests</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px]">Apt Date</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[100px]">Apt Time</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[150px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('status')}>
                                <div className="flex items-center justify-center gap-1">
                                    Status
                                    {sortConfig?.key === 'status' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[300px]">Admin Remarks</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[180px] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLeads.map((lead) => {
                            const leadId = lead._id || lead.id || "";
                            return (
                                <tr key={leadId} className="border-b border-border/30 group hover:bg-muted/10 transition-colors">
                                    {/* Name */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-[12px] font-black text-foreground uppercase tracking-tight truncate">{lead.name}</p>
                                            {lead.notifyWhenAvailable && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded text-[8px] font-black uppercase animate-pulse">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    WAITLIST
                                                </div>
                                            )}
                                            {lead.preferredColor && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-racing-blue/10 text-racing-blue border border-racing-blue/20 rounded text-[8px] font-black uppercase">
                                                    🎨 {lead.preferredColor}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Phone */}
                                    <td className="py-3 px-4 border-r border-border/10 uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer hover:text-racing-blue transition-colors"
                                            onClick={() => handleCall(lead)}
                                        >
                                            <Phone className="w-3 h-3 opacity-40" />
                                            {lead.phone}
                                        </div>
                                    </td>

                                    {/* Score */}
                                    <td className="py-3 px-4 border-r border-border/10 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-black text-foreground">{lead.score || 0}/10</span>
                                            <div className="h-1 w-12 bg-muted rounded-full overflow-hidden border border-border/50">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        (lead.score || 0) > 7 ? "bg-red-500" :
                                                            (lead.score || 0) > 4 ? "bg-amber-500" : "bg-blue-500"
                                                    )}
                                                    style={{ width: `${(lead.score || 0) * 10}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Quality/Heat */}
                                    <td className="py-3 px-4 border-r border-border/10 text-center">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-[.2em] px-2 py-0.5 rounded border",
                                            lead.heat === 'HOT' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                lead.heat === 'WARM' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                    "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        )}>
                                            {lead.heat || 'COLD'}
                                        </span>
                                    </td>

                                    {/* Interests */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <div className="flex flex-wrap gap-1">
                                            {lead.interests.map((interest) => (
                                                <span key={interest} className="px-1.5 py-0.5 rounded bg-muted/50 text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Apt Date */}
                                    <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-muted-foreground/40" />
                                            <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                                {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Apt Time */}
                                    <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-muted-foreground/40" />
                                            <span className="text-[11px] font-bold text-muted-foreground">
                                                {lead.followUpDate ? new Date(lead.followUpDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 px-4 border-r border-border/10 text-center">
                                        <div
                                            className={cn(
                                                "text-wrap px-2 py-1 rounded-md text-xs font-black uppercase tracking-widest border whitespace-wrap",
                                                lead.status === "New"
                                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                                    : lead.status === "Contacted"
                                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                                        : lead.status === "Test Ride"
                                                            ? "bg-purple-500/10 text-purple-800 dark:text-purple-600 border-purple-500/20"
                                                            : lead.status === "Waiting for Availability"
                                                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                                                                : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                            )}
                                        >
                                            {lead.status}
                                        </div>
                                    </td>


                                    {/* Remarks */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <div className="flex items-center gap-2">
                                            <textarea
                                                value={editingRemarks[leadId] ?? lead.adminNotes ?? ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setEditingRemarks(prev => ({ ...prev, [leadId]: val }));
                                                    setShowSaveIcon(prev => ({ ...prev, [leadId]: val !== (lead.adminNotes || "") }));
                                                }}
                                                placeholder="Add internal remarks..."
                                                rows={1}
                                                className="w-full bg-transparent border-none text-[11px] font-bold text-foreground outline-none resize-none focus:bg-muted/50 p-1 rounded transition-all placeholder:italic placeholder:font-normal"
                                            />
                                            {showSaveIcon[leadId] && (
                                                <button
                                                    onClick={() => handleUpdateLead(leadId, { adminNotes: editingRemarks[leadId] })}
                                                    className="p-1 px-2 bg-racing-blue text-white rounded text-[8px] font-black uppercase tracking-widest animate-pulse"
                                                >
                                                    Save
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleWhatsApp(lead)}
                                                className="p-2 rounded-lg border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 text-racing-blue transition-all"
                                                title="WhatsApp Brochure"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleCall(lead)}
                                                className="p-2 rounded-lg border border-border hover:bg-green-500/10 hover:border-green-500/50 text-green-600 transition-all"
                                                title="Direct Call"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === leadId ? null : leadId)}
                                                    className={cn(
                                                        "p-2 rounded-lg border border-border hover:bg-muted/30 transition-all",
                                                        openMenuId === leadId && "bg-muted"
                                                    )}
                                                >
                                                    <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                                </button>

                                                <AnimatePresence>
                                                    {openMenuId === leadId && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 py-1 overflow-hidden"
                                                            >
                                                                <div className="px-4 py-2 border-b border-border/50 bg-muted/20">
                                                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Send Brochure</p>
                                                                    <select
                                                                        className="w-full bg-background border border-border rounded px-2 py-1 text-[9px] font-bold outline-none"
                                                                        value={selectedBrochure[leadId] || ""}
                                                                        onChange={(e) => setSelectedBrochure({ ...selectedBrochure, [leadId]: e.target.value })}
                                                                    >
                                                                        <option value="">Default (Interest)</option>
                                                                        {BIKES.map(b => <option key={b.slug} value={b.name}>{b.name}</option>)}
                                                                    </select>
                                                                </div>
                                                                <button
                                                                    onClick={() => { setEditingLead(lead); setOpenMenuId(null); }}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-[9px] font-black uppercase text-left hover:bg-muted transition-colors text-muted-foreground"
                                                                >
                                                                    <Edit3 className="w-3 h-3" />
                                                                    Edit Info
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEscalationData({ inquiryId: leadId, name: lead.name, phone: lead.phone, interests: lead.interests, adminNotes: lead.adminNotes });
                                                                        setIsAddModalOpen(true);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-[9px] font-black uppercase text-left hover:bg-orange-500/10 transition-colors text-orange-500"
                                                                >
                                                                    <UserPlus className="w-3 h-3" />
                                                                    Escalate Hot
                                                                </button>
                                                                <button
                                                                    onClick={() => { handleDiscardLead(leadId); setOpenMenuId(null); }}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-[9px] font-black uppercase text-left hover:bg-red-500/10 transition-colors text-red-500 mt-1 border-t border-border/30"
                                                                >
                                                                    Discard Lead
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border border-border rounded-xl">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        Spreadsheet Page {currentPage} of {totalPages}
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

            {/* Modals */}
            {editingLead && (
                <LeadEditModal
                    lead={editingLead}
                    isOpen={!!editingLead}
                    onClose={() => setEditingLead(null)}
                    onUpdate={refreshLeads}
                />
            )}

            {isAddModalOpen && (
                <LeadAddModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEscalationData(null);
                    }}
                    onUpdate={refreshLeads}
                    initialData={escalationData}
                />
            )}
        </div>
    );
}
