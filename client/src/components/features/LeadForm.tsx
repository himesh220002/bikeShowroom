"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Loader2, Send, Phone, User, MessageSquare, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { submitLead } from "@/lib/actions/leadActions";

const interests = [
    { id: "R15", label: "R15 Series", score: 0 },
    { id: "MT", label: "MT-15 V2", score: 0 },
    { id: "FZ", label: "FZ Series", score: 0 },
    { id: "AEROX", label: "Aerox 155", score: 0 },
    { id: "SCOOTER", label: "RayZR / Fascino", score: 0 },
    { id: "SERVICE", label: "Service Request", score: 0 },
    { id: "EMI", label: "EMI / Finance", bonus: "+50 Score" },
    { id: "EXCHANGE", label: "Exchange / Value", bonus: "+45 Score" }
];

export function LeadForm() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [response, setResponse] = useState<{ score?: number, message?: string }>({});

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
        <section id="inquiry" className="py-32 bg-zinc-950 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-racing-blue/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-20 items-center">
                    {/* Text Context */}
                    <div className="hidden space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                                <Info className="w-3.5 h-3.5" />
                                Instant Response
                            </div>
                            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none">
                                SECURE YOUR <br />
                                <span className="text-gradient">DREAM RIDE.</span>
                            </h2>
                            <p className="text-lg text-gray-400 font-medium max-w-md leading-relaxed">
                                Join the elite community of Yamaha riders at Choudhary Automobile.
                                Our experts are standing by to process your inquiry with priority.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            {[
                                { icon: User, title: "Personalized Consultation", desc: "Expert guidance on model selection" },
                                { icon: Phone, title: "Priority Callback", desc: "Response within 2-4 business hours" }
                            ].map((item) => (
                                <div key={item.title} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-black text-white uppercase tracking-tight text-sm">{item.title}</h4>
                                        <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Container */}
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full bg-zinc-800 rounded-[3.5rem] p-12 text-center border border-racing-blue/20 shadow-2xl shadow-racing-blue/10 flex flex-col items-center"
                            >
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/40">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-4xl font-display font-black text-white mb-4 uppercase tracking-tighter">Inquiry Logged!</h3>
                                <p className="text-gray-400 mb-10 max-w-sm font-medium leading-relaxed font-sans">
                                    Wait for the thrill. Our specialists at Choudhary Automobile will reach out shortly.
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
                                className="w-full bg-zinc-900 rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-zinc-800"
                            >
                                <form onSubmit={handleFormSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">Pilot Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    required
                                                    name="name"
                                                    type="text"
                                                    placeholder="Who's riding?"
                                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 rounded-3xl pl-14 pr-8 py-5 text-sm font-black text-white transition-all outline-none"
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
                                                    pattern="[0-9]{10}"
                                                    maxLength={10}
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.value = target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                    placeholder="Mobile number"
                                                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 rounded-3xl pl-14 pr-8 py-5 text-sm font-black text-white transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 ml-2">Interested In</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {interests.map((item) => (
                                                <label key={item.id} className="relative group cursor-pointer block w-full">
                                                    <input type="checkbox" className="sr-only peer" name="interest" value={item.label} />
                                                    <div className="px-3 py-4 rounded-2xl bg-zinc-950 border border-zinc-800 peer-checked:border-racing-blue/30 peer-checked:bg-racing-blue/10 transition-all flex flex-col gap-1 items-center text-center h-full min-h-[70px] justify-center">
                                                        <span className="text-[12px] font-black uppercase tracking-tight text-gray-300 peer-checked:text-racing-blue transition-colors leading-tight">
                                                            {item.label}
                                                        </span>
                                                        {item.bonus && (
                                                            <span className="text-[7px] font-black text-racing-blue opacity-0 peer-checked:opacity-100 transition-opacity mt-1">
                                                                {item.bonus}
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
                                            placeholder="EMI preferences, test ride schedule..."
                                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-racing-blue/30 
                                                rounded-3xl px-8 py-5 text-sm font-black text-white transition-all outline-none
                                                resize-y overflow-hidden max-h-[300px]"
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = "auto"; // reset height
                                                target.style.height = Math.min(target.scrollHeight, 300) + "px"; // expand until 300px
                                                target.style.overflowY = target.scrollHeight > 300 ? "auto" : "hidden"; // scroll after 300px
                                            }}
                                        />
                                    </div>


                                    <button
                                        disabled={status === "submitting"}
                                        className={cn(
                                            "w-full bg-racing-blue hover:bg-dark-racing text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl shadow-racing-blue/30 group",
                                            status === "submitting" && "opacity-80 pointer-events-none"
                                        )}
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                SUBMITTING TO ENGINE...
                                            </>
                                        ) : (
                                            <>
                                                INITIATE INQUIRY
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-[9px] text-gray-400 font-black text-center uppercase tracking-[0.2em] px-8 leading-relaxed">
                                        Data secured with Choudhary Automobile Encryption Protocols.
                                        By submitting, you agree to our digital terms.
                                    </p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
