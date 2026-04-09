"use client";

import { useEffect, useState } from "react";
import { BIKES } from "@/lib/constants/bikes";
import { BikeCard } from "@/components/features/BikeCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { API_URL } from "@/lib/config";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsPage() {
    const [liveBikes, setLiveBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const res = await fetch(`${API_URL}/bikes`);
                const data = await res.json();
                if (data.success) {
                    setLiveBikes(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch bikes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBikes();
    }, []);

    const bikesToShow = liveBikes.length > 0 ? liveBikes : BIKES;

    const CATEGORIES_CONFIG = [
        {
            id: "sport",
            title: "Sport Motorcycles",
            subtitle: "R-Series & MT-Series",
            description: "Engineered for performance, designed for the track and the street.",
            filter: (b: any) => b.category === 'bike' && ["r15v4", "mt15", "mt03"].includes(b.slug)
        },
        {
            id: "street",
            title: "Street Commuters",
            subtitle: "FZ-Series",
            description: "The Lord of the Streets. Muscular, reliable, and fuel-efficient.",
            filter: (b: any) => b.category === 'bike' && ["fzs-v4", "fz-fi", "fz-rave"].includes(b.slug)
        },
        {
            id: "retro",
            title: "Neo-Retro",
            subtitle: "XSR & FZ-X",
            description: "Classic aesthetics meet modern technology for a timeless ride.",
            filter: (b: any) => b.category === 'bike' && ["fzx", "xsr155"].includes(b.slug)
        },
        {
            id: "other-motorcycles",
            title: "More Motorcycles",
            subtitle: "New Arrivals",
            description: "Check out our latest additions to the Yamaha lineup.",
            filter: (b: any) => b.category === 'bike' && !["r15v4", "mt15", "mt03", "fzs-v4", "fz-fi", "fz-rave", "fzx", "xsr155"].includes(b.slug)
        },
        {
            id: "scooters",
            title: "Performance Scooters",
            subtitle: "Aerox, RayZR & Fascino",
            description: "Stylish, powerful, and practical for the modern urban landscape.",
            filter: (b: any) => b.category === 'scooty'
        }
    ];

    const categoriesWithBikes = CATEGORIES_CONFIG.map(cat => ({
        ...cat,
        bikes: bikesToShow.filter(cat.filter)
    })).filter(cat => cat.bikes.length > 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-24 md:pt-32 pb-24">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-20 space-y-4">
                        <Skeleton className="h-6 w-32 rounded-full" />
                        <Skeleton className="h-12 w-64 rounded-xl" />
                        <Skeleton className="h-4 w-full max-w-2xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="aspect-[4/5] rounded-[3rem]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 md:pt-32 pb-24 relative overflow-hidden">
            {/* Showroom Background Image - Fixed Position */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 scale-100"
                    style={{ backgroundImage: `url('/images/mt15v2background.webp')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950" />
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="mb-10 md:mb-20 space-y-4">

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                        <Zap className="w-3 h-3" />
                        Yamaha Lineup
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter">
                        OUR <span className="text-racing-blue">MACHINES</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl font-medium leading-relaxed">
                        Discover the perfect balance of performance, style, and innovation across our diverse range of motorcycles and scooters.
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-16 md:space-y-32">

                    {categoriesWithBikes.map((category) => (
                        <section key={category.id} id={category.id} className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                                <div className="space-y-2">
                                    <h2 className="text-2xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                                        {category.title}
                                    </h2>
                                    <p className="text-racing-blue text-xs font-black uppercase tracking-[0.3em]">
                                        {category.subtitle}
                                    </p>
                                </div>
                                <p className="text-gray-400 text-sm max-w-md">
                                    {category.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {category.bikes.map((bike, idx) => (
                                    <div key={bike.slug || bike._id}>
                                        <BikeCard bike={bike} index={idx} />
                                    </div>
                                ))}
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
