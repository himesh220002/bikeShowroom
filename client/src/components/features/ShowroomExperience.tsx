"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Sparkles, MapPin, ArrowUpRight } from "lucide-react";

export function ShowroomExperience() {
    return (
        <section className="py-32 bg-zinc-900/60 backdrop-blur-sm relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-racing-blue/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-racing-blue/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Visuals Side */}
                    <div className="grid grid-cols-2 gap-6 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="aspect-[5/5] rounded-[3rem] overflow-hidden border border-white/10 relative group"
                        >
                            <Image
                                src="/images/r15v4-sp.webp"
                                alt="Showroom Interior"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <div className="space-y-6 mt-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 relative group"
                            >
                                <Image
                                    src="/images/calloftheblue.png"
                                    alt="Our Expert Staff"
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="aspect-[4/3] rounded-[2.5rem] bg-racing-blue/10 border border-racing-blue/20 flex flex-col items-center justify-center text-center p-8 group hover:bg-racing-blue transition-colors"
                            >
                                <Sparkles className="w-8 h-8 text-racing-blue mb-4 group-hover:text-white transition-colors" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Premium Ambience</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">A world-class experience awaits</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-12">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-6"
                            >
                                Immersive Experience
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl xl:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] mb-8"
                            >
                                THE HEART OF <br />
                                <span className="text-gradient">BLUE EXCELLENCE.</span>
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl"
                            >
                                More than just a showroom, Choudhary Yamaha is your trusted destination for advanced bikes and scooters. Built upon the legacy of <a href="https://www.yamaha-motor-india.com/" target="_blank" className="text-white hover:text-racing-blue underline underline-offset-4 decoration-white/20 transition-colors">Yamaha Motor India</a>, we offer a premium workshop, expert staff, and a legacy of rider-first service.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-6 items-start group"
                            >
                                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-racing-blue/50 transition-colors shadow-2xl">
                                    <Users className="w-6 h-6 text-racing-blue" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Expert Team</h4>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Yamaha Certified Technicians & Sales Experts</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="flex gap-6 items-start group"
                            >
                                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-racing-blue/50 transition-colors shadow-2xl">
                                    <MapPin className="w-6 h-6 text-racing-blue" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">State-of-the-art</h4>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Advanced diagnostic tools & premium waiting lounge</p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            onClick={() => window.open("https://www.google.com/maps/place/Yamaha+Motor+Showroom+-+Choudhary+Auto+Mobile/@25.5510543,87.5554903,17z/data=!3m1!4b1!4m6!3m5!1s0x39faabfee0ff3ee9:0xb3d96e799dcd25ef!8m2!3d25.5510495!4d87.5580652!16s%2Fg%2F11tj359dsf?entry=ttu&g_ep=EgoyMDI2MDQwNy4wIKXMDSoASAFQAw%3D%3D", "_blank")}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group border border-white/5"
                        >
                            Visit Our Showroom
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
