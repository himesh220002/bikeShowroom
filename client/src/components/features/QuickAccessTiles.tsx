"use client";

import { motion } from "framer-motion";
import { Bike, Calendar, Shield, Wrench, CreditCard, Headphones } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const tiles = [
    {
        title: "Book Test Ride",
        icon: Bike,
        href: "#inquiry",
        description: "Experience the thrill first-hand",
        color: "bg-blue-500/10 text-blue-500",
        hoverColor: "group-hover:bg-blue-500 group-hover:text-white"
    },
    {
        title: "Service Scheduling",
        icon: Calendar,
        href: "/service#booking",
        description: "Priority slots for your Yamaha",
        color: "bg-racing-blue/10 text-racing-blue",
        hoverColor: "group-hover:bg-racing-blue group-hover:text-white"
    },
    {
        title: "Insurance Renewal",
        icon: Shield,
        href: "#inquiry",
        description: "Hassle-free protection sync",
        color: "bg-emerald-500/10 text-emerald-500",
        hoverColor: "group-hover:bg-emerald-500 group-hover:text-white"
    },
    {
        title: "Accessories & Spares",
        icon: Wrench,
        href: "/service#spares",
        description: "100% Genuine Yamaha parts",
        color: "bg-orange-500/10 text-orange-500",
        hoverColor: "group-hover:bg-orange-500 group-hover:text-white"
    },
    {
        title: "Finance Options",
        icon: CreditCard,
        href: "#inquiry",
        description: "Low interest & easy EMI",
        color: "bg-purple-500/10 text-purple-500",
        hoverColor: "group-hover:bg-purple-500 group-hover:text-white"
    },
    {
        title: "Customer Support",
        icon: Headphones,
        href: "https://wa.me/917004100062",
        description: "24/7 dedicated assistance",
        color: "bg-pink-500/10 text-pink-500",
        hoverColor: "group-hover:bg-pink-500 group-hover:text-white"
    }
];

export function QuickAccessTiles() {
    return (
        <section className="hidden md:block py-24 bg-zinc-950/40 backdrop-blur-sm">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                        Quick Service
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
                        SMART <span className="text-gradient">SOLUTIONS</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-6">
                    {tiles.map((tile, i) => (
                        <motion.div
                            key={tile.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                href={tile.href}
                                className="group relative flex flex-col items-center text-center p-3 xl:p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-800/50 h-full overflow-hidden"
                            >
                                {/* Hover Glow */}
                                <div className={cn(
                                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl",
                                    tile.color.split(' ')[1]
                                )} />

                                <div className={cn(
                                    "w-12 h-12 xl:w-16 xl:h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-2xl",
                                    tile.color,
                                    tile.hoverColor
                                )}>
                                    <tile.icon className="w-8 h-8" />
                                </div>

                                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 group-hover:text-racing-blue transition-colors">
                                    {tile.title}
                                </h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    {tile.description}
                                </p>

                                {/* Decorative Background Element */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-white/10 transition-colors" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
