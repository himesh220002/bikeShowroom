"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/ads");
                const data = await res.json();
                if (data.success) {
                    // Only show active ads (in a real app we'd filter by status, 
                    // but here we just take what's returned)
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
        if (ads.length <= 1) return;
        const timer = setInterval(() => {
            next();
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length, currentIndex]);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    };

    if (loading || !ads || ads.length === 0) return null;

    return (
        <section className="relative py-12 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="relative group">
                    {/* Main Carousel Container */}
                    <div className="relative aspect-[21/9] md:aspect-[25/9] w-full rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl border border-border">
                        {ads.map((ad, index) => (
                            <div
                                key={ad._id}
                                className={cn(
                                    "absolute inset-0 transition-all duration-1000 ease-in-out",
                                    index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
                                )}
                            >
                                <img
                                    src={ad.image}
                                    alt={ad.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                                    <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-racing-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                                {ad.type}
                                            </span>
                                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                                                Latest Promotion
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
                                            {ad.name}
                                        </h2>
                                        {ad.description && (
                                            <p className="text-white/70 text-sm md:text-lg font-medium max-w-lg line-clamp-2">
                                                {ad.description}
                                            </p>
                                        )}
                                        <div className="flex gap-4 pt-4">
                                            <a
                                                href={ad.link}
                                                target="_blank"
                                                className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                            >
                                                {ad.type === "Video" ? <Play className="w-4 h-4 fill-current" /> : <ExternalLink className="w-4 h-4" />}
                                                {ad.type === "Video" ? "Watch Video" : "Explore Offer"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Navigation Arrows */}
                        <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={prev}
                                className="p-4 bg-black/20 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-racing-blue transition-all"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={next}
                                className="p-4 bg-black/20 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-racing-blue transition-all"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "h-1.5 transition-all duration-500 rounded-full",
                                    index === currentIndex ? "w-12 bg-racing-blue" : "w-4 bg-muted hover:bg-muted-foreground"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-racing-blue/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}
