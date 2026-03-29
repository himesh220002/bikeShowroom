"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Loader2, Send, Phone, User, MessageSquare, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { submitLead } from "@/lib/actions/leadActions";
import { useAuth } from "@/context/AuthContext";

const interests = [
    { id: "R15", label: "R15 Series", score: 0 },
    { id: "MT", label: "MT-15 V2", score: 0 },
    { id: "FZ", label: "FZ Series", score: 0 },
    { id: "AEROX", label: "Aerox 155", score: 0 },
    { id: "XSR", label: "XSR 155", score: 0 },
    { id: "SCOOTER", label: "RayZR / Fascino", score: 0 },
    { id: "SERVICE", label: "Service Request", score: 0 },
    { id: "EMI", label: "EMI / Finance", bonus: "+50 Score" },
    { id: "EXCHANGE", label: "Exchange / Value", bonus: "+45 Score" },
    { id: "BOOKING", label: "Booking Request", score: 0 },
    { id: "PRE-ORDER", label: "Pre-order", score: 0 }
];

interface LeadFormProps {
    defaultInterest?: string;
    bikeModel?: string;
}

export function LeadForm({ defaultInterest, bikeModel }: LeadFormProps) {
    const { user } = useAuth();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [response, setResponse] = useState<{ score?: number, message?: string }>({});

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
        setStatus("submitting");

        const formData = new FormData(e.currentTarget);
        const result = await submitLead(formData);

        if (result.success) {
            setResponse({ score: result.data?.score, message: result.message });
            setStatus("success");
        } else {
            setStatus("idle");
            alert(result.message);
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
                                className="w-full bg-zinc-800 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-center border border-racing-blue/20 shadow-2xl shadow-racing-blue/10 flex flex-col items-center"
                            >
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-green-500/40">
                                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-4 uppercase tracking-tighter">Inquiry Logged!</h3>
                                <p className="text-gray-400 mb-8 md:mb-10 max-w-sm font-medium leading-relaxed font-sans text-sm">
                                    Wait for the thrill. Our specialists at Choudhary Yamaha will reach out shortly.
                                    {response.score && <span className="block mt-4 text-racing-blue font-black uppercase text-xs tracking-widest">Lead Priority Score: {response.score}</span>}
                                </p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="bg-zinc-900 border border-zinc-700 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all text-gray-300"
                                >
                                    New Inquiry
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full bg-zinc-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-8 md:p-14 shadow-2xl border border-zinc-800"
                            >
                                <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">Pilot Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    required
                                                    name="name"
                                                    type="text"
                                                    defaultValue={user?.displayName || ""}
                                                    placeholder="Who's riding?"
                                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-4 md:py-5 text-sm font-black text-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    required
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
                                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-4 md:py-5 text-sm font-black text-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">Email Address</label>
                                            <div className="relative">
                                                <Send className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 shadow-xl" />
                                                <input
                                                    required
                                                    name="email"
                                                    type="email"
                                                    defaultValue={user?.email || ""}
                                                    placeholder="email@example.com"
                                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 rounded-2xl md:rounded-3xl pl-14 pr-8 py-4 md:py-5 text-sm font-black text-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">Interested In</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                                            {interests.map((item) => (
                                                <label key={item.id} className="relative group cursor-pointer block w-full">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        name="interest"
                                                        value={item.label}
                                                        defaultChecked={isItemSelected(item)}
                                                    />
                                                    <div className="px-2 py-3 sm:px-3 sm:py-4 rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-800 peer-checked:border-racing-blue/30 peer-checked:bg-racing-blue/10 transition-all flex flex-col gap-1 items-center text-center h-full min-h-[60px] sm:min-h-[70px] justify-center">
                                                        <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-tight text-gray-300 peer-checked:text-racing-blue transition-colors leading-tight">
                                                            {item.label}
                                                        </span>
                                                        {(item.bonus || (bikeModel && isItemSelected(item))) && (
                                                            <span className="text-[7px] font-black text-racing-blue opacity-0 peer-checked:opacity-100 transition-opacity mt-1">
                                                                {item.bonus || "SELECTED MODEL"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">
                                            Inquiry Notes (Optional)
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={2}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="EMI preferences, test ride schedule..."
                                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 
                                                rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 text-sm font-black text-white transition-all outline-none
                                                resize-y overflow-hidden max-h-[300px]"
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = "auto"; // reset height
                                                target.style.height = Math.min(target.scrollHeight, 300) + "px"; // expand until 300px
                                                target.style.overflowY = target.scrollHeight > 300 ? "auto" : "hidden"; // scroll after 300px
                                            }}
                                        />
                                    </div>


                                    <input type="hidden" name="bikeModel" value={bikeModel || ""} />

                                    <button
                                        disabled={status === "submitting"}
                                        className={cn(
                                            "w-full bg-racing-blue hover:bg-dark-racing text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl shadow-racing-blue/30 group",
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

                                    <p className="text-[9px] text-gray-400 font-black text-center uppercase tracking-[0.2em] px-4 md:px-8 leading-relaxed">
                                        Data secured with Choudhary Yamaha Encryption Protocols.
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
