"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bike, Phone, Shield, Zap, ChevronRight, ChevronLeft, Gauge, Cpu, Binary, Fuel, Wind, Zap as ZapIcon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { BIKES } from "@/lib/constants/bikes";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { BikeImage } from "@/components/ui/BikeImage";

const bikes = BIKES;

export function FeaturedBikes() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            const scrollAmount = offsetWidth > 1024 ? offsetWidth / 3 : offsetWidth > 768 ? offsetWidth / 2 : offsetWidth;
            const scrollTo = direction === 'left'
                ? scrollLeft - scrollAmount
                : scrollLeft + scrollAmount;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="bikes" className="py-32 bg-zinc-950 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                            <Zap className="w-3 h-3" />
                            Premium Lineup
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
                            FEATURED <span className="text-racing-blue">MACHINES</span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:border-racing-blue transition-all group active:scale-95 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-14 h-14 rounded-2xl bg-racing-blue flex items-center justify-center text-white hover:bg-dark-racing transition-all group active:scale-95 shadow-xl shadow-racing-blue/20"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-12 cursor-pointer active:cursor-grabbing scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {bikes.map((bike, index) => (
                        <div
                            key={bike.slug}
                            className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] flex-shrink-0 snap-start"
                        >
                            <Link
                                href={`/bikes/${bike.slug}`}
                                className="block h-full"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="group relative bg-zinc-900 rounded-[2.5rem] p-8 h-full border border-zinc-800 hover:border-racing-blue/30 transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <span className="inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-xl bg-racing-blue">
                                            {bike.tag}
                                        </span>

                                        <div className="space-y-1 mb-6">
                                            <h4 className="text-3xl font-display font-black text-gray-300 tracking-tighter uppercase leading-none group-hover:text-racing-blue transition-colors">
                                                {bike.name}
                                            </h4>
                                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
                                                {bike.colors[0].name}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mb-8">
                                            {bike.specs.map(spec => (
                                                <div key={spec.label} className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-zinc-950 rounded-lg">
                                                        <LucideIcon name={spec.icon} className="w-3 h-3 text-racing-blue" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{spec.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between pt-6 border-t border-zinc-800 mt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Ex-Showroom</span>
                                            <span className="text-2xl font-display font-black text-white">₹ {bike.price}*</span>
                                        </div>
                                        <div className="bg-racing-blue text-white p-3 rounded-xl hover:bg-dark-racing transition-all transform active:scale-95 shadow-lg shadow-racing-blue/20">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="absolute top-8 right-0 w-[55%] pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                                        <BikeImage
                                            src={bike.colors[0].image}
                                            fallbackSrc={`${bike.threeSixtyUrl?.replace('360/', 'color/')}${bike.colors[0].colorOption}.webp`}
                                            alt={bike.name}
                                            width={400}
                                            height={300}
                                            className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                                        />
                                    </div>

                                    <div className="absolute -bottom-4 -left-2 text-6xl font-black text-white/5 pointer-events-none select-none -z-0 tracking-tighter uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                                        {bike.name.split(" ")[0]}
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "Original Spares", desc: "100% genuine Yamaha parts" },
                        { icon: Bike, title: "Swift Valuations", desc: "Digital exchange scoring" },
                        { icon: Phone, title: "Expert Support", desc: "Certified Technicians" }
                    ].map((item, i) => (
                        <div key={item.title} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex items-center gap-5 group hover:border-racing-blue/20 transition-all">
                            <div className="w-12 h-12 bg-racing-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                                <item.icon className="w-6 h-6 text-racing-blue" />
                            </div>
                            <div>
                                <h5 className="font-display font-black text-white text-sm uppercase tracking-tight">{item.title}</h5>
                                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
