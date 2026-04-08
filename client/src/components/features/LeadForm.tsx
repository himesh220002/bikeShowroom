"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, Loader2, Phone, User, Send, MapPin, MessageCircle, Gift, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { submitLead } from "@/lib/actions/leadActions";
import { useAuth } from "@/context/AuthContext";
import { useConfig } from "@/components/providers/ConfigProvider";

const categories = [
    {
        name: "Sports & Naked",
        items: [
            { id: "R15", label: "R15 Series", score: 10 },
            { id: "MT", label: "MT Series", score: 9 },
            { id: "FZ", label: "FZ Series", score: 8 },
            { id: "XSR", label: "XSR 155", score: 9 },
        ]
    },
    {
        name: "Performance Scooters",
        items: [
            { id: "AEROX", label: "Aerox 155", score: 9 },
            { id: "SCOOTER", label: "RayZR / Fascino", score: 7 },
        ]
    },
    {
        name: "Services & Offers",
        items: [
            { id: "SERVICE", label: "Service", score: 6 },
            { id: "EMI", label: "Finance/EMI", bonus: "LOW ROI" },
            { id: "BOOKING", label: "Fast Booking", score: 8 },
            { id: "PRE-ORDER", label: "Pre-order", score: 5 }
        ]
    }
];

interface LeadFormProps {
    defaultInterest?: string;
    bikeModel?: string;
}

export function LeadForm({ defaultInterest, bikeModel }: LeadFormProps) {
    const { user } = useAuth();
    const { config } = useConfig();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [response, setResponse] = useState<{ score?: number, message?: string }>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [utm, setUtm] = useState<Record<string, string>>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const capturedUtm: Record<string, string> = {};
            ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(key => {
                const val = params.get(key);
                if (val) capturedUtm[key] = val;
            });
            setUtm(capturedUtm);
        }
    }, []);

    const getInitialNotes = () => {
        if (defaultInterest === "BOOKING") return `I'm interested in booking the ${bikeModel || 'bike'}. Please contact me with details.`;
        if (defaultInterest === "EMI") return `I'm interested in finance options for the ${bikeModel || 'bike'}.`;
        if (defaultInterest === "PRE-ORDER") return `I want to pre-order the ${bikeModel || 'bike'} in the selected colour.`;
        return "";
    };

    const [notes, setNotes] = useState(getInitialNotes());

    const isItemSelected = (id: string) => {
        if (defaultInterest === id) return true;
        if (bikeModel) {
            const modelUpper = bikeModel.toUpperCase();
            if (modelUpper.includes("R15") && id === "R15") return true;
            if (modelUpper.includes("MT") && id === "MT") return true;
            if (modelUpper.includes("FZ") && id === "FZ") return true;
            if (modelUpper.includes("AEROX") && id === "AEROX") return true;
            if (modelUpper.includes("XSR") && id === "XSR") return true;
            if ((modelUpper.includes("RAYZR") || modelUpper.includes("FASCINO")) && id === "SCOOTER") return true;
        }
        return false;
    };

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);

        // Manual validation
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const interest = formData.getAll("interest");

        const newErrors: Record<string, string> = {};
        if (!name || name.length < 2) newErrors.name = "Full name required.";
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Enter a valid 10-digit number.";
        if (interest.length === 0) newErrors.interest = "Select your interest.";

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
            <div className="max-w-7xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-card/90 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-center border border-racing-blue/20 shadow-2xl flex flex-col items-center"
                        >
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/40">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4 uppercase tracking-tighter">Your Ride Awaits!</h3>
                            <p className="text-muted-foreground mb-10 max-w-sm font-medium leading-relaxed text-sm">
                                Thanks for choosing Choudhary Yamaha. Our team will contact you shortly. **Connect with us now to speed up the process.**
                            </p>

                            {/* Showroom Connect Panel */}
                            <div className="w-full max-w-md grid grid-cols-1 gap-4 mb-10">
                                <a
                                    href={config.showroomMap}
                                    target="_blank"
                                    className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-racing-blue/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-racing-blue/10 rounded-xl flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-racing-blue" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visit Us</span>
                                            <span className="text-sm font-bold text-white uppercase">Get Directions</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-racing-blue group-hover:translate-x-1 transition-all" />
                                </a>

                                <a
                                    href={`https://wa.me/${config.showroomPhone.replace(/\D/g, '')}?text=Hi, I just submitted an inquiry on your website. I am interested in a Yamaha bike.`}
                                    target="_blank"
                                    className="flex items-center justify-between p-4 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#25D366]/20 rounded-xl flex items-center justify-center">
                                            <MessageCircle className="w-5 h-5 text-[#25D366]" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] font-black text-[#25D366] uppercase tracking-widest">Direct Support</span>
                                            <span className="text-sm font-bold text-white uppercase">Chat on WhatsApp</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#25D366]/40 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
                                </a>

                                <a
                                    href={`tel:${config.showroomPhone.replace(/\s+/g, '')}`}
                                    className="flex items-center justify-between p-4 bg-racing-blue rounded-2xl hover:bg-dark-racing transition-all group shadow-xl shadow-racing-blue/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] font-black text-white/60 uppercase tracking-widest">Priority Call</span>
                                            <span className="text-sm font-bold text-white uppercase">Call Showroom</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </a>
                            </div>

                            <button
                                onClick={() => setStatus("idle")}
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Submit another inquiry
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full bg-card/80 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] p-4 sm:p-6 md:p-10 lg:p-12 shadow-2xl border border-border"
                        >


                            <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-8">
                                {errors.server && (
                                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3">
                                        <Info className="w-5 h-5 text-red-500 shrink-0" />
                                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{errors.server}</p>
                                    </div>
                                )}

                                {/* Hidden UTM Tags */}
                                {Object.entries(utm).map(([key, value]) => (
                                    <input key={key} type="hidden" name={key} value={value} />
                                ))}
                                <input type="hidden" name="bikeModel" value={bikeModel || ""} />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Your Name</label>
                                        <div className="relative">
                                            <User className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.name ? "text-red-500" : "text-muted-foreground")} />
                                            <input
                                                name="name"
                                                type="text"
                                                defaultValue={user?.displayName || ""}
                                                placeholder="Who's riding?"
                                                className={cn(
                                                    "w-full bg-background border focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-3 md:py-4 text-sm font-black text-foreground transition-all outline-none",
                                                    errors.name ? "border-red-500" : "border-border"
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", errors.phone ? "text-red-500" : "text-muted-foreground")} />
                                            <input
                                                name="phone"
                                                type="tel"
                                                defaultValue={user?.phone || ""}
                                                maxLength={10}
                                                placeholder="Mobile number"
                                                className={cn(
                                                    "w-full bg-background border focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-3 md:py-4 text-sm font-black text-foreground transition-all outline-none",
                                                    errors.phone ? "border-red-500" : "border-border"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Categorized Interests */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">What are you looking for?</label>
                                    <div className="space-y-6">
                                        {categories.map((cat) => (
                                            <div key={cat.name} className="space-y-3">
                                                <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-900 border-l-2 border-racing-blue/30 pl-3 ml-2">{cat.name}</h5>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {cat.items.map((item) => (
                                                        <label key={item.id} className="relative cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                name="interest"
                                                                value={item.label}
                                                                defaultChecked={isItemSelected(item.id)}
                                                            />
                                                            <div className="px-3 py-3 sm:py-4 rounded-2xl bg-racing-blue/10 border border-border peer-checked:border-racing-blue/90 peer-checked:bg-racing-blue/30 transition-all flex flex-col items-center justify-center text-center h-full">
                                                                <span className="text-[12px] font-black uppercase tracking-tighter text-foreground peer-checked:text-racing-blue transition-colors">
                                                                    {item.label}
                                                                </span>
                                                                {item.bonus && (
                                                                    <span className="text-[7px] font-black text-racing-blue mt-1 uppercase tracking-widest">{item.bonus}</span>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.interest && <p className="text-[9px] text-red-500 font-black uppercase ml-2 tracking-tighter">{errors.interest}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Inquiry Notes (Optional)</label>
                                    <textarea
                                        name="message"
                                        rows={2}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="EMI preferences, test ride schedule..."
                                        className="w-full bg-background border border-border focus:border-racing-blue/30 rounded-2xl md:rounded-3xl px-8 py-4 text-sm font-black text-foreground transition-all outline-none resize-none max-h-[150px]"
                                    />
                                </div>

                                <button
                                    disabled={status === "submitting"}
                                    className={cn(
                                        "w-full bg-racing-blue hover:bg-dark-racing text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl shadow-racing-blue/20",
                                        status === "submitting" && "opacity-80 pointer-events-none"
                                    )}
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            SENDING INQUIRY...
                                        </>
                                    ) : (
                                        <>
                                            INITIATE INQUIRY
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <p className="text-[8px] text-zinc-500 font-black text-center uppercase tracking-widest opacity-60">
                                    Privacy protected with enterprise encryption.
                                </p>

                                {/* Funnel Incentive Banner */}
                                {/* <div className="mb-10 p-4 bg-racing-blue/10 border border-racing-blue/20 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-racing-blue/20 blur-[60px] -translate-y-1/2 translate-x-1/2" />
                                    <div className="w-12 h-12 bg-racing-blue rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-racing-blue/30 group-hover:scale-110 transition-transform">
                                        <Gift className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-racing-blue leading-none mb-1">Showroom Exclusive</h4>
                                        <p className="text-xs font-bold text-foreground">Get a **DISCOUNTED YAMAHA CO-BRANDED HELMET** on every new bike booking today!</p>
                                    </div>
                                </div> */}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
