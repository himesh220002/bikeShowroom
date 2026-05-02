"use client";

import { useState, useMemo } from "react";
import { Wrench, Bike, Calendar, Package, MoreVertical, Phone, MessageSquare, Users, Clock, ChevronDown, CheckCircle, Circle, MapPin, Tag, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";
import { formatPrice } from "@/lib/utils/price";
import { motion, AnimatePresence } from "framer-motion";
import { ExportButton } from "@/components/ui/ExportButton";
import { ServiceStatusModal } from "./ServiceStatusModal";

export interface ServiceBooking {
    _id: string;
    name: string;
    phone: string;
    bikeModel: string;
    regNumber: string;
    chassisNumber?: string;
    serviceType: string;
    status: 'booked' | 'in-progress' | 'completed' | 'delivered' | 'cancelled';
    priority?: 'High' | 'Normal';
    technicianName?: string;
    estimatedCompletionTime?: string;
    appointmentDate: string;
    appointmentTime: string;
    createdAt: string;
    statusHistory?: any[];
    cost: number;
    serviceNumber: number;
    customerId?: any;
}

interface ServicesTableProps {
    services: ServiceBooking[];
    onUpdate?: () => void;
}

const STATUS_OPTIONS = ['booked', 'in-progress', 'completed', 'delivered', 'cancelled'];

const statusColors = {
    'booked': "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    'in-progress': "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    'completed': "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    'delivered': "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    'cancelled': "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function ServicesTable({ services, onUpdate }: ServicesTableProps) {
    const [statusModal, setStatusModal] = useState<{ service: ServiceBooking, status: string } | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedServices = useMemo(() => {
        return [...services].sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            let aVal: any = "";
            let bVal: any = "";

            if (key === 'time') {
                aVal = a.appointmentTime;
                bVal = b.appointmentTime;
            } else if (key === 'date') {
                aVal = new Date(a.appointmentDate).getTime();
                bVal = new Date(b.appointmentDate).getTime();
            } else if (key === 'priority') {
                const pMap = { 'High': 2, 'Normal': 1, undefined: 0 };
                aVal = pMap[a.priority as keyof typeof pMap] || 0;
                bVal = pMap[b.priority as keyof typeof pMap] || 0;
            } else if (key === 'name') {
                aVal = (a.customerId?.name || a.name || "").toLowerCase();
                bVal = (b.customerId?.name || b.name || "").toLowerCase();
            } else if (key === 'model') {
                aVal = (a.bikeModel || "").toLowerCase();
                bVal = (b.bikeModel || "").toLowerCase();
            } else if (key === 'status') {
                aVal = a.status.toLowerCase();
                bVal = b.status.toLowerCase();
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [services, sortConfig]);

    const totalPages = Math.ceil(services.length / pageSize);
    const currentServices = sortedServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <Wrench className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Service Queue</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Spreadsheet View Enabled</p>
                    </div>
                </div>

                <ExportButton
                    data={services}
                    filename="Yamaha_Services_Report"
                    sheetName="Services"
                />
            </div>

            <div className="overflow-x-auto min-h-[300px] border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[2000px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[110px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('time')}>
                                <div className="flex items-center gap-1">
                                    Time
                                    {sortConfig?.key === 'time' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('date')}>
                                <div className="flex items-center gap-1">
                                    Date
                                    {sortConfig?.key === 'date' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[100px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('priority')}>
                                <div className="flex items-center justify-center gap-1">
                                    Priority
                                    {sortConfig?.key === 'priority' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[200px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
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
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('model')}>
                                <div className="flex items-center gap-1">
                                    Machine Model
                                    {sortConfig?.key === 'model' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px]">Vehicle Reg #</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px]">Chassis Number</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px]">Service Type</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[100px] text-center">SVC #</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center">Est. Bill</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px]">Technician</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('status')}>
                                <div className="flex items-center justify-center gap-1">
                                    Status
                                    {sortConfig?.key === 'status' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[150px] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentServices.map((service) => (
                            <tr key={service._id} className="border-b border-border/30 group hover:bg-muted/10 transition-colors">
                                {/* Time */}
                                <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-muted-foreground/40" />
                                        <span className="text-[11px] font-black text-foreground">{service.appointmentTime}</span>
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-muted-foreground/40" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{service.appointmentDate}</span>
                                    </div>
                                </td>

                                {/* Priority */}
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                        service.priority === 'High'
                                            ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
                                            : "bg-muted text-muted-foreground border-border/50"
                                    )}>
                                        {service.priority || 'Normal'}
                                    </span>
                                </td>

                                {/* Name */}
                                <td className="py-3 px-4 border-r border-border/10 overflow-hidden">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-black text-foreground uppercase truncate">
                                            {service.customerId?.name || service.name}
                                        </span>
                                        {service.customerId && (
                                            <span className="text-[8px] font-black text-racing-blue uppercase tracking-widest">Matched Profile</span>
                                        )}
                                    </div>
                                </td>

                                {/* Phone */}
                                <td className="py-3 px-4 border-r border-border/10 uppercase tracking-wider text-[12px] font-bold text-muted-foreground">
                                    {service.phone}
                                </td>

                                {/* Machine */}
                                <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                    <span className="text-[13px] font-black text-foreground uppercase tracking-tighter italic">
                                        {service.bikeModel}
                                    </span>
                                </td>

                                {/* Reg Number */}
                                <td className="py-3 px-4 border-r border-border/10 uppercase tracking-widest text-[11px] font-black text-racing-blue">
                                    {service.regNumber || 'N/A'}
                                </td>

                                {/* Chassis */}
                                <td className="py-3 px-4 border-r border-border/10 uppercase tracking-widest text-[10px] font-bold text-muted-foreground">
                                    {service.chassisNumber || 'N/A'}
                                </td>

                                {/* Type */}
                                <td className="py-3 px-4 border-r border-border/10 whitespace-nowrap">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase border border-border/50 px-2 py-0.5 rounded bg-muted/20">
                                        {service.serviceType}
                                    </span>
                                </td>

                                {/* SVC # */}
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded border",
                                        service.serviceNumber <= 4
                                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                                            : "bg-racing-blue/5 text-racing-blue border-racing-blue/20"
                                    )}>
                                        #{service.serviceNumber}
                                    </span>
                                </td>

                                {/* Bill */}
                                <td className="py-3 px-4 border-r border-border/10 text-center">
                                    <span className="text-[12px] font-black text-racing-blue">
                                        {service.cost > 0 ? `₹${formatPrice(service.cost)}` : '—'}
                                    </span>
                                </td>

                                {/* Tech */}
                                <td className="py-3 px-4 border-r border-border/10 overflow-hidden">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase truncate block italic">
                                        {service.technicianName || 'Unassigned'}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-4 border-r border-border/10 relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === service._id ? null : service._id);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                                            statusColors[service.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border",
                                            openDropdownId === service._id && "ring-1 ring-racing-blue shadow-lg bg-card"
                                        )}
                                    >
                                        {service.status.replace('-', ' ')}
                                        <ChevronDown className={cn("w-3 h-3 transition-transform", openDropdownId === service._id && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {openDropdownId === service._id && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute top-full left-0 right-0 pt-1 z-50 px-2"
                                                >
                                                    <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                                                        {STATUS_OPTIONS.map((opt) => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => {
                                                                    setStatusModal({ service, status: opt });
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className={cn(
                                                                    "w-full px-4 py-2.5 text-[8px] font-black uppercase tracking-[.2em] text-left hover:bg-racing-blue hover:text-white transition-all border-b border-border/30 last:border-0",
                                                                    service.status === opt ? "text-racing-blue bg-racing-blue/5" : "text-muted-foreground"
                                                                )}
                                                            >
                                                                {opt.replace('-', ' ')}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 rounded-lg border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 text-racing-blue transition-all">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-2 rounded-lg border border-border hover:bg-green-500/10 hover:border-green-500/50 text-green-600 transition-all">
                                            <Phone className="w-3.5 h-3.5" />
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
                        Queued Jobs Page {currentPage} of {totalPages}
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

            <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border border-border border-dashed rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border border-racing-blue/30" />
                    Standard Spreadsheet Flow • Shift + Wheel to Scroll Horizontal
                </p>
                {statusModal && (
                    <ServiceStatusModal
                        service={statusModal.service}
                        newStatus={statusModal.status}
                        isOpen={true}
                        onClose={() => setStatusModal(null)}
                        onUpdate={() => {
                            if (onUpdate) onUpdate();
                            setStatusModal(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
