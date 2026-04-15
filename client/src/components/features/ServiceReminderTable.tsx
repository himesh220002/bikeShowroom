"use client";

import { User, Phone, Bike, Calendar, MessageSquare, CheckCircle, Circle, MapPin, Hash, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useMemo } from "react";
import { API_URL } from "@/lib/config";
import { useConfig } from "@/components/providers/ConfigProvider";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerCRM {
    _id: string;
    name: string;
    phone: string;
    regNumber?: string;
    lastSale: {
        bikeName: string;
        variant: string;
        saleDate: string;
    } | null;
    nextServiceDue: string | null;
    serviceMilestone: string;
    isFreeService: boolean;
    serviceHistory: {
        totalCount: number;
    };
    reminderStatus?: string;
    reminderRemarks?: string;
    reminderCalled?: boolean;
    reminderMessaged?: boolean;
}

interface ServiceReminderTableProps {
    onUpdate?: () => void;
}

const REMARK_OPTIONS = [
    { label: "Didn’t Picked", value: "Didn’t Picked" },
    { label: "Will Not Come", value: "Will Not Come" },
    { label: "Will Come in This Week", value: "Will Come in This Week" },
    { label: "Will Come in 2 Days", value: "Will Come in 2 Days" },
    { label: "Coming Today (Confirmed)", value: "Coming Today (Confirmed)" },
    { label: "Already Done Current Service", value: "Already Done Current Service" },
    { label: "Follow‑Up Required", value: "Follow‑Up Required" },
    { label: "Wrong Number / Not Reachable", value: "Wrong Number / Not Reachable" },
    { label: "Service scheduled created by customer", value: "Service scheduled created by customer" }
];

export function ServiceReminderTable({ onUpdate }: ServiceReminderTableProps) {
    const [customers, setCustomers] = useState<CustomerCRM[]>([]);
    const [loading, setLoading] = useState(true);
    const { config } = useConfig();
    const [savingId, setSavingId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/customers`);
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch reminders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const processedCustomers = useMemo(() => {
        let filtered = customers.filter(c => c.lastSale !== null);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                (c.regNumber && c.regNumber.toLowerCase().includes(q))
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(c => c.reminderStatus === statusFilter);
        }

        const getPriority = (dateStr: string | null) => {
            if (!dateStr) return 4;
            const date = new Date(dateStr);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const serviceDate = new Date(date);
            serviceDate.setHours(0, 0, 0, 0);

            const diff = serviceDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 1; // Overdue
            if (diffDays <= 7) return 2; // Near
            return 3; // Future
        };

        let sorted = [...filtered];

        if (sortConfig) {
            const { key, direction } = sortConfig;
            sorted.sort((a, b) => {
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
        } else {
            sorted.sort((a, b) => {
                const pA = getPriority(a.nextServiceDue);
                const pB = getPriority(b.nextServiceDue);
                if (pA !== pB) return pA - pB;

                if (!a.nextServiceDue) return 1;
                if (!b.nextServiceDue) return -1;
                return new Date(a.nextServiceDue).getTime() - new Date(b.nextServiceDue).getTime();
            });
        }

        return sorted;
    }, [customers, searchQuery, statusFilter, sortConfig]);

    const totalPages = Math.ceil(processedCustomers.length / pageSize);
    const currentCustomers = processedCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleUpdateCustomer = async (customerId: string, updates: Partial<CustomerCRM>) => {
        setSavingId(customerId);
        try {
            const res = await fetch(`${API_URL}/customers/${customerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            if (data.success) {
                setCustomers(prev => prev.map(c => c._id === customerId ? { ...c, ...updates } : c));
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            console.error("Failed to update reminder:", err);
        } finally {
            setSavingId(null);
        }
    };

    const handleWhatsApp = (customer: CustomerCRM) => {
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

📍 Address: CHOUDHARY YAMAHA Service Center, GHV4+WM6, Katihar-Manihari Rd, Barmasia Power House Colony, Lohiya Nagar, Katihar, Bihar 854105
🗺️ Map: https://share.google/EsFERqZuDrslGA3is
📞 Contact: +919733327604

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

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-racing-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Excel View...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 px-4 py-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search CRM Database..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-muted/30 border border-border rounded-xl px-10 py-2.5 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-racing-blue/30 outline-none transition-all"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-racing-blue/30 transition-all"
                >
                    <option value="all">Filter Status</option>
                    {REMARK_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto min-h-[300px] border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[2000px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">
                                    Customer Name
                                    {sortConfig?.key === 'name' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Phone Number</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('bikeModel')}>
                                <div className="flex items-center gap-1">
                                    Bike Model
                                    {sortConfig?.key === 'bikeModel' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Reg Number</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Purchase Date</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px]">Current Milestone</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Next Due Date</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] text-center">Engagement</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] text-center">Actions</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[250px]">Follow-Up Remark</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[300px]">Admin Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.map((customer) => {
                            const nextDate = customer.nextServiceDue ? new Date(customer.nextServiceDue) : null;
                            const now = new Date();
                            now.setHours(0, 0, 0, 0);
                            const serviceDate = nextDate ? new Date(nextDate) : null;
                            if (serviceDate) serviceDate.setHours(0, 0, 0, 0);

                            const diffDays = serviceDate ? Math.ceil((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

                            const isWithinWeek = diffDays !== null && diffDays >= 0 && diffDays <= 7;
                            const isOverdue = diffDays !== null && diffDays < 0;

                            return (
                                <tr key={customer._id} className="border-b border-border/30 hover:bg-muted/10 transition-colors group">
                                    {/* Name */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <p className="text-[13px] font-black text-foreground uppercase tracking-tight truncate">{customer.name}</p>
                                    </td>

                                    {/* Phone */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <p className="text-[12px] font-bold text-muted-foreground tracking-wider">{customer.phone}</p>
                                    </td>

                                    {/* Model */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <p className="text-[12px] font-black text-foreground uppercase tracking-tighter truncate italic">
                                            {customer.lastSale?.bikeName || "N/A"}
                                        </p>
                                    </td>

                                    {/* Reg Number */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <p className="text-[11px] font-bold text-racing-blue bg-racing-blue/5 border border-racing-blue/10 px-2 py-0.5 rounded inline-block uppercase tracking-widest">
                                            {customer.regNumber || "N/A"}
                                        </p>
                                    </td>

                                    {/* Purchase Date */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-muted-foreground/50" />
                                            <span className="text-[12px] font-bold text-muted-foreground uppercase">
                                                {customer.lastSale?.saleDate ? new Date(customer.lastSale.saleDate).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: '2-digit'
                                                }) : "N/A"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Milestone */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <span className="text-[10px] font-black bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground uppercase tracking-widest truncate block">
                                            {customer.serviceMilestone}
                                        </span>
                                    </td>

                                    {/* Due Date */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                isOverdue ? "bg-red-500 animate-pulse" : isWithinWeek ? "bg-amber-500 animate-pulse" : "bg-green-500"
                                            )} />
                                            <p className={cn(
                                                "text-[12px] font-black uppercase tracking-widest",
                                                isOverdue ? "text-red-500" : isWithinWeek ? "text-amber-500" : "text-green-500"
                                            )}>
                                                {nextDate ? nextDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A"}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Engagement (Combined Checkboxes) */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <button
                                                    onClick={() => handleUpdateCustomer(customer._id, { reminderCalled: !customer.reminderCalled })}
                                                    className="focus:outline-none hover:scale-110 transition-transform"
                                                >
                                                    {customer.reminderCalled ? (
                                                        <CheckCircle className="w-4 h-4 text-racing-blue" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-muted-foreground/30" />
                                                    )}
                                                </button>
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-tighter">CALL</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5">
                                                <button
                                                    onClick={() => handleUpdateCustomer(customer._id, { reminderMessaged: !customer.reminderMessaged })}
                                                    className="focus:outline-none hover:scale-110 transition-transform"
                                                >
                                                    {customer.reminderMessaged ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-muted-foreground/30" />
                                                    )}
                                                </button>
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-tighter">TEXT</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Quick Actions */}
                                    <td className="py-3 px-4 border-r border-border/10 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleCall(customer)}
                                                className={cn(
                                                    "p-2 rounded-lg border transition-all duration-500",
                                                    isOverdue || isWithinWeek
                                                        ? "bg-racing-blue/10 border-racing-blue text-racing-blue shadow-[0_0_10px_-2px_rgba(0,123,255,0.3)]"
                                                        : "bg-muted/50 border-border text-muted-foreground hover:bg-racing-blue/10 hover:border-racing-blue/50"
                                                )}
                                            >
                                                <Phone className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleWhatsApp(customer)}
                                                className={cn(
                                                    "p-2 rounded-lg border transition-all duration-500",
                                                    isOverdue || isWithinWeek
                                                        ? "bg-green-500/10 border-green-500 text-green-600 shadow-[0_0_10px_-2px_rgba(34,197,94,0.3)]"
                                                        : "bg-muted/50 border-border text-muted-foreground hover:bg-green-500/10 hover:border-green-500/50"
                                                )}
                                            >
                                                <MessageSquare className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>

                                    {/* Follow-Up Status */}
                                    <td className="py-3 px-4 border-r border-border/10">
                                        <select
                                            value={customer.reminderStatus || ""}
                                            onChange={(e) => handleUpdateCustomer(customer._id, { reminderStatus: e.target.value })}
                                            className="bg-card border border-border rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-racing-blue outline-none transition-all w-full"
                                            disabled={savingId === customer._id}
                                        >
                                            <option value="">Select Status</option>
                                            {REMARK_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Notes */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                defaultValue={customer.reminderRemarks || ""}
                                                onBlur={(e) => {
                                                    if (e.target.value !== (customer.reminderRemarks || "")) {
                                                        handleUpdateCustomer(customer._id, { reminderRemarks: e.target.value });
                                                    }
                                                }}
                                                placeholder="Add internal notes..."
                                                className="bg-transparent border-none px-0 py-1 text-[12px] font-bold outline-none focus:ring-0 placeholder:text-muted-foreground/30 w-full"
                                                disabled={savingId === customer._id}
                                            />
                                            {savingId === customer._id && (
                                                <div className="w-3 h-3 border-2 border-racing-blue border-t-transparent rounded-full animate-spin" />
                                            )}
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
                        Reminders Page {currentPage} of {totalPages}
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

            <div className="px-4 py-2 bg-muted/20 border border-border rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-racing-blue animate-pulse" />
                    Horizontal Scroll enabled for full spreadsheet view (Shift + Scroll)
                </p>
            </div>
        </div>
    );
}
