"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

type Ad = {
    _id: string;
    name: string;
    type: "Poster" | "Video" | "Banner";
    image: string;
    description?: string;
    link: string;
};

export function AdCarousel() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/ads");
                const data = await res.json();
                if (data.success) {
                    setAds(data.data.filter((ad: any) => ad.status === 'Active' || ad.status === 'Scheduled'));
                }
            } catch (err) {
                console.error("Failed to fetch ads:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (ads.length <= 2) return;
        const timer = setInterval(() => {
            next();
        }, 6000);
        return () => clearInterval(timer);
    }, [ads.length, currentIndex]);

    const next = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % ads.length);
    };

    const prev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    };

    if (loading || !ads || ads.length === 0) return null;

    // Determine visible ads based on currentIndex
    // For a smoother "infinite" feel, we'll slice the array
    const getVisibleAds = () => {
        if (ads.length === 1) return [ads[0]];
        const first = ads[currentIndex];
        const nextIdx = (currentIndex + 1) % ads.length;
        return [first, ads[nextIdx]];
    };

    const visibleAds = getVisibleAds();

    return (
        <section id="promotions" className="relative py-16 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter italic">
                            TRENDING <span className="text-racing-blue">OFFERS</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-racing-blue mt-2 rounded-full" />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={prev}
                            className="p-4 bg-muted border border-border text-white rounded-full hover:bg-racing-blue transition-all group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={next}
                            className="p-4 bg-muted border border-border text-white rounded-full hover:bg-racing-blue transition-all group"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {visibleAds.map((ad) => (
                                <AdCard key={ad._id} ad={ad} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-12">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={cn(
                                "h-1.5 transition-all duration-500 rounded-full",
                                index === currentIndex ? "w-12 bg-racing-blue" : "w-4 bg-muted hover:bg-muted-foreground"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-racing-blue/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}

function AdCard({ ad }: { ad: Ad }) {
    return (
        <div className="group flex flex-col space-y-6">
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-muted border border-border shadow-2xl">
                {/* Visual content part */}
                <div className="absolute inset-0 w-full h-full">
                    {/* Blurred background for non-banner types */}
                    {(ad.type === "Poster" || ad.type === "Video") && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <img
                                src={ad.image}
                                alt=""
                                className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
                            />
                        </div>
                    )}
                    <img
                        src={ad.image}
                        alt={ad.name}
                        className={cn(
                            "relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-105",
                            ad.type === "Banner" ? "object-cover" : "object-contain"
                        )}
                    />
                    <div className="absolute top-6 left-6 z-20">
                        <span className="px-3 py-1 bg-racing-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            {ad.type}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-2 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-racing-blue/60 text-[10px] font-black uppercase tracking-widest">
                        Exclusively At BikeShowroom
                    </span>
                </div>
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-none">
                    {ad.name}
                </h3>
                {ad.description && (
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 max-w-xl">
                        {ad.description}
                    </p>
                )}
                <div className="pt-2">
                    <a
                        href={ad.link}
                        target="_blank"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all shadow-xl hover:-translate-y-1"
                    >
                        {ad.type === "Video" ? <Play className="w-4 h-4 fill-current" /> : <ExternalLink className="w-4 h-4" />}
                        {ad.type === "Video" ? "Watch Review" : "Explore"}
                    </a>
                </div>
            </div>
        </div>
    );
}
