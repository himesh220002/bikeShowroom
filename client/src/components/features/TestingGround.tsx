"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import {
    FlaskConical,
    Send,
    Wrench,
    CheckCircle2,
    AlertCircle,
    Loader2,
    UserPlus,
    Megaphone,
    Clock,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const TEST_NUMBERS = ["9471283523", "8105542318"];
const STANDARD_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function TestingGround() {
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState<any[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const today = new Date().toISOString().split('T')[0];

    const fetchTodaySlots = async () => {
        try {
            const res = await axios.get(`${API_URL}/workshop-slots/available?date=${today}`);
            if (res.data.success) {
                setSlots(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch today's slots:", err);
        }
    };

    useEffect(() => {
        fetchTodaySlots();
    }, []);

    const toggleSlotFull = async (time: string, isFull: boolean) => {
        setLoading(true);
        try {
            // If marking full, we set capacity to current bookedCount OR 1 if 0.
            // If resetting, we set capacity back to 5.
            const slot = slots.find(s => s.slotTime === time);
            const currentBooked = slot?.bookedCount || 0;
            const newCapacity = isFull ? (currentBooked > 0 ? currentBooked : 0) : 5;

            // To mark as "Full", we can also set capacity to bookedCount.
            // But if bookedCount is 0 and we want it full, we set capacity to 0.

            const res = await axios.put(`${API_URL}/workshop-slots/capacity`, {
                date: today,
                slotTime: time,
                capacity: isFull ? currentBooked : 5
            });

            if (res.data.success) {
                fetchTodaySlots();
                setMessage({ type: 'success', text: `Slot ${time} marked as ${isFull ? 'FULL' : 'AVAILABLE'}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Failed to toggle slot" });
        } finally {
            setLoading(false);
        }
    };

    const launchTestBroadcast = async () => {
        setLoading(true);
        setMessage(null);
        try {
            // 1. Ensure test customers exist
            const recipientIds: string[] = [];
            for (const phone of TEST_NUMBERS) {
                // Upsert customer
                const custRes = await axios.post(`${API_URL}/services`, {
                    name: `Test User (${phone.slice(-4)})`,
                    phone: phone,
                    bikeModel: "Test Bike",
                    regNumber: "TEST-0000",
                    serviceType: "General",
                    interests: ["TEST_USER"],
                    source: "Testing Ground",
                    appointmentDate: today,
                    appointmentTime: "09:00"
                });
                // Note: /services route upserts customer and returns the service object which contains customer reference or we can find the customer.
                // For simplicity, we'll search for them by phone now.
                const findRes = await axios.get(`${API_URL}/customers?search=${phone}`);
                if (findRes.data.success && findRes.data.data.length > 0) {
                    recipientIds.push(findRes.data.data[0]._id);
                }
            }

            if (recipientIds.length === 0) throw new Error("Could not identify test recipients");

            // 2. Launch Campaign
            const campaignRes = await axios.post(`${API_URL}/campaigns`, {
                name: "Test Broadcast Run",
                type: "Testing",
                content: "This is a test broadcast from the Workshop Testing Ground. System is functioning normally. 🧪",
                recipientIds: recipientIds
            });

            if (campaignRes.data.success) {
                setMessage({ type: 'success', text: `Broadcast successfully sent to ${recipientIds.length} test numbers.` });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || err.message || "Broadcast failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-1">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-racing-blue/10 rounded-2xl border border-racing-blue/20">
                    <FlaskConical className="w-6 h-6 text-racing-blue" />
                </div>
                <div>
                    <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter italic">
                        TESTING <span className="text-gradient">GROUND</span>
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Experimental tools for system verification</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workshop Slot Test */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wrench className="w-24 h-24 rotate-12" />
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <div className="p-2 bg-purple-500/10 rounded-xl">
                            <Clock className="w-5 h-5 text-purple-500" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Workshop Slot Marking</h4>
                    </div>

                    <p className="text-xs text-muted-foreground font-medium">Toggle availability for today's slots to test the customer booking interface behavior.</p>

                    <div className="grid grid-cols-3 gap-3">
                        {STANDARD_SLOTS.map(time => {
                            const slot = slots.find(s => s.slotTime === time);
                            const isFull = slot ? slot.bookedCount >= slot.capacity : false;

                            return (
                                <button
                                    key={time}
                                    disabled={loading}
                                    onClick={() => toggleSlotFull(time, !isFull)}
                                    className={cn(
                                        "px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                        isFull
                                            ? "bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/20"
                                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    {time}
                                    <span className="block text-[7px] mt-0.5 opacity-60">{isFull ? 'FULL' : 'OK'}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Campaign Broadcast Test */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Megaphone className="w-24 h-24 -rotate-12" />
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <div className="p-2 bg-green-500/10 rounded-xl">
                            <Megaphone className="w-5 h-5 text-green-500" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">CRM Broadcast Test</h4>
                    </div>

                    <p className="text-xs text-muted-foreground font-medium font-bold uppercase tracking-widest">Recipient Numbers:</p>
                    <div className="flex gap-2">
                        {TEST_NUMBERS.map(num => (
                            <span key={num} className="bg-muted px-3 py-1.5 rounded-lg text-[10px] font-bold text-foreground border border-border">
                                +91 {num}
                            </span>
                        ))}
                    </div>

                    <button
                        disabled={loading}
                        onClick={launchTestBroadcast}
                        className="w-full py-4 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-racing-blue/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Run Test Broadcast
                    </button>

                    <p className="text-[8px] text-muted-foreground italic text-center uppercase tracking-widest font-bold">This will create test CRM profiles if missing</p>
                </div>
            </div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={cn(
                            "fixed bottom-8 right-8 p-4 rounded-2xl border shadow-2xl z-50 flex items-center gap-3 max-w-sm",
                            message.type === 'success' ? "bg-green-500 border-green-600 text-white" : "bg-red-500 border-red-600 text-white"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-70">
                            <Clock className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
