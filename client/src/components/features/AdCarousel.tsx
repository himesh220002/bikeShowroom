"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";
import { API_URL, API_BASE_URL } from "@/lib/config";
import { Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Ad = {
    _id: string;
    name: string;
    type: "Poster" | "Video" | "Banner";
    image: string;
    description?: string;
    link: string;
};

type PromoResponse = Ad & {
    status: 'Active' | 'Scheduled' | 'Inactive';
};

export function AdCarousel() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [selectedType, setSelectedType] = useState<Ad["type"]>("Poster");

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`${API_URL}/promos`);
                const data = await res.json();
                if (data.success) {
                    setAds(data.data
                        .filter((ad: PromoResponse) => ad.status === 'Active' || ad.status === 'Scheduled')
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

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        if (file.type.startsWith("video/")) {
            setSelectedType("Video");
        } else {
            setSelectedType("Poster");
        }
    };

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

                <div className="mb-10 space-y-6">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                        <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground">
                            Upload image or video
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="mt-3 block w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground"
                            />
                        </label>
                        <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground">
                            Ad type
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as Ad["type"])}
                                className="mt-3 block w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground"
                            >
                                <option value="Poster">Poster</option>
                                <option value="Video">Video</option>
                                <option value="Banner">Banner</option>
                            </select>
                        </label>
                    </div>

                    {previewUrl && (
                        <div className="rounded-[2rem] overflow-hidden bg-muted/50 border border-border p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Preview ({selectedType})
                                </span>
                                <span className="text-xs text-gray-300">
                                    {selectedFile?.type}
                                </span>
                            </div>
                            {selectedFile?.type.startsWith("video/") ? (
                                <video controls src={previewUrl} className="w-full rounded-3xl" />
                            ) : (
                                <Image
                                    src={previewUrl}
                                    alt="Selected preview"
                                    width={900}
                                    height={500}
                                    unoptimized
                                    className="w-full rounded-3xl object-cover"
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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

    return (
        <div className="group flex flex-col space-y-4">
            <div className="relative aspect-[4/5] w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted/50 backdrop-blur-md border border-border shadow-2xl gpu-accelerated">
                <div className="absolute inset-0 w-full h-full">
                    {(ad.type === "Poster" || ad.type === "Video") && ad.image && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt=""
                                fill
                                unoptimized
                                className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
                            />
                        </div>
                    )}
                    {ad.image && (
                        <Image
                            src={imageUrl}
                            alt={ad.name}
                            fill
                            unoptimized
                            className={cn(
                                "relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover"
                            )}
                        />
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
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-racing-blue rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all shadow-xl hover:-translate-y-1"
                    >
                        {ad.type === "Video" ? <Play className="w-4 h-4 fill-current" /> : <ExternalLink className="w-4 h-4" />}
                        {ad.type === "Video" ? "Watch Review" : "Explore"}
                    </a>
                </div>
            </div>
        </div>
    );
}
