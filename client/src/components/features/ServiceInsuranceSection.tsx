"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Shield, Clock, Calendar, CheckCircle2, ChevronRight, Bell, Plus, Edit2, Save, X, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { DigitalPlate } from "../ui/DigitalPlate";

interface IModification {
    partName: string;
    brand: string;
    cost: number;
    date: string;
}

interface IConsumables {
    tires: number;
    chain: number;
    brakes: number;
    coolant: number;
}

interface UserBike {
    _id: string;
    bikeId?: string;
    bikeModel: string;
    bikeImage?: string;
    registrationNumber: string;
    chassisNumber?: string;
    purchaseDate: string;
    lastServiceDate?: string;
    nextServiceDate?: string;
    nextServiceKm?: number;
    mileage: number;
    serviceCount: number;
    consumables: IConsumables;
    conditionScore: number;
    modifications: IModification[];
}

export function ServiceInsuranceSection() {
    const { user } = useAuth();
    const [bikes, setBikes] = useState<UserBike[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ registrationNumber: "", chassisNumber: "" });

    useEffect(() => {
        if (user) {
            fetchBikes();
        }
    }, [user]);

    const fetchBikes = async () => {
        try {
            const res = await axios.get<any>(`${API_URL}/user-bikes`, { withCredentials: true });
            if (res.data.success) {
                setBikes(res.data.data);
                if (res.data.data.length > 0) {
                    setEditForm({
                        registrationNumber: res.data.data[0].registrationNumber || "",
                        chassisNumber: res.data.data[0].chassisNumber || ""
                    });
                }
            }
        } catch (err) {
            console.error("Failed to fetch bikes for dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBike = async () => {
        if (!bikes[0]) return;
        try {
            const res = await axios.put<any>(`${API_URL}/user-bikes/${bikes[0]._id}`, editForm, { withCredentials: true });
            if (res.data.success) {
                setBikes([res.data.data, ...bikes.slice(1)]);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to update bike:", err);
        }
    };

    if (!user) return null;

    const primaryBike = bikes[0];

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Content Side */}
                    <div className="order-2 lg:order-1 space-y-12">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                                Premium Workshop Companion
                            </h2>
                            <h3 className="text-3xl md:text-5xl font-display font-black text-zinc-900 uppercase tracking-tighter leading-tight mb-8">
                                THE <span className="text-gradient">DIGITAL TWIN</span> EXPERIENCE
                            </h3>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                                Elevate your ownership. Monitor every heartbeat of your machine, from consumable lifespan to performance genealogy.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <Link
                                href="/service#booking"
                                className="p-10 bg-zinc-50/50 rounded-[2.5rem] border border-zinc-100 space-y-4 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all text-left block"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-racing-blue/10 flex items-center justify-center">
                                    <Wrench className="w-6 h-6 text-racing-blue" />
                                </div>
                                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Service Booking</h4>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                                    Instant slot confirmation with Yamaha-trained experts.
                                </p>
                                <span className="text-[10px] font-black text-racing-blue uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pt-2">
                                    Schedule Now <ChevronRight className="w-3 h-3" />
                                </span>
                            </Link>

                            <Link
                                href="#inquiry"
                                className="p-10 bg-zinc-50/50 rounded-[2.5rem] border border-zinc-100 space-y-4 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all text-left block"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Performance Metrics</h4>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                                    Track BHP gains and weight savings from your modifications.
                                </p>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pt-2">
                                    View Analytics <ChevronRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Interactive Dashboard Preview */}
                    <div className="order-1 lg:order-2 relative">
                        {/* Decorative Background Glow */}
                        <div className="absolute -inset-10 bg-racing-blue/10 blur-[100px] rounded-full opacity-50" />

                        <motion.div
                            initial={{ opacity: 0, rotateY: -10, x: 20 }}
                            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/5 overflow-hidden preserve-3d"
                        >
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-10 pb-8 border-b border-zinc-50">
                                <Link href="/garage" className="flex items-center gap-4 group/head">
                                    <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center relative group-hover/head:border-racing-blue/50 transition-all">
                                        <Activity className="w-6 h-6 text-racing-blue" />
                                        <div className="absolute inset-0 bg-racing-blue rounded-full animate-ping opacity-10" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest group-hover/head:text-racing-blue transition-all">
                                            {primaryBike ? `${primaryBike.bikeModel} Control Center` : "Garage Dashboard"}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                {primaryBike?.chassisNumber || "VIN Required"}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 border border-zinc-100 transition-all"
                                >
                                    {isEditing ? <X className="w-5 h-5 text-zinc-400" /> : <Edit2 className="w-5 h-5 text-zinc-400" />}
                                </button>
                            </div>

                            {/* Digital Plate Section */}
                            <div className="mb-8 flex justify-center">
                                {isEditing ? (
                                    <div className="w-full space-y-5 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 shadow-sm">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Registration Number</label>
                                            <input
                                                type="text"
                                                value={editForm.registrationNumber}
                                                onChange={(e) => setEditForm({ ...editForm, registrationNumber: e.target.value.toUpperCase() })}
                                                className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 text-sm font-bold focus:border-racing-blue outline-none transition-all shadow-sm"
                                                placeholder="e.g. KA 01 AB 1234"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Chassis Number</label>
                                            <input
                                                type="text"
                                                value={editForm.chassisNumber}
                                                onChange={(e) => setEditForm({ ...editForm, chassisNumber: e.target.value.toUpperCase() })}
                                                className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 text-sm font-bold focus:border-racing-blue outline-none transition-all shadow-sm"
                                                placeholder="e.g. ME123...456"
                                            />
                                        </div>
                                        <button
                                            onClick={handleUpdateBike}
                                            className="w-full py-4 bg-racing-blue text-white text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-racing-blue/20"
                                        >
                                            <Save className="w-4 h-4" /> Save Machine Data
                                        </button>
                                    </div>
                                ) : (
                                    <DigitalPlate registrationNumber={primaryBike?.registrationNumber} />
                                )}
                            </div>

                            {/* Consumables Health Trackers */}
                            {primaryBike && (
                                <div className="space-y-8 mb-10">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2 leading-none">
                                            <Activity className="w-4 h-4 text-racing-blue" />
                                            Health Score: <span className={primaryBike.conditionScore > 80 ? "text-emerald-600" : "text-amber-600"}>{primaryBike.conditionScore}%</span>
                                        </h5>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Pristine Profile</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                        {[
                                            { label: "Tires", value: primaryBike.consumables?.tires || 100, color: "bg-blue-500" },
                                            { label: "Chain", value: primaryBike.consumables?.chain || 100, color: "bg-emerald-500" },
                                            { label: "Brakes", value: primaryBike.consumables?.brakes || 100, color: "bg-amber-500" },
                                            { label: "Coolant", value: primaryBike.consumables?.coolant || 100, color: "bg-purple-500" },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-2">
                                                <div className="flex justify-between items-center leading-none">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                                    <span className="text-[9px] font-bold text-zinc-900">{item.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.value}%` }}
                                                        className={`h-full ${item.color}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-2 gap-5 mb-10">
                                <div className="p-5 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                                    <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Next Service</h5>
                                    {loading ? (
                                        <div className="h-4 w-16 bg-zinc-100 animate-pulse rounded" />
                                    ) : (
                                        <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                                            {primaryBike?.nextServiceDate ? new Date(primaryBike.nextServiceDate).toLocaleDateString() : "TBD"}
                                        </p>
                                    )}
                                </div>
                                <div className="p-5 bg-zinc-50/50 rounded-2xl border border-zinc-100 group hover:bg-white hover:border-racing-blue/20 transition-all cursor-pointer">
                                    <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Mod Log</h5>
                                    <p className="text-sm font-black text-racing-blue uppercase tracking-tight flex items-center gap-2">
                                        {primaryBike?.modifications?.length || 0} Installed <ChevronRight className="w-4 h-4" />
                                    </p>
                                </div>
                            </div>

                            {/* Service Slots Preview */}
                            <div className="space-y-5">
                                <h5 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 leading-none">
                                    <Calendar className="w-4 h-4 text-racing-blue" />
                                    Priority Booking Slots
                                </h5>
                                <div className="grid grid-cols-3 gap-3">
                                    {["09:00 AM", "11:30 AM", "03:00 PM"].map((time, idx) => (
                                        <div
                                            key={time}
                                            className={`p-4 rounded-xl border text-[10px] font-black text-center transition-all ${idx === 1 ? "bg-racing-blue/10 border-racing-blue/30 text-racing-blue shadow-sm shadow-racing-blue/10" : "bg-zinc-50 border-zinc-100 text-gray-400"
                                                }`}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                    <Link
                                        href="/service#booking"
                                        className="p-4 rounded-xl border border-dashed border-zinc-200 bg-transparent text-[10px] font-black text-gray-400 text-center flex items-center justify-center hover:bg-zinc-50 hover:text-racing-blue transition-all"
                                    >
                                        Book More
                                    </Link>
                                </div>
                            </div>

                            {/* Explainer Overlay (Desktop only) */}
                            <AnimatePresence>
                                {!primaryBike && !loading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-x-8 bottom-10 top-[160px] bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-zinc-100 flex flex-col items-center justify-center p-8 text-center z-20 shadow-2xl shadow-black/5"
                                    >
                                        <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6">
                                            <Plus className="w-8 h-8 text-racing-blue" />
                                        </div>
                                        <h5 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3">No Machine Found</h5>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-8 max-w-[200px] leading-relaxed">
                                            Register your bike to unlock full ownership tracking metrics.
                                        </p>
                                        <Link
                                            href="/profile"
                                            className="px-8 py-3.5 bg-racing-blue text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-racing-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Add Bike Now
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
