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
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    // Sound Mapping Logic
    const getEngineSound = (bike: Bike) => {
        const engine = bike.fullSpecs.engine.toLowerCase();
        if (bike.slug === 'aerox') return '/EngineSound/Aerox 155.m4a';
        if (bike.category === 'scooty' && engine.includes('125cc')) return '/EngineSound/125cc scooty yamaha.m4a';
        if (engine.includes('149cc')) return '/EngineSound/149cc-yamaha-hybrid.mp3';
        if (engine.includes('155cc')) return '/EngineSound/r15-exaust-note.mp3';
        return null;
    };

    const soundPath = getEngineSound(bike);

    useEffect(() => {
        if (activeMode === "sound" && soundPath) {
            const newAudio = new Audio(soundPath);
            newAudio.loop = true;
            setAudio(newAudio);

            return () => {
                newAudio.pause();
                newAudio.currentTime = 0;
                setIsPlaying(false);
            };
        } else {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            setIsPlaying(false);
            setAudio(null);
        }
    }, [activeMode, soundPath]);

    useEffect(() => {
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(console.error);
        } else {
            audio.pause();
        }
    }, [isPlaying, audio]);

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
        { id: "sound", label: "Engine Sound", icon: Volume2 },
        // { id: "tech", label: "Digital Tech", icon: Cpu },
    ];

    return (
        <div className="relative max-w-[1200px] mx-auto h-[400px] sm:h-[600px] md:h-[700px] bg-background rounded-3xl md:rounded-[3rem] overflow-hidden border border-border shadow-2xl group/viewer">
            {/* Main 3D View (Custom Rotating Viewer) */}
            <div className="absolute inset-0 z-0">
                {activeMode === "360" ? (
                    <RotatingBikeViewer
                        baseUrl={bike.threeSixtyUrl || ""}
                        imageCount={bike.threeSixtyImageCount}
                    />
                ) : (
                    <div className="w-full h-full bg-background flex items-center justify-center opacity-20">
                        {activeMode === "tech" ? (
                            <Cpu className="w-32 h-32 text-racing-blue/20 animate-pulse" />
                        ) : (
                            <Volume2 className="w-32 h-32 text-racing-blue/20 animate-pulse" />
                        )}
                    </div>
                )}
            </div>

            {/* Mode Selection Tabs (Top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-card/60 backdrop-blur-lg border border-border/5 rounded-2xl z-40 will-change-transform mt-4">
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
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-8 pointer-events-auto">
                            <div className="text-center mb-4">
                                <h4 className="text-xs font-black text-racing-blue uppercase tracking-[0.3em] mb-2">Exhaust Note</h4>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Yamaha {bike.name} Signature Series</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    disabled={!soundPath}
                                    className={cn(
                                        "w-24 h-24 rounded-full bg-racing-blue text-white flex items-center justify-center shadow-2xl shadow-racing-blue/40 hover:scale-110 active:scale-95 transition-all group disabled:opacity-50 disabled:cursor-not-allowed",
                                        !soundPath && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                                </button>

                                <div className="flex gap-1.5 h-16 items-center">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={isPlaying ? {
                                                height: [10, 60, 20, 50, 15, 45, 10],
                                                opacity: [0.3, 1, 0.4, 1, 0.3]
                                            } : { height: 8, opacity: 0.2 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.6,
                                                delay: i * 0.05,
                                                ease: "easeInOut"
                                            }}
                                            className="w-1.5 bg-racing-blue rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            {isPlaying && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] animate-pulse mt-4"
                                >
                                    {soundPath ? "Establishing High-Fidelity Link..." : "Engine Sound Unavailable"}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tech Interface Overlay (Premium Dashboard) */}
            <AnimatePresence>
                {activeMode === "tech" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="absolute inset-x-2 md:inset-x-10 bottom-2 md:bottom-10 top-16 md:top-20 z-30 bg-background/98 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] will-change-transform"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-12 border-b border-white/5 flex justify-between items-center bg-linear-to-r from-muted/20 to-transparent shrink-0">
                            <div>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-racing-blue mb-2 md:mb-3 block">Yamaha R-DNA Intelligent Systems</span>
                                <h4 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tighter leading-none mb-1">
                                    {bike.name} <span className="text-gradient">TECH</span>
                                </h4>
                            </div>
                            <button
                                onClick={() => setActiveMode("360")}
                                className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-full flex items-center justify-center text-foreground hover:bg-racing-blue hover:text-white transition-all group border border-white/5"
                            >
                                <X className="w-5 h-5 md:w-7 md:h-7 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                            <style>{`
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {/* Center: Main Gauge cluster */}
                            <div className="flex-[3] flex flex-col justify-center items-center p-6 md:p-12 relative bg-linear-to-b from-racing-blue/[0.03] to-transparent shrink-0">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-racing-blue/5 blur-[120px] rounded-full pointer-events-none" />

                                <div className="relative w-56 h-56 md:w-96 md:h-96 rounded-full border-[12px] md:border-[16px] border-zinc-900 shadow-[0_0_80px_rgba(0,123,255,0.2)] flex items-center justify-center overflow-hidden group">
                                    <div className="absolute inset-0 border-[2px] border-racing-blue/20 rounded-full" />

                                    {/* RPM Ring */}
                                    <motion.div
                                        className="absolute inset-6 border-4 border-dashed border-racing-blue/40 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: gear === "N" ? 20 : 10 / (gear as number), ease: "linear" }}
                                    />

                                    {/* Speed & Gear */}
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        {/* VVA Indicator Light */}
                                        <AnimatePresence>
                                            {GEAR_DATA[gear].vva && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-racing-blue rounded-full shadow-[0_0_20px_rgba(0,123,255,0.5)] z-20"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                                    <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase">VVA ACTIVE</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="mb-2">
                                            <motion.span
                                                key={gear}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-7xl md:text-9xl font-display font-black text-foreground italic flex items-baseline justify-center tracking-tighter"
                                            >
                                                <AnimatedNumber value={springSpeed} />
                                            </motion.span>
                                            <span className="text-xs md:text-sm font-black text-racing-blue uppercase tracking-[0.4em] mt-[-10px] block">KM/H</span>
                                        </div>

                                        <button
                                            onClick={toggleGear}
                                            className="mt-4 px-8 py-3 bg-zinc-900/80 rounded-2xl border border-white/5 cursor-pointer hover:border-racing-blue/50 transition-all select-none group/gear active:scale-95"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 group-hover/gear:text-racing-blue/60 transition-colors">Shift</span>
                                                <span className="text-2xl md:text-4xl font-display font-black text-white italic tracking-widest group-hover/gear:text-racing-blue transition-colors">
                                                    G{gear}
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Decorative Scan Line */}
                                    <motion.div
                                        className="absolute inset-0 bg-linear-to-b from-transparent via-racing-blue/10 to-transparent h-24 w-full"
                                        animate={{ top: ['-20%', '120%'] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    />
                                </div>

                                <div className="mt-12 flex gap-8 items-center bg-zinc-900/40 px-8 py-4 rounded-full border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Systems Nominal</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10" />
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none">
                                        Telemetry Channel 04 • Secured Link
                                    </p>
                                </div>
                            </div>

                            {/* Right: Technical Specifications (Scrollable) */}
                            <div className="flex-[2] p-8 md:p-14 overflow-y-auto scrollbar-hide border-l border-white/5 bg-white/[0.02]">
                                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                    <span className="w-8 h-px bg-racing-blue" />
                                    SPECIFICATIONS
                                </h5>

                                <div className="space-y-6">
                                    {[
                                        { label: "Engine Type", value: "155cc LC4V SOHC VVA", detail: "Active Cam Profiling" },
                                        { label: "Gear Status", value: gear === "N" ? "Neutral" : `Select Gear ${gear}`, detail: GEAR_DATA[gear].note },
                                        { label: "VVA System", value: GEAR_DATA[gear].vva ? "OPTIMIZED" : "STANDBY", detail: gear === 3 ? "Activation @ 7,400 RPM" : gear === "N" ? "Idle monitoring" : gear > 3 ? "Peak Power Mode" : "Fuel efficiency focus" },
                                        { label: "Torque Profile", value: "14.2 Nm @ 7.5k rpm", detail: "High-Response Delivery" },
                                        { label: "Safety Suite", value: "Dual ABS + TCS", detail: "Active Traction Control" },
                                    ].map((spec, i) => (
                                        <motion.div
                                            key={spec.label}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-zinc-900/60 p-5 md:p-7 rounded-[2rem] border border-white/5 hover:border-racing-blue/40 transition-all group/spec"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest">{spec.label}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-racing-blue/20 group-hover/spec:bg-racing-blue transition-colors" />
                                            </div>
                                            <div className="text-white font-display font-black text-base md:text-xl tracking-tight uppercase leading-tight group-hover/spec:text-racing-blue transition-colors">
                                                {spec.value}
                                            </div>
                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1.5 opacity-60 group-hover/spec:opacity-100 transition-opacity">
                                                {spec.detail}
                                            </div>
                                        </motion.div>
                                    ))}

                                    <div className="p-8 bg-linear-to-br from-racing-blue/10 to-transparent rounded-[2.5rem] border border-racing-blue/20 mt-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Load</h5>
                                            <span className="text-[10px] font-black text-racing-blue">82%</span>
                                        </div>
                                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-racing-blue shadow-[0_0_15px_rgba(0,123,255,0.5)]"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "82%" }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                            />
                                        </div>
                                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em] mt-4 text-center">Engine Temperature Stable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Helper (Bottom Right) */}
            {/* <AnimatePresence>
                {activeMode === "360" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-8 right-8 flex gap-3 z-10"
                    >
                        <div className="bg-zinc-950/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4 shadow-2xl">
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Interactive</span>
                                <div className="flex items-center gap-2">
                                    <Rotate3d className="w-3 h-3 text-racing-blue" />
                                    <span className="text-[10px] font-bold text-white uppercase">Swipe to Rotate</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence> */}
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
