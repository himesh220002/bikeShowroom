"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Star,
    ArrowRight,
    ChevronRight,
    Clock,
    Zap,
    Shield,
    Download,
    Share2,
    Maximize2,
    RotateCcw,
    CheckCircle2,
    Wallet,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BikeImage } from "@/components/ui/BikeImage";

interface BikeDetailsHeroProps {
    bike: any;
    onAction?: (intent: string) => void;
}

import { useState } from "react";
import Link from "next/link";
import { BIKES } from "@/lib/constants/bikes";

export function BikeDetailsHero({ bike, onAction }: BikeDetailsHeroProps) {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const color = bike.colors[selectedColorIndex];

    return (
        <section className="relative min-h-screen bg-zinc-950 pb-20 overflow-hidden">
            {/* Background elements */}
            <div
                className="absolute top-0 right-0 w-1/2 h-screen blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 transition-colors duration-1000"
                style={{ backgroundColor: `${color.hex}22` || 'rgba(0,123,255,0.05)' }}
            />
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

                        <div className="mb-10">
                            <h1 className="text-3xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">
                                {bike.name} <br />
                                <span className="text-racing-blue">{color.name}</span>
                            </h1>

                            {/* Mobile Image - Injected between Name and Color Selector */}
                            <motion.div
                                key={`mobile-${color.name}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="lg:hidden my-8 relative"
                            >
                                <div className="absolute inset-0 bg-racing-blue/20 blur-[100px] opacity-20 -z-10" />
                                <BikeImage
                                    src={color.image}
                                    fallbackSrc={bike.threeSixtyUrl ? `${bike.threeSixtyUrl.replace('360/', 'color/')}${color.colorOption}.webp` : undefined}
                                    alt={bike.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
                                    priority
                                />
                            </motion.div>

                            {/* Color Selector */}
                            {bike.colors.length > 1 && (
                                <div className="mt-8 flex flex-col gap-3">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Available Colors</span>
                                    <div className="flex gap-4">
                                        {bike.colors.map((c: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedColorIndex(index)}
                                                className={cn(
                                                    "w-8 h-8 rounded-full border-2 transition-all p-1",
                                                    index === selectedColorIndex ? "border-racing-blue scale-110" : "border-transparent border-white/20 hover:border-white/40"
                                                )}
                                                title={c.name}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full shadow-inner"
                                                    style={{ backgroundColor: c.hex || '#555' }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm md:text-xl text-gray-400 font-medium leading-relaxed max-w-xl mb-4 md:mb-10">
                            {bike.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                            {[
                                { label: "Top Speed", value: bike.fullSpecs?.topSpeed || "140 km/h", icon: Zap },
                                { label: "Mileage", value: bike.fullSpecs?.mileage || "45 kmpl", icon: Shield },
                                { label: "Weight", value: bike.fullSpecs?.weight || "141 kg", icon: Clock },
                            ].map((fact, i) => (
                                <div key={i} className="flex flex-col p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <fact.icon className="w-3 h-3 text-racing-blue" />
                                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{fact.label}</span>
                                    </div>
                                    <span className="text-sm md:text-lg font-display font-black text-white italic">{fact.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6 mb-8 items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                                    {color.price ? "Price" : "Starting From"}
                                </span>
                                <span className="text-2xl lg:text-4xl font-display font-black text-white tracking-tighter italic">₹ {color.price || bike.price}*</span>
                                <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">*Ex-Showroom Price</span>
                            </div>

                            <div className="h-12 w-px bg-zinc-800 hidden sm:block" />

                            <div className="flex gap-4 items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-racing-blue/10 flex items-center justify-center">
                                                <Star className="w-3 h-3 text-racing-blue fill-current" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-500">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2 h-2 fill-current" />)}
                                    </div>
                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">500+ Reviews</span>
                                </div>
                            </div>
                        </div>

                        {color.stock === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-10 p-5 rounded-3xl bg-racing-blue/5 border border-racing-blue/20 flex items-start gap-4 max-w-md backdrop-blur-sm shadow-2xl shadow-black/20"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-racing-blue/10 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-racing-blue uppercase tracking-widest mb-1">Color Out of Stock</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                        This colour is not available at the moment. Please contact the dealer to <span className="text-white">pre-order</span> this bike colour for you.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4">
                            <button
                                onClick={() => {
                                    if (onAction) onAction(color.stock === 0 ? "PRE-ORDER" : "BOOKING");
                                    else document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={cn(
                                    "group px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all transform active:scale-95 shadow-2xl",
                                    color.stock === 0
                                        ? "bg-zinc-900 border border-racing-blue/50 text-racing-blue hover:bg-zinc-800 shadow-racing-blue/5"
                                        : "bg-racing-blue text-white hover:bg-dark-racing shadow-racing-blue/20"
                                )}
                            >
                                {color.stock === 0 ? "Pre-order Now" : "Book Machine"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => {
                                    if (onAction) onAction("EMI");
                                    else document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-zinc-800 transition-all transform active:scale-95"
                            >
                                Finance Options
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {bike.brochureUrl && (
                                <a
                                    href={bike.brochureUrl}
                                    download={bike.brochureUrl.startsWith('/')}
                                    target={bike.brochureUrl.startsWith('/') ? undefined : "_blank"}
                                    rel={bike.brochureUrl.startsWith('/') ? undefined : "noopener noreferrer"}
                                    className="px-6 md:px-10 py-5 bg-zinc-900/50 text-gray-400 border border-zinc-800/50 rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-xs hover:border-white/20 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 sm:col-span-2 lg:col-auto"
                                >
                                    <Download className="w-4 h-4" />
                                    Brochure
                                </a>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        key={color.name}
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-racing-blue/20 blur-[150px] opacity-20 -z-10" />
                        <BikeImage
                            src={color.image}
                            fallbackSrc={bike.threeSixtyUrl ? `${bike.threeSixtyUrl.replace('360/', 'color/')}${color.colorOption}.webp` : undefined}
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
