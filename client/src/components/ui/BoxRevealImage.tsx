"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { cleanImageUrl } from "@/lib/utils/url";

interface BoxRevealImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function BoxRevealImage({ src, alt, className }: BoxRevealImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const cleanedSrc = cleanImageUrl(src);

    // Reset loading state when src changes to trigger animation
    useEffect(() => {
        setIsLoaded(false);
        setIsCompleted(false);
        const loadTimer = setTimeout(() => setIsLoaded(true), 100);
        const finalTimer = setTimeout(() => setIsCompleted(true), 1200); // Wait for animations to finish
        return () => {
            clearTimeout(loadTimer);
            clearTimeout(finalTimer);
        };
    }, [src]);

    const tiles = [
        { pos: "center center", x: 0, y: 0, delay: 0 },         // 1: Center
        { pos: "right center", x: 1, y: 0, delay: 0.1, origin: "left" },    // 2: Right
        { pos: "center bottom", x: 0, y: 1, delay: 0.1, origin: "top" },     // 3: Bottom
        { pos: "left center", x: -1, y: 0, delay: 0.1, origin: "right" },   // 4: Left
        { pos: "center top", x: 0, y: -1, delay: 0.1, origin: "bottom" },  // 5: Top
        { pos: "right bottom", x: 1, y: 1, delay: 0.2, origin: "top left" },  // 6: Bottom-Right
        { pos: "left bottom", x: -1, y: 1, delay: 0.2, origin: "top right" }, // 7: Bottom-Left
        { pos: "left top", x: -1, y: -1, delay: 0.2, origin: "bottom right" }, // 8: Top-Left
        { pos: "right top", x: 1, y: -1, delay: 0.2, origin: "bottom left" },  // 9: Top-Right
    ];

    return (
        <div className={cn("relative perspective-[1000px] w-full max-w-[800px] mx-auto", className)}>
            <div className="relative w-full aspect-[3/2] transform-style-3d">
                <AnimatePresence>
                    {isLoaded && !isCompleted && (
                        <motion.div
                            key="grid"
                            className="grid grid-cols-3 grid-rows-3 w-full h-full transform-style-3d bg-transparent"
                            exit={{
                                opacity: 0,
                                scale: 1.1,
                                filter: "blur(4px)",
                                transition: { duration: 0.4 }
                            }}
                        >
                            {tiles.map((tile, i) => (
                                <motion.div
                                    key={`${src}-${i}`}
                                    initial={{
                                        opacity: 0,
                                        rotateX: tile.y !== 0 ? (tile.y > 0 ? -180 : 180) : 0,
                                        rotateY: tile.x !== 0 ? (tile.x > 0 ? 180 : -180) : 0,
                                        scale: 0.8,
                                        z: -200
                                    }}
                                    animate={{
                                        opacity: 1,
                                        rotateX: 0,
                                        rotateY: 0,
                                        scale: 1,
                                        z: 0
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: tile.delay,
                                        ease: [0.23, 1, 0.32, 1]
                                    }}
                                    style={{
                                        backgroundImage: `url(${cleanedSrc})`,
                                        backgroundSize: "300% 300%",
                                        backgroundPosition: tile.pos,
                                        transformOrigin: tile.origin || "center",
                                        gridColumn: tile.x === 0 ? 2 : (tile.x > 0 ? 3 : 1),
                                        gridRow: tile.y === 0 ? 2 : (tile.y > 0 ? 3 : 1),
                                    }}
                                    className="w-full h-full backface-hidden"
                                />
                            ))}
                        </motion.div>
                    )}

                    {isCompleted && (
                        <motion.div
                            key="final"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2, ease: "easeOut" }
                            }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                        >
                            <img
                                src={cleanedSrc}
                                alt={alt}
                                className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Reflection / Glow below */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-racing-blue/20 blur-[60px] opacity-30 rounded-full" />
        </div>
    );
}
