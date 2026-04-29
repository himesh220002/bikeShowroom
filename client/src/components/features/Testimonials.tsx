"use client";

import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck, Award, Zap, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

const testimonials = [
    {
        name: "Yash Kumar",
        role: "R15M Rider",
        quote: "The purchasing experience at Choudhary Yamaha was seamless. Their team handled everything from finance to registration with priority. Best showroom in Katihar!",
        rating: 5,
        ltv: "Elite Member"
    },
    {
        name: "Rahul Verma",
        role: "MT-15 Enthusiast",
        quote: "Expert service is what keeps me coming back. Their technicians really know their way around high-performance Yamaha engines. Highly recommended for genuine spares.",
        rating: 5,
        ltv: "3 Year Legacy"
    },
    {
        name: "Priya Singh",
        role: "Aerox 155 Owner",
        quote: "The premium ambience of the showroom reflects their commitment to quality. I felt valued from the moment I stepped in. Transparent billing and great support.",
        rating: 5,
        ltv: "Priority Support"
    }
];

const trustSignals = [
    {
        icon: ShieldCheck,
        title: "Authorized & Trusted",
        desc: "100% Genuine Yamaha spares and certified showroom expertise since 2012.",
        color: "text-blue-500"
    },
    {
        icon: Zap,
        title: "Expert Service",
        desc: "Yamaha-trained technicians ensuring peak performance for every ride.",
        color: "text-racing-blue"
    },
    {
        icon: Award,
        title: "Customer First",
        desc: "Seamless documentation and priority support for our elite rider community.",
        color: "text-amber-500"
    }
];

export function Testimonials() {
    return (
        <section className="py-32 bg-zinc-950 border-y border-zinc-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Trust Signals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {trustSignals.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center p-8 bg-zinc-900/40 rounded-[3rem] border border-white/5 hover:border-racing-blue/20 transition-all group"
                        >
                            <div className={cn("w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-racing-blue/50 transition-all shadow-2xl", item.color)}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">{item.title}</h4>
                            <p className="text-gray-500 text-[11px] font-bold leading-relaxed tracking-wider uppercase opacity-80">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                        Voices of Excellence
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">
                        RIDER <span className="text-gradient">TESTIMONIALS</span>
                    </h3>
                </div>

                {/* Testimonials Slider (Grid for now) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testi, i) => (
                        <motion.div
                            key={testi.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative p-10 bg-zinc-900/40 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <Quote className="absolute top-8 right-8 w-12 h-12 text-racing-blue/10 group-hover:text-racing-blue/20 transition-colors" />

                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testi.rating)].map((_, idx) => (
                                            <Star key={idx} className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        ))}
                                    </div>

                                    <p className="text-gray-400 text-md font-medium leading-relaxed mb-8 italic">
                                        "{testi.quote}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                        <User className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest">{testi.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-racing-blue uppercase tracking-widest">{testi.role}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{testi.ltv}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Shadow */}
                            <div className="absolute -inset-0.5 bg-linear-to-b from-racing-blue/0 to-racing-blue/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action for Why Choose Us */}
                <div className="mt-24 p-12 bg-zinc-900/60 rounded-[3rem] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 group">
                    <div className="max-w-xl text-center md:text-left">
                        <h4 className="text-xl xl:text-2xl font-display font-black text-white uppercase tracking-tighter mb-4 xl:mb-8">
                            WHY CUSTOMERS CHOOSE <span className="text-racing-blue">CHOUDHARY YAMAHA</span>
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
                            {[
                                "Premium Ambience",
                                "Transparent Billing",
                                "Yamaha Certified Workshop",
                                "Genuine Spares Guarantee",
                                "Priority After-Sales Support",
                                "Expert Finance Guidance"
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-500"
                                >
                                    <div className="w-2 h-1 rounded-xl bg-racing-blue shadow-[0_0_10px_rgba(0,123,255,0.5)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <div className="flex -space-x-4 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full bg-racing-blue border-4 border-zinc-900 flex items-center justify-center text-[10px] font-black text-white">
                                +1.2K
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Join our community of riders</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
