"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Rotate3d, Loader2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// const TOTAL_IMAGES = 40;
// const BASE_URL = "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/360/";

// ----------------------------------------------------------------------------
// ImageFrame: Handles individual frame rendering and cross-fading logic
// ----------------------------------------------------------------------------
function ImageFrame({ id, smoothIndex, loaded, baseUrl, totalImages }: { id: number; smoothIndex: any; loaded: boolean; baseUrl: string; totalImages: number }) {
    // Calculate opacity based on relative distance to this frame
    const opacity = useTransform(smoothIndex, (latestValue: number) => {
        // Normalize the floating index to stay within the range
        const normalizedLatest = ((latestValue - 1) % totalImages + totalImages) % totalImages + 1;

        // Math.round can return 0.5 -> 1 or 40.5 -> 41. We must wrap back to 1.
        let rounded = Math.round(normalizedLatest);
        if (rounded > totalImages) rounded = 1;
        if (rounded < 1) rounded = totalImages;

        if (id === rounded) return 1;
        return 0;
    });

    if (!loaded) return null;

    return (
        <motion.img
            src={`${baseUrl}${id}.webp`}
            alt={`Frame ${id}`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity }}
            loading="eager"
        />
    );
}

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export function RotatingBikeViewer({ baseUrl, imageCount = 40 }: { baseUrl: string; imageCount?: number }) {
    const TOTAL_IMAGES = imageCount;
    const [targetIndex, setTargetIndex] = useState(1);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(false);
    const [hasBeenInView, setHasBeenInView] = useState(false);

    // smoothIndex follows targetIndex with physics for better "120fps feel"
    const smoothIndex = useSpring(1, {
        stiffness: 80,
        damping: 40,
        mass: 0.5
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const lastIndex = useRef(1);
    const framesMoved = useRef(0);

    // Intersection Observer to trigger loading only when in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasBeenInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Sync spring to target state
    useEffect(() => {
        smoothIndex.set(targetIndex);
    }, [targetIndex, smoothIndex]);

    // Preload all assets
    useEffect(() => {
        if (!hasBeenInView) return;

        let loadedCount = 0;
        for (let i = 1; i <= TOTAL_IMAGES; i++) {
            const img = new Image();
            img.src = `${baseUrl}${i}.webp`;
            img.onload = () => {
                setLoadedImages((prev) => ({ ...prev, [i]: true }));
                loadedCount++;
                const progress = Math.round((loadedCount / TOTAL_IMAGES) * 100);
                setLoadProgress(progress);

                if (loadedCount === TOTAL_IMAGES) {
                    setLoading(false);
                    // Single full rotation on initial load
                    setTimeout(() => {
                        framesMoved.current = 0;
                        setIsAutoRotating(true);
                    }, 500);
                }
            };
        }
    }, [hasBeenInView, baseUrl]);

    // Auto-rotation (Relative turns)
    useEffect(() => {
        if (!isAutoRotating || loading) return;

        const interval = setInterval(() => {
            if (!isDragging.current) {
                if (framesMoved.current >= TOTAL_IMAGES * 2) {
                    setIsAutoRotating(false);
                } else {
                    framesMoved.current++;
                    setTargetIndex((prev) => prev + 1); // Continuous for smooth spring animation
                }
            }
        }, 60);

        return () => clearInterval(interval);
    }, [isAutoRotating, loading]);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        setIsAutoRotating(false);
        startX.current = e.clientX;
        lastIndex.current = targetIndex;
        if (containerRef.current) {
            containerRef.current.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const deltaX = e.clientX - startX.current;

        const pixelsPerFrame = rect.width / (TOTAL_IMAGES * 1.5);
        const moveFrames = Math.floor(deltaX / pixelsPerFrame);

        // Use continuous index movement
        setTargetIndex(lastIndex.current - moveFrames);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        if (containerRef.current) {
            containerRef.current.releasePointerCapture(e.pointerId);
        }
    };

    // Track rounded display index for the UI
    const [displayIndex, setDisplayIndex] = useState(1);
    useEffect(() => {
        return smoothIndex.on("change", (latestVal) => {
            let normalized = ((latestVal - 1) % TOTAL_IMAGES + TOTAL_IMAGES) % TOTAL_IMAGES + 1;
            let rounded = Math.round(normalized);
            if (rounded > TOTAL_IMAGES) rounded = 1;
            if (rounded < 1) rounded = TOTAL_IMAGES;
            setDisplayIndex(rounded);
        });
    }, [smoothIndex]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center bg-zinc-950 overflow-hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-zinc-950/90 backdrop-blur-md">
                    <Loader2 className="w-12 h-12 text-racing-blue animate-spin mb-6" />
                    <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden mb-4">
                        <motion.div
                            className="h-full bg-racing-blue shadow-[0_0_10px_rgba(0,123,255,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                        Caching High-Res Stream... {loadProgress}%
                    </p>
                </div>
            )}

            {/* Interpolated Image Stack */}
            <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center">
                {Array.from({ length: TOTAL_IMAGES }, (_, i) => i + 1).map((i) => (
                    <ImageFrame
                        key={i}
                        id={i}
                        smoothIndex={smoothIndex}
                        loaded={loadedImages[i]}
                        baseUrl={baseUrl}
                        totalImages={TOTAL_IMAGES}
                    />
                ))}
            </div>

            {/* UI Overlays */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl pointer-events-none z-20">
                <Rotate3d className="w-4 h-4 text-racing-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Hold & Drag to Explore</span>
            </div>

            <div className="absolute top-12 right-12 z-20">
                <button
                    onClick={() => {
                        if (!isAutoRotating) {
                            framesMoved.current = 0; // reset every time you resume
                        }
                        setIsAutoRotating(!isAutoRotating);
                    }}
                    className="hidden flex items-center justify-center w-10 h-10 bg-zinc-900/50 border border-zinc-800 rounded-xl text-racing-blue hover:bg-racing-blue hover:text-white transition-all shadow-lg"
                >
                    {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
            </div>
        </div>
    );
}
