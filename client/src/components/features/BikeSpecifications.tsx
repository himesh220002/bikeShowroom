"use client";

import { motion } from "framer-motion";
// import { Gauge, Cpu, Binary, Shield, Zap, Fuel, Scale, Ruler, Layers } from "lucide-react";
import { LucideIcon } from "@/components/ui/LucideIcon";
import Link from "next/link";

interface BikeSpecificationsProps {
    bike: any;
}

export function BikeSpecifications({ bike }: BikeSpecificationsProps) {
    if (!bike || !bike.fullSpecs) {
        return null;
    }

    const mainSpecs = [
        { label: "Engine Architecture", value: bike.fullSpecs.engine, icon: "Gauge", image: "/images/bike parts/155-cc-lc4v-sohc-fi-engine-with-vva.webp", className: "md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-[450px]" },
        { label: "Maximum Power", value: bike.fullSpecs.power, icon: "Zap", image: "/images/bike parts/accelerationbike.jpeg", className: "md:col-span-1 min-h-[200px]" },
        { label: "Peak Torque", value: bike.fullSpecs.torque, icon: "Cpu", image: "/images/bike parts/mt-03-right-side-handelbar-throttle-grip.avif", className: "md:col-span-1 min-h-[200px]" },
        { label: "Transmission", value: bike.fullSpecs.transmission, icon: "Binary", image: "/images/bike parts/gearengine.jpg", className: "md:col-span-1 min-h-[250px]" },
        { label: "Braking System", value: bike.fullSpecs.brakes, icon: "Shield", image: "/images/bike parts/fz-rave-front-disc-brake-caliper.avif", className: "md:col-span-2 min-h-[250px]" },
    ];

    const secondarySpecs = [
        { label: "Fuel Capacity", value: bike.fullSpecs.fuelCapacity, icon: "Fuel" },
        { label: "Curb Weight", value: bike.fullSpecs.weight, icon: "Scale" },
        { label: "Seat Height", value: bike.fullSpecs.seatHeight, icon: "Ruler" },
        { label: "Tyre Size", value: bike.fullSpecs.tyres, icon: "Layers" },
    ];

    return (
        <section className="py-12 relative overflow-hidden">
            {/* Background ambiance */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Cinematic Header */}
                <div className="text-center mb-24 relative">
                    <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
                        PERFORMANCE
                    </h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-xs md:text-sm font-black uppercase tracking-[0.5em] text-racing-blue mb-6 flex items-center justify-center gap-4">
                            <span className="w-12 h-px bg-gradient-to-r from-transparent to-racing-blue/50" />
                            Technical Specs
                            <span className="w-12 h-px bg-gradient-to-l from-transparent to-racing-blue/50" />
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-tight">
                            ENGINEERING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-racing-blue via-cyan-400 to-blue-600">EXCELLENCE</span>
                        </h3>
                    </motion.div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                    {mainSpecs.map((spec, index) => (
                        <motion.div
                            key={spec.label}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
                            className={`group relative rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl ${spec.className}`}
                        >
                            {/* Animated Grayscale Image */}
                            {spec.image && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 group-hover:scale-110"
                                    style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}${spec.image}")` }}
                                />
                            )}

                            {/* Rich Overlays */}
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />

                            {/* Glowing Hover Border */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-racing-blue/30 rounded-[2rem] md:rounded-[2.5rem] transition-colors duration-700 pointer-events-none z-20" />

                            <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-between pointer-events-none">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-racing-blue/20 group-hover:border-racing-blue/50 group-hover:scale-110 transition-all duration-500 shadow-xl">
                                    <LucideIcon name={spec.icon} className="w-6 h-6 md:w-7 md:h-7 text-white/70 group-hover:text-racing-blue transition-colors duration-500" />
                                </div>

                                <motion.div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-[10px] md:text-xs text-racing-blue font-black uppercase tracking-[0.2em] mb-2">{spec.label}</h4>
                                    <h3 className="text-2xl md:text-4xl text-white font-display font-black uppercase tracking-tighter leading-none drop-shadow-lg">{spec.value}</h3>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
                    {/* Dimensions & Chassis Card */}
                    <div className="relative group overflow-hidden bg-zinc-900 p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110"
                            style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/bikemountain.jpg")` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/80 to-transparent" />

                        <div className="relative z-10 h-full flex flex-col">
                            <h4 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-10">Dimensions <span className="text-racing-blue">& Chassis</span></h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-auto">
                                {secondarySpecs.map((spec) => (
                                    <div key={spec.label} className="flex flex-col gap-3 group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover/item:bg-racing-blue/20 transition-colors">
                                                <LucideIcon name={spec.icon} className="w-4 h-4 text-racing-blue" />
                                            </div>
                                            <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{spec.label}</span>
                                        </div>
                                        <p className="text-white font-black text-lg md:text-xl uppercase tracking-tight drop-shadow-md">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Key Features Card */}
                    <div className="bg-gradient-to-br from-blue-900 to-zinc-950 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl border border-white/5">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-110 mix-blend-overlay"
                            style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/fascino.png")` }}
                        />

                        <div className="relative z-10">
                            <h4 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-8">Key <span className="text-cyan-400">Features</span></h4>
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(bike.fullSpecs.features) && bike.fullSpecs.features.map((feature: string, i: any) => (
                                    <motion.span
                                        key={feature}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-2xl text-[10px] md:text-xs font-black text-white uppercase tracking-widest border border-white/10 hover:bg-racing-blue/20 hover:border-racing-blue/50 transition-colors cursor-default"
                                    >
                                        {feature}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        <div className="absolute -bottom-20 -right-20 opacity-30 group-hover:scale-125 group-hover:opacity-50 transition-all duration-1000">
                            <div className="w-64 h-64 bg-cyan-500 rounded-full blur-[100px]" />
                        </div>

                        <Link href="https://www.yamaha-motor-india.com/" target="_blank" rel="noopener noreferrer" className="relative z-10 mt-16 bg-white text-racing-blue px-8 py-4 rounded-2xl w-fit text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                            Yamaha Racing Heritage
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
