"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MessageSquare,
    Bike as BikeIcon,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Zap,
    ChevronRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testRideSchema, TestRideFormData } from '@/lib/validations/testRide';
import { createTestRide } from '@/lib/services/testRideService';
import { BIKES } from '@/lib/constants/bikes';
import { getAllBikes } from '@/lib/services/bikeService';
import { cn } from '@/lib/utils/cn';
import { useSearchParams } from 'next/navigation';

function TestRideFormContent() {
    const searchParams = useSearchParams();
    const initialBikeSlug = searchParams.get('bike');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [inventoryBikes, setInventoryBikes] = useState<any[]>([]);
    const [selectedBike, setSelectedBike] = useState<any | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<TestRideFormData>({
        resolver: zodResolver(testRideSchema),
        defaultValues: {
            bikeModel: '',
            preferredTime: 'Morning (10 AM - 12 PM)',
        }
    });

    const bikeModelValue = watch('bikeModel');

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const res = await getAllBikes();
                if (res.success && res.data.length > 0) {
                    setInventoryBikes(res.data);
                } else {
                    setInventoryBikes(BIKES);
                }
            } catch (err) {
                console.error("Failed to fetch bikes:", err);
                setInventoryBikes(BIKES);
            }
        };
        fetchBikes();
    }, []);

    const bikesToDisplay = inventoryBikes.length > 0 ? inventoryBikes : BIKES;

    useEffect(() => {
        if (initialBikeSlug && bikesToDisplay.length > 0) {
            const bike = bikesToDisplay.find(b => b.slug === initialBikeSlug);
            if (bike) {
                setSelectedBike(bike);
                setValue('bikeModel', bike.name);
            }
        }
    }, [initialBikeSlug, setValue, bikesToDisplay]);

    const onSubmit = async (data: TestRideFormData) => {
        setIsSubmitting(true);
        try {
            await createTestRide({
                ...data,
                preferredDate: data.preferredDate.toISOString(),
            });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                reset();
            }, 5000);
        } catch (error) {
            console.error('Failed to submit test ride request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBikeSelect = (bike: any) => {
        setSelectedBike(bike);
        setValue('bikeModel', bike.name);
        setIsDropdownOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Side: Info */}
                <div className="lg:col-span-5 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                            <Zap className="w-3 h-3" />
                            Premium Experience
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none mb-6">
                            BOOK YOUR <br />
                            <span className="text-racing-blue">TEST RIDE</span>
                        </h1>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Feel the raw power and precision engineering of Yamaha. Choose your machine, pick a slot, and get ready to Revs Your Heart.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: Calendar, title: "Flexible Slots", desc: "Choose a time that works for you" },
                            { icon: BikeIcon, title: "Latest Lineup", desc: "All current Yamaha models available" },
                            { icon: CheckCircle2, title: "Instant Sync", desc: "Direct integration with our showroom" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-zinc-900 border border-border/50 rounded-2xl flex items-center justify-center shrink-0">
                                    <item.icon className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:col-span-7">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-racing-blue to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000" />
                        <div className="relative bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-20 flex flex-col items-center text-center"
                                >
                                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Request Received!</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto font-medium leading-relaxed">
                                        Our performance consultants will contact you within 24 hours to confirm your Yamaha experience.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-8 text-racing-blue text-[10px] font-black uppercase tracking-widest hover:underline"
                                    >
                                        Book another ride
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                            <div className="relative group/input">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-racing-blue transition-colors" />
                                                <input
                                                    {...register('name')}
                                                    placeholder="Enter your name"
                                                    className="w-full bg-foreground text-background border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all"
                                                />
                                            </div>
                                            {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.name.message}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</label>
                                            <div className="relative group/input">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-racing-blue transition-colors" />
                                                <input
                                                    {...register('phone')}
                                                    type="tel"
                                                    maxLength={10}
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    placeholder="Enter 10-digit number"
                                                    className="w-full bg-foreground text-background border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>

                                    {/* Bike Dropdown */}
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Machine</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full bg-foreground text-background border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold flex items-center justify-between hover:bg-blue-900/70 transition-all group/btn"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BikeIcon className="absolute left-4 w-4 h-4 text-muted-foreground group-hover/btn:text-racing-blue transition-colors" />
                                                <span>{bikeModelValue || "Choose your Yamaha"}</span>
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")} />
                                        </button>

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-border rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto custom-scrollbar"
                                                >
                                                    {bikesToDisplay.map((bike: any) => (
                                                        <button
                                                            key={bike._id || bike.slug}
                                                            type="button"
                                                            onClick={() => handleBikeSelect(bike)}
                                                            className="w-full p-4 flex items-center gap-4 hover:bg-zinc-800 transition-all border-b border-border/50 last:border-0"
                                                        >
                                                            <div className="w-20 h-12 relative bg-zinc-950 rounded-lg overflow-hidden shrink-0">
                                                                {bike.colors && bike.colors[0] && (
                                                                    <img
                                                                        src={bike.colors[0].image}
                                                                        alt={bike.name}
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-sm font-black tracking-tight text-white">{bike.name}</p>
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{bike.category}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {errors.bikeModel && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.bikeModel.message}</p>}
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Date</label>
                                            <div className="relative group/input">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-racing-blue transition-colors pointer-events-none" />
                                                <input
                                                    type="date"
                                                    {...register('preferredDate', { valueAsDate: true })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full bg-foreground text-background border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all"
                                                />
                                            </div>
                                            {errors.preferredDate && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.preferredDate.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Time</label>
                                            <div className="relative group/input">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-racing-blue transition-colors pointer-events-none" />
                                                <select
                                                    {...register('preferredTime')}
                                                    className="w-full bg-foreground text-background border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all appearance-none"
                                                >
                                                    <option value="Morning (10 AM - 12 PM)">Morning (10 AM - 12 PM)</option>
                                                    <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                                                    <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-racing-blue text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-racing-blue/20 hover:shadow-racing-blue/40 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 overflow-hidden relative group"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                SUBMITTING...
                                            </>
                                        ) : (
                                            <>
                                                CONFIRM TEST RIDE
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TestRidePage() {
    return (
        <main className="min-h-screen bg-zinc-950 pt-32 pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 right-0 w-1/2 h-screen bg-racing-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-screen bg-blue-900/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Suspense fallback={
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-racing-blue animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing Experience...</p>
                    </div>
                }>
                    <TestRideFormContent />
                </Suspense>
            </div>
        </main>
    );
}
