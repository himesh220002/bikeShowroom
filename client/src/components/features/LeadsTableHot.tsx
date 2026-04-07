"use client";

import { Rocket, Phone, MessageSquare, MoreVertical, Flame, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ExportButton } from "@/components/ui/ExportButton";

import { useState } from "react";
import { API_URL } from "@/lib/config";

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
}

export function LeadsTableHot({ leads }: LeadsTableHotProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const refreshLeads = () => {
        window.location.reload();
    };

    const handleDiscardLead = async (id: string) => {
        if (!window.confirm("Are you sure you want to discard this hot lead? This action cannot be undone.")) return;
        try {
            const res = await fetch(`${API_URL}/qualified-leads/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                refreshLeads();
            }
        } catch (err) {
            console.error("Error discarding hot lead:", err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Hot Leads</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{leads.length} High Priority Prospect</p>
                    </div>
                </div>
                <ExportButton
                    data={leads}
                    filename="Yamaha_HotLeads_Report"
                    sheetName="HotLeads"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority Prospect</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activity</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inquiry Details</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Escalation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead._id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                            <Users className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{lead.customerId.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="w-3 h-3 text-muted-foreground/60" />
                                                <span className="text-[10px] font-bold text-muted-foreground">{lead.customerId.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black text-foreground border border-border">
                                            {lead.inquiryIds.length}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Repeat Requests</span>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 w-fit px-3 py-1 rounded-full">
                                        <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
                                            {lead.leadStage}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-6 px-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all">
                                            <MessageSquare className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === lead._id ? null : lead._id)}
                                                className={cn(
                                                    "p-2 rounded-xl border border-border hover:bg-muted/30 transition-all",
                                                    openMenuId === lead._id && "bg-muted shadow-inner border-racing-blue/30"
                                                )}
                                            >
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </button>

                                            {openMenuId === lead._id && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <button
                                                        onClick={() => handleDiscardLead(lead._id)}
                                                        className="w-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-left hover:bg-red-500/10 transition-colors text-red-500/80 hover:text-red-500"
                                                    >
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
                                <td colSpan={5} className="px-8 py-20 text-center opacity-30 italic text-sm font-medium">
                                    No prospects have reached the "Hot" threshold yet...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
