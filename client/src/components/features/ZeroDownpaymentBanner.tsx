"use client";

import { motion } from "framer-motion";
import { Wallet, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";

interface ZeroDownpaymentBannerProps {
    bikeName: string;
}

export function ZeroDownpaymentBanner({ bikeName }: ZeroDownpaymentBannerProps) {
    return (
        <section className="py-24 bg-zinc-950 overflow-hidden px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-[1600px] mx-auto relative min-h-[600px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl group"
            >
                {/* Full Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                        alt="Zero Downpayment Finance Offer"
                        fill
                        sizes="100vw"
                        unoptimized={true}
                        className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Dark Overlays - Adjusted for better visibility */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 h-full flex items-center p-8 md:p-20">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 bg-green-500/10 backdrop-blur-md border border-green-500/20 w-fit px-5 py-2 rounded-full mb-8"
                        >
                            <Zap className="w-4 h-4 text-green-500 fill-green-500" />
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                Special Finance Offer
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                                ZERO <br />
                                <span className="text-racing-blue">DOWNPAYMENT</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-12 max-w-xl leading-relaxed">
                                Get your hands on the <span className="text-white font-black">{bikeName}</span> without any upfront cost. Our flexible financing solutions make ownership effortless.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {[
                                "No Initial Security Deposit",
                                "Low Interest Rate EMI",
                                "Instant Digital Approval",
                                "Minimal Paperwork Required"
                            ].map((benefit, i) => (
                                <motion.div
                                    key={benefit}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-racing-blue/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-racing-blue" />
                                    </div>
                                    <span className="text-xs text-white font-bold uppercase tracking-tight">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            onClick={() => {
                                document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group bg-white text-zinc-950 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-4 hover:bg-racing-blue hover:text-white transition-all transform active:scale-95 shadow-2xl"
                        >
                            Apply For Finance
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </div>
                </div>

                {/* Decorative Background Element */}
                <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none hidden lg:block">
                    <div className="text-[30rem] font-black text-white leading-none tracking-tighter italic">
                        0%
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
