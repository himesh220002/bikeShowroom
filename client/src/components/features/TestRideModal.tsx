"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MessageSquare,
    Bike as BikeIcon,
    CheckCircle2,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testRideSchema, TestRideFormData } from '@lib/validations/testRide';
import { createTestRide } from '@lib/services/testRideService';
import { BIKES } from '@lib/constants/bikes';
import { getAllBikes, Bike } from '@lib/services/bikeService';
import { cn } from '@lib/utils/cn';

interface TestRideModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialBikeSlug?: string;
}

export function TestRideModal({ isOpen, onClose, initialBikeSlug }: TestRideModalProps) {
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

    // Fetch bikes from inventory
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

    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            if (!initialBikeSlug) {
                setSelectedBike(null);
                reset();
            }
        }
    }, [isOpen, initialBikeSlug, reset]);

    const onSubmit = async (data: TestRideFormData) => {
        setIsSubmitting(true);
        try {
            await createTestRide({
                ...data,
                preferredDate: data.preferredDate.toISOString(),
            });
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                reset();
            }, 3000);
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
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 pt-24 pb-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-card/80 border border-border/50 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Progress Bar */}
                        {isSubmitting && (
                            <motion.div
                                className="absolute top-0 left-0 h-1 bg-racing-blue"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2 }}
                            />
                        )}

                        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-display font-black text-foreground italic uppercase tracking-tighter leading-none flex items-center gap-2">
                                        Book Your <span className="text-racing-blue">Test Ride</span>
                                    </h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 ml-0.5">Experience the DNA of Yamaha</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 hover:bg-white hover:text-black transition-all group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-6 flex flex-col items-center text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-2">Request Submitted!</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                                        We've received your request. Our team will contact you shortly to confirm your slot.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    {...register('name')}
                                                    placeholder="Who's riding?"
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all placeholder:text-muted-foreground/50"
                                                />
                                            </div>
                                            {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.name.message}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    {...register('phone')}
                                                    placeholder="98765 43210"
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all placeholder:text-muted-foreground/50"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>

                                    {/* Email (Optional) */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address (Optional)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <input
                                                {...register('email')}
                                                placeholder="your@email.com"
                                                className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                        {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email.message}</p>}
                                    </div>

                                    {/* Bike Dropdown */}
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Machine</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold flex items-center justify-between hover:bg-muted/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BikeIcon className="absolute left-4  w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                                <span>{bikeModelValue || "Select your ride"}</span>
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")} />
                                        </button>

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                                                >
                                                    {bikesToDisplay.map((bike: any) => (
                                                        <button
                                                            key={bike._id || bike.slug}
                                                            type="button"
                                                            onClick={() => handleBikeSelect(bike)}
                                                            className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-all border-b border-border/50 last:border-0"
                                                        >
                                                            <div className="w-16 h-10 relative bg-muted rounded-lg overflow-hidden shrink-0">
                                                                {bike.colors && bike.colors[0] && (
                                                                    <img
                                                                        src={bike.colors[0].image}
                                                                        alt={bike.name}
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-sm font-black tracking-tight">{bike.name}</p>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Date</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors pointer-events-none" />
                                                <input
                                                    type="date"
                                                    {...register('preferredDate', { valueAsDate: true })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all"
                                                />
                                            </div>
                                            {errors.preferredDate && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.preferredDate.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Time</label>
                                            <div className="relative group">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors pointer-events-none" />
                                                <select
                                                    {...register('preferredTime')}
                                                    className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all appearance-none"
                                                >
                                                    <option value="Morning (10 AM - 12 PM)">Morning (10 AM - 12 PM)</option>
                                                    <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                                                    <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes (Optional)</label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                            <textarea
                                                {...register('notes')}
                                                placeholder="Any specific requests or preferences?"
                                                rows={3}
                                                className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all placeholder:text-muted-foreground/50 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-racing-blue text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-racing-blue/20 hover:shadow-racing-blue/40 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 overflow-hidden relative group"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing Request...
                                            </>
                                        ) : (
                                            <>
                                                Schedule Test Ride
                                                <CheckCircle2 className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
