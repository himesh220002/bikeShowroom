"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, Info, FileText, Landmark, UserCheck, Calculator, Scale, AlertCircle, Ban, History } from "lucide-react";

interface FinanceTransparencyPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const TRANSPARENCY_TERMS = [
    {
        title: "Our Commitment",
        content: "We work directly with Tata Capital, L&T, Bajaj, and IDFC First to provide you with the most accurate quotes. No \"estimated\" numbers—just the actual bank terms.",
        icon: ShieldCheck,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Eligibility-Based Funding",
        content: "While we offer up to 100% funding, the final downpayment is determined by the bank based on your CIBIL score and income profile.",
        icon: UserCheck,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        title: "On-Road Pricing",
        content: "All EMI calculations are based on the total On-Road price (Ex-showroom + RTO Registration + Tata AIG Insurance + Logistics).",
        icon: Calculator,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        title: "Reducing Interest Rates",
        content: "We primarily offer \"Reducing Balance\" interest rates, meaning you only pay interest on the remaining principal, not the original loan amount.",
        icon: Landmark,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        title: "Hypothecation (Collateral)",
        content: "As per RTO rules, the vehicle remains hypothecated (linked) to the bank until the loan is fully repaid and an NOC is issued.",
        icon: FileText,
        color: "text-red-500",
        bg: "bg-red-500/10"
    },
    {
        title: "Mandatory Documentation",
        content: "Spot approval requires an active Aadhaar-linked mobile number for E-KYC and a PAN card for credit verification.",
        icon: Info,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10"
    },
    {
        title: "Advance EMI Policy",
        content: "Depending on the scheme, the bank may require 1 or 2 \"Advance EMIs\" at the time of delivery; this is adjusted against your total loan tenure.",
        icon: History,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
    },
    {
        title: "Processing Fees",
        content: "Every bank charges a one-time documentation/processing fee. This will be clearly mentioned in your sanction letter before you sign.",
        icon: AlertCircle,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    {
        title: "PDC/E-Mandate",
        content: "To ensure timely payments and avoid late fees, an E-Mandate (Auto-debit) from your bank account is mandatory for all finance plans.",
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        title: "No Hidden Service Charges",
        content: "Choudhary Yamaha does not charge any \"extra\" file-processing fees outside of the official bank-mandated charges.",
        icon: Ban,
        color: "text-rose-500",
        bg: "bg-rose-500/10"
    },
    {
        title: "Pre-closure Terms",
        content: "You have the right to close your loan early. Foreclosure charges and \"lock-in\" periods are governed strictly by the bank’s policy (usually 6–12 months).",
        icon: Scale,
        color: "text-slate-500",
        bg: "bg-slate-500/10"
    }
];

export function FinanceTransparencyPopup({ isOpen, onClose }: FinanceTransparencyPopupProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start gap-2 sm:items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-card border border-border rounded-[1rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] mt-24 sm:mt-0"
                    >
                        {/* Header */}
                        <div className="p-5 md:p-10 border-b border-border/50 flex justify-between items-center bg-muted/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <ShieldCheck className="w-40 h-40" />
                            </div>

                            <div className="z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-racing-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-racing-blue/20">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-sm md:text-3xl font-display font-black text-foreground italic uppercase tracking-tighter leading-none">
                                        Transparent & <span className="text-racing-blue">Fair Financing</span>
                                    </h2>
                                </div>
                                <p className="md:block hidden text-[8px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Choudhary Yamaha's Commitment to Integrity & Clarity</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-muted border border-border hover:bg-white hover:text-black transition-all group active:scale-95"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {TRANSPARENCY_TERMS.map((term, index) => (
                                    <motion.div
                                        key={term.title}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group p-5 md:p-6 bg-muted/20 border border-border/50 rounded-[1.5rem] hover:bg-muted/40 hover:border-racing-blue/30 transition-all"
                                    >
                                        <div className="flex gap-5">
                                            <div className={`w-12 h-12 shrink-0 rounded-2xl ${term.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                                <term.icon className={`w-6 h-6 ${term.color}`} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-foreground">
                                                    {term.title}
                                                </h3>
                                                <p className="text-[11px] md:text-xs leading-relaxed text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                                                    {term.content}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-10 p-6 bg-racing-blue/5 border border-racing-blue/10 rounded-[1.5rem] flex flex-col md:flex-row items-center gap-6">
                                <div className="flex -space-x-3">
                                    {['Tata Capital', 'L&T', 'Bajaj', 'IDFC'].map((bank) => (
                                        <div key={bank} className="w-12 h-12 rounded-full bg-background border-2 border-background flex items-center justify-center text-[8px] font-black uppercase text-center p-1 shadow-sm">
                                            {bank}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-racing-blue mb-1">Trusted Partners</h4>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">We facilitate loans from leading financial institutions only.</p>
                                </div>
                                <div className="md:ml-auto w-full md:w-auto">
                                    <button
                                        onClick={onClose}
                                        className="w-full md:w-auto px-8 py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue transition-colors active:scale-95"
                                    >
                                        I Understand
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
