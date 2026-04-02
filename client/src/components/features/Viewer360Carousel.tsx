"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Rotate3d, Loader2 } from "lucide-react";
import { Viewer360 } from "./Viewer360";
import { BIKES, type Bike } from "@/lib/constants/bikes";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/config";

export function Viewer360Carousel() {
    const [bikes, setBikes] = useState<Bike[]>(BIKES);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchBikes() {
            try {
                const res = await fetch(`${API_URL}/bikes`);
                const data = await res.json();
                if (data.success) {
                    // Merge backend bikes into static BIKES to ensure latest 360 URLs are used
                    const merged = BIKES.map(staticBike => {
                        const dbBike = data.data.find((b: any) => b.name === staticBike.name);
                        if (dbBike) {
                            return {
                                ...staticBike,
                                threeSixtyUrl: dbBike.threeSixtyUrl || staticBike.threeSixtyUrl,
                                threeSixtyImageCount: dbBike.threeSixtyImageCount || staticBike.threeSixtyImageCount
                            };
                        }
                        return staticBike;
                    });
                    setBikes(merged);
                }
            } catch (err) {
                console.error("360 Carousel Sync Error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchBikes();
    }, []);

    // Filter bikes that actually have 360 view assets and sufficient frames
    const bikesWith360 = bikes.filter(bike =>
        !!bike.threeSixtyUrl && (bike.threeSixtyImageCount || 0) > 35
    );

    // Deduplication: Only show one entry per unique 360 URL (fixes "Two R15s" issue)
    const uniqueBikes = bikesWith360.filter((bike, index, self) =>
        index === self.findIndex((b) => b.threeSixtyUrl === bike.threeSixtyUrl)
    );

    if (uniqueBikes.length === 0) return null;

    const nextBike = () => {
        setCurrentIndex((prev) => (prev + 1) % uniqueBikes.length);
    };

    const prevBike = () => {
        setCurrentIndex((prev) => (prev - 1 + uniqueBikes.length) % uniqueBikes.length);
    };

    const currentBike = uniqueBikes[currentIndex];

    return (
        <div className="relative group/carousel">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl rounded-[3rem]">
                    <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                </div>
            )}

            {/* Bike Info Header */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center hidden md:block">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBike.slug}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <h4 className="text-4xl font-display font-black text-white/10 uppercase tracking-tighter leading-none mb-2">
                            {currentBike.name}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue/40">
                            {currentBike.colors[0].name} Edition
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Main Viewer */}
            <div className="relative z-10">
                <Viewer360 key={currentBike.slug} bike={currentBike} />
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-2 bg-black/60 backdrop-blur-xl border border-white/5 rounded-full will-change-transform">
                {uniqueBikes.map((bike, idx) => (
                    <button
                        key={bike.slug}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            currentIndex === idx
                                ? "bg-racing-blue w-8"
                                : "bg-white/20 hover:bg-white/40"
                        )}
                        title={bike.name}
                    />
                ))}
            </div>

            {/* Next/Prev Buttons */}
            <button
                onClick={prevBike}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/60 backdrop-blur-lg border border-white/5 rounded-full text-white hover:bg-racing-blue hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 will-change-transform"
                aria-label="Previous Bike"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={nextBike}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/60 backdrop-blur-lg border border-white/5 rounded-full text-white hover:bg-racing-blue hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 will-change-transform"
                aria-label="Next Bike"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
}
