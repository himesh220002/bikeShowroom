"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Calendar, Clock, Bike, Package, CheckCircle2, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { submitServiceBooking } from "@/lib/actions/serviceActions";

type ServiceType = "General" | "Periodic" | "Repair" | "Spares";

export function ServiceBooking() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [serviceType, setServiceType] = useState<ServiceType>("General");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userBikes, setUserBikes] = useState<any[]>([]);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const STANDARD_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    // Form data state
    const [formData, setFormData] = useState({
        bikeModel: "",
        regNumber: "",
        notes: "",
        name: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName,
                phone: prev.phone // Keep phone if already entered, though usually it's null
            }));

            // Fetch user's registered bikes
            axios.get(`${API_URL}/user-bikes`, { withCredentials: true })
                .then(res => {
                    if (res.data.success) {
                        setUserBikes(res.data.data);
                    }
                })
                .catch(err => console.error("Failed to fetch user bikes:", err));
        }
    }, [user]);

    useEffect(() => {
        if (formData.appointmentDate) {
            setLoadingSlots(true);
            axios.get(`${API_URL}/workshop-slots/available?date=${formData.appointmentDate}`)
                .then(res => {
                    if (res.data.success) {
                        setAvailableSlots(res.data.data);
                    }
                })
                .catch(err => console.error("Failed to fetch slots:", err))
                .finally(() => setLoadingSlots(false));
        }
    }, [formData.appointmentDate]);

    const serviceOptions = [
        { id: "General", label: "General Checkup", icon: Wrench, desc: "Standard 21-point inspection" },
        { id: "Periodic", label: "Periodic Service", icon: Calendar, desc: "Based on mileage/time" },
        { id: "Repair", label: "Major Repair", icon: Bike, desc: "Engine, transmission, etc." },
        { id: "Spares", label: "Genuine Spares", icon: Package, desc: "Order specific parts" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await submitServiceBooking({
            ...formData,
            serviceType
        });

        setIsSubmitting(false);
        if (result.success) {
            setSubmitted(true);
        } else {
            alert("Booking failed. Please try again.");
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-card rounded-[3rem] p-12 text-center border border-racing-blue/20 shadow-2xl flex flex-col items-center"
            >
                <div className="w-20 h-20 bg-racing-blue/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-racing-blue" />
                </div>
                <h3 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter mb-4">
                    Booking Confirmed!
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-8 font-medium">
                    Your service request for {formData.bikeModel} has been sent. Our team will contact you at {formData.phone} shortly.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setStep(1); }}
                    className="px-8 py-4 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/80 transition-all border border-border"
                >
                    New Booking
                </button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-card rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-8 md:p-10 border border-border shadow-2xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                    <motion.div
                        className="h-full bg-racing-blue shadow-[0_0_10px_rgba(0,123,255,0.5)]"
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-2 block">Service Center</span>
                        <h2 className="text-3xl md:text-4xl font-display font-black text-foreground uppercase tracking-tighter">
                            SCHEDULE <span className="text-gradient">SERVICE</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Step</span>
                        <div className="text-2xl font-display font-black text-foreground italic">{step}/3</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {serviceOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setServiceType(opt.id as any)}
                                            className={cn(
                                                "p-6 rounded-2xl border text-left transition-all group",
                                                serviceType === opt.id
                                                    ? "bg-racing-blue/10 border-racing-blue"
                                                    : "bg-background/50 border-border hover:border-racing-blue/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                                    serviceType === opt.id ? "bg-racing-blue text-white" : "bg-muted text-muted-foreground group-hover:text-foreground"
                                                )}>
                                                    <opt.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">{opt.label}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{opt.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full py-5 bg-racing-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-racing-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Select Vehicle Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {user && userBikes.length > 0 && (
                                    <div className="p-6 bg-racing-blue/5 border border-racing-blue/20 rounded-[2rem] mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-racing-blue/10 rounded-xl">
                                                <User className="w-4 h-4 text-racing-blue" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Select from Your Garage</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {userBikes.map((bike) => (
                                                <button
                                                    key={bike._id}
                                                    type="button"
                                                    onClick={() => setFormData(p => ({ ...p, bikeModel: bike.bikeModel, regNumber: bike.registrationNumber }))}
                                                    className={cn(
                                                        "p-4 rounded-xl border text-left transition-all",
                                                        formData.regNumber === bike.registrationNumber
                                                            ? "bg-racing-blue border-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                                            : "bg-background border-border text-muted-foreground hover:border-racing-blue/30"
                                                    )}
                                                >
                                                    <p className="text-[10px] font-black uppercase tracking-tight mb-1">{bike.bikeModel}</p>
                                                    <p className={cn(
                                                        "text-[8px] font-bold uppercase",
                                                        bike.registrationNumber ? "opacity-70" : "text-racing-blue"
                                                    )}>
                                                        {bike.registrationNumber || "Registration Pending"}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Bike Model</label>
                                            <input
                                                required
                                                value={formData.bikeModel}
                                                onChange={(e) => setFormData(p => ({ ...p, bikeModel: e.target.value }))}
                                                placeholder="e.g. R15M V4"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration Number</label>
                                                {!formData.regNumber && <span className="text-[8px] font-black text-racing-blue/60 uppercase tracking-widest bg-racing-blue/5 px-2 py-0.5 rounded-full">Optional for New Bikes</span>}
                                            </div>
                                            <input
                                                value={formData.regNumber}
                                                onChange={(e) => setFormData(p => ({ ...p, regNumber: e.target.value }))}
                                                placeholder="e.g. BR 11 XY 0000 or 'NEW BIKE'"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Additional Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                                            placeholder="Describe any specific issues..."
                                            rows={3}
                                            className="w-full bg-background border border-border rounded-3xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="py-5 bg-muted text-foreground border border-border rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-muted/80 transition-all w-full"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="py-5 bg-racing-blue text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-lg shadow-racing-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full"
                                    >
                                        Next: Date & Time <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                            placeholder="Your Name"
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            maxLength={10}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                if (val.length <= 10) {
                                                    setFormData(p => ({ ...p, phone: val }));
                                                }
                                            }}
                                            placeholder="10-digit mobile number"
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Preferred Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.appointmentDate}
                                            onChange={(e) => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Select Time Slot</label>
                                        {!formData.appointmentDate ? (
                                            <div className="p-8 border border-dashed border-border rounded-3xl text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Please select a date first</p>
                                            </div>
                                        ) : loadingSlots ? (
                                            <div className="grid grid-cols-3 gap-3">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {STANDARD_SLOTS.map(time => {
                                                    const slotInfo = availableSlots.find(s => s.slotTime === time);
                                                    const capacity = slotInfo?.capacity ?? 5;
                                                    const bookedCount = slotInfo?.bookedCount ?? 0;
                                                    const isFull = bookedCount >= capacity;
                                                    const isSelected = formData.appointmentTime === time;

                                                    return (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            disabled={isFull}
                                                            onClick={() => setFormData(p => ({ ...p, appointmentTime: time }))}
                                                            className={cn(
                                                                "relative p-4 rounded-xl border transition-all text-center group",
                                                                isSelected
                                                                    ? "bg-racing-blue border-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                                                    : isFull
                                                                        ? "bg-muted/50 border-border opacity-50 cursor-not-allowed"
                                                                        : "bg-background border-border hover:border-racing-blue/50"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "text-[12px] font-black uppercase tracking-tight mb-1",
                                                                isSelected ? "text-white" : "text-foreground"
                                                            )}>
                                                                {time}
                                                            </div>
                                                            <div className={cn(
                                                                "text-[8px] font-bold uppercase tracking-widest",
                                                                isSelected ? "text-white/70" : isFull ? "text-red-500" : "text-racing-blue"
                                                            )}>
                                                                {isFull ? "Fully Booked" : `${capacity - bookedCount} Slots Left`}
                                                            </div>
                                                            {isSelected && (
                                                                <motion.div
                                                                    layoutId="activeSlot"
                                                                    className="absolute inset-0 border-2 border-white/20 rounded-xl"
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="py-5 bg-muted text-foreground border border-border rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-muted/80 transition-all w-full"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={cn(
                                            "py-5 bg-racing-blue text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-lg shadow-racing-blue/20 transition-all flex items-center justify-center gap-2 w-full",
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                                        )}
                                    >
                                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                                    </button>
                                </div>
                                <div className="p-6 bg-racing-blue/10 border border-racing-blue/20 rounded-2xl">
                                    <div className="flex items-center gap-3 text-foreground mb-2">
                                        <Clock className="w-4 h-4 text-racing-blue" />
                                        <span className="text-xs font-black uppercase tracking-widest">Fast Track Protocol</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                        Our workshop manager will call you within 12 to 24 hours of submission to confirm your preferred time slot and pickup options.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
