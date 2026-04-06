"use client";

import { CheckCircle2, MoreVertical, Phone, MessageSquare, Users, Edit3, Save, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BIKES } from "@/lib/constants/bikes";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import { ExportButton } from "@/components/ui/ExportButton";
import { LeadEditModal } from "./LeadEditModal";
import { LeadAddModal } from "./LeadAddModal";

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
    adminNotes?: string;
    createdAt?: string;
}

interface LeadsTableProps {
    leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
    const [config, setConfig] = useState<any>(null);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedBrochure, setSelectedBrochure] = useState<{ [key: string]: string }>({});
    const [editingRemarks, setEditingRemarks] = useState<{ [key: string]: string }>({});
    const [showSaveIcon, setShowSaveIcon] = useState<{ [key: string]: boolean }>({});

    // For Escalation
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [escalationData, setEscalationData] = useState<any>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(leads.length / pageSize);
    const currentLeads = leads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const refreshLeads = () => {
        window.location.reload();
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
                // Success - update local state? For now just refresh or clear showSaveIcon
                setShowSaveIcon(prev => ({ ...prev, [id]: false }));
            }
        } catch (err) {
            console.error("Error updating lead:", err);
        }
    };

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_URL}/config`);
                const data = await res.json();
                if (data.success) setConfig(data.data);
            } catch (err) {
                console.error("Failed to fetch showroom config:", err);
            }
        };
        fetchConfig();
    }, []);

    const handleWhatsApp = (lead: Lead) => {
        const bikeName = lead.interests[0];
        let brochurePageUrl = "";
        let bike = null;

        // Use manually selected brochure if available
        const selected = selectedBrochure[lead._id || lead.id || ""];
        if (selected) {
            bike = BIKES.find(b => b.name === selected || b.slug === selected);
        } else {
            // Fallback to auto-calculation based on first interest
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

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center m-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-racing-blue/10 rounded-lg">
                        <Users className="w-5 h-5 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Active Leads</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{leads.length} Prospective Customers</p>
                    </div>
                </div>
                <ExportButton
                    data={leads}
                    filename="Yamaha_Leads_Report"
                    sheetName="Leads"
                />
            </div>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prospect</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interest</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Follow-up / Schedule</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remarks / Response</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLeads.map((lead) => (
                            <tr key={lead._id || lead.id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                                <Users className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            {lead.score !== undefined && (
                                                <div className="mt-2 w-full max-w-[60px] group/score relative">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[7px] font-black uppercase tracking-tighter text-muted-foreground/50">Score</span>
                                                        <span className="text-[7px] font-black text-foreground">{lead.score}</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                lead.score > 7 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                                                                    lead.score > 4 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" :
                                                                        "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                                            )}
                                                            style={{ width: `${(lead.score || 0) * 10}%` }}
                                                        />
                                                    </div>
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/score:block z-50">
                                                        <div className="bg-black/90 text-white text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded whitespace-nowrap">
                                                            Lead Quality: {lead.heat} ({lead.score}/10)
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{lead.name}</p>
                                            <div
                                                className="flex items-center gap-2 mt-1 cursor-pointer hover:text-racing-blue transition-colors group/phone"
                                                onClick={() => handleCall(lead)}
                                            >
                                                <Phone className="w-3 h-3 text-muted-foreground/60 group-hover/phone:text-racing-blue" />
                                                <span className="text-[14px] font-bold text-muted-foreground group-hover/phone:text-racing-blue">{lead.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex flex-wrap gap-1">
                                        {lead.interests.map((interest) => (
                                            <span key={interest} className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 group/date relative">
                                            {lead.followUpDate ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">
                                                        {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-racing-blue uppercase tracking-widest opacity-60">
                                                        {new Date(lead.followUpDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingLead(lead)}
                                                    className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/40 hover:text-racing-blue transition-colors uppercase tracking-widest italic"
                                                >
                                                    <Calendar className="w-3 h-3" />
                                                    Set Schedule
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingLead(lead)}
                                                className="hidden group-hover/date:flex absolute -right-6 p-1.5 bg-card border border-border rounded-lg shadow-xl hover:bg-muted transition-all z-10"
                                            >
                                                <Edit3 className="w-3 h-3 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-2">
                                        <textarea
                                            value={editingRemarks[lead._id || lead.id || ""] ?? lead.adminNotes ?? ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const id = lead._id || lead.id || "";
                                                setEditingRemarks(prev => ({ ...prev, [id]: val }));
                                                setShowSaveIcon(prev => ({ ...prev, [id]: val !== (lead.adminNotes || "") }));
                                            }}
                                            placeholder="Add remarks..."
                                            rows={1}
                                            className="w-full max-w-[200px] bg-transparent border-none text-xs font-bold text-foreground outline-none resize-none focus:bg-muted/50 p-1 rounded transition-all placeholder:italic placeholder:font-normal"
                                        />
                                        {showSaveIcon[lead._id || lead.id || ""] && (
                                            <button
                                                onClick={() => handleUpdateLead(lead._id || lead.id || "", { adminNotes: editingRemarks[lead._id || lead.id || ""] })}
                                                className="p-1 bg-racing-blue text-white rounded hover:bg-dark-racing transition-all animate-bounce"
                                            >
                                                <Save className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        lead.status === "New" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" :
                                            lead.status === "Contacted" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                                                lead.status === "Test Ride" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" :
                                                    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                    )}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="py-6 px-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleWhatsApp(lead)}
                                            className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all"
                                            title="Send WhatsApp Brochure"
                                        >
                                            <MessageSquare className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleCall(lead)}
                                            className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all"
                                            title="Call Prospect"
                                        >
                                            <Phone className="w-4 h-4 text-green-400 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEscalationData({
                                                    name: lead.name,
                                                    phone: lead.phone,
                                                    interests: lead.interests,
                                                    adminNotes: lead.adminNotes
                                                });
                                                setIsAddModalOpen(true);
                                            }}
                                            className="p-2 rounded-xl border border-border hover:bg-orange-500/10 hover:border-orange-500/50 group/escalate transition-all"
                                            title="Escalate to Hot Lead"
                                        >
                                            <UserPlus className="w-4 h-4 text-orange-500 group-hover:escalate:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => setEditingLead(lead)}
                                            className="p-2 rounded-xl border border-border hover:bg-muted/30 transition-all"
                                            title="Edit Lead Details"
                                        >
                                            <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === (lead._id || lead.id) ? null : (lead._id || lead.id || null))}
                                                className={cn(
                                                    "p-2 rounded-xl border border-border hover:bg-muted/30 transition-all",
                                                    openMenuId === (lead._id || lead.id) && "bg-muted shadow-inner border-racing-blue/30"
                                                )}
                                            >
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </button>

                                            {openMenuId === (lead._id || lead.id) && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <div className="px-4 py-2 border-b border-border/50 mb-1">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Select Brochure</p>
                                                        <select
                                                            className="w-full mt-1 bg-transparent border-none text-[10px] font-bold text-foreground outline-none cursor-pointer"
                                                            value={selectedBrochure[lead._id || lead.id || ""] || ""}
                                                            onChange={(e) => {
                                                                setSelectedBrochure({ ...selectedBrochure, [lead._id || lead.id || ""]: e.target.value });
                                                            }}
                                                        >
                                                            <option value="">Default (Interest)</option>
                                                            {BIKES.map(b => (
                                                                <option key={b.slug} value={b.name}>{b.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setEditingLead(lead);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors flex items-center justify-between"
                                                    >
                                                        Full Edit <Edit3 className="w-3 h-3 text-muted-foreground" />
                                                    </button>
                                                    <button className="w-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors text-red-500/80 hover:text-red-500">
                                                        Discard Lead
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center opacity-30 italic text-sm font-medium">
                                    No fresh leads detected in the stream...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, leads.length)} of {leads.length} leads
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "w-8 h-8 rounded-xl text-[10px] font-black transition-all border",
                                    currentPage === i + 1
                                        ? "bg-racing-blue text-white border-racing-blue shadow-lg shadow-racing-blue/20"
                                        : "bg-card border-border hover:bg-muted"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
