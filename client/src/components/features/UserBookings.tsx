"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import {
    Calendar,
    Clock,
    Wrench,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    MapPin,
    Bike,
    Loader2,
    History,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceBooking {
    _id: string;
    bikeModel: string;
    regNumber: string;
    serviceType: string;
    appointmentDate: string;
    appointmentTime: string;
    status: 'booked' | 'in-progress' | 'completed' | 'delivered' | 'cancelled';
    priority?: 'High' | 'Normal';
    technicianName?: string;
    estimatedCompletionTime?: string;
    cost?: number;
    billingType?: 'free' | 'paid';
    serviceNumber?: number;
    notes?: string;
    createdAt: string;
}

export function UserBookings() {
    const { user, loading: authLoading, login } = useAuth();
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API_URL}/services/user`, { withCredentials: true });
            if (res.data.success) {
                setBookings(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || (user && loading)) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Workshop Records...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="glass p-12 rounded-[2.5rem] border border-border/50 text-center space-y-6">
                <div className="w-16 h-16 bg-racing-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bike className="w-8 h-8 text-racing-blue" />
                </div>
                <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">Track Your Service</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                    Log in to view your workshop history, track active bookings, and manage your garage.
                </p>
                <button
                    onClick={login}
                    className="bg-racing-blue text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-racing-blue/30"
                >
                    Login to Portal
                </button>
            </div>
        );
    }

    const activeBookings = bookings.filter(b => ["booked", "in-progress"].includes(b.status));
    const historyBookings = bookings.filter(b => ["completed", "delivered", "cancelled"].includes(b.status));

    const currentList = activeTab === "active" ? activeBookings : historyBookings;

    return (
        <div className="space-y-8">
            {/* Component Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter flex items-center justify-center sm:justify-start gap-3">
                        {activeTab === "active" ? <Activity className="w-6 h-6 text-racing-blue" /> : <History className="w-6 h-6 text-zinc-500" />}
                        Workshop <span className={activeTab === "active" ? "text-racing-blue" : "text-muted-foreground"}>Bookings</span>
                    </h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                        {activeTab === "active" ? `Monitoring ${activeBookings.length} active service tokens` : `Detailed log of ${historyBookings.length} past workshop sessions`}
                    </p>
                </div>

                <div className="flex gap-2 p-1 bg-muted/90 border border-border rounded-xl backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-[0.5625rem] font-black uppercase tracking-widest transition-all relative overflow-hidden",
                            activeTab === "active" ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        Active ({activeBookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-[0.5625rem] font-black uppercase tracking-widest transition-all relative overflow-hidden",
                            activeTab === "history" ? "bg-zinc-800 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        History ({historyBookings.length})
                    </button>
                </div>
            </div>

            {/* Bookings List */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                >
                    {currentList.length === 0 ? (
                        <div className="bg-gray-100 p-20 rounded-[3rem] text-center border border-dashed border-border/50 bg-card/10">
                            {activeTab === "active" ? <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" /> : <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />}
                            <h4 className="text-xl font-display font-black text-foreground uppercase tracking-tighter mb-2 opacity-50">
                                No {activeTab} Records
                            </h4>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Workshop ledger is currently clear</p>
                        </div>
                    ) : (
                        currentList.map((booking) => (
                            <div
                                key={booking._id}
                                className={cn(
                                    "bg-background rounded-[2rem] border border-border/50 overflow-hidden hover:border-racing-blue/30 transition-all group",
                                    booking.status === 'in-progress' && "border-racing-blue/20 bg-racing-blue/[0.02]"
                                )}
                            >
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        {/* Status & Primary Info */}
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                                                booking.status === 'booked' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                    booking.status === 'in-progress' ? "bg-racing-blue/10 text-racing-blue border-racing-blue/20" :
                                                        booking.status === 'completed' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                            booking.status === 'delivered' ? "bg-racing-blue/10 text-racing-blue border-racing-blue/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" :
                                                                "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                            )}>
                                                {booking.status === 'delivered' ? <CheckCircle2 className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h4 className="text-lg font-display font-black text-foreground uppercase tracking-tighter italic">
                                                        {booking.serviceType}
                                                    </h4>
                                                    {/* Service Number Badge */}
                                                    {booking.serviceNumber && (
                                                        <span className={cn(
                                                            "text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                            booking.serviceNumber <= 4
                                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                                : "bg-racing-blue/10 text-racing-blue border-racing-blue/20"
                                                        )}>
                                                            SVC #{booking.serviceNumber} &middot; {booking.serviceNumber <= 4 ? 'Free' : 'Paid'}
                                                        </span>
                                                    )}
                                                    <span className={cn(
                                                        "text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                        booking.status === 'booked' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                            booking.status === 'in-progress' ? "bg-racing-blue/10 text-racing-blue border-racing-blue/20 shadow-[0_0_8px_rgba(37,99,235,0.2)]" :
                                                                booking.status === 'completed' ? "bg-green-500/10 text-green-500 border-green-500/20 text-[6px]" :
                                                                    booking.status === 'delivered' ? "bg-racing-blue/10 text-racing-blue border-racing-blue/20" :
                                                                        "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                                    )}>
                                                        {booking.status.replace('-', ' ')}
                                                    </span>
                                                    {booking.priority === 'High' && (
                                                        <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                                                            HIGH PRIORITY
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Bike className="w-3 h-3" /> {booking.bikeModel} <span className="opacity-20">/</span> {booking.regNumber || 'REG PENDING'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timeline & Details */}
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1 max-w-2xl">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-60">Scheduled Date</span>
                                                <div className="flex items-center gap-2 text-foreground font-bold">
                                                    <Calendar className="w-3.5 h-3.5 text-racing-blue" />
                                                    <span className="text-[11px] uppercase tracking-tighter">{new Date(booking.appointmentDate).toDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-60">Slot Time</span>
                                                <div className="flex items-center gap-2 text-foreground font-bold">
                                                    <Clock className="w-3.5 h-3.5 text-racing-blue" />
                                                    <span className="text-[11px] uppercase tracking-tighter">{booking.appointmentTime}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1 hidden lg:block">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-60">Service Center</span>
                                                <div className="flex items-center gap-2 text-foreground font-bold">
                                                    <MapPin className="w-3.5 h-3.5 text-racing-blue" />
                                                    <span className="text-[11px] uppercase tracking-tighter">Yamaha Authorized</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Footer / Actions */}
                                        <div className="flex items-center justify-end">
                                            {booking.status === 'in-progress' ? (
                                                <div className="px-4 py-2 bg-racing-blue shadow-lg shadow-racing-blue/20 rounded-xl flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live: In Workshop</span>
                                                </div>
                                            ) : (
                                                <div className="text-right">
                                                    <span className="text-[0.5rem] font-black text-muted-foreground uppercase tracking-widest block mb-1">Booking Ref</span>
                                                    <span className="text-[0.625rem] font-black text-foreground uppercase tracking-[0.2em] opacity-40 italic">#{booking._id.slice(-6)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expandable Meta Info */}
                                    {(booking.technicianName || (['completed', 'delivered'].includes(booking.status) && (booking.cost != null || booking.billingType))) && (
                                        <div className="mt-6 pt-4 border-t border-border/30 flex flex-wrap items-center gap-4">
                                            {/* Billing Type Badge — only shown after admin confirms pricing */}
                                            {['completed', 'delivered'].includes(booking.status) && (
                                                booking.billingType === 'free' ? (
                                                    <span className="px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        🎁 Free Service
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full bg-racing-blue/10 text-racing-blue border border-racing-blue/20">
                                                        💳 Paid Service
                                                    </span>
                                                )
                                            )}

                                            {booking.technicianName && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest italic">Attended By:</span>
                                                    <span className="text-[9px] font-black text-foreground uppercase tracking-tighter">{booking.technicianName}</span>
                                                </div>
                                            )}

                                            {booking.cost != null && (['delivered', 'completed'].includes(booking.status)) && (
                                                <div className="ml-auto flex items-center gap-3 px-4 py-2 bg-racing-blue/5 border border-racing-blue/20 rounded-2xl">
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Final Bill</span>
                                                    <span className="text-sm font-black text-racing-blue uppercase tracking-tighter">
                                                        {booking.billingType === 'free' && booking.cost === 0
                                                            ? 'Complimentary'
                                                            : booking.cost > 0
                                                                ? `₹${booking.cost.toLocaleString('en-IN')}`
                                                                : 'Pending'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
