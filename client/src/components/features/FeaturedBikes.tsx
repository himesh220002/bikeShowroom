"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bike, Phone, Shield, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { BIKES } from "@/lib/constants/bikes";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { BikeImage } from "@/components/ui/BikeImage";

export function FeaturedBikes() {
    const [liveBikes, setLiveBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/bikes");
                const data = await res.json();
                if (data.success) {
                    setLiveBikes(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch featured bikes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBikes();
    }, []);

    if (loading) {
        return (
            <section id="machines" className="py-24 relative overflow-hidden bg-transparent">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded-full" />
                            <div className="h-12 w-64 bg-muted animate-pulse rounded-2xl" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[3rem]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const bikesToShow = liveBikes.length > 0 ? liveBikes : BIKES;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            const scrollAmount = offsetWidth > 1024 ? offsetWidth / 3 : offsetWidth > 768 ? offsetWidth / 2 : offsetWidth;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="machines" className="py-32 bg-transparent overflow-hidden border-y border-white/5" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                            <Zap className="w-3 h-3" />
                            Premium Lineup
                        </div>
                        <h2 className="text-3xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
                            FEATURED <span className="text-racing-blue">MACHINES</span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:border-racing-blue transition-all group active:scale-95"
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
                    className="flex gap-6 md:gap-10 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 will-change-transform"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {bikesToShow.map((bike: any, index: number) => {
                        const currentSpecs = bike.specs || [];
                        const primaryColor = bike.colors?.[0] || { name: 'Standard', hex: '#333', image: '' };

                        return (
                            <div
                                key={bike.slug || bike._id}
                                className="w-[100%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] flex-shrink-0 snap-center"
                            >
                                <Link
                                    href={`/bikes/${bike.slug}`}
                                    className="block h-full"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "0px" }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="group relative bg-zinc-900/70 backdrop-blur-md rounded-[2.5rem] p-8 h-[550px] border border-zinc-800/50 hover:border-racing-blue/40 transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden will-change-transform gpu-accelerated"
                                    >
                                        {/* Dynamic Background Glow */}
                                        <div
                                            className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                            style={{ backgroundColor: primaryColor.hex }}
                                        />

                                        <div className="relative z-20">
                                            <span className="inline-block px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white mb-4 md:mb-6 shadow-xl bg-racing-blue/80 backdrop-blur-md border border-white/10">
                                                {bike.tag}
                                            </span>

                                            <div className="space-y-1 mb-6">
                                                <h4 className="text-2xl md:text-4xl font-display font-black text-white tracking-tighter uppercase leading-none group-hover:text-racing-blue transition-colors duration-500">
                                                    {bike.name}
                                                </h4>
                                                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[7px] md:text-[8px]">
                                                    {primaryColor.name}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
                                                {currentSpecs.slice(0, 3).map((spec: any, i: number) => (
                                                    <div key={i} className="flex flex-col items-center gap-1.5 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 group/spec hover:bg-white/10 transition-colors">
                                                        <LucideIcon name={spec.icon} className="w-3.5 h-3.5 md:w-4 md:h-4 text-racing-blue group-hover/spec:scale-110 transition-transform" />
                                                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-gray-400 text-center leading-tight">{spec.label}</span>
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
                                                        {bike.price}*
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

                                        {/* Oversized Bike Image with Glow Support */}
                                        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[82%] pointer-events-none transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-4 z-10 will-change-transform">
                                            <div className="relative">
                                                <div
                                                    className="absolute inset-0 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                                                    style={{ backgroundColor: primaryColor.hex }}
                                                />
                                                <BikeImage
                                                    src={primaryColor.image}
                                                    fallbackSrc={bike.threeSixtyUrl ? `${bike.threeSixtyUrl.replace('360/', 'color/')}${primaryColor.colorOption}.webp` : primaryColor.image}
                                                    alt={bike.name}
                                                    width={500}
                                                    height={400}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="w-full h-auto object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] relative z-10"
                                                />
                                            </div>
                                        </div>

                                        {/* Watermark Name */}
                                        <div className="absolute -bottom-8 -left-4 text-8xl font-black text-white/[0.03] pointer-events-none select-none z-0 tracking-tighter uppercase italic group-hover:text-racing-blue/[0.05] group-hover:-translate-y-4 transition-all duration-1000 ease-out">
                                            {bike.name.split(" ")[1] || bike.name.split(" ")[0]}
                                        </div>
                                    </motion.div>
                                </Link>
                            </div>
                        );
                    })}
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
