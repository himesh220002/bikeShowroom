"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, Loader2 } from "lucide-react";
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

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/ads");
                const data = await res.json();
                if (data.success) {
                    setAds(data.data
                        .filter((ad: any) => ad.status === 'Active' || ad.status === 'Scheduled')
                        .slice(0, 3)
                    );
                }
            } catch (err) {
                console.error("Failed to fetch ads:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);


    return (
        <section id="promotions" className="relative py-16 bg-transparent overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-5xl font-display font-black text-white uppercase tracking-tighter italic">
                            Yamaha Highlights <span className="text-racing-blue">& Events</span>
                        </h2>
                        <div className="h-1 w-16 md:w-24 bg-racing-blue mt-2 rounded-full" />
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ads.map((ad) => (
                            <AdCard key={ad._id} ad={ad} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-racing-blue/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}

function AdCard({ ad }: { ad: Ad }) {
    return (
        <div className="group flex flex-col space-y-4">
            <div className="relative aspect-square w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted border border-border shadow-2xl">
                {/* Visual content part */}
                <div className="absolute inset-0 w-full h-full">
                    {/* Blurred background for non-banner types */}
                    {(ad.type === "Poster" || ad.type === "Video") && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <Image
                                src={ad.image}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover blur-3xl opacity-40 scale-110"
                            />
                        </div>
                    )}
                    <Image
                        src={ad.image}
                        alt={ad.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={cn(
                            "relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover"
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
                        Choudhary Yamaha Exclusive
                    </span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight leading-none line-clamp-1">
                    {ad.name}
                </h3>
                {ad.description && (
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 max-w-xl hidden md:block">
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
