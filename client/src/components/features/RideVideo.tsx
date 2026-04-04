"use client";

import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function RideVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Netflix-style subtle zoom effect based on scroll
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Immersive Video Container */}
            <motion.div
                style={{ scale, opacity }}
                className="absolute inset-0 w-full h-full"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    {/* <source src="/videos/yamaha r15 ride katihar mar26.mp4" type="video/mp4" /> */}
                    <source src="/videos/ymhaktrr15ridemar26.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
            </motion.div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-[1600px] mx-auto w-full"
                >
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue mb-4">
                        Katihar Ride Chronicles
                    </h2>
                    <h3 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter mb-6">
                        PURE <span className="text-racing-blue italic">RACING</span> DNA
                    </h3>
                    <p className="text-sm md:text-lg text-gray-400 font-medium max-w-xl leading-relaxed">
                        Experience the adrenaline of the Yamaha R15 on the streets of Katihar. Engineered for the track, built for the city—celebrating 70 years of Yamaha’s legacy of performance and innovation.
                    </p>
                </motion.div>
            </div>

            {/* Custom Controls */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-center gap-4 z-20">
                <button
                    onClick={toggleMute}
                    className="group w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-racing-blue hover:text-white transition-all"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                </button>
            </div>

            {/* Netflix-style Progress Bar (Purely Aesthetic) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                    className="h-full bg-racing-blue shadow-[0_0_10px_rgba(0,107,242,0.8)]"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </section>
    );
}
