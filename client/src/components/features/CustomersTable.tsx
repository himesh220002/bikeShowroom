"use client";

import { User, Phone, Bike, Calendar, Wrench, MessageSquare, History, ShoppingCart, Star, MapPin, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
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
    rating?: number;
    engagement?: number;
    milestone?: string;
    regNumber?: string;
    lastSale: {
        bikeName: string;
        variant: string;
        salePrice: string;
        saleDate: string;
        createdAt: string;
        chassisNumber?: string;
        registrationNumber?: string;
        engineNumber?: string;
        paymentMethod?: string;
        financeProvider?: string;
        invoiceNumber?: string;
        salesperson?: string;
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
                <table className="w-full text-left border-collapse min-w-[2800px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {isCampaignMode && <th className="py-4 px-4 w-[60px] text-center border-r border-border/10">#</th>}
                            {[
                                { label: "Owner Name", key: "name", w: "200px" },
                                { label: "Phone Number", key: "phone", w: "140px" },
                                { label: "Residing Address", key: "address", w: "250px" },
                                { label: "Pref Contact", key: "preferredContact", w: "120px" },
                                { label: "Primary Machine", key: "lastSale.bikeName", w: "180px" },
                                { label: "Variant", key: "lastSale.variant", w: "140px" },
                                { label: "Purchase Dt", key: "lastSale.saleDate", w: "130px" },
                                { label: "Lifetime Value", key: "lifetimeValue", w: "140px" },
                                { label: "Milestone", key: "serviceMilestone", w: "180px" },
                                { label: "Engagement", key: "engagement", w: "120px" },
                                { label: "Chassis #", key: "lastSale.chassisNumber", w: "180px" },
                                { label: "Registration #", key: "regNumber", w: "140px" },
                                { label: "Engine #", key: "lastSale.engineNumber", w: "180px" },
                                { label: "Sale Price", key: "lastSale.salePrice", w: "130px" },
                                { label: "Payment", key: "lastSale.paymentMethod", w: "120px" },
                                { label: "Finance Provider", key: "lastSale.financeProvider", w: "160px" },
                                { label: "Invoice #", key: "lastSale.invoiceNumber", w: "140px" },
                                { label: "Salesperson", key: "lastSale.salesperson", w: "160px" },
                                { label: "Rating", key: "rating", w: "100px" },
                                { label: "Service Due", key: "nextServiceDue", w: "130px" },
                                { label: "Action", key: "", w: "120px" }
                            ].map((col) => (
                                <th
                                    key={col.label}
                                    style={{ width: col.w }}
                                    onClick={() => col.key && handleSort(col.key)}
                                    className={cn(
                                        "py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 transition-colors group",
                                        col.key && "cursor-pointer hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.key && (
                                            sortConfig?.key === col.key ? (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                                            )
                                        )}
                                    </div>
                                </th>
                            ))}
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
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <p className="text-[13px] font-black text-racing-blue uppercase tracking-tighter italic truncate">{customer.lastSale?.bikeName || "N/A"}</p>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className="text-[10px] font-black text-racing-blue bg-racing-blue/5 px-2 py-0.5 rounded border border-racing-blue/10 uppercase">{customer.lastSale?.variant || "—"}</span>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
                                    {customer.lastSale ? new Date(customer.lastSale.saleDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <div className="text-[12px] font-black text-emerald-600 italic">
                                        ₹{formatPrice(customer.lifetimeValue || 0)}
                                    </div>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50 uppercase tracking-widest">
                                        {customer.milestone || "—"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-racing-blue" style={{ width: `${customer.engagement || 0}%` }} />
                                    </div>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center font-mono text-[10px] text-muted-foreground">
                                    {customer.lastSale?.chassisNumber || "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center font-black text-[11px] uppercase">
                                    {customer.regNumber || "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center font-mono text-[10px] text-muted-foreground">
                                    {customer.lastSale?.engineNumber || "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center font-black text-[11px]">
                                    {customer.lastSale ? `₹${formatPrice(customer.lastSale.salePrice)}` : "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className="text-[9px] font-black uppercase border border-border px-2 py-0.5 rounded text-muted-foreground">{customer.lastSale?.paymentMethod || "—"}</span>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center text-[10px] font-black text-amber-600 uppercase italic">
                                    {customer.lastSale?.financeProvider || "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center text-[10px] font-black text-muted-foreground">
                                    {customer.lastSale?.invoiceNumber || "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center text-[10px] font-bold text-muted-foreground italic">
                                    {customer.lastSale?.salesperson || "—"}
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <div className="flex items-center justify-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-2 h-2", i < (customer.rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted/20")} />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    {customer.nextServiceDue ? (
                                        <span className={cn(
                                            "text-[11px] font-black uppercase tracking-widest",
                                            new Date() > new Date(customer.nextServiceDue) ? "text-red-500" : "text-emerald-500"
                                        )}>
                                            {new Date(customer.nextServiceDue).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </span>
                                    ) : <span className="text-[9px] text-muted-foreground/30 font-black">N/A</span>}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => { setEditingCustomer(customer); setOpenMenuId(null); }}
                                            className="p-1.5 border border-border rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-racing-blue"
                                            title="Edit Profile"
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
