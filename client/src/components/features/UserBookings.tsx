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
    Activity,
    Sparkles,
    MessageSquare,
    Save,
    Edit3,
    X
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
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
    rating?: number;
    feedback?: string;
    createdAt: string;
}

export function UserBookings() {
    const { user, loading: authLoading, login } = useAuth();
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");

    // Local UI State
    const [showRatingEdit, setShowRatingEdit] = useState<string | null>(null);
    const [showFeedbackEdit, setShowFeedbackEdit] = useState<string | null>(null);
    const [tempFeedback, setTempFeedback] = useState("");

    // Emoji Reaction State
    const [reactionEmoji, setReactionEmoji] = useState<{ id: string, emoji: string } | null>(null);

    const fetchBookings = async () => {
        try {
            const res = await axios.get<{ success: boolean; data: ServiceBooking[] }>(
                `${API_URL}/services/user`,
                { withCredentials: true }
            );
            const data = res.data as any;
            if (data.success) {
                const fetchedBookings = data.data;
                setBookings(fetchedBookings);
                
                // Auto-tab selection: show active if any exist, otherwise history
                const hasActive = fetchedBookings.some((b: ServiceBooking) => ["booked", "in-progress"].includes(b.status));
                setActiveTab(hasActive ? "active" : "history");
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

    const handleRateService = async (id: string, rating: number) => {
        try {
            const res = await axios.post<{ success: boolean }>(`${API_URL}/services/${id}/rate`, { rating }, { withCredentials: true });
            const data = res.data as any;
            if (data.success) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, rating } : b));
                setShowRatingEdit(null);

                // Emoji Logic
                let emoji = "🙂"; // 4-7
                if (rating > 7) emoji = "😊";
                if (rating < 4) emoji = "😢";

                setReactionEmoji({ id, emoji });
                setTimeout(() => setReactionEmoji(null), 3000);
            }
        } catch (err) {
            console.error("Failed to rate service:", err);
            alert("Failed to save rating. Please try again.");
        }
    };

    const handleSaveFeedback = async (id: string) => {
        try {
            const res = await axios.post<{ success: boolean }>(`${API_URL}/services/${id}/rate`, { feedback: tempFeedback }, { withCredentials: true });
            const data = res.data as any;
            if (data.success) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, feedback: tempFeedback } : b));
                setShowFeedbackEdit(null);
                setTempFeedback("");
            }
        } catch (err) {
            console.error("Failed to save feedback:", err);
            alert("Failed to save feedback. Please try again.");
        }
    };

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
                                    "bg-background rounded-[2rem] border border-border/50 overflow-hidden hover:border-racing-blue/30 transition-all group relative",
                                    booking.status === 'in-progress' && "border-racing-blue/20 bg-racing-blue/[0.02]"
                                )}
                            >
                                {/* Emoji Reaction Overlay */}
                                <AnimatePresence>
                                    {reactionEmoji?.id === booking._id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                            animate={{ opacity: 1, scale: 1.5, y: -40 }}
                                            exit={{ opacity: 0, scale: 2, y: -80 }}
                                            className="absolute left-1/2 md:left-[85%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-5xl pointer-events-none drop-shadow-2xl"
                                        >
                                            {reactionEmoji.emoji}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
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
                                                    <span className={cn(
                                                        "text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                        booking.status === 'booked' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                            booking.status === 'in-progress' ? "bg-racing-blue/10 text-racing-blue border-racing-blue/20" :
                                                                booking.status === 'completed' ? "bg-green-500/10 text-green-500 border-green-500/20 text-[6px]" :
                                                                    booking.status === 'delivered' ? "bg-racing-blue/10 text-racing-blue border-racing-blue/20" :
                                                                        "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                                    )}>
                                                        {booking.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Bike className="w-3 h-3" /> {booking.bikeModel} <span className="opacity-20">/</span> {booking.regNumber}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 flex-1 max-w-2xl">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-60">Scheduled Date</span>
                                                <div className="flex items-center gap-2 text-foreground font-bold">
                                                    <Calendar className="w-3.5 h-3.5 text-racing-blue" />
                                                    <span className="text-[11px] uppercase tracking-tighter">{new Date(booking.appointmentDate).toDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-right sm:text-left">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-60">Slot Time</span>
                                                <div className="flex items-center sm:justify-start justify-end gap-2 text-foreground font-bold font-display">
                                                    <Clock className="w-3.5 h-3.5 text-racing-blue" />
                                                    <span className="text-[11px] uppercase tracking-tighter">{booking.appointmentTime}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-center min-w-[150px]">
                                            {activeTab === 'history' && ['completed', 'delivered'].includes(booking.status) && (
                                                <div className="space-y-2 text-right w-full">
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Workshop Satisfaction</span>

                                                    {booking.rating !== undefined && showRatingEdit !== booking._id ? (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-xl font-display font-black text-racing-blue">{booking.rating}</span>
                                                                    <span className="text-[8px] font-black text-muted-foreground opacity-40 uppercase">/10</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setShowRatingEdit(booking._id)}
                                                                    className="p-1.5 bg-muted rounded-lg hover:bg-racing-blue/10 transition-colors group/edit"
                                                                >
                                                                    <Edit3 className="w-3 h-3 text-muted-foreground group-hover/edit:text-racing-blue" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap justify-end gap-1">
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                                <button
                                                                    key={num}
                                                                    onClick={() => handleRateService(booking._id, num)}
                                                                    className={cn(
                                                                        "w-6 h-6 flex items-center justify-center rounded-md border text-[8px] font-black transition-all",
                                                                        booking.rating === num
                                                                            ? "bg-racing-blue text-white border-racing-blue"
                                                                            : "border-border hover:bg-racing-blue hover:text-white hover:border-racing-blue"
                                                                    )}
                                                                >
                                                                    {num}
                                                                </button>
                                                            ))}
                                                            {showRatingEdit === booking._id && (
                                                                <button onClick={() => setShowRatingEdit(null)} className="w-6 h-6 flex items-center justify-center text-muted-foreground">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {(booking.technicianName || booking.cost != null) && (
                                        <div className="mt-6 pt-4 border-t border-border/10 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-6">
                                                {booking.technicianName && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-40">Tech</span>
                                                        <span className="text-[9px] font-black uppercase text-foreground">{booking.technicianName}</span>
                                                    </div>
                                                )}
                                                {booking.cost != null && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block opacity-40">Cost</span>
                                                        <span className="text-[10px] font-black text-racing-blue">
                                                            {booking.billingType === 'free' ? 'Complementary' : `₹${formatPrice(booking.cost || 0)}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-20 italic">
                                                Ref: {booking._id.slice(-8)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback Section */}
                                    {activeTab === 'history' && ['completed', 'delivered'].includes(booking.status) && (
                                        <div className="mt-4 pt-4 border-t border-border/10">
                                            {showFeedbackEdit === booking._id ? (
                                                <div className="space-y-4">
                                                    <textarea
                                                        value={tempFeedback}
                                                        onChange={(e) => setTempFeedback(e.target.value)}
                                                        placeholder="Share your detailed experience with our workshop team..."
                                                        className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-[11px] font-medium text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-racing-blue outline-none min-h-[100px] transition-all"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setShowFeedbackEdit(null); setTempFeedback(""); }}
                                                            className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveFeedback(booking._id)}
                                                            className="px-6 py-2 bg-racing-blue text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-racing-blue/20 hover:scale-[1.02] transition-all"
                                                        >
                                                            <Save className="w-3 h-3" /> Save Feedback
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    {booking.feedback ? (
                                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 relative group/msg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex items-center gap-2 text-[8px] font-black text-racing-blue uppercase tracking-widest">
                                                                    <MessageSquare className="w-3 h-3" /> Shared Feedback
                                                                </div>
                                                                <button
                                                                    onClick={() => { setShowFeedbackEdit(booking._id); setTempFeedback(booking.feedback || ""); }}
                                                                    className="text-muted-foreground hover:text-racing-blue transition-colors"
                                                                >
                                                                    <Edit3 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                                                "{booking.feedback}"
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setShowFeedbackEdit(booking._id); setTempFeedback(""); }}
                                                            className="w-full py-4 border border-dashed border-border rounded-2xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue hover:border-racing-blue/50 hover:bg-racing-blue/5 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <MessageSquare className="w-4 h-4" /> Give Detailed Feedback
                                                        </button>
                                                    )}
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
