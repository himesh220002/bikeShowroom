"use client";

import { CheckCircle2, MoreVertical, Phone, MessageSquare } from "lucide-react";
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
            <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                    <tr>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Customer</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Interests</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {leads.map((lead) => (
                        <tr key={lead._id || lead.id} className="group hover:bg-white/5 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white mb-0.5">{lead.name}</span>
                                    <span className="text-[10px] text-gray-500 font-bold tracking-wider">{lead.phone}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex flex-wrap gap-1">
                                    {lead.interests.map((interest) => (
                                        <span key={interest} className="px-2 py-0.5 rounded-md bg-zinc-800 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-8 py-5">
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
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                                        <Phone className="w-4 h-4 text-racing-blue" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                                        <MessageSquare className="w-4 h-4 text-green-400" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                                        <MoreVertical className="w-4 h-4 text-gray-500" />
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
