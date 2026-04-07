import { User, Phone, Bike, Calendar, Wrench, MessageSquare, History, PlusCircle, MoreVertical, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { ExportButton } from "@/components/ui/ExportButton";
import { CustomerEditModal } from "./CustomerEditModal";

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

    const router = useRouter();
    const [config, setConfig] = useState<any>(null);
    const [editingCustomer, setEditingCustomer] = useState<CustomerCRM | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);


    const refreshData = () => {
        if (onUpdate) onUpdate();
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

    const handleCall = (customer: CustomerCRM) => {
        window.location.href = `tel:${customer.phone}`;
    };

    const handleService = () => {
        router.push("/service");
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
        <div className="space-y-3">
            <div className="flex justify-between items-center m-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <User className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Customer Database</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{customers.length} Verified Owners</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isCampaignMode && (
                        <button
                            onClick={() => {
                                if (selectedCustomers.length === customers.length) {
                                    onSelectionChange?.([]);
                                } else {
                                    onSelectionChange?.(customers.map(c => c._id));
                                }
                            }}
                            className="px-3 py-1.5 bg-muted border border-border rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-muted/50 transition-all"
                        >
                            {selectedCustomers.length === customers.length ? "Deselect All" : "Select All"}
                        </button>
                    )}
                    <ExportButton
                        data={customers}
                        filename="Yamaha_Customers_Report"
                        sheetName="Customers"
                    />
                </div>
            </div>

            <div className="overflow-x-auto pb-20">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-border text-center">
                            {isCampaignMode && (
                                <th className="py-4 px-4 w-[50px]">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomers.length === customers.length && customers.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onSelectionChange?.(customers.map(c => c._id));
                                            } else {
                                                onSelectionChange?.([]);
                                            }
                                        }}
                                        className="w-4 h-4 rounded border-border accent-racing-blue cursor-pointer"
                                    />
                                </th>
                            )}
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-left">Customer</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Contact Pref</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Last Purchase</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">LTV / Score</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Service Status</th>
                            <th className="py-4 px-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right w-[220px]">Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr
                                key={customer._id}
                                className={cn(
                                    "border-b border-border/30 group hover:bg-muted/30 transition-colors",
                                    selectedCustomers.includes(customer._id) && "bg-racing-blue/5 shadow-[inset_4px_0_0_0_#0056b3]"
                                )}
                            >
                                {isCampaignMode && (
                                    <td className="py-4 px-4 text-center">

                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onSelectionChange?.([...selectedCustomers, customer._id]);
                                                } else {
                                                    onSelectionChange?.(selectedCustomers.filter(id => id !== customer._id));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-border accent-racing-blue cursor-pointer"
                                        />
                                    </td>
                                )}
                                <td className="py-4 px-4">

                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border cursor-pointer hover:bg-racing-blue/20 transition-colors"
                                            onClick={() => handleCall(customer)}
                                        >
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-foreground leading-tight">{customer.name}</p>
                                            <div
                                                className="flex items-center gap-1.5 mt-0.5 cursor-pointer hover:text-racing-blue transition-colors group/phone"
                                                onClick={() => handleCall(customer)}
                                            >
                                                <Phone className="w-2.5 h-2.5 text-muted-foreground/60 group-hover/phone:text-racing-blue" />
                                                <span className="text-[12px] font-bold text-muted-foreground group-hover/phone:text-racing-blue">{customer.phone}</span>
                                            </div>

                                            {customer.address && (
                                                <p className="text-[8px] font-bold text-muted-foreground/60 uppercase mt-1 line-clamp-1 max-w-[150px]">
                                                    {customer.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">

                                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded border border-border">
                                        {customer.preferredContact || "Phone"}
                                    </span>
                                </td>
                                <td className="py-4 px-4">

                                    {customer.lastSale ? (
                                        <div>
                                            <p className="text-sm font-black text-foreground uppercase tracking-tighter">{customer.lastSale.bikeName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Bike className="w-3 h-3 text-racing-blue" />
                                                <span
                                                    className="text-[10px] font-bold text-muted-foreground hover:text-racing-blue cursor-pointer transition-colors"
                                                    onClick={() => window.location.href = `/admin?tab=sales&search=${customer.phone}`}
                                                >
                                                    Purchased {new Date(customer.lastSale.saleDate).toLocaleDateString('en-IN', {
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>

                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">No sales record</span>
                                    )}
                                </td>
                                <td className="py-4 px-4">

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-racing-blue font-black italic text-xs">
                                            ₹{(customer.lifetimeValue || 0).toLocaleString('en-IN')}
                                        </div>
                                        {customer.feedbackScore !== undefined && (
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            i < (customer.feedbackScore || 0) ? "bg-amber-400" : "bg-muted"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        {customer.nextServiceDue ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full animate-pulse",
                                                        new Date() > new Date(customer.nextServiceDue) ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                            (new Date(customer.nextServiceDue).getTime() - new Date().getTime()) < (7 * 24 * 60 * 60 * 1000) ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                                "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest",
                                                        new Date() > new Date(customer.nextServiceDue) ? "text-red-500" :
                                                            (new Date(customer.nextServiceDue).getTime() - new Date().getTime()) < (7 * 24 * 60 * 60 * 1000) ? "text-amber-500" :
                                                                "text-green-500"
                                                    )}>
                                                        {new Date(customer.nextServiceDue).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn(
                                                        "text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest",
                                                        customer.isFreeService ? "bg-racing-blue/10 border-racing-blue text-racing-blue" : "bg-muted border-border text-muted-foreground"
                                                    )}>
                                                        {customer.serviceMilestone}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-30">N/A</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-8 text-right w-[220px]">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Desktop-only Quick Actions */}
                                        <div className="hidden md:flex items-center gap-2">
                                            <button
                                                onClick={handleService}
                                                className="p-2 flex-shrink-0 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all"
                                                title="Schedule Service"
                                            >
                                                <Wrench className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleWhatsApp(customer)}
                                                className="p-2 flex-shrink-0 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all"
                                                title="WhatsApp Customer"
                                            >
                                                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === customer._id ? null : customer._id)}
                                                className={cn(
                                                    "p-2 rounded-xl border border-border hover:bg-muted/30 transition-all text-muted-foreground",
                                                    openMenuId === customer._id && "bg-muted shadow-inner border-racing-blue/30 text-foreground"
                                                )}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            <AnimatePresence>
                                                {openMenuId === customer._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-2xl z-50 py-2"
                                                        >
                                                            {/* Mobile-only consolidated actions */}
                                                            <div className="md:hidden border-b border-border/50 mb-1 pb-1">
                                                                <button
                                                                    onClick={() => { handleService(); setOpenMenuId(null); }}
                                                                    className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left hover:bg-racing-blue/10 transition-colors text-racing-blue flex items-center gap-3"
                                                                >
                                                                    <Wrench className="w-3.5 h-3.5" />
                                                                    Schedule Service
                                                                </button>
                                                                <button
                                                                    onClick={() => { handleWhatsApp(customer); setOpenMenuId(null); }}
                                                                    className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left hover:bg-green-500/10 transition-colors text-green-600 flex items-center gap-3"
                                                                >
                                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                                    WhatsApp Member
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => { setEditingCustomer(customer); setOpenMenuId(null); }}
                                                                className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors text-muted-foreground flex items-center gap-3"
                                                            >
                                                                <History className="w-3.5 h-3.5" />
                                                                History & Profile
                                                            </button>
                                                            <button
                                                                onClick={() => { window.location.href = `/admin?tab=sales&search=${customer.phone}`; setOpenMenuId(null); }}
                                                                className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left hover:bg-green-500/10 transition-colors text-green-600 flex items-center gap-3 border-t border-border/30"
                                                            >
                                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                                Sales Ledger
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

            {editingCustomer && (
                <CustomerEditModal
                    customer={editingCustomer}
                    isOpen={!!editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    onUpdate={refreshData}
                />
            )}
        </div>
    );
}
