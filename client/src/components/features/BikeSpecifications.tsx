"use client";

import { motion } from "framer-motion";
// import { Gauge, Cpu, Binary, Shield, Zap, Fuel, Scale, Ruler, Layers } from "lucide-react";
import { LucideIcon } from "@/components/ui/LucideIcon";

interface BikeSpecificationsProps {
    bike: any;
}

export function BikeSpecifications({ bike }: BikeSpecificationsProps) {
    if (!bike || !bike.fullSpecs) {
        return null;
    }

    const mainSpecs = [
        { label: "Engine", value: bike.fullSpecs.engine, icon: "Gauge" },
        { label: "Max Power", value: bike.fullSpecs.power, icon: "Zap" },
        { label: "Max Torque", value: bike.fullSpecs.torque, icon: "Cpu" },
        { label: "Transmission", value: bike.fullSpecs.transmission, icon: "Binary" },
        { label: "Braking System", value: bike.fullSpecs.brakes, icon: "Shield" },
        { label: "Fuel Capacity", value: bike.fullSpecs.fuelCapacity, icon: "Fuel" },
        ...(bike.fullSpecs.topSpeed ? [{ label: "Top Speed", value: bike.fullSpecs.topSpeed, icon: "Timer" }] : []),
        ...(bike.fullSpecs.mileage ? [{ label: "Mileage", value: bike.fullSpecs.mileage, icon: "Activity" }] : []),
    ];

    const secondarySpecs = [
        { label: "Curb Weight", value: bike.fullSpecs.weight, icon: "Scale" },
        { label: "Seat Height", value: bike.fullSpecs.seatHeight, icon: "Ruler" },
        { label: "Tyre Size", value: bike.fullSpecs.tyres, icon: "Layers" },
    ];

    return (
        <section className="py-24 bg-muted/30 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                        Technical Specs
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tighter">
                        ENGINEERING <span className="text-racing-blue">EXCELLENCE</span>
                    </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-16">
                    {mainSpecs.map((spec, index) => (
                        <motion.div
                            key={spec.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-border hover:border-racing-blue/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-racing-blue/5 blur-2xl -mr-12 -mt-12 group-hover:bg-racing-blue/10 transition-colors" />

                            <div className="w-10 h-10 md:w-14 md:h-14 bg-muted rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform relative z-10">
                                <LucideIcon name={spec.icon} className="w-5 h-5 md:w-6 md:h-6 text-racing-blue" />
                            </div>

                            <h4 className="text-[8px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1 md:mb-2 relative z-10">{spec.label}</h4>
                            <p className="text-sm md:text-lg text-foreground font-bold uppercase tracking-tight relative z-10">{spec.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="bg-card p-10 rounded-[3rem] border border-border">
                        <h4 className="text-xl font-display font-black text-foreground uppercase tracking-tight mb-8">Dimensions & Chassis</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {secondarySpecs.map((spec) => (
                                <div key={spec.label} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <LucideIcon name={spec.icon} className="w-4 h-4 text-racing-blue" />
                                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{spec.label}</span>
                                    </div>
                                    <p className="text-foreground font-bold uppercase">{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-800 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mb-6">Key Features</h4>
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(bike.fullSpecs.features) && bike.fullSpecs.features.map((feature: string) => (
                                    <span key={feature} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <div className="w-40 h-40 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 mt-12 bg-white text-racing-blue px-6 py-3 rounded-2xl w-fit text-xs font-black uppercase shadow-xl">
                            Yamaha Racing Heritage
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
