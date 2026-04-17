"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { Clock, Calendar, Save, Loader2, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const STANDARD_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function SlotManagement() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/workshop-slots/available?date=${selectedDate}`);
            const data = res.data as any;
            if (data.success) {
                setSlots(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch slots:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const handleCapacityUpdate = async (time: string, capacity: number) => {
        setSaving(time);
        setMessage(null);
        try {
            const res = await axios.put(`${API_URL}/workshop-slots/capacity`, {
                date: selectedDate,
                slotTime: time,
                capacity: Number(capacity)
            });
            const data = res.data as any;
            if (data.success) {
                // Update local state
                const updatedSlot = data.data;
                setSlots(prev => {
                    const exists = prev.find(s => s.slotTime === time);
                    if (exists) {
                        return prev.map(s => s.slotTime === time ? updatedSlot : s);
                    }
                    return [...prev, updatedSlot];
                });
                setMessage({ type: 'success', text: `Capacity updated for ${time}` });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || "Failed to update capacity" });
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 sm:p-0 pb-2 rounded-[2rem] border border-border">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-racing-blue" />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter italic">
                            CAPACITY <span className="text-gradient">PLANNING</span>
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Select date to manage workshop slots</p>
                    </div>
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-racing-blue transition-all [color-scheme:dark]"
                />
            </div>

            <AnimatePresence mode="wait">
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            "p-4 rounded-xl border flex items-center gap-3",
                            message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Capacity Data...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {STANDARD_SLOTS.map((time) => {
                        const slotInfo = slots.find(s => s.slotTime === time);
                        const capacity = slotInfo?.capacity ?? 4;
                        const bookedCount = slotInfo?.bookedCount ?? 0;
                        const isSaving = saving === time;

                        return (
                            <div
                                key={time}
                                className="bg-card border border-border rounded-[2rem] p-6 group hover:border-racing-blue/50 transition-all shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:rotate-12 transition-transform">
                                            <Clock className="w-5 h-5 text-racing-blue" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-display font-black text-foreground italic">{time}</span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", bookedCount >= capacity ? "bg-red-500" : "bg-green-500")} />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {bookedCount >= capacity ? "FULL" : "AVAILABLE"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Booked</span>
                                        <span className="text-xl font-display font-black text-racing-blue italic leading-none">{bookedCount}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Capacity</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={bookedCount}
                                                defaultValue={capacity}
                                                onBlur={(e) => {
                                                    const newVal = Number(e.target.value);
                                                    if (newVal !== capacity && newVal >= bookedCount) {
                                                        handleCapacityUpdate(time, newVal);
                                                    }
                                                }}
                                                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-racing-blue transition-all"
                                            />
                                            <button
                                                disabled={isSaving}
                                                className="p-2.5 bg-racing-blue/10 text-racing-blue rounded-xl hover:bg-racing-blue hover:text-white transition-all disabled:opacity-50"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(bookedCount / capacity) * 100}%` }}
                                                className={cn(
                                                    "h-full rounded-full transition-all",
                                                    bookedCount >= capacity ? "bg-red-500" : "bg-racing-blue shadow-[0_0_10px_rgba(0,123,255,0.4)]"
                                                )}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Utilization</span>
                                            <span className="text-[8px] font-black text-foreground">{Math.round((bookedCount / capacity) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
