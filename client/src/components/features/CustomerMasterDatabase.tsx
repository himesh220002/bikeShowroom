"use client";

import { useState, useMemo } from "react";
import { Search, ChevronRight, FileText, Wrench, Shield, Calendar, Phone, Mail, User, Download, ExternalLink, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerMasterData {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    address?: string;
    preferredContact?: string;
    lifetimeValue?: number;
    rating?: number;
    engagement?: number;
    milestone?: string;
    regNumber: string;
    chassisNumber: string;
    engineNumber: string;
    lastSale: {
        bikeName: string;
        variant: string;
        salePrice: string;
        saleDate: string;
        invoiceNumber?: string;
        paymentMethod?: string;
        financeProvider?: string;
        salesperson?: string;
        chassisNumber?: string;
        registrationNumber?: string;
        engineNumber?: string;
    } | null;
    userBikes: {
        model: string;
        regNo: string;
        docs: any[];
        mods: any[];
        score: number;
    }[];
    serviceHistory: {
        totalCount: number;
        latest: {
            status: string;
            date: string;
            serviceType: string;
        } | null;
    };
    nextServiceDue: string | null;
    serviceMilestone: string;
}

export function CustomerMasterDatabase({ data }: { data: CustomerMasterData[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof CustomerMasterData | string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerMasterData | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedData = useMemo(() => {
        let filtered = [...data];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                c.regNumber.toLowerCase().includes(q) ||
                c.chassisNumber.toLowerCase().includes(q) ||
                c.lastSale?.bikeName.toLowerCase().includes(q)
            );
        }

        filtered.sort((a, b) => {
            const getVal = (obj: any, path: string) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };
            const aVal = getVal(a, sortConfig.key as string) || "";
            const bVal = getVal(b, sortConfig.key as string) || "";
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [data, searchQuery, sortConfig]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search By Name, Phone, Reg No, or Chassis..."
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-racing-blue transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Showing {processedData.length} Intelligent Assets
                </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white">
                <table className="w-full text-left border-collapse min-w-[2500px] table-fixed">
                    <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50">
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
                                { label: "Action", key: "", w: "100px" }
                            ].map((col) => (
                                <th
                                    key={col.label}
                                    style={{ width: col.w }}
                                    onClick={() => col.key && handleSort(col.key)}
                                    className={cn(
                                        "px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-r border-zinc-100/50 transition-colors group",
                                        col.key && "cursor-pointer hover:bg-zinc-100 hover:text-racing-blue"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {col.key && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.map((customer) => (
                            <tr
                                key={customer._id}
                                className="border-b border-zinc-100 group hover:bg-zinc-50/50 transition-colors"
                            >
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <div className="text-sm font-black text-black uppercase italic truncate">{customer.name}</div>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-bold text-[11px] text-gray-600 tracking-wider">
                                    {customer.phone}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 text-[10px] font-bold text-gray-500 uppercase truncate">
                                    {customer.address || "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                                        {customer.preferredContact || "Phone"}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <p className="text-[11px] font-black text-racing-blue uppercase italic truncate">{customer.lastSale?.bikeName || "INQUIRY"}</p>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <span className="text-[9px] font-black text-racing-blue bg-racing-blue/5 border border-racing-blue/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                                        {customer.lastSale?.variant || "—"}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 whitespace-nowrap text-[11px] font-bold text-gray-500">
                                    {customer.lastSale ? new Date(customer.lastSale.saleDate).toLocaleDateString() : "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-black text-[12px] text-emerald-600">
                                    ₹{formatPrice(customer.lifetimeValue || 0)}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <span className="text-[9px] font-black uppercase text-racing-blue bg-racing-blue/5 px-2 py-0.5 rounded truncate block text-center">
                                        {customer.serviceMilestone}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-racing-blue" style={{ width: `${customer.engagement || 0}%` }} />
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-mono text-[10px] font-bold text-gray-500 uppercase">
                                    {customer.lastSale?.chassisNumber || "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-black text-[11px] text-black uppercase">
                                    {customer.regNumber}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-mono text-[10px] font-bold text-gray-500 uppercase">
                                    {customer.lastSale?.engineNumber || "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-black text-[12px] text-black">
                                    {customer.lastSale ? `₹${formatPrice(customer.lastSale.salePrice)}` : "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30">
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border border-zinc-200 text-gray-600">
                                        {customer.lastSale?.paymentMethod || "—"}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 text-[10px] font-black text-amber-600 uppercase italic">
                                    {customer.lastSale?.financeProvider || "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 font-black text-[10px] text-gray-500 uppercase">
                                    {customer.lastSale?.invoiceNumber || "—"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 text-[10px] font-bold text-gray-400 uppercase italic">
                                    {customer.lastSale?.salesperson || "Showroom"}
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <Search className={cn("w-3 h-3", (customer.rating || 0) >= 1 ? "text-amber-500 fill-amber-500" : "text-gray-200")} />
                                        <span className="text-[10px] font-black">{customer.rating || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-r border-zinc-100/30 whitespace-nowrap text-[11px] font-bold text-gray-500">
                                    {customer.nextServiceDue ? new Date(customer.nextServiceDue).toLocaleDateString() : "TBD"}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button
                                        onClick={() => setSelectedCustomer(customer)}
                                        className="p-1.5 border border-zinc-200 rounded-lg text-gray-400 hover:text-racing-blue hover:border-racing-blue transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Slide-out Panel for Detail Research */}
            <AnimatePresence>
                {selectedCustomer && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCustomer(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-zinc-950 border-l border-white/5 z-[101] shadow-2xl p-0 overflow-y-auto"
                        >
                            <div className="sticky top-0 p-8 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-racing-blue/10 border border-racing-blue/20 flex items-center justify-center font-display font-black text-xl text-racing-blue">
                                        {selectedCustomer.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-black text-white uppercase italic tracking-tighter leading-none">{selectedCustomer.name}</h2>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Intelligence Profile · {selectedCustomer._id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-all"
                                >
                                    <Search className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <div className="p-8 space-y-12">
                                {/* Header Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { icon: Calendar, label: "Customer Since", value: selectedCustomer.lastSale ? new Date(selectedCustomer.lastSale.saleDate).getFullYear() : "N/A" },
                                        { icon: Wrench, label: "Services", value: selectedCustomer.serviceHistory.totalCount },
                                        { icon: Phone, label: "Contact", value: selectedCustomer.phone },
                                        { icon: Shield, label: "Condition", value: `${selectedCustomer.userBikes?.[0]?.score || 100}%` },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-4 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                                            <stat.icon className="w-4 h-4 text-racing-blue mb-2" />
                                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                            <div className="text-sm font-black text-white uppercase">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Deep Intelligence Section */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-racing-blue uppercase tracking-[0.4em] flex items-center gap-3">
                                        <div className="w-8 h-[1px] bg-racing-blue" /> Machine Genealogy
                                    </h3>
                                    <div className="p-8 rounded-[3rem] bg-zinc-900 border border-white/10 space-y-8">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Model & Variant</label>
                                                <div className="text-sm font-black text-white uppercase tracking-tighter">{selectedCustomer.lastSale?.bikeName} {selectedCustomer.lastSale?.variant}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Registration No</label>
                                                <div className="text-sm font-black text-racing-blue uppercase tracking-tight">{selectedCustomer.regNumber}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Chassis (VIN)</label>
                                                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{selectedCustomer.chassisNumber}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Engine No</label>
                                                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{selectedCustomer.engineNumber}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Document Vault (Research) */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-racing-blue uppercase tracking-[0.4em] flex items-center gap-3">
                                        <div className="w-8 h-[1px] bg-racing-blue" /> Document Repository
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedCustomer.userBikes?.[0]?.docs?.length > 0 ? (
                                            selectedCustomer.userBikes[0].docs.map((doc: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl group hover:border-racing-blue/30 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-white uppercase">{doc.docType}</div>
                                                            <div className="text-[9px] text-gray-500 font-bold uppercase">
                                                                {doc.docUrl?.startsWith('v1:') ? '🔒 Encrypted in User Vault' : 'Stored in Digital Twin'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!doc.docUrl?.startsWith('v1:') && (
                                                        <a href={doc.docUrl} target="_blank" className="p-2 rounded-xl bg-racing-blue/10 text-racing-blue hover:bg-racing-blue hover:text-white transition-all">
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                No Digital Documents Found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
