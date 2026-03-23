"use client";

import { Rocket, Phone, MessageSquare, MoreVertical, Flame, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                    <tr>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Prospect</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inquiry Count</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Priority</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Last Activity</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {leads.map((lead) => (
                        <tr key={lead._id} className="group hover:bg-orange-500/5 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white mb-0.5">{lead.customerId.name}</span>
                                    <span className="text-[10px] text-gray-500 font-bold tracking-wider">{lead.customerId.phone}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white border border-zinc-700">
                                        {lead.inquiryIds.length}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Repeat Requests</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 w-fit px-3 py-1 rounded-full">
                                    <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">
                                        {lead.leadStage}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-medium">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest transition-all">
                                        Assign Rep
                                    </button>
                                    <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                                        <Phone className="w-4 h-4 text-racing-blue" />
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
                            <td colSpan={5} className="px-8 py-20 text-center opacity-30 italic text-sm font-medium">
                                No prospects have reached the "Hot" threshold yet...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
