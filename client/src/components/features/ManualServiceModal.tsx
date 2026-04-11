"use client";

import { useState } from "react";
import { X, User, Phone, Bike, Calendar, Clock, ShieldAlert, Wrench, Loader2, Save, IndianRupee, Tag, ChevronDown, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";

interface ManualServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newJob: any) => void;
}

export function ManualServiceModal({ isOpen, onClose, onSuccess }: ManualServiceModalProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        bikeModel: "",
        regNumber: "",
        serviceType: "Maintenance",
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: "10:30 AM",
        priority: "Normal",
        technicianName: "",
        billingType: "paid" as 'free' | 'paid',
        cost: 0,
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/services`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                onSuccess(data.data);
                onClose();
                // Reset form
                setForm({
                    name: "",
                    phone: "",
                    bikeModel: "",
                    regNumber: "",
                    serviceType: "Maintenance",
                    appointmentDate: new Date().toISOString().split('T')[0],
                    appointmentTime: "10:30 AM",
                    priority: "Normal",
                    technicianName: "",
                    billingType: "paid",
                    cost: 0,
                    notes: ""
                });
            } else {
                alert(data.message || data.error || "Failed to add service");
            }
        } catch (err) {
            console.error("Error adding manual service:", err);
            alert("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-racing-blue/50 via-racing-blue to-racing-blue/50" />

                        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">
                                        ADD <span className="text-gradient">WALK-IN SERVICE</span>
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Directly allot a service slot for walk-in customers</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-muted rounded-2xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Enter full name"
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="text"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="10-digit mobile number"
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bike Model</label>
                                        <div className="relative group">
                                            <Bike className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="text"
                                                value={form.bikeModel}
                                                onChange={(e) => setForm({ ...form, bikeModel: e.target.value })}
                                                placeholder="e.g. MT-15 V2"
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registration Number</label>
                                        <div className="relative group">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="text"
                                                value={form.regNumber}
                                                onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                                                placeholder="e.g. KA-01-EF-1234"
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all uppercase"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Type</label>
                                        <div className="relative group">
                                            <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="text"
                                                value={form.serviceType}
                                                onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Appointment Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="date"
                                                value={form.appointmentDate}
                                                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all [color-scheme:dark]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Appointment Time</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                type="text"
                                                value={form.appointmentTime}
                                                onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                                                placeholder="e.g. 10:45 AM"
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
                                        <div className="relative group">
                                            <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <select
                                                value={form.priority}
                                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                                className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Normal">Normal</option>
                                                <option value="High">High</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Technician</label>
                                    <div className="relative group">
                                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                        <input
                                            type="text"
                                            value={form.technicianName}
                                            onChange={(e) => setForm({ ...form, technicianName: e.target.value })}
                                            placeholder="Enter technician name"
                                            className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Billing Configuration */}
                                <div className="border border-border/60 rounded-2xl p-5 space-y-4 bg-muted/10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> Billing Configuration
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['paid', 'free'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setForm({ ...form, billingType: type, cost: type === 'free' ? 0 : form.cost })}
                                                className={cn(
                                                    "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    form.billingType === type
                                                        ? type === 'paid'
                                                            ? "bg-racing-blue text-white border-racing-blue shadow-lg shadow-racing-blue/20"
                                                            : "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                                        : "bg-background text-muted-foreground border-border hover:border-racing-blue/30"
                                                )}
                                            >
                                                {type === 'paid' ? '💳 Paid Service' : '🎁 Free Service'}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-racing-blue">
                                            {form.billingType === 'free' ? 'Extra Charges (if any)' : 'Final Bill Amount'}
                                        </label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-blue" />
                                            <input
                                                type="number"
                                                min="0"
                                                value={form.cost}
                                                onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                                                placeholder="0.00"
                                                className="w-full bg-racing-blue/5 border border-racing-blue/20 rounded-xl pl-11 pr-4 py-3.5 text-xs font-black text-racing-blue focus:outline-none focus:border-racing-blue/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {loading ? "Allocating Slot..." : "Allot Service Slot"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-8 py-4 bg-muted text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all active:scale-[0.98]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
