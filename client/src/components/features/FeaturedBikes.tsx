"use client";

import { Bike, Phone, Shield, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { BIKES } from "@/lib/constants/bikes";
import { BikeCard } from "./BikeCard";
import { API_URL } from "@/lib/config";
import { Skeleton } from "../ui/Skeleton";

export function FeaturedBikes() {
    const [liveBikes, setLiveBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial fetch
    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const res = await fetch(`${API_URL}/bikes`);
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

    const bikesToShow = liveBikes.length > 0 ? liveBikes : BIKES;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            const scrollAmount = offsetWidth > 1024 ? offsetWidth / 3 : offsetWidth > 768 ? offsetWidth / 2 : offsetWidth;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Auto-play Effect - MUST be called before any conditional returns
    useEffect(() => {
        if (loading || bikesToShow.length <= 1) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, offsetWidth } = scrollRef.current;

                // If at the end (or near it due to pixel precision), go back to start
                const isAtEnd = scrollLeft + offsetWidth >= scrollWidth - 10;

                if (isAtEnd) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scroll('right');
                }
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [loading, bikesToShow.length]);

    if (loading) {
        return (
            <section id="machines" className="py-12 md:py-24 relative overflow-hidden bg-transparent">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-32 rounded-full" />
                            <Skeleton className="h-12 w-64 rounded-2xl" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="aspect-[4/5] rounded-[3rem]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="machines" className="py-12 lg:py-32 bg-transparent overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-8">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                            <Zap className="w-3 h-3" />
                            Premium Lineup
                        </div>
                        <h2 className="text-3xl md:text-5xl  xl:text-7xl font-display font-black text-white uppercase tracking-tighter">
                            FEATURED <span className="text-racing-blue">MACHINES</span>
                        </h2>
                    </div>

                    <div className="hidden sm:flex width-fit gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground hover:border-racing-blue transition-all group active:scale-95"
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
                    className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide will-change-transform"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {bikesToShow.map((bike: any, index: number) => (
                        <div
                            key={bike.slug || bike._id}
                            className="w-[100%] sm:w-[calc(50%-1rem)] xl:w-[calc(33.333%-1.33rem)] flex-shrink-0 snap-center"
                        >
                            <BikeCard bike={bike} index={index} />
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "Original Spares", desc: "100% genuine Yamaha parts" },
                        { icon: Bike, title: "Swift Valuations", desc: "Digital exchange scoring" },
                        { icon: Phone, title: "Expert Support", desc: "Certified Technicians" }
                    ].map((item, i) => (
                        <div key={item.title} className="bg-gray-900 p-6 rounded-3xl border border-gray-800 border-inner flex items-center gap-5 group hover:border-racing-blue/20 transition-all">
                            <div className="w-12 h-12 bg-racing-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                                <item.icon className="w-6 h-6 text-racing-blue" />
                            </div>
                            <div>
                                <h5 className="font-display font-black text-white text-sm uppercase tracking-tight">{item.title}</h5>
                                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
