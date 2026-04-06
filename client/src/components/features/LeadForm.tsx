"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Loader2, Send, Phone, User, MessageSquare, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { submitLead } from "@/lib/actions/leadActions";
import { useAuth } from "@/context/AuthContext";

const interests = [
    { id: "R15", label: "R15 Series", score: 10 },
    { id: "MT", label: "MT Series", score: 9 },
    { id: "FZ", label: "FZ Series", score: 8 },
    { id: "AEROX", label: "Aerox 155", score: 9 },
    { id: "XSR", label: "XSR 155", score: 9 },
    { id: "SCOOTER", label: "RayZR / Fascino", score: 7 },
    { id: "SERVICE", label: "Service Request", score: 6 },
    { id: "EMI", label: "EMI / Finance", bonus: "+50 Score" },
    { id: "BOOKING", label: "Booking Request", score: 8 },
    { id: "PRE-ORDER", label: "Pre-order", score: 5 }
];

interface LeadFormProps {
    defaultInterest?: string;
    bikeModel?: string;
}

export function LeadForm({ defaultInterest, bikeModel }: LeadFormProps) {
    const { user } = useAuth();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [response, setResponse] = useState<{ score?: number, message?: string }>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const getInitialNotes = () => {
        if (defaultInterest === "BOOKING") return `I'm interested in booking the ${bikeModel || 'bike'}. Please contact me with details.`;
        if (defaultInterest === "EMI") return `I'm interested in finance options for the ${bikeModel || 'bike'}.`;
        if (defaultInterest === "PRE-ORDER") return `I want to pre-order the ${bikeModel || 'bike'} in the selected colour.`;
        return "";
    };

    const [notes, setNotes] = useState(getInitialNotes());

    // Auto-selection logic
    const isItemSelected = (item: typeof interests[0]) => {
        if (defaultInterest === item.id) return true;
        if (bikeModel) {
            const modelUpper = bikeModel.toUpperCase();
            if (modelUpper.includes("R15") && item.id === "R15") return true;
            if (modelUpper.includes("MT") && item.id === "MT") return true;
            if (modelUpper.includes("FZ") && item.id === "FZ") return true;
            if (modelUpper.includes("AEROX") && item.id === "AEROX") return true;
            if (modelUpper.includes("XSR") && item.id === "XSR") return true;
            if ((modelUpper.includes("RAYZR") || modelUpper.includes("FASCINO")) && item.id === "SCOOTER") return true;
        }
        return false;
    };

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const interest = formData.getAll("interest");

        const newErrors: Record<string, string> = {};

        if (!name || name.length < 2) newErrors.name = "Please enter your full name.";
        if (!phone || !/^[0-9]{10}$/.test(phone)) newErrors.phone = "Enter a valid 10-digit number.";
        if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address.";
        if (interest.length === 0) newErrors.interest = "Select at least one interest.";


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStatus("submitting");

        const result = await submitLead(formData);

        if (result.success) {
            setResponse({ score: result.data?.score, message: result.message });
            setStatus("success");
            setErrors({});
        } else {
            setStatus("idle");
            setErrors({ server: result.message });
        }
    }

    return (
        <div className="relative w-full text-left overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-racing-blue/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    {/* Form Container */}
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full bg-card/80 backdrop-blur-md rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-center border border-racing-blue/20 shadow-2xl shadow-racing-blue/10 flex flex-col items-center gpu-accelerated"
                            >
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-green-500/40">
                                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4 uppercase tracking-tighter">Inquiry Logged!</h3>
                                <p className="text-muted-foreground mb-8 md:mb-10 max-w-sm font-medium leading-relaxed font-sans text-sm">
                                    Wait for the thrill. Our specialists at Choudhary Yamaha will reach out shortly.
                                    {response.score && <span className="block mt-4 text-racing-blue font-black uppercase text-xs tracking-widest">Lead Priority Score: {response.score}</span>}
                                </p>
                                <button
                                    onClick={() => {
                                        setStatus("idle");
                                    }}
                                    className="bg-card border border-border px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all text-foreground"
                                >
                                    New Inquiry
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full bg-card/80 backdrop-blur-md rounded-[2.5rem] md:rounded-[3.5rem] p-4 sm:p-6 md:p-10 lg:p-14 shadow-2xl border border-border gpu-accelerated"
                            >
                                <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
                                    {errors.server && (
                                        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 mb-6">
                                            <Info className="w-5 h-5 text-red-500 shrink-0" />
                                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{errors.server}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-2">Pilot Name</label>
                                            <div className="relative">
                                                <User className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.name ? "text-red-500" : "text-muted-foreground")} />
                                                <input
                                                    name="name"
                                                    type="text"
                                                    defaultValue={user?.displayName || ""}
                                                    placeholder="Who's riding?"
                                                    className={cn(
                                                        "w-full bg-background border focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-3 md:py-4 text-sm font-black text-foreground transition-all outline-none",
                                                        errors.name ? "border-red-500 bg-red-50" : "border-border"
                                                    )}
                                                />
                                            </div>
                                            {errors.name && <p className="text-[9px] text-red-500 font-black uppercase ml-2 tracking-tighter">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-2">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.phone ? "text-red-500" : "text-muted-foreground")} />
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    defaultValue={user?.phone || ""}
                                                    pattern="[0-9]{10}"
                                                    maxLength={10}
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        let val = target.value.replace(/[^0-9]/g, '');
                                                        if (val.length > 10) val = val.slice(0, 10);
                                                        target.value = val;
                                                    }}
                                                    placeholder="Mobile number"
                                                    className={cn(
                                                        "w-full bg-background border focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-3 md:py-4 text-sm font-black text-foreground transition-all outline-none",
                                                        errors.phone ? "border-red-500 bg-red-50" : "border-border"
                                                    )}
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[9px] text-red-500 font-black uppercase ml-2 tracking-tighter">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-2">Email Address<span className="text-muted-foreground/60">(optional)</span></label>
                                            <div className="relative">
                                                <Send className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.email ? "text-red-500" : "text-muted-foreground shadow-xl")} />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    defaultValue={user?.email || ""}
                                                    placeholder="email@example.com (optional)"
                                                    className={cn(
                                                        "w-full bg-background border focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-3 md:py-4 text-sm font-black text-foreground transition-all outline-none",
                                                        errors.email ? "border-red-500 bg-red-50" : "border-border"
                                                    )}
                                                />
                                            </div>
                                            {errors.email && <p className="text-[9px] text-red-500 font-black uppercase ml-2 tracking-tighter">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-2">Interested In</label>
                                        <div className={cn(
                                            "grid grid-cols-5 lg:grid-cols-3 xl:grid-cols-6 gap-1 sm:gap-2 justify-items-center transition-colors p-1 rounded-3xl",
                                            errors.interest && "border border-red-500/50 bg-red-500/5"
                                        )}>
                                            {interests.map((item) => (
                                                <label key={item.id} className="relative group cursor-pointer block w-full max-w-[100px]">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        name="interest"
                                                        value={item.label}
                                                        defaultChecked={isItemSelected(item)}
                                                    />
                                                    <div className="px-1 py-2 sm:px-2 sm:py-3 rounded-xl bg-background border border-border peer-checked:border-racing-blue/90 peer-checked:bg-racing-blue/20 transition-all flex flex-col gap-1 items-center justify-center text-center h-full min-h-[50px]">
                                                        <span className="text-[10px] sm:text-[14px] lg:text-[12px] xl:text-[14px] font-black uppercase tracking-tight text-foreground peer-checked:text-racing-blue transition-colors leading-tight">
                                                            {item.label}
                                                        </span>
                                                        {(item.bonus || (bikeModel && isItemSelected(item))) && (
                                                            <span className="text-[6px] font-black text-racing-blue opacity-0 peer-checked:opacity-100 transition-opacity mt-1">
                                                                {item.bonus || "SELECTED"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.interest && <p className="text-[9px] text-red-500 font-black uppercase ml-2 tracking-tighter">{errors.interest}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[12px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-2">
                                            Inquiry Notes (Optional)
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={1}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="EMI preferences, test ride schedule..."
                                            className="w-full bg-background border border-border focus:border-racing-blue/30 
                                                rounded-2xl md:rounded-3xl px-6 md:px-8 py-3 md:py-4 text-sm font-black text-foreground transition-all outline-none
                                                resize-y overflow-hidden max-h-[150px]"
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = "auto";
                                                target.style.height = Math.min(target.scrollHeight, 150) + "px";
                                                target.style.overflowY = target.scrollHeight > 150 ? "auto" : "hidden";
                                            }}
                                        />
                                    </div>


                                    <input type="hidden" name="bikeModel" value={bikeModel || ""} />

                                    <button
                                        disabled={status === "submitting"}
                                        className={cn(
                                            "w-full bg-racing-blue hover:bg-dark-racing text-white py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl shadow-racing-blue/30 group",
                                            status === "submitting" && "opacity-80 pointer-events-none"
                                        )}
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                SUBMITTING...
                                            </>
                                        ) : (
                                            <>
                                                INITIATE INQUIRY
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-[8px] text-muted-foreground font-black text-center uppercase tracking-[0.2em] px-4 md:px-8 leading-relaxed opacity-70">
                                        Data secured with Choudhary Yamaha Encryption.
                                        By submitting, you agree to our digital terms.
                                    </p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
