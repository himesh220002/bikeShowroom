"use client";

import { BIKES } from "@/lib/constants/bikes";
import { BikeImage } from "@/components/ui/BikeImage";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Zap, Shield, Bike as BikeIcon } from "lucide-react";

const CATEGORIES = [
    {
        id: "sport",
        title: "Sport Motorcycles",
        subtitle: "R-Series & MT-Series",
        description: "Engineered for performance, designed for the track and the street.",
        bikes: ["r15v4", "mt15", "mt03"]
    },
    {
        id: "street",
        title: "Street Commuters",
        subtitle: "FZ-Series",
        description: "The Lord of the Streets. Muscular, reliable, and fuel-efficient.",
        bikes: ["fzs-v4", "fz-fi", "fzs-rave"]
    },
    {
        id: "retro",
        title: "Neo-Retro",
        subtitle: "XSR & FZ-X",
        description: "Classic aesthetics meet modern technology for a timeless ride.",
        bikes: ["fzx", "xsr155"]
    },
    {
        id: "scooters",
        title: "Performance Scooters",
        subtitle: "Aerox, RayZR & Fascino",
        description: "Stylish, powerful, and practical for the modern urban landscape.",
        bikes: ["aerox", "rayzr", "fascino"]
    }
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-24">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-20 space-y-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                        <Zap className="w-3 h-3" />
                        Yamaha Lineup
                    </div>
                    <h1 className="text-4xl md:text-8xl font-display font-black text-white uppercase tracking-tighter">
                        OUR <span className="text-racing-blue">MACHINES</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl font-medium leading-relaxed">
                        Discover the perfect balance of performance, style, and innovation across our diverse range of motorcycles and scooters.
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-32">
                    {CATEGORIES.map((category, catIdx) => (
                        <section key={category.id} className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                                <div className="space-y-2">
                                    <h2 className="text-2xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                                        {category.title}
                                    </h2>
                                    <p className="text-racing-blue text-xs font-black uppercase tracking-[0.3em]">
                                        {category.subtitle}
                                    </p>
                                </div>
                                <p className="text-gray-500 text-sm max-w-md">
                                    {category.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {category.bikes.map((slug, bikeIdx) => {
                                    const bike = BIKES.find(b => b.slug === slug);
                                    if (!bike) return null;

                                    const primaryColor = bike.colors?.[0] || { name: 'Standard', hex: '#333', image: '' };

                                    return (
                                        <motion.div
                                            key={bike.slug}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: bikeIdx * 0.1 }}
                                        >
                                            <Link
                                                href={`/bikes/${bike.slug}`}
                                                className="group relative block bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 h-[550px] border border-zinc-800/50 hover:border-racing-blue/40 transition-all duration-700 shadow-2xl flex flex-col justify-between overflow-hidden"
                                            >
                                                {/* Background Glow */}
                                                <div
                                                    className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                                    style={{ backgroundColor: primaryColor.hex }}
                                                />

                                                <div className="relative z-20">
                                                    <span className="inline-block px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-xl bg-racing-blue/80 backdrop-blur-md border border-white/10">
                                                        {bike.tag}
                                                    </span>

                                                    <div className="space-y-1 mb-6">
                                                        <h4 className="text-2xl md:text-4xl font-display font-black text-white tracking-tighter uppercase leading-none group-hover:text-racing-blue transition-colors duration-500">
                                                            {bike.name}
                                                        </h4>
                                                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[8px]">
                                                            {primaryColor.name}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 mb-8">
                                                        {bike.specs.slice(0, 3).map((spec: any, i: number) => (
                                                            <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 group/spec hover:bg-white/10 transition-colors">
                                                                <LucideIcon name={spec.icon} className="w-4 h-4 text-racing-blue group-hover/spec:scale-110 transition-transform" />
                                                                <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 text-center leading-tight">{spec.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="relative z-20 flex items-end justify-between pt-8 border-t border-white/5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                                            <span className="w-4 h-[1px] bg-gray-600" />
                                                            Ex-Showroom
                                                        </span>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-[9px] font-black text-racing-blue">₹</span>
                                                            <span className="text-xl md:text-3xl font-display font-black text-white tracking-tighter italic">
                                                                {bike.price.split('-')[0].trim()}*
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3">
                                                        <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-racing-blue group-hover:border-racing-blue transition-all duration-500 shadow-xl group-hover:shadow-racing-blue/40 group-hover:scale-110">
                                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                                                        </div>
                                                        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                                            Discover
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Image Container with Center positioning similar to FeaturedBikes */}
                                                <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[82%] pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-4 z-10">
                                                    <div className="relative">
                                                        <div
                                                            className="absolute inset-0 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000"
                                                            style={{ backgroundColor: primaryColor.hex }}
                                                        />
                                                        <BikeImage
                                                            src={primaryColor.image}
                                                            fallbackSrc={`${bike.threeSixtyUrl?.replace('360/', 'color/')}${primaryColor.colorOption}.webp`}
                                                            alt={bike.name}
                                                            width={500}
                                                            height={400}
                                                            className="w-full h-auto object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] relative z-10"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Watermark Name */}
                                                <div className="absolute -bottom-8 -left-4 text-8xl font-black text-white/[0.03] pointer-events-none select-none z-0 tracking-tighter uppercase italic group-hover:text-racing-blue/[0.05] group-hover:-translate-y-4 transition-all duration-1000 ease-out">
                                                    {bike.name.split(" ")[1] || bike.name.split(" ")[0]}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Banner */}
                <div className="mt-32 bg-racing-blue rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                                READY TO <br />
                                <span className="text-zinc-950">EXPERIENCE?</span>
                            </h2>
                            <p className="text-white/80 font-medium max-w-sm">
                                Book a test ride today and feel the Yamaha DNA for yourself.
                            </p>
                        </div>
                        <Link
                            href="/#inquiry"
                            className="bg-zinc-950 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4"
                        >
                            Book Test Ride
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
