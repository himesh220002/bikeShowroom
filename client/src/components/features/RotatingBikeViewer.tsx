"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Loader2, Rotate3d, Play, Pause } from "lucide-react";

// ----------------------------------------------------------------------------
// ImageFrame: Handles individual frame rendering and cross-fading logic
// ----------------------------------------------------------------------------
function ImageFrame({ id, smoothIndex, loaded, baseUrl, totalImages }: { id: number; smoothIndex: any; loaded: boolean; baseUrl: string; totalImages: number }) {
    const opacity = useTransform(smoothIndex, (latestValue: number) => {
        const normalizedLatest = ((latestValue - 1) % totalImages + totalImages) % totalImages + 1;
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
// InfiniteGrid: Professional architectural background (Max Visibility)
// ----------------------------------------------------------------------------
// function InfiniteGrid() {
//     return (
//         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background">
//             {/* Major "CM" Scale (40px Grid H & V) - High contrast for light mode */}
//             <div
//                 className="absolute inset-0 opacity-[0.45] dark:opacity-[0.15]"
//                 style={{
//                     backgroundImage: `
//                         linear-gradient(to right, #000 1.5px, transparent 1.5px),
//                         linear-gradient(to bottom, #000 1.5px, transparent 1.5px)
//                     `,
//                     backgroundSize: '40px 40px',
//                     maskImage: 'radial-gradient(circle at center, black 60%, transparent 98%)',
//                     WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 98%)',
//                 }}
//             />
//             {/* Major Grid White Inversion for Dark Theme */}
//             <div
//                 className="absolute inset-0 hidden dark:block opacity-[0.15]"
//                 style={{
//                     backgroundImage: `
//                         linear-gradient(to right, #fff 1px, transparent 1px),
//                         linear-gradient(to bottom, #fff 1px, transparent 1px)
//                     `,
//                     backgroundSize: '40px 40px',
//                     maskImage: 'radial-gradient(circle at center, black 60%, transparent 98%)',
//                     WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 98%)',
//                 }}
//             />

//             {/* Minor "MM" Scale (10px Grid H & V) - Precision detailing (Increased visibility) */}
//             <div
//                 className="absolute inset-0 opacity-[0.4] dark:opacity-[0.12]"
//                 style={{
//                     backgroundImage: `
//                         linear-gradient(to right, #000 0.5px, transparent 0.5px),
//                         linear-gradient(to bottom, #000 0.5px, transparent 0.5px)
//                     `,
//                     backgroundSize: '10px 10px',
//                     maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
//                     WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
//                 }}
//             />
//             {/* Minor Grid White Inversion for Dark Theme */}
//             <div
//                 className="absolute inset-0 hidden dark:block opacity-[0.12]"
//                 style={{
//                     backgroundImage: `
//                         linear-gradient(to right, #fff 0.5px, transparent 0.5px),
//                         linear-gradient(to bottom, #fff 0.5px, transparent 0.5px)
//                     `,
//                     backgroundSize: '10px 10px',
//                     maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
//                     WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
//                 }}
//             />
//         </div>
//     );
// }

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

    useEffect(() => {
        smoothIndex.set(targetIndex);
    }, [targetIndex, smoothIndex]);

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
                    setTimeout(() => {
                        framesMoved.current = 0;
                        setIsAutoRotating(true);
                    }, 500);
                }
            };
        }
    }, [hasBeenInView, baseUrl]);

    useEffect(() => {
        if (!isAutoRotating || loading) return;

        const interval = setInterval(() => {
            if (!isDragging.current) {
                if (framesMoved.current >= TOTAL_IMAGES * 2) {
                    setIsAutoRotating(false);
                } else {
                    framesMoved.current++;
                    setTargetIndex((prev) => prev + 1);
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

        // Refined sensitivity: approx 1.2x swipe for full rotation
        const pixelsPerFrame = rect.width / (TOTAL_IMAGES * 1.2);
        const moveFrames = Math.floor(deltaX / pixelsPerFrame);
        setTargetIndex(lastIndex.current - moveFrames);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        if (containerRef.current) {
            containerRef.current.releasePointerCapture(e.pointerId);
        }
    };

    const [displayIndex, setDisplayIndex] = useState(1);
    useEffect(() => {
        return smoothIndex.on("change", (latestVal) => {
            const normalized = ((latestVal - 1) % TOTAL_IMAGES + TOTAL_IMAGES) % TOTAL_IMAGES + 1;
            let rounded = Math.round(normalized);
            if (rounded > TOTAL_IMAGES) rounded = 1;
            if (rounded < 1) rounded = TOTAL_IMAGES;
            setDisplayIndex(rounded);
        });
    }, [smoothIndex]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center backdrop-blur-xl overflow-hidden touch-action-none"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* Background Grid - z-0 */}
            {/* <InfiniteGrid /> */}

            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-background/90 backdrop-blur-md">
                    <Loader2 className="w-12 h-12 text-racing-blue animate-spin mb-6" />
                    <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mb-4">
                        <motion.div
                            className="h-full bg-racing-blue shadow-[0_0_10px_rgba(0,123,255,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                        Caching High-Res Stream... {loadProgress}%
                    </p>
                </div>
            )}

            {/* Image Stack - z-10 (Between grid and text) */}
            <div className="relative w-full max-w-4xl mt-10 aspect-[16/9] flex items-center justify-center z-10 pointer-events-none sm:scale-100 scale-[1.4] transition-transform duration-500">
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

            {/* Interaction Helper - z-20 (Always on top) */}
            {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/10 backdrop-blur-xl border border-border px-3 sm:px-6 py-1 sm:py-3 rounded-2xl pointer-events-none z-20">
                <Rotate3d className="w-4 h-4 text-racing-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hold & Drag to Explore</span>
            </div> */}

            <div className="absolute top-12 right-12 z-20">
                <button
                    onClick={() => {
                        if (!isAutoRotating) {
                            framesMoved.current = 0;
                        }
                        setIsAutoRotating(!isAutoRotating);
                    }}
                    className="hidden flex items-center justify-center w-10 h-10 bg-muted/50 border border-border rounded-xl text-racing-blue hover:bg-racing-blue hover:text-white transition-all shadow-lg"
                >
                    {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
            </div>
        </div>
    );
}
