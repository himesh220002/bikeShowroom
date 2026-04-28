"use client";

import Image from "next/image";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { API_URL, API_BASE_URL } from "@/lib/config";
import { Play, Pause, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Ad = {
    _id: string;
    name: string;
    type: "Poster" | "Video" | "Banner";
    image: string;
    thumbnail?: string;
    description?: string;
    link: string;
};

type PromoResponse = Ad & {
    status: 'Active' | 'Scheduled' | 'Inactive';
};

export function AdCarousel() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`${API_URL}/promos`);
                const data = await res.json();
                if (data.success) {
                    setAds(data.data
                        .filter((ad: PromoResponse) => ad.status === 'Active' || ad.status === 'Scheduled')
                        .slice(0, 4)
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
        <section id="promotions" className="relative py-16 bg-transparent overflow-hidden scroll-mt-[100px]">
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
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-96 rounded-[1.5rem] bg-muted/30 border border-border animate-pulse"
                                />
                            ))
                        ) : ads.length > 0 ? (
                            ads.map((ad) => <AdCard key={ad._id} ad={ad} />)
                        ) : (
                            <div className="col-span-full rounded-[1.5rem] bg-muted/50 border border-border p-12 text-center text-gray-300">
                                No active promotions available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-racing-blue/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}

function AdCard({ ad }: { ad: Ad }) {
    const imageUrl = ad.image.startsWith('/uploads') ? `${API_BASE_URL}${ad.image}` : ad.image;
    const thumbUrl = ad.thumbnail ? (ad.thumbnail.startsWith('/uploads') ? `${API_BASE_URL}${ad.thumbnail}` : ad.thumbnail) : imageUrl;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (ad.type !== "Video") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(() => { });
                    setIsPlaying(true);
                } else {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, [ad.type]);

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="group flex flex-col space-y-4">
            <div className="relative aspect-[4/5] w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted/50 backdrop-blur-md border border-border shadow-2xl gpu-accelerated">
                <div className="absolute inset-0 w-full h-full">
                    {(ad.type === "Poster" || ad.type === "Video") && ad.image && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <Image
                                src={ad.type === "Video" ? thumbUrl : imageUrl}
                                alt=""
                                fill
                                unoptimized
                                className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
                            />
                        </div>
                    )}
                    {ad.image && (
                        ad.type === "Video" ? (
                            <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
                                <video
                                    ref={videoRef}
                                    src={imageUrl}
                                    poster={thumbUrl}
                                    muted
                                    loop
                                    playsInline
                                    className="relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover"
                                />
                                {/* Play/Pause Overlay */}
                                <div className={cn(
                                    "absolute inset-0 z-20 flex items-center justify-center transition-all duration-300",
                                    isPlaying ? "opacity-0 group-hover:opacity-100 bg-black/10" : "opacity-100 bg-black/30"
                                )}>
                                    <div className="w-16 h-16 rounded-full bg-racing-blue/90 text-white flex items-center justify-center backdrop-blur-md shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Image
                                src={imageUrl}
                                alt={ad.name}
                                fill
                                unoptimized
                                className={cn(
                                    "relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover"
                                )}
                            />
                        )
                    )}
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
                <h3 className="text-xl md:text-2xl font-display font-black text-blue-200 uppercase tracking-tight leading-none line-clamp-1">
                    {ad.name}
                </h3>
                {ad.description && (
                    <p className="text-gray-400 text-sm font-medium line-clamp-2 max-w-xl hidden md:block">
                        {ad.description}
                    </p>
                )}
                <div className="pt-2">
                    <a
                        href={ad.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-4 md:px-8 py-2 md:py-4 bg-white text-racing-blue rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all shadow-xl hover:-translate-y-1"
                    >
                        {ad.type === "Video" ? <ExternalLink className="w-4 h-4 fill-current" /> : <ExternalLink className="w-4 h-4" />}
                        {ad.type === "Video" ? "Review" : "Explore"}
                    </a>
                </div>
            </div>
        </div>
    );
}
