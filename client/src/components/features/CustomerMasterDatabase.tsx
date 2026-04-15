"use client";

import { useState, useMemo } from "react";
import { Search, ChevronRight, FileText, Wrench, Shield, Calendar, Phone, Mail, User, Download, ExternalLink, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerMasterData {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    address?: string;
    regNumber: string;
    chassisNumber: string;
    engineNumber: string;
    lastSale: {
        bikeName: string;
        variant: string;
        salePrice: string;
        saleDate: string;
        invoiceNumber?: string;
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
            const aVal = (a as any)[sortConfig.key] || "";
            const bVal = (b as any)[sortConfig.key] || "";
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
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-zinc-900/50">
                            {[
                                { label: "Customer", key: "name" },
                                { label: "Machine Data", key: "regNumber" },
                                { label: "Purchase History", key: "lastSale.saleDate" },
                                { label: "Service Lifecycle", key: "nextServiceDue" },
                                { label: "Score", key: "conditionScore" }
                            ].map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className="px-6 py-4 text-[10px] font-black text-gray-100 uppercase tracking-widest cursor-pointer hover:text-racing-blue transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.map((customer) => (
                            <tr
                                key={customer._id}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-300 border border-white/10 flex items-center justify-center font-bold text-racing-blue">
                                            {customer.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-black uppercase italic">{customer.name}</div>
                                            <div className="text-[10px] text-gray-500 font-bold">{customer.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1">
                                        <div className="text-[11px] font-black text-racing-blue uppercase tracking-wider">
                                            {customer.regNumber}
                                        </div>
                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                            VIN: {customer.chassisNumber}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {customer.lastSale ? (
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-black text-white uppercase tracking-tighter">
                                                {customer.lastSale.bikeName}
                                            </div>
                                            <div className="text-[9px] text-gray-500 font-bold uppercase">
                                                {new Date(customer.lastSale.saleDate).toLocaleDateString()} • ₹{customer.lastSale.salePrice}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-600 uppercase italic">Inquiry Only</span>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                            {customer.serviceMilestone}
                                        </div>
                                        <div className="text-[9px] text-gray-500 font-bold">
                                            Next: {customer.nextServiceDue ? new Date(customer.nextServiceDue).toLocaleDateString() : "TBD"}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-racing-blue"
                                            style={{ width: `${customer.userBikes?.[0]?.score || 100}%` }}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => setSelectedCustomer(customer)}
                                        className="p-2 rounded-xl bg-zinc-800 border border-white/10 text-gray-400 hover:text-white hover:border-racing-blue/50 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
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
                                                            <div className="text-[9px] text-gray-500 font-bold uppercase">Stored in Digital Twin</div>
                                                        </div>
                                                    </div>
                                                    <a href={doc.docUrl} target="_blank" className="p-2 rounded-xl bg-racing-blue/10 text-racing-blue hover:bg-racing-blue hover:text-white transition-all">
                                                        <Download className="w-4 h-4" />
                                                    </a>
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
