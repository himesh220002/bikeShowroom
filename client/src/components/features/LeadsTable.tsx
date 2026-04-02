"use client";

import { CheckCircle2, MoreVertical, Phone, MessageSquare, Users, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BIKES } from "@/lib/constants/bikes";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import { ExportButton } from "@/components/ui/ExportButton";
import { LeadEditModal } from "./LeadEditModal";

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

    const refreshLeads = () => {
        // Since leads are passed as props, we need a way to refresh if we edit.
        // In a real app, we'd use a state management library or pass a refresh function.
        // For now, I'll assume the parent component will re-fetch or we can just reload.
        window.location.reload();
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
        // Attempt to find by name or slug
        const bike = BIKES.find(b =>
            b.name.toLowerCase() === bikeName.toLowerCase() ||
            b.slug === bikeName.toLowerCase().replace(/\s+/g, '-')
        );
        const brochureUrl = bike?.brochureUrl;

        const { showroomPhone, showroomEmail, showroomAddress, showroomMap } = config || {};
        const displayPhone = showroomPhone || "7004100062";
        const displayEmail = showroomEmail || "choudharyyamaha.ktr@gmail.com";

        const message = `Hello! Thank you for reaching out to Choudhary Yamaha.

We have received your inquiry and we’re excited to assist you. 
Our showroom details are as follows:

🏍️ Choudhary Yamaha Showroom  
Address: ${showroomAddress || "Manihari Mor, Mirchaibari, Katihar"}  
Contact: ${displayPhone}  
Email: ${displayEmail}  
${showroomMap ? `Map: ${showroomMap}` : ""}

We invite you to visit our showroom to experience the Yamaha ${bikeName} and other models in person. 
You can also book a free test ride at your convenience and connect directly with our team for guidance.

Please find attached our latest Yamaha brochure (PDF) with detailed specifications, features, and offers.
${brochureUrl || ""}

We look forward to welcoming you soon at Choudhary Yamaha!`;

        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = lead.phone.replace(/\D/g, '');
        // Add 91 prefix if not present and has 10 digits
        const phoneWithCountry = (cleanPhone.length === 10) ? `91${cleanPhone}` : cleanPhone;

        const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCall = (lead: Lead) => {
        window.location.href = `tel:${lead.phone}`;
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center mb-6">
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
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Follow-up</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Agent</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                            <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead._id || lead.id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                                <Users className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            {lead.score !== undefined && (
                                                <span className={cn(
                                                    "mt-1 text-[8px] font-black px-1.5 py-0.5 rounded border uppercase",
                                                    lead.heat === 'Hot' ? "text-red-500 border-red-500/20 bg-red-500/10" :
                                                        lead.heat === 'Warm' ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                                                            "text-blue-500 border-blue-500/20 bg-blue-500/10"
                                                )}>
                                                    Score: {lead.score}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{lead.name}</p>
                                            <div
                                                className="flex items-center gap-2 mt-1 cursor-pointer hover:text-racing-blue transition-colors group/phone"
                                                onClick={() => handleCall(lead)}
                                            >
                                                <Phone className="w-3 h-3 text-muted-foreground/60 group-hover/phone:text-racing-blue" />
                                                <span className="text-[10px] font-bold text-muted-foreground group-hover/phone:text-racing-blue">{lead.phone}</span>
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
                                        {lead.followUpDate ? (
                                            <>
                                                <span className="text-[10px] font-black text-foreground uppercase">
                                                    {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </span>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Scheduled</span>
                                            </>
                                        ) : (
                                            <span className="text-[9px] font-bold text-muted-foreground/40 italic uppercase tracking-widest">Not set</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                                        {lead.assignedAgent || "Unassigned"}
                                    </span>
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
                                            onClick={() => setEditingLead(lead)}
                                            className="p-2 rounded-xl border border-border hover:bg-muted/30 transition-all"
                                            title="Edit Lead Details"
                                        >
                                            <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
        </div>
    );
}
