"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Star,
    ArrowRight,
    ChevronRight,
    Clock,
    Zap,
    Shield,
    Download,
    Share2,
    Maximize2,
    RotateCcw,
    CheckCircle2,
    Wallet,
    AlertTriangle,
    Bike
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BikeImage } from "@/components/ui/BikeImage";
import { BoxRevealImage } from "@/components/ui/BoxRevealImage";
import { formatPrice } from "@/lib/utils/price";

interface BikeDetailsHeroProps {
    bike: any;
    selectedVariantIndex?: number;
    onVariantChange?: (index: number) => void;
    selectedColorIndex?: number;
    onColorChange?: (index: number) => void;
    onAction?: (intent: string) => void;
}

import { useMemo } from "react";
import Link from "next/link";
import { BIKES, BikeVariant } from "@/lib/constants/bikes";

export function BikeDetailsHero({
    bike,
    selectedVariantIndex = 0,
    onVariantChange,
    selectedColorIndex = 0,
    onColorChange,
    onAction
}: BikeDetailsHeroProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const currentVariant = useMemo(() => {
        return bike.variants && bike.variants.length > 0 ? bike.variants[selectedVariantIndex] : null;
    }, [bike.variants, selectedVariantIndex]);

    const activeColors = useMemo(() => {
        return currentVariant ? currentVariant.colors : bike.colors;
    }, [currentVariant, bike.colors]);

    const color = activeColors[selectedColorIndex] || activeColors[0];
    const displayPrice = color.price || (currentVariant ? currentVariant.price : bike.price);

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-200 via-indigo-100 to-gray-800/90 p-26 overflow-hidden">
            {/* Background elements */}
            <div
                className="absolute top-0 right-0 w-1/2 h-screen blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 transition-colors duration-1000"
                style={{ backgroundColor: `${color.hex}22` || 'rgba(0,123,255,0.05)' }}
            />
            <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-muted/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                            <Zap className="w-3 h-3" />
                            {bike.tag}
                        </div>

                        <div className="mb-10">
                            <h1 className="text-3xl md:text-4xl text-center sm:text-start font-display font-black text-foreground tracking-tighter leading-none mb-4">
                                {bike.name} <br />
                                <span className="text-xl text-racing-blue">{color.name}</span>
                            </h1>

                            {/* Variant Selector */}
                            {bike.variants && bike.variants.length > 0 && (
                                <div className="mt-8 mb-6 flex flex-col items-center sm:items-start gap-4">
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Select Model Variant</span>
                                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                        {bike.variants.map((variant: BikeVariant, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (onVariantChange) onVariantChange(idx);
                                                }}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2",
                                                    idx === selectedVariantIndex
                                                        ? "bg-racing-blue border-racing-blue text-white shadow-lg shadow-racing-blue/20 scale-105"
                                                        : "bg-muted/50 border-border/50 text-muted-foreground hover:border-racing-blue/30 hover:text-foreground"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    idx === selectedVariantIndex ? "bg-white animate-pulse" : "bg-muted-foreground/30"
                                                )} />
                                                {variant.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mobile Image - Injected between Name and Color Selector */}
                            <motion.div
                                key={`mobile-${color.name}-${selectedVariantIndex}`}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="lg:hidden my-8 relative"
                            >
                                <div className="absolute inset-0 bg-racing-blue/20 blur-[100px] opacity-20 -z-10" />
                                <BikeImage
                                    src={color.image}
                                    fallbackSrc={bike.threeSixtyUrl ? `${bike.threeSixtyUrl.replace('360/', 'color/')}${color.colorOption}.webp` : undefined}
                                    alt={bike.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
                                    priority
                                />
                            </motion.div>

                            {/* Color Selector */}
                            {activeColors.length > 1 && (
                                <div className="mt-8 flex flex-col items-center sm:items-start gap-3">
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Available Colors</span>
                                    <div className="flex gap-4">
                                        {activeColors.map((c: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (onColorChange) onColorChange(index);
                                                }}
                                                className={cn(
                                                    "w-8 h-8 rounded-full border-2 transition-all p-1",
                                                    index === selectedColorIndex ? "border-racing-blue scale-110" : "border-transparent border-foreground/10 hover:border-foreground/20"
                                                )}
                                                title={c.name}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full shadow-inner"
                                                    style={{ backgroundColor: c.hex || '#555' }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl mb-4">
                            {bike.description}
                        </p>

                        {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
                            {[
                                { label: "Top Speed", value: bike.fullSpecs?.topSpeed || "140 km/h", icon: Zap },
                                { label: "Mileage", value: bike.fullSpecs?.mileage || "45 kmpl", icon: Shield },
                                { label: "Weight", value: bike.fullSpecs?.weight || "141 kg", icon: Clock },
                            ].map((fact, i) => (
                                <div key={i} className="flex flex-col p-4 bg-muted/40 border border-border/50 rounded-2xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <fact.icon className="w-3 h-3 text-racing-blue" />
                                        <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">{fact.label}</span>
                                    </div>
                                    <span className="text-sm md:text-lg font-display font-black text-foreground italic">{fact.value}</span>
                                </div>
                            ))}
                        </div> */}

                        <div className="flex flex-wrap gap-6 mb-8 items-center justify-center sm:justify-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">
                                    {displayPrice ? "Price" : "Starting From"}
                                </span>
                                <span className="text-2xl lg:text-4xl font-display font-black text-foreground tracking-tighter italic">₹ {formatPrice(displayPrice)}*</span>
                                <span className="text-[8px] text-muted-foreground/60 font-bold uppercase mt-1">*Ex-Showroom Price</span>
                            </div>

                            <div className="h-12 w-px bg-zinc-800 hidden sm:block" />

                            <div className="flex gap-4 items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-racing-blue/10 flex items-center justify-center">
                                                <Star className="w-3 h-3 text-racing-blue fill-current" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-500">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2 h-2 fill-current" />)}
                                    </div>
                                    <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">200+ Reviews</span>
                                </div>
                            </div>
                        </div>

                        {color.stock === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-2 w-fit rounded-xl bg-racing-blue/5 border border-racing-blue/20 flex items-center gap-4 max-w-md backdrop-blur-sm shadow-2xl shadow-black/20"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-400/40 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Color Out of Stock</h4>
                                    {/* <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                                        This colour is not available at the moment. Please contact the dealer to <span className="text-foreground">pre-order</span> this bike colour for you.
                                    </p> */}
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4">
                            <button
                                onClick={() => {
                                    if (onAction) onAction(color.stock === 0 ? "PRE-ORDER" : "BOOKING");
                                    else document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={cn(
                                    "group p-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all transform active:scale-95 shadow-2xl",
                                    color.stock === 0
                                        ? "bg-gray-900 border border-racing-blue/50 text-white hover:bg-gray-800 shadow-racing-blue/5"
                                        : "bg-racing-blue text-white hover:bg-dark-racing shadow-racing-blue/20"
                                )}
                            >
                                {color.stock === 0 ? "Pre-order" : "Book Machine"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {/* <button
                                onClick={() => {
                                    if (onAction) onAction("EMI");
                                    else document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group bg-muted border border-border text-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-muted/80 transition-all transform active:scale-95"
                            >
                                Finance Options
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button> */}
                            <Link
                                href={`/test-ride?bike=${bike.slug}`}
                                className="group bg-amber-400/60 border border-border text-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-racing-blue hover:text-white hover:border-racing-blue transition-all transform active:scale-95"
                            >
                                Test Ride
                                <Bike className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-rotate-35 transition-transform" />
                            </Link>
                            {bike.brochureUrl && (
                                <a
                                    href={bike.brochureUrl}
                                    download={bike.brochureUrl.startsWith('/')}
                                    target={bike.brochureUrl.startsWith('/') ? undefined : "_blank"}
                                    rel={bike.brochureUrl.startsWith('/') ? undefined : "noopener noreferrer"}
                                    className="px-6 md:px-10 py-5 bg-muted/50 text-gray-700 border border-border/50 rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-xs hover:border-foreground/20 hover:text-foreground transition-all transform active:scale-95 flex items-center justify-center gap-3 sm:col-span-2 lg:col-auto"
                                >
                                    <Download className="w-4 h-4" />
                                    Brochure
                                </a>
                            )}
                        </div>
                    </motion.div>

                    <div className=" flex flex-col gap-10">

                        <motion.div
                            key={`${color.name}-${selectedVariantIndex}`}
                            initial={{ opacity: 0, scale: 0.8, x: 100 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                                duration: 0.6
                            }}
                            className="relative hidden lg:block cursor-crosshair"
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                                perspective: "1000px"
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="absolute inset-0 bg-racing-blue/20 blur-[150px] opacity-20 -z-10" />
                            <div style={{ transform: "translateZ(50px)" }}>
                                <BoxRevealImage
                                    src={color.image}
                                    alt={bike.name}
                                    className="w-full h-auto drop-shadow-2xl"
                                />
                            </div>

                            {/* Interactive floating specs */}
                            <div className="absolute -bottom-10 left-0 bg-card/80 backdrop-blur-xl border border-border p-4 rounded-3xl hidden md:block shadow-2xl transition-transform hover:scale-110" style={{ transform: "translateZ(80px)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-muted-foreground font-black uppercase mb-1">Warranty</p>
                                        <p className="text-xs text-foreground font-bold uppercase">2 Years Standard</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-10 -right-10 bg-card/80 backdrop-blur-xl border border-border p-4 rounded-3xl hidden md:block shadow-2xl transition-transform hover:scale-110" style={{ transform: "translateZ(80px)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-muted-foreground font-black uppercase mb-1">Fast Delivery</p>
                                        <p className="text-xs text-foreground font-bold uppercase">Within 7 Days</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {bike.image2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="relative w-full aspect-video  overflow-hidden  group"
                            >
                                {/* <div className="absolute inset-0 bg-gradient-to-tr from-racing-blue/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" /> */}

                                <Image
                                    src={bike.image2}
                                    alt={`${bike.name} secondary view`}
                                    fill
                                    className="object-contain p-2 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 drop-shadow-2xl"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div >

            {/* Model Name Background Text */}
            < div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none -mb-20 opacity-5" >
                <h2 className="text-[25vw] font-black text-foreground uppercase tracking-tighter leading-none whitespace-nowrap">
                    {bike.name}
                </h2>
            </div >
        </section >
    );
}
