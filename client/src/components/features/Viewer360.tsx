"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Volume2, Cpu, Rotate3d, Play, Pause, X } from "lucide-react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export function Viewer360() {
    const [activeMode, setActiveMode] = useState<"360" | "sound" | "tech">("360");
    const [isPlaying, setIsPlaying] = useState(false);
    const [gear, setGear] = useState<number | "N">("N");
    const GEAR_SPEEDS = [0, 32, 65, 95, 120, 145];

    const springSpeed = useSpring(0, {
        stiffness: 30,
        damping: 12,
        mass: 1.5
    });

    useEffect(() => {
        if (gear === "N") {
            springSpeed.set(0);
        } else {
            springSpeed.set(GEAR_SPEEDS[gear as number]);
        }
    }, [gear, springSpeed]);

    const toggleGear = () => {
        setGear((prev) => {
            if (prev === "N") return 1;
            if (prev >= 5) return "N";
            return (prev as number) + 1;
        });
    };

    const modes = [
        { id: "360", label: "360° Explore", icon: Rotate3d },
        { id: "sound", label: "Engine Sound", icon: Volume2 },
        { id: "tech", label: "Digital Tech", icon: Cpu },
    ];

    return (
        <div className="relative max-w-[1400px] mx-auto h-[700px] bg-zinc-950 rounded-[3rem] overflow-hidden border border-zinc-900 shadow-2xl group/viewer">
            {/* Main 3D View (Sketchfab Embed) */}
            <div className="absolute inset-0 z-0">
                <iframe
                    title="Yamaha XSR700 2016"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/d0a818f66f3a461ab30f4ffea2fc3699/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_stop=0&autospin=0.04&scrollwheel=0&double_click=0"
                />
            </div>

            {/* Mode Selection Tabs (Top) */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-2xl z-20">
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
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <mode.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Context (Bottom Left) */}
            <div className="absolute bottom-8 left-8 p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] max-w-xs z-20 shadow-2xl">
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
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none">
                                {activeMode === "360" && <>EXPLORE <br />EVERY <span className="text-gradient">ANGLE</span></>}
                                {activeMode === "sound" && <>THRILL OF <br />THE <span className="text-gradient">ENGINE</span></>}
                                {activeMode === "tech" && <>DIGITAL <br /><span className="text-gradient">COMMAND</span></>}
                            </h3>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                            {activeMode === "360" && "Immerse yourself in 360 virtual reality. Experience the XSR700 in its full glory."}
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
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
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
                        className="absolute inset-10 z-30 bg-zinc-950/98 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-linear-to-r from-zinc-900/50 to-transparent">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue mb-2 block">Yamaha Power Core v4.2</span>
                                <h4 className="text-4xl font-display font-black text-white uppercase tracking-tighter">XSR700 DIGITAL COMMAND</h4>
                            </div>
                            <button
                                onClick={() => setActiveMode("360")}
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-racing-blue transition-all group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="flex-1 p-12 grid grid-cols-12 gap-10">
                            {/* Left: Main Gauge cluster */}
                            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center relative">
                                <div className="relative w-80 h-80 rounded-full border-8 border-zinc-900 shadow-[0_0_100px_rgba(0,123,255,0.15)] flex items-center justify-center overflow-hidden group">
                                    {/* RPM Ring */}
                                    <motion.div
                                        className="absolute inset-4 border-4 border-dashed border-racing-blue/30 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    />
                                    {/* Speed & Gear */}
                                    <div className="relative z-10 text-center">
                                        <motion.span
                                            key={gear}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-8xl font-display font-black text-white italic -mb-4 block"
                                        >
                                            <AnimatedNumber value={springSpeed} />
                                        </motion.span>
                                        <span className="text-xs font-black text-racing-blue uppercase tracking-[0.3em]">KM/H</span>
                                        <div
                                            onClick={toggleGear}
                                            className="mt-4 px-4 py-1 bg-racing-blue/20 rounded-lg border border-racing-blue/40 cursor-pointer hover:bg-racing-blue/40 transition-all select-none"
                                        >
                                            <span className="text-sm font-black text-white tracking-widest">GEAR {gear}</span>
                                        </div>
                                    </div>
                                    {/* Decorative Scan Line */}
                                    <motion.div
                                        className="absolute inset-0 bg-linear-to-b from-transparent via-racing-blue/5 to-transparent h-20 w-full"
                                        animate={{ top: ['-20%', '120%'] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    />
                                </div>
                                <p className="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-widest text-center">
                                    Real-time Telemetry Active • 256-bit Encryption
                                </p>
                            </div>

                            {/* Right: Technical Specifications */}
                            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: "Engine Type", value: "689cc CP2 (Liquid Cooled)", detail: "Crossplane Philosophy" },
                                        { label: "Max Torque", value: "67.0 Nm @ 6,500 rpm", detail: "Linear Response" },
                                        { label: "Braking System", value: "Dual Channel ABS", detail: "Safety Standard" },
                                        { label: "Traction Control", value: "Electronic TCS v2", detail: "Multi-Mode" },
                                    ].map((spec, i) => (
                                        <motion.div
                                            key={spec.label}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-racing-blue/30 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{spec.label}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-racing-blue opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-white font-display font-black text-lg tracking-tight uppercase">{spec.value}</div>
                                            <div className="text-[9px] text-racing-blue/60 font-black uppercase tracking-widest mt-1">{spec.detail}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="p-6 bg-racing-blue/5 rounded-2xl border border-racing-blue/20">
                                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Vehicle Diagnostics</h5>
                                    <div className="flex gap-4">
                                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div className="h-full bg-racing-blue" initial={{ width: "0%" }} animate={{ width: "82%" }} transition={{ duration: 1.5 }} />
                                        </div>
                                        <span className="text-[10px] font-black text-racing-blue leading-none">82% TEMP</span>
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
