"use client";

import { useState } from "react";
import { Wrench, Bike, Calendar, Package, MoreVertical, Phone, MessageSquare, Users, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { ExportButton } from "@/components/ui/ExportButton";
import { ServiceStatusModal } from "./ServiceStatusModal";

export interface ServiceBooking {
    _id: string;
    name: string;
    phone: string;
    bikeModel: string;
    regNumber: string;
    serviceType: string;
    status: 'booked' | 'in-progress' | 'completed' | 'delivered' | 'cancelled';
    priority?: 'High' | 'Normal';
    technicianName?: string;
    estimatedCompletionTime?: string;
    appointmentDate: string;
    appointmentTime: string;
    createdAt: string;
    statusHistory?: any[];
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

    const refreshData = () => {
        if (onUpdate) onUpdate();
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API_URL}/services/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (!data.success) alert("Failed to update status: " + data.error);
        } catch (err) {
            console.error("Error updating service status:", err);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center m-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-racing-blue/10 rounded-lg">
                        <Wrench className="w-4 h-4 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Service Queue</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{services.length} Scheduled Appointments</p>
                    </div>
                </div>

                <ExportButton
                    data={services}
                    filename="Yamaha_Services_Report"
                    sheetName="Services"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Booking Info</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Vehicle</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Schedule</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Bill</th>
                            <th className="py-4 px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Status</th>
                        </tr>

                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service._id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-4">

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                            <Users className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-foreground leading-tight">{service.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Phone className="w-2.5 h-2.5 text-muted-foreground/60" />
                                                <span className="text-[10px] font-bold text-muted-foreground">{service.phone}</span>
                                            </div>
                                        </div>

                                    </div>
                                </td>
                                <td className="py-4 px-4">

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-racing-blue/10 rounded-lg shrink-0">
                                            <Bike className="w-4 h-4 text-racing-blue" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[13px] font-black text-foreground uppercase tracking-tighter whitespace-nowrap leading-tight">{service.bikeModel}</p>
                                                {service.priority === 'High' && (
                                                    <span className="text-[7px] font-black uppercase text-red-500 bg-red-500/10 border border-red-500/20 px-1 py-0.5 rounded leading-none">VIP</span>
                                                )}
                                            </div>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-80">{service.serviceType}</p>
                                            <p className="text-[8px] font-black text-racing-blue/80 uppercase tracking-widest mt-0.5">{service.regNumber}</p>
                                        </div>

                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-foreground">
                                            <Calendar className="w-3 h-3 text-muted-foreground/60" />
                                            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                {service.appointmentDate}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-3 h-3 text-muted-foreground/60" />
                                            <span className="text-[9px] font-bold">{service.appointmentTime}</span>
                                        </div>
                                        {service.estimatedCompletionTime && (
                                            <span className="text-[7.5px] font-black text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded w-fit mt-0.5">
                                                EST: {service.estimatedCompletionTime}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="py-4 px-4">
                                    <div className="flex flex-col gap-1">
                                        {/* Service Number Badge */}
                                        {(service as any).serviceNumber && (
                                            <span className={cn(
                                                "text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border w-fit",
                                                (service as any).serviceNumber <= 4
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                                    : "bg-racing-blue/10 text-racing-blue border-racing-blue/20"
                                            )}>
                                                SVC #{(service as any).serviceNumber} · {(service as any).serviceNumber <= 4 ? 'Free' : 'Paid'}
                                            </span>
                                        )}
                                        {(service as any).cost > 0 ? (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-black text-racing-blue uppercase tracking-tighter">
                                                    ₹{((service as any).cost as number).toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">Billed</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-muted-foreground opacity-30 uppercase tracking-widest">—</span>
                                        )}
                                    </div>
                                </td>

                                <td className="py-4 px-4 text-right">

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all">
                                                <MessageSquare className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all">
                                                <Phone className="w-4 h-4 text-green-600 dark:text-green-400 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                        <div className="relative w-full flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(openDropdownId === service._id ? null : service._id);
                                                }}
                                                className={cn(
                                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                                                    statusColors[service.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border",
                                                    openDropdownId === service._id && "ring-2 ring-racing-blue ring-offset-2 dark:ring-offset-background"
                                                )}
                                            >
                                                {service.status.replace('-', ' ')}
                                                <ChevronDown className={cn("w-3 h-3 transition-transform", openDropdownId === service._id && "rotate-180")} />
                                            </button>

                                            <AnimatePresence>
                                                {openDropdownId === service._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute top-full right-0 pt-2 z-50 overflow-visible"
                                                        >
                                                            <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden w-40">
                                                                {STATUS_OPTIONS.map((opt) => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => {
                                                                            setStatusModal({ service, status: opt });
                                                                            setOpenDropdownId(null);
                                                                        }}
                                                                        className={cn(
                                                                            "px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0",
                                                                            service.status === opt ? "text-racing-blue" : "text-muted-foreground hover:text-foreground"
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
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center opacity-30 italic text-sm font-medium text-muted-foreground">
                                    No workshop bookings in the queue...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
