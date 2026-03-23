"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Star, Shield, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BikeDetailsHeroProps {
    bike: any;
}

export function BikeDetailsHero({ bike }: BikeDetailsHeroProps) {
    return (
        <section className="relative min-h-screen bg-zinc-950 pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-screen bg-racing-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-zinc-900/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 md:pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                            <Zap className="w-3 h-3" />
                            {bike.tag}
                        </div>

                        <h1 className="text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                            {bike.name} <br />
                            <span className="text-racing-blue">{bike.variant}</span>
                        </h1>

                        <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl mb-10">
                            {bike.description}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-12">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Starting From</span>
                                <span className="text-4xl font-display font-black text-white">₹ {bike.price}*</span>
                                <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">*Ex-Showroom Price</span>
                            </div>

                            <div className="h-16 w-px bg-zinc-800 self-center hidden sm:block" />

                            <div className="flex gap-4 items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-zinc-700" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-500">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">500+ Happy Riders</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-10 py-5 bg-racing-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-dark-racing transition-all transform active:scale-95 shadow-xl shadow-racing-blue/20 flex items-center justify-center gap-3 group">
                                Book This Machine
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-10 py-5 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-black uppercase tracking-widest hover:border-racing-blue transition-all transform active:scale-95 flex items-center justify-center gap-3">
                                Download Brochure
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-racing-blue/20 blur-[150px] opacity-20 -z-10" />
                        <Image
                            src={bike.image}
                            alt={bike.name}
                            width={800}
                            height={600}
                            className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
                            priority
                        />

                        {/* Interactive floating specs */}
                        <div className="absolute -top-10 -right-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-4 rounded-3xl hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div>
                                    <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Warranty</p>
                                    <p className="text-xs text-white font-bold uppercase">2 Years Standard</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -left-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-4 rounded-3xl hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div>
                                    <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Fast Delivery</p>
                                    <p className="text-xs text-white font-bold uppercase">Within 7 Days</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Model Name Background Text */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none -mb-20 opacity-5">
                <h2 className="text-[25vw] font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap">
                    {bike.name}
                </h2>
            </div>
        </section>
    );
}
