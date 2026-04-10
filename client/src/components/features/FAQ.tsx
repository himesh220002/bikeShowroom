"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const FAQ_DATA = [
    {
        question: "What documents are required for a bike purchase?",
        answer: "To ensure a smooth delivery at Choudhary Yamaha, please bring: 1. Aadhaar Card (Address Proof) 2. PAN Card (Identity Proof) 3. Two passport-size photographs. For finance/loan applications, you may also need the last 6 months' bank statements and salary slips."
    },
    {
        question: "Do you offer finance and easy EMI options?",
        answer: "Yes, we provide seamless finance options through our premium partners: \n1. L&T Finance: Quick processing and minimal documentation. \n2. Bajaj Finance: Instant approval and attractive EMI subvention schemes. \n3. IDFC First Bank: Competitive interest rates and flexible tenures. \nWe also work with HDFC and Yamaha Financial Services to ensure you get the best deal."
    },
    {
        question: "How long does the registration (RC) process take?",
        answer: "The RTO registration and Number Plate (HSRP) process typically takes 15 to 30 working days after delivery. Once the RC (Registration Certificate) and HSRP are ready, our team will contact you for a quick installation at the showroom."
    },
    {
        question: "What are the service intervals for a new Yamaha?",
        answer: "Your Yamaha deserves the best care! The 1st Free Service is due at 1,000 KM or 30 days (whichever comes first). Subsequent services are generally recommended every 3,000-5,000 KM. Regular servicing at an authorized center ensures your warranty remains valid and your bike stays in peak condition."
    },
    {
        question: "Can I book a test ride for my favorite model?",
        answer: "Absolutely! You can book a test ride directly through our website using the inquiry form below or by visiting us at Mirchaibari, Katihar. We recommend booking in advance to ensure the specific model and variant are ready for your ride."
    },
    {
        question: "Are genuine Yamaha spare parts available?",
        answer: "Yes, Choudhary Yamaha is an authorized dealer, and we stock 100% genuine Yamaha Blue Square spare parts and accessories. Using genuine parts is critical for maintaining performance, safety, and the long-term health of your engine."
    }
];

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-zinc-950/40 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-racing-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-racing-blue/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 border border-racing-blue/20 text-racing-blue text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Rider Support
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter italic">
                        Frequently <span className="text-racing-blue">Asked</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-md mx-auto">
                        Quick solutions to common queries to help you start your Yamaha journey.
                    </p>
                </div>

                <div className="space-y-4">
                    {FAQ_DATA.map((faq, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "group border rounded-3xl transition-all duration-500 overflow-hidden",
                                    isActive
                                        ? "bg-zinc-900 border-racing-blue/50 shadow-[0_20px_50px_rgba(45,106,255,0.1)]"
                                        : "bg-zinc-900/40 border-white/5 hover:border-racing-blue/20"
                                )}
                            >
                                <button
                                    onClick={() => setActiveIndex(isActive ? null : index)}
                                    className="w-full px-4 sm:px-8 py-6 flex items-center justify-between text-left gap-4"
                                >
                                    <span className={cn(
                                        "text-sm font-black uppercase tracking-widest transition-colors duration-300",
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                                    )}>
                                        {faq.question}
                                    </span>
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                                        isActive ? "bg-racing-blue text-white rotate-180 shadow-lg shadow-racing-blue/20" : "bg-white/5 text-gray-500"
                                    )}>
                                        <ChevronDown className={cn("w-5 h-5", isActive && "animate-bounce-subtle")} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-4 sm:px-8 pb-8">
                                                <div className="p-6 bg-racing-blue/5 rounded-2xl border border-racing-blue/10 relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-racing-blue" />
                                                    <p className="text-xs font-bold text-gray-300 leading-relaxed tracking-wider">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 flex flex-col items-center gap-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Still have more questions?</p>
                    <a
                        href="#inquiry"
                        className="px-10 py-4 bg-racing-blue text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-racing-blue/30"
                    >
                        Talk to an Expert
                    </a>
                </div>
            </div>
        </section>
    );
}
