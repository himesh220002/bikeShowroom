"use client";

import { CheckCircle2, MoreVertical, Phone, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface Lead {
    _id?: string;
    id?: string;
    name: string;
    phone: string;
    interests: string[];
    status: string;
    source: string;
    createdAt?: string;
}

interface LeadsTableProps {
    leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prospect</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interest</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead._id || lead.id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{lead.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3 text-muted-foreground/60" />
                                            <span className="text-[10px] font-bold text-muted-foreground">{lead.phone}</span>
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
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                    lead.status === "New" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                        lead.status === "Contacted" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            lead.status === "Test Ride" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                "bg-green-500/10 text-green-400 border-green-500/20"
                                )}>
                                    {lead.status}
                                </span>
                            </td>
                            <td className="py-6 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all">
                                        <MessageSquare className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all">
                                        <Phone className="w-4 h-4 text-green-400 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-border hover:bg-muted/30 transition-all">
                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {leads.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-8 py-20 text-center opacity-30 italic text-sm font-medium">
                                No fresh leads detected in the stream...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
