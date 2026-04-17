"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, ChevronRight, Activity } from "lucide-react";
import { useRef } from "react";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden bg-black pt-20 md:pt-28">
            {/* Immersive Background - Optimized for Scroll Performance */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 will-change-transform translate-z-0"
            >
                <Image
                    src="/images/hero_showroom.png"
                    alt="Choudhary Yamaha Showroom"
                    fill
                    sizes="100vw"
                    className="object-cover object-center scale-110 opacity-60 dark:opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/40 to-black" />
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
            </motion.div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-24">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 w-fit px-5 py-2 rounded-full mb-8 shadow-2xl"
                    >
                        <div className="p-1 bg-racing-blue rounded-full">
                            <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            The Call of the Blue • Authorized Yamaha Dealer Katihar
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-4 mb-8"
                    >
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl 2xl:text-[8rem] font-display font-black text-white leading-[0.9] md:leading-[0.85] uppercase tracking-tighter">
                            REVS YOUR <br />
                            <span className="text-gradient">HEART.</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl leading-relaxed font-medium"
                    >
                        Experience the absolute pinnacle of Yamaha performance at Choudhary Yamaha.
                        Engineered for thrill, built for excellence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a href="/products" className="w-full sm:w-auto bg-racing-blue hover:bg-dark-racing text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-racing-blue/40 group">
                            Explore Models
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#inquiry" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                            Book Test Ride
                        </a>
                        <a href="#promotions" className="w-full sm:w-auto bg-zinc-900/50 hover:bg-zinc-800 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all border border-white/10 shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                            <Star className="w-3.5 h-3.5 text-racing-blue" />
                            View Offers
                        </a>
                    </motion.div>

                    {/* Premium Trust Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-12 border-l-4 border-racing-blue pl-12"
                    >
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter">1.2K+</p>
                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Katihar Riders</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter">3+</p>
                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Legacy Years</p>
                        </div>
                        <div className="hidden sm:block space-y-1">
                            <p className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter">4.9/5</p>
                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Rating</p>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Logo / Element for Balance */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-[250px] h-[250px] items-center justify-center pointer-events-none z-0"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/images/YamahaLogo.png"
                            alt="Yamaha Logo"
                            width={250}
                            height={250}
                            className="object-contain opacity-20 brightness-200 invert"
                        />
                    </div>
                    {/* Optimized Glow - Removed animate-pulse to prevent compositor thrashing during scroll */}
                    <div className="absolute inset-0 bg-racing-blue/20 blur-[100px] rounded-full opacity-40" />
                </motion.div>
            </div>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black to-transparent z-10" />
        </section>
    );
}
