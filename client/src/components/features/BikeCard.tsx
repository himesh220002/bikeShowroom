"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { BikeImage } from "@/components/ui/BikeImage";

interface BikeCardProps {
    bike: any;
    index?: number;
}

export function BikeCard({ bike, index = 0 }: BikeCardProps) {
    const currentSpecs = bike.specs || [];
    // Ensure we handle missing values gracefully
    const primaryColor = bike.colors?.[0] || { name: 'Standard', hex: '#333', image: '' };

    return (
        <Link
            href={`/bikes/${bike.slug}`}
            className="block h-full"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="group relative bg-card/70 backdrop-blur-md rounded-[2.5rem] p-8 h-[550px] border border-border hover:border-racing-blue/40 transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden will-change-transform gpu-accelerated"
            >
                {/* Dynamic Background Glow */}
                <div
                    className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: primaryColor.hex }}
                />

                <div className="relative z-20">
                    <span className="inline-block px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white mb-4 md:mb-6 shadow-xl bg-racing-blue/80 backdrop-blur-md border border-white/10">
                        {bike.tag}
                    </span>

                    <div className="space-y-1 mb-6">
                        <h4 className="text-2xl md:text-3xl font-display font-black text-foreground tracking-tighter uppercase leading-none group-hover:text-blue-800 transition-colors duration-500">
                            {bike.name}
                        </h4>
                        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[7px] md:text-[8px]">
                            {primaryColor.name}
                        </p>
                    </div>

                    {/* <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
                        {currentSpecs.slice(0, 3).map((spec: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 p-2 md:p-3 rounded-xl md:rounded-2xl bg-foreground/5 border border-foreground/10 group/spec hover:bg-foreground/10 transition-colors">
                                <LucideIcon name={spec.icon} className="w-3.5 h-3.5 md:w-4 md:h-4 text-racing-blue group-hover/spec:scale-110 transition-transform" />
                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground text-center leading-tight">{spec.label}</span>
                            </div>
                        ))}
                    </div> */}
                </div>

                <div className="relative z-20 flex items-end justify-between pt-8 border-t border-foreground/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-muted-foreground/30" />
                            Ex-Showroom
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[9px] font-black text-racing-blue">₹</span>
                            <span className="text-xl md:text-3xl font-display font-black text-foreground tracking-tighter italic">
                                {bike.price}*
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="w-12 h-12 bg-foreground/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-foreground border border-foreground/10 group-hover:bg-racing-blue group-hover:border-racing-blue transition-all duration-500 shadow-xl group-hover:shadow-racing-blue/40 group-hover:scale-110">
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
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
                <div className="absolute -bottom-8 -left-4 text-8xl font-black text-foreground/[0.03] pointer-events-none select-none z-0 tracking-tighter uppercase italic group-hover:text-racing-blue/[0.05] group-hover:-translate-y-4 transition-all duration-1000 ease-out">
                    {bike.name.split(" ")[1] || bike.name.split(" ")[0]}
                </div>
            </motion.div>
        </Link>
    );
}
