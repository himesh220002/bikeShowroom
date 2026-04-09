"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Volume2, Cpu, Rotate3d, Play, Pause, X } from "lucide-react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { RotatingBikeViewer } from "./RotatingBikeViewer";
import { type Bike } from "@/lib/constants/bikes";

export function Viewer360({ bike }: { bike: Bike }) {
    const [activeMode, setActiveMode] = useState<"360" | "sound" | "tech">("360");
    const [isPlaying, setIsPlaying] = useState(false);
    const [gear, setGear] = useState<number | "N">("N");
    const GEAR_DATA: Record<number | "N", { speed: number; note: string; vva: boolean }> = {
        "N": { speed: 0, note: "Neutral gear - Engine idling", vva: false },
        1: { speed: 40, note: "Strong initial pull, VVA not active yet", vva: false },
        2: { speed: 60, note: "Good acceleration, hits limiter quickly", vva: false },
        3: { speed: 80, note: "VVA starts helping above ~7,400 rpm", vva: true },
        4: { speed: 100, note: "Smooth climb, best mid-range", vva: true },
        5: { speed: 120, note: "Needs long stretch, VVA fully active", vva: true },
        6: { speed: 140, note: "Maximum top speed achieved", vva: true },
    };

    const springSpeed = useSpring(0, {
        stiffness: 30,
        damping: 12,
        mass: 1.5
    });

    useEffect(() => {
        springSpeed.set(GEAR_DATA[gear].speed);
    }, [gear, springSpeed]);

    const toggleGear = () => {
        setGear((prev: number | "N") => {
            if (prev === "N") return 1;
            if (prev >= 6) return "N";
            return (prev as number) + 1;
        });
    };

    const modes = [
        { id: "360", label: "360° Explore", icon: Rotate3d },
        // { id: "sound", label: "Engine Sound", icon: Volume2 },
        // { id: "tech", label: "Digital Tech", icon: Cpu },
    ];

    return (
        <div className="relative max-w-[1400px] mx-auto h-[400px] sm:h-[600px] md:h-[700px] bg-background rounded-xl md:rounded-[3rem] overflow-hidden border border-border shadow-2xl group/viewer">
            {/* Main 3D View (Custom Rotating Viewer) */}
            <div className="absolute inset-0 z-0">
                {activeMode === "360" ? (
                    <RotatingBikeViewer
                        baseUrl={bike.threeSixtyUrl || ""}
                        imageCount={bike.threeSixtyImageCount}
                    />
                ) : (
                    <div className="w-full h-full bg-background flex items-center justify-center opacity-20">
                        <Rotate3d className="w-32 h-32 text-foreground animate-pulse" />
                    </div>
                )}
            </div>

            {/* Mode Selection Tabs (Top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-card/60 backdrop-blur-lg border border-border/5 rounded-2xl z-20 will-change-transform">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => {
                            setActiveMode(mode.id as any);
                            if (mode.id !== "sound") setIsPlaying(false);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeMode === mode.id
                                ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                        )}
                    >
                        <mode.icon className="w-4 h-4" />
                        <span className="hidden sm:inline z-10">{mode.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Context (Bottom Left) */}
            <div className="absolute bottom-8 left-8 p-8 bg-card/90 backdrop-blur-lg border border-border rounded-[2.5rem] max-w-xs z-20 shadow-2xl hidden lg:block will-change-transform">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeMode}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-racing-blue animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-racing-blue">
                                    {modes.find(m => m.id === activeMode)?.label}
                                </span>
                            </div>
                            <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter leading-none z-30 relative">
                                {activeMode === "360" && <>{bike.name} <br />360° <span className="text-gradient">VIEW</span></>}
                                {activeMode === "sound" && <>THRILL OF <br />THE <span className="text-gradient">ENGINE</span></>}
                                {activeMode === "tech" && <>DIGITAL <br /><span className="text-gradient">COMMAND</span></>}
                            </h3>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            {activeMode === "360" && `Immerse yourself in 360 virtual reality. Experience the ${bike.name} in its full glory.`}
                            {activeMode === "sound" && "Experience the raw power. Listen to the signature Yamaha exhaust note recorded live."}
                            {activeMode === "tech" && "Interact with the next-gen TFT console. Experience connected features and ride modes."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sound Check Overlay */}
            <AnimatePresence>
                {activeMode === "sound" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none"
                    >
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-24 h-24 rounded-full bg-racing-blue text-white flex items-center justify-center shadow-2xl shadow-racing-blue/40 hover:scale-110 active:scale-95 transition-all"
                            >
                                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                            </button>
                            {isPlaying && (
                                <div className="flex gap-1 h-12 items-center">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [10, 40, 15, 35, 12] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                            className="w-1 bg-racing-blue rounded-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tech Interface Overlay (Premium Dashboard) */}
            <AnimatePresence>
                {activeMode === "tech" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-x-2 md:inset-x-10 bottom-2 md:bottom-10 top-16 md:top-20 z-30 bg-background/98 backdrop-blur-lg border border-border/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col will-change-transform"
                    >
                        {/* Header */}
                        <div className="p-5 md:p-10 border-b border-border/5 flex justify-between items-center bg-linear-to-r from-muted/50 to-transparent shrink-0">
                            <div>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue mb-1 md:mb-2 block">Yamaha {bike.name} DNA</span>
                                <h4 className="text-2xl md:text-4xl font-display font-black text-foreground uppercase tracking-tighter leading-none">{bike.name} TECH</h4>
                            </div>
                            <button
                                onClick={() => setActiveMode("360")}
                                className="w-9 h-9 md:w-12 md:h-12 bg-foreground/5 rounded-full flex items-center justify-center text-foreground hover:bg-racing-blue hover:text-white transition-all group"
                            >
                                <X className="w-4 h-4 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                            <style>{`
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {/* Center: Main Gauge cluster */}
                            <div className="flex-[3] flex flex-col justify-center items-center p-4 md:p-10 relative bg-linear-to-b from-foreground/[0.02] to-transparent shrink-0">
                                <div className="relative w-48 h-48 md:w-80 md:h-80 rounded-full border-4 md:border-8 border-muted shadow-[0_0_100px_rgba(0,123,255,0.15)] flex items-center justify-center overflow-hidden group">
                                    {/* RPM Ring */}
                                    <motion.div
                                        className="absolute inset-4 border-4 border-dashed border-racing-blue/30 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    />
                                    {/* Speed & Gear */}
                                    <div className="relative z-10 text-center">
                                        {/* VVA Indicator Light */}
                                        <AnimatePresence>
                                            {GEAR_DATA[gear].vva && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-racing-blue/20 rounded-full border border-racing-blue/50 shadow-[0_0_15px_rgba(0,123,255,0.3)]"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-racing-blue animate-pulse" />
                                                    <span className="text-[8px] font-black text-white tracking-[0.2em] uppercase">VVA ACTIVE</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <motion.span
                                            key={gear}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-6xl md:text-8xl font-display font-black text-foreground italic -mb-2 md:-mb-4 block"
                                        >
                                            <AnimatedNumber value={springSpeed} />
                                        </motion.span>
                                        <span className="text-[10px] md:text-xs font-black text-racing-blue uppercase tracking-[0.3em]">KM/H</span>
                                        <div
                                            onClick={toggleGear}
                                            className="mt-4 px-6 py-2 bg-racing-blue/20 rounded-lg border border-racing-blue/40 cursor-pointer hover:bg-racing-blue/40 transition-all select-none"
                                        >
                                            <span className="text-xl md:text-3xl font-display font-black text-foreground underline decoration-racing-blue/40 decoration-4 underline-offset-8 uppercase tracking-widest italic group-hover:text-racing-blue transition-colors">
                                                G{gear}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Decorative Scan Line */}
                                    <motion.div
                                        className="absolute inset-0 bg-linear-to-b from-transparent via-racing-blue/5 to-transparent h-20 w-full"
                                        animate={{ top: ['-20%', '120%'] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    />
                                </div>
                                <p className="mt-8 text-[10px] text-muted-foreground font-black uppercase tracking-widest text-center">
                                    Real-time Telemetry Active • 256-bit Encryption
                                </p>
                            </div>

                            {/* Right: Technical Specifications (Scrollable) */}
                            <div className="flex-[2] p-6 md:p-12 overflow-y-auto scrollbar-hide border-l border-border/5 bg-foreground/5">
                                <div className="space-y-4 md:space-y-6">
                                    {[
                                        { label: "Engine Type", value: "155cc LC4V SOHC VVA", detail: "Variable Valve Actuation" },
                                        { label: "Gear Status", value: gear === "N" ? "Neutral" : `Gear ${gear}`, detail: GEAR_DATA[gear].note },
                                        { label: "VVA System", value: GEAR_DATA[gear].vva ? "ACTIVE" : "INACTIVE", detail: gear === 3 ? "Kicks in @ 7,400 RPM" : gear === "N" ? "Standby" : gear > 3 ? "Fully Engaged" : "Below threshold" },
                                        { label: "Max Torque", value: "14.2 Nm @ 7,500 rpm", detail: "Linear Power Delivery" },
                                        { label: "Braking System", value: "Dual Channel ABS", detail: "Safety Standard" },
                                        { label: "Traction Control", value: "TCS System", detail: "Advanced Stability" },
                                    ].map((spec, i) => (
                                        <motion.div
                                            key={spec.label}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-card/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-border/5 hover:border-racing-blue/30 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest">{spec.label}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-racing-blue opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-foreground font-display font-black text-sm md:text-lg tracking-tight uppercase leading-tight">{spec.value}</div>
                                            <div className="text-[8px] md:text-[9px] text-racing-blue/60 font-black uppercase tracking-widest mt-1">{spec.detail}</div>
                                        </motion.div>
                                    ))}

                                    <div className="p-6 bg-racing-blue/5 rounded-2xl border border-racing-blue/20">
                                        <h5 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-3">Vehicle Diagnostics</h5>
                                        <div className="flex gap-4">
                                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                                <motion.div className="h-full bg-racing-blue" initial={{ width: "0%" }} animate={{ width: "82%" }} transition={{ duration: 1.5 }} />
                                            </div>
                                            <span className="text-[10px] font-black text-racing-blue leading-none">82% TEMP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Helper (Bottom Right) */}
            {/* <div className="absolute bottom-8 right-8 flex gap-3 z-10">
                <div className="bg-zinc-900/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-zinc-800 flex items-center gap-4 shadow-2xl">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Rotate</span>
                        <div className="w-4 h-4 border-2 border-zinc-700 rounded-full mt-1 animate-ping" />
                    </div>
                </div>
            </div> */}
        </div>
    );
}

function AnimatedNumber({ value }: { value: any }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        return value.on("change", (latest: number) => {
            setDisplay(Math.floor(latest));
        });
    }, [value]);

    return <>{display}</>;
}
