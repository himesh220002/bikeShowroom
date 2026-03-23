"use client";

import { Wrench, Bike, Calendar, Package, MoreVertical, Phone, MessageSquare, Users, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ServiceBooking {
    _id: string;
    name: string;
    phone: string;
    bikeModel: string;
    regNumber: string;
    serviceType: string;
    status: 'booked' | 'in-progress' | 'completed' | 'delivered' | 'cancelled';
    technicianName?: string;
    appointmentDate: string;
    appointmentTime: string;
    createdAt: string;
}

interface ServicesTableProps {
    services: ServiceBooking[];
}

const STATUS_OPTIONS = ['booked', 'in-progress', 'completed', 'delivered', 'cancelled'];

const statusColors = {
    'booked': "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    'in-progress': "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    'completed': "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    'delivered': "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    'cancelled': "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function ServicesTable({ services }: ServicesTableProps) {
    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/services/${id}/status`, {
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
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Booking Info</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Schedule</th>
                        <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service._id} className="border-b border-border/30 group hover:bg-muted/30 transition-colors">
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{service.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3 text-muted-foreground/60" />
                                            <span className="text-[10px] font-bold text-muted-foreground">{service.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-racing-blue/10 rounded-lg">
                                        <Bike className="w-4 h-4 text-racing-blue" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase tracking-tighter">{service.bikeModel}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{service.serviceType}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {service.appointmentDate}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">{service.appointmentTime}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-4 text-right">
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-xl border border-border hover:bg-racing-blue/10 hover:border-racing-blue/50 group/btn transition-all">
                                            <MessageSquare className="w-4 h-4 text-racing-blue group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button className="p-2 rounded-xl border border-border hover:bg-green-500/10 hover:border-green-500/50 group/btn transition-all">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="relative group/status w-full flex justify-end">
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                                            statusColors[service.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border"
                                        )}>
                                            {service.status.replace('-', ' ')}
                                            <ChevronDown className="w-3 h-3 transition-transform group-hover/status:rotate-180" />
                                        </span>
                                        <div className="absolute top-full mt-2 right-0 hidden group-hover/status:flex flex-col bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden w-40">
                                            {STATUS_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateStatus(service._id, opt)}
                                                    className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border-b border-border/50 last:border-0"
                                                >
                                                    {opt.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
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
    );
}
