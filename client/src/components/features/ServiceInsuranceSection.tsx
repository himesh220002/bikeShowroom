"use client";

import { motion } from "framer-motion";
import { Wrench, Shield, Clock, Calendar, CheckCircle2, ChevronRight, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function ServiceInsuranceSection() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <section className="py-32 bg-zinc-950 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Content Side */}
                    <div className="order-2 lg:order-1 space-y-12">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                                Post-Purchase Care
                            </h2>
                            <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-tight mb-8">
                                SEAMLESS <span className="text-gradient">SERVICE & PROTECTION</span>
                            </h3>
                            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
                                We don't just sell bikes; we ensure they stay in peak condition. Manage your service bookings and insurance renewals through our interactive digital dashboard.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <Link
                                href="/service#booking"
                                className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 space-y-4 group hover:border-racing-blue/20 transition-all text-left block"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-racing-blue/10 flex items-center justify-center">
                                    <Wrench className="w-6 h-6 text-racing-blue" />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Service Booking</h4>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                                    Instant slot confirmation with Yamaha-trained experts.
                                </p>
                                <span className="text-[10px] font-black text-racing-blue uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pt-2">
                                    Schedule Now <ChevronRight className="w-3 h-3" />
                                </span>
                            </Link>

                            <Link
                                href="#inquiry"
                                className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 space-y-4 group hover:border-emerald-500/20 transition-all text-left block"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Insurance Sync</h4>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                                    Automated renewal reminders and paperless claims.
                                </p>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pt-2">
                                    Renew Now <ChevronRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Interactive Dashboard Preview */}
                    <div className="order-1 lg:order-2 relative">
                        {/* Decorative Background Glow */}
                        <div className="absolute -inset-10 bg-racing-blue/10 blur-[100px] rounded-full opacity-50" />

                        <motion.div
                            initial={{ opacity: 0, rotateY: -10, x: 20 }}
                            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-zinc-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden preserve-3d"
                        >
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">My Garage Dashboard</h4>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Real-time Status</p>
                                    </div>
                                </div>
                                <Bell className="w-4 h-4 text-gray-500 animate-pulse" />
                            </div>

                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
                                    <h5 className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Next Service</h5>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">12 May 2024</p>
                                </div>
                                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
                                    <h5 className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Insurance Expiry</h5>
                                    <p className="text-sm font-black text-racing-blue uppercase tracking-tight">28 Days Left</p>
                                </div>
                            </div>

                            {/* Service Slots Preview */}
                            <div className="space-y-4">
                                <h5 className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-racing-blue" />
                                    Priority Booking Slots
                                </h5>
                                <div className="grid grid-cols-3 gap-3">
                                    {["09:00 AM", "11:30 AM", "03:00 PM", "04:30 PM", "06:00 PM"].map((time, idx) => (
                                        <div
                                            key={time}
                                            className={`p-3 rounded-xl border text-[9px] font-black text-center transition-all ${idx === 1 ? "bg-racing-blue/20 border-racing-blue text-racing-blue" : "bg-zinc-800 border-white/5 text-gray-500"
                                                }`}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                    <div className="p-3 rounded-xl border border-dashed border-white/10 bg-transparent text-[9px] font-black text-gray-600 text-center flex items-center justify-center">
                                        More...
                                    </div>
                                </div>
                            </div>

                            {/* Explainer Overlay (Desktop only) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="hidden absolute right-6 bottom-6 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-[200px]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Insurance Tip</span>
                                </div>
                                <p className="text-[10px] text-zinc-900 font-bold leading-relaxed">
                                    Renewing through us ensures <span className="text-racing-blue">Zero-Dep</span> coverage and cashless repairs at our workshop.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
