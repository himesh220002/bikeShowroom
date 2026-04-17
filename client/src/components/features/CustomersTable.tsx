"use client";

import { User, Phone, Bike, Calendar, Wrench, MessageSquare, History, ShoppingCart, Star, MapPin, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExportButton } from "@/components/ui/ExportButton";
import { CustomerEditModal } from "./CustomerEditModal";
import { useConfig } from "@/components/providers/ConfigProvider";

interface CustomerCRM {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    preferredContact?: string;
    lifetimeValue?: number;
    feedbackScore?: number;
    lastSale: {
        bikeName: string;
        variant: string;
        salePrice: string;
        saleDate: string;
        createdAt: string;
    } | null;
    nextServiceDue: string | null;
    serviceMilestone: string;
    isFreeService: boolean;
    serviceHistory: {
        totalCount: number;
        latest: {
            status: string;
            date: string;
        } | null;
    };
}

interface CustomersTableProps {
    customers: CustomerCRM[];
    isCampaignMode?: boolean;
    selectedCustomers?: string[];
    onSelectionChange?: (ids: string[]) => void;
    onUpdate?: () => void;
}

export function CustomersTable({
    customers,
    isCampaignMode,
    selectedCustomers = [],
    onSelectionChange,
    onUpdate
}: CustomersTableProps) {
    const { config } = useConfig();
    const [editingCustomer, setEditingCustomer] = useState<CustomerCRM | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

    const sortedCustomers = useMemo(() => {
        return [...customers].sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            let aVal: any = "";
            let bVal: any = "";

            if (key === 'name') {
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
            } else if (key === 'bikeModel') {
                aVal = (a.lastSale?.bikeName || "").toLowerCase();
                bVal = (b.lastSale?.bikeName || "").toLowerCase();
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [customers, sortConfig]);

    const totalPages = Math.ceil(sortedCustomers.length / pageSize);
    const currentCustomers = sortedCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleWhatsApp = (customer: CustomerCRM) => {
        const { showroomPhone, showroomEmail, showroomAddress } = config || {};
        const displayPhone = showroomPhone || "7004100062";
        const displayEmail = showroomEmail || "choudharyyamaha.ktr@gmail.com";

        const milestone = customer.serviceMilestone || "Periodic Maintenance";
        const dueDate = customer.nextServiceDue ? new Date(customer.nextServiceDue).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : "soon";

        const message = `Hello ${customer.name}! 

This is Choudhary Yamaha, Katihar. We are checking in to see how your ${customer.lastSale?.bikeName || "Yamaha machine"} is performing.

🚀 Your **${milestone}** is scheduled for **${dueDate}**.

Periodic service is vital to keep your machine in peak condition and maintain its warranty. ${customer.isFreeService ? "Since this is a **FREE SERVICE**." : ""}

📍 Address: ${showroomAddress || "Manihari Mor, Mirchaibari, Katihar"}
📞 Contact: ${displayPhone}

Reply to this message to confirm your appointment!`;

        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = customer.phone.replace(/\D/g, '');
        const phoneWithCountry = (cleanPhone.length === 10) ? `91${cleanPhone}` : cleanPhone;
        const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    if (customers.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <User className="w-12 h-12 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No customers found in CRM</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <UserCircle className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">CRM Master Database</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{customers.length} Verified Records</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isCampaignMode && (
                        <button
                            onClick={() => onSelectionChange?.(selectedCustomers.length === customers.length ? [] : customers.map(c => c._id))}
                            className="px-4 py-2 bg-muted border border-border rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all"
                        >
                            {selectedCustomers.length === customers.length ? "Deselect All" : "Select All"}
                        </button>
                    )}
                    <ExportButton
                        data={customers}
                        filename="Yamaha_CRM_Export"
                        sheetName="CRM_Contacts"
                    />
                </div>
            </div>

            <div className="overflow-x-auto min-h[300px] border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[1800px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {isCampaignMode && <th className="py-4 px-4 w-[60px] text-center border-r border-border/10">#</th>}
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[200px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">
                                    Owner Name
                                    {sortConfig?.key === 'name' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Phone Number</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[250px]">Residing Address</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center">Pref Contact</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('bikeModel')}>
                                <div className="flex items-center gap-1">
                                    Primary Machine
                                    {sortConfig?.key === 'bikeModel' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center">Purchase Dt</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center">Lifetime Value</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center">Rating</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] text-center">Service Due</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[150px] text-center">Milestone</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[150px] text-center">Engagement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.map((customer) => (
                            <tr key={customer._id} className={cn(
                                "border-b border-border/30 group hover:bg-muted/10 transition-colors",
                                selectedCustomers.includes(customer._id) && "bg-racing-blue/5"
                            )}>
                                {isCampaignMode && (
                                    <td className="py-3 px-4 border-r border-border/10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) onSelectionChange?.([...selectedCustomers, customer._id]);
                                                else onSelectionChange?.(selectedCustomers.filter(id => id !== customer._id));
                                            }}
                                            className="w-4 h-4 rounded border-border accent-racing-blue cursor-pointer"
                                        />
                                    </td>
                                )}

                                <td className="py-3 px-4 border-r border-border/10">
                                    <p className="text-[13px] font-black text-foreground uppercase tracking-tight truncate">{customer.name}</p>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 uppercase tracking-wider text-[12px] font-bold text-muted-foreground">
                                    {customer.phone}
                                </td>

                                <td className="py-3 px-4 border-r border-border/10">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-muted-foreground/30 flex-shrink-0" />
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase truncate">{customer.address || "—"}</p>
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{customer.preferredContact || "Phone"}</span>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10">
                                    <div className="flex items-center gap-2">
                                        <Bike className="w-3.5 h-3.5 text-racing-blue/40" />
                                        <p className="text-[13px] font-black text-foreground uppercase tracking-tighter italic truncate">{customer.lastSale?.bikeName || "N/A"}</p>
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
                                    {customer.lastSale ? new Date(customer.lastSale.saleDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "—"}
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <div className="text-[12px] font-black text-racing-blue italic">
                                        ₹{(customer.lifetimeValue || 0).toLocaleString('en-IN')}
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <div className="flex items-center justify-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-2 h-2", i < (customer.feedbackScore || 0) ? "fill-amber-400 text-amber-400" : "text-muted/20")} />
                                        ))}
                                    </div>
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    {customer.nextServiceDue ? (
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className={cn(
                                                "text-[11px] font-black uppercase tracking-widest",
                                                new Date() > new Date(customer.nextServiceDue) ? "text-red-500" : "text-emerald-500"
                                            )}>
                                                {new Date(customer.nextServiceDue).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <div className={cn(
                                                "w-1 h-1 rounded-full",
                                                new Date() > new Date(customer.nextServiceDue) ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                                            )} />
                                        </div>
                                    ) : <span className="text-[9px] text-muted-foreground/30 font-black">N/A</span>}
                                </td>

                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className={cn(
                                        "text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest",
                                        customer.isFreeService ? "bg-racing-blue/5 border-racing-blue/20 text-racing-blue" : "bg-muted border-border/50 text-muted-foreground"
                                    )}>
                                        {customer.serviceMilestone || "—"}
                                    </span>
                                </td>

                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => { setEditingCustomer(customer); setOpenMenuId(null); }}
                                            className="p-1.5 border border-border rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-racing-blue"
                                            title="View History"
                                        >
                                            <History className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleWhatsApp(customer)}
                                            className="p-1.5 border border-border rounded-lg hover:bg-green-500/10 hover:border-green-500/50 text-green-600 transition-all"
                                            title="WhatsApp"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `tel:${customer.phone}`}
                                            className="p-1.5 border border-border rounded-lg hover:bg-racing-blue/10 hover:border-racing-blue/50 text-racing-blue transition-all"
                                            title="Call"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
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
                        Profiles Page {currentPage} of {totalPages}
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

            {editingCustomer && (
                <CustomerEditModal
                    customer={editingCustomer}
                    isOpen={!!editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    onUpdate={() => onUpdate?.()}
                />
            )}
        </div>
    );
}
