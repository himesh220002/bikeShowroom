"use client";

import { Bike, Phone, Shield, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { BIKES } from "@/lib/constants/bikes";
import { BikeCard } from "./BikeCard";
import { API_URL } from "@/lib/config";
import { Skeleton } from "../ui/Skeleton";

export function FeaturedBikes() {
    const [liveBikes, setLiveBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(true);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const bikesToShow = liveBikes.length > 0 ? liveBikes : BIKES;

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % bikesToShow.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + bikesToShow.length) % bikesToShow.length);
    };

    const handleDragEnd = (e: any, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x < -threshold) {
            handleNext();
        } else if (info.offset.x > threshold) {
            handlePrev();
        }
    };

    const getCardProps = (index: number) => {
        const n = bikesToShow.length;
        let offset = index - activeIndex;

        // Infinite wrap logic
        if (n > 2) {
            if (offset > n / 2) {
                offset -= n;
            } else if (offset < -n / 2) {
                offset += n;
            }
        }

        if (isMobile) {
            let width = "0%";
            let left = "0%";
            let x = "0%";
            let zIndex = 0;
            let opacity = 0;
            let scale = 1;
            let filter = "blur(0px)";

            if (offset === 0) {
                width = "75%";
                left = "4%";
                opacity = 1;
                zIndex = 10;
            } else if (offset === 1) {
                width = "15%";
                left = "83%";
                opacity = 1;
                zIndex = 5;
            } else if (offset === 2) {
                width = "10%";
                left = "102%";
                opacity = 1;
                zIndex = 2;
            } else if (offset === -1) {
                width = "75%";
                left = "-80%";
                opacity = 0;
            } else if (offset > 2) {
                left = "150%";
                width = "10%";
                opacity = 0;
            } else {
                left = "-150%";
                width = "75%";
                opacity = 0;
            }
            return { width, left, x, zIndex, opacity, scale, filter };
        } else {
            const width = "450px";
            let left = "50%";
            let x = "-50%";
            let zIndex = 0;
            let opacity = 0;
            let scale = 1;
            let filter = "blur(0px)";

            if (offset === 0) {
                left = "50%";
                zIndex = 10;
                opacity = 1;
            } else if (offset === 1) {
                left = "80%";
                zIndex = 5;
                opacity = 0.9;
                scale = 0.85;
                filter = "blur(3px)";
            } else if (offset === -1) {
                left = "20%";
                zIndex = 5;
                opacity = 0.9;
                scale = 0.85;
                filter = "blur(3px)";
            } else if (offset === 2) {
                left = "100%";
                zIndex = 2;
                opacity = 0.5;
                scale = 0.7;
                filter = "blur(2px)";
            } else if (offset === -2) {
                left = "0%";
                zIndex = 2;
                opacity = 0.5;
                scale = 0.7;
                filter = "blur(2px)";
            } else if (offset > 2) {
                left = "150%";
                opacity = 0;
            } else {
                left = "-50%";
                opacity = 0;
            }
            return { width, left, x, zIndex, opacity, scale, filter };
        }
    };

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

    const activeBike = bikesToShow[activeIndex];
    const primaryColor = activeBike?.colors?.[0]?.hex || '#000000';

    return (
        <section
            id="machines"
            className="py-12 lg:py-20 relative overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: `${primaryColor}10`, containIntrinsicSize: '0 800px' }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                            <Zap className="w-3 h-3" />
                            Premium Lineup
                        </div>
                        <h2 className="text-3xl md:text-4xl xl:text-5xl font-display font-black text-white uppercase tracking-tighter">
                            FEATURED <span className="text-racing-blue">MACHINES</span>
                        </h2>
                    </div>

                    <div className="hidden sm:flex width-fit gap-4">
                        <button
                            onClick={handlePrev}
                            className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground hover:border-racing-blue transition-all group active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-14 h-14 rounded-2xl bg-racing-blue flex items-center justify-center text-white hover:bg-dark-racing transition-all group active:scale-95 shadow-xl shadow-racing-blue/20"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden md:overflow-visible">
                    <motion.div
                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                    >
                        {bikesToShow.map((bike: any, index: number) => {
                            const { width, left, x, zIndex, opacity, scale, filter } = getCardProps(index);

                            return (
                                <motion.div
                                    key={bike.slug || bike._id}
                                    className="absolute top-0 h-full origin-center"
                                    initial={false}
                                    animate={{
                                        width,
                                        left,
                                        x,
                                        zIndex,
                                        opacity,
                                        scale,
                                        filter
                                    }}
                                    transition={{
                                        duration: 1.0,
                                        ease: [0.16, 1, 0.3, 1] // Smooth, cinematic ease
                                    }}
                                    onClick={() => {
                                        if (index !== activeIndex) setActiveIndex(index);
                                    }}
                                    onMouseEnter={() => {
                                        if (index !== activeIndex && !isMobile) {
                                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                            hoverTimeoutRef.current = setTimeout(() => {
                                                setActiveIndex(index);
                                            }, 200); // Wait for 200ms of intentional hover
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                    }}
                                >
                                    <BikeCard bike={bike} index={index} isActive={index === activeIndex} />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "Original Spares", desc: "100% genuine Yamaha parts" },
                        { icon: Bike, title: "Swift Valuations", desc: "Digital exchange scoring" },
                        { icon: Phone, title: "Expert Support", desc: "Certified Technicians" }
                    ].map((item, i) => (
                        <div key={item.title} className="bg-gray-900 p-6 rounded-3xl border border-gray-800 flex items-center gap-5 group hover:border-racing-blue/20 transition-all">
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
