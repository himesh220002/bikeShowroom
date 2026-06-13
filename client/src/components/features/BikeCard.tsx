"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BikeImage } from "@/components/ui/BikeImage";
import { formatPrice } from "@/lib/utils/price";

interface BikeCardProps {
    bike: any;
    index?: number;
    isActive?: boolean;
}

export function BikeCard({ bike, index = 0, isActive = true }: BikeCardProps) {
    const primaryColor = bike.colors?.[0] || { name: 'Standard', hex: '#333', image: '' };

    return (
        <div className="block h-full w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.05, 0.3) }}
                className="group relative bg-card/70 backdrop-blur-md  rounded-[1.5rem] h-[400px]  border border-border/50 hover:border-racing-blue/40 transition-all duration-500 shadow-xl overflow-hidden will-change-transform gpu-accelerated w-full hover:scale-[1.2] hover:z-20"
            >
                {/* Background Glow */}
                <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-screen pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${primaryColor.hex}40 0%, transparent 70%)` }}
                />

                {/* Tag */}
                <div className="absolute top-6 left-6 z-30">
                    <span className="inline-block px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-xl bg-black/40 backdrop-blur-md border border-white/10">
                        {bike.tag.split(" ")[0] + " " + bike.tag.split(" ")[1] || 'Premium'}
                    </span>
                </div>
                <div className="absolute top-16 left-6">
                    <h4 className="text-xl font-display font-black text-blue-900 tracking-tighter leading-none group-hover:text-indigo-700 transition-colors duration-500 truncate max-w-[200px] md:max-w-[200px]">
                        {bike.name}
                    </h4>
                    <p className="text-black/70 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">
                        {primaryColor.name}
                    </p>
                </div>

                {/* Bike Image Container */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-4">
                    <div className="relative w-full h-full max-w-[300px] max-h-[300px] flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-115">
                        <BikeImage
                            src={primaryColor.image}
                            fallbackSrc={bike.threeSixtyUrl ? `${bike.threeSixtyUrl.replace('360/', 'color/')}${primaryColor.colorOption}.webp` : primaryColor.image}
                            alt={bike.name}
                            width={400}
                            height={400}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Content Overlay (Bottom Left) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-black/5 to-transparent pointer-events-none z-20" />

                <div className="absolute bottom-0 left-0 w-full p-4 z-30 flex items-end justify-between min-w-[280px]">
                    <div className="flex flex-col gap-2">


                        <div className="flex flex-col gap-0.5 mt-2">
                            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-white/30" />
                                Ex-Showroom
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[16px] font-black text-racing-blue">₹</span>
                                <span className="text-xl font-display font-black text-gray-600 tracking-tighter italic">
                                    {formatPrice(bike.price)}*
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link href={`/bikes/${bike.slug}`} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:bg-racing-blue group-hover:border-racing-blue transition-all duration-500 shadow-xl shrink-0 group-hover:scale-110">
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
