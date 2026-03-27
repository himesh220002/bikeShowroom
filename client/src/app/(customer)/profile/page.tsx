"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Bike, Calendar, Clock, Plus, Trash2, Wrench, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

interface UserBike {
    _id: string;
    bikeModel: string;
    registrationNumber: string;
    purchaseDate: string;
    lastServiceDate?: string;
    nextServiceDate?: string;
    mileage?: number;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [bikes, setBikes] = useState<UserBike[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        bikeModel: "",
        registrationNumber: "",
        purchaseDate: "",
        lastServiceDate: "",
        mileage: "",
        serviceCount: "0"
    });

    const fetchBikes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/user-bikes", { withCredentials: true });
            if (res.data.success) {
                setBikes(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch bikes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBikes();
        }
    }, [user]);

    const handleAddBike = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/user-bikes", formData, { withCredentials: true });
            if (res.data.success) {
                setBikes([res.data.data, ...bikes]);
                setIsAdding(false);
                setFormData({
                    bikeModel: "",
                    registrationNumber: "",
                    purchaseDate: "",
                    lastServiceDate: "",
                    mileage: "",
                    serviceCount: "0"
                });
            }
        } catch (err) {
            console.error("Failed to add bike:", err);
        }
    };

    const handleDeleteBike = async (id: string) => {
        if (!confirm("Are you sure you want to remove this bike from your garage?")) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/user-bikes/${id}`, { withCredentials: true });
            if (res.data.success) {
                setBikes(bikes.filter(b => b._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete bike:", err);
        }
    };

    if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-racing-blue border-t-transparent rounded-full animate-spin" /></div>;

    if (!user) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-racing-blue shadow-2xl shadow-racing-blue/20">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={user.displayName} width={80} height={80} className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <Bike className="w-8 h-8 text-racing-blue" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">My <span className="text-racing-blue">Garage</span></h1>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">{user.displayName} &bull; {user.email}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-racing-blue hover:bg-racing-blue/90 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 shadow-xl shadow-racing-blue/30"
                    >
                        {isAdding ? <Clock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? "Cancel" : "Register New Bike"}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Bike List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {isAdding ? (
                                <motion.form
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={handleAddBike}
                                    className="glass p-8 rounded-[2.5rem] border border-racing-blue/30 shadow-2xl space-y-6"
                                >
                                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter mb-4">Bike Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bike Model</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-racing-blue transition-all"
                                                placeholder="e.g. Yamaha R15 V4"
                                                value={formData.bikeModel}
                                                onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-1">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Registration Number</label>
                                                <span className="text-[8px] font-black text-racing-blue/60 uppercase tracking-widest bg-racing-blue/5 px-2 py-0.5 rounded-full">Optional</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-racing-blue transition-all"
                                                placeholder="e.g. BR 01 AB 1234 or 'New Bike'"
                                                value={formData.registrationNumber}
                                                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Purchase Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-racing-blue transition-all"
                                                value={formData.purchaseDate}
                                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Current Mileage (km)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-racing-blue transition-all"
                                                placeholder="5000"
                                                value={formData.mileage}
                                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Previous Services Done</label>
                                            <select
                                                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-racing-blue transition-all"
                                                value={formData.serviceCount}
                                                onChange={(e) => setFormData({ ...formData, serviceCount: e.target.value })}
                                            >
                                                <option value="0" className="bg-zinc-900 text-white font-bold">0 (New Bike)</option>
                                                <option value="1" className="bg-zinc-900 text-white font-bold">1st Service Done</option>
                                                <option value="2" className="bg-zinc-900 text-white font-bold">2nd Service Done</option>
                                                <option value="3" className="bg-zinc-900 text-white font-bold">3rd Service Done</option>
                                                <option value="4" className="bg-zinc-900 text-white font-bold">4th Service Done</option>
                                                <option value="5" className="bg-zinc-900 text-white font-bold">5+ Services Done</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-racing-blue text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-racing-blue/30"
                                    >
                                        Add to My Garage
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    {bikes.length === 0 ? (
                                        <div className="glass p-20 rounded-[3rem] text-center border border-dashed border-zinc-800">
                                            <Bike className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
                                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-2">Garage is Empty</h3>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Register your Yamaha to track service schedules</p>
                                        </div>
                                    ) : (
                                        bikes.map((bike) => (
                                            <div key={bike._id} className="glass p-8 rounded-[2.5rem] border border-zinc-800 hover:border-racing-blue/50 transition-all group overflow-hidden relative">
                                                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Bike className="w-48 h-48 text-white rotate-12" />
                                                </div>
                                                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="flex gap-6">
                                                        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4">
                                                            <Bike className="w-full h-full text-racing-blue" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">{bike.bikeModel}</h3>
                                                                <span className="bg-racing-blue/10 text-racing-blue text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-racing-blue/20">Active</span>
                                                            </div>
                                                            <p className={cn(
                                                                "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                                                                bike.registrationNumber ? "text-muted-foreground" : "text-racing-blue"
                                                            )}>
                                                                {bike.registrationNumber ? (
                                                                    <>
                                                                        <CheckCircle2 className="w-3 h-3 text-green-500" /> {bike.registrationNumber}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <AlertCircle className="w-3 h-3" /> Registration Pending
                                                                    </>
                                                                )}
                                                            </p>
                                                            <div className="flex gap-6 mt-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Purchased</span>
                                                                    <span className="text-xs font-bold text-gray-300">{new Date(bike.purchaseDate).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Mileage</span>
                                                                    <span className="text-xs font-bold text-gray-300">{bike.mileage || 0} KM</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-between items-end">
                                                        <div className="text-right">
                                                            <span className="text-[9px] font-black text-racing-blue uppercase tracking-widest block mb-1">Next Service Due</span>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-racing-blue" />
                                                                <span className="text-xl font-display font-black text-white italic">{bike.nextServiceDate ? new Date(bike.nextServiceDate).toLocaleDateString() : 'TBD'}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteBike(bike._id)}
                                                            className="text-red-500/50 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                                            title="Delete Bike"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Reminders & Stats */}
                    <div className="space-y-8">
                        <div className="glass p-8 rounded-[2.5rem] border border-zinc-800 bg-racing-blue/5">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-racing-blue" /> Service Reminders
                            </h3>
                            <div className="space-y-4">
                                {bikes.length === 0 ? (
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">Add your bike to receive personalized maintenance alerts.</p>
                                ) : (
                                    bikes.map(bike => {
                                        const now = new Date();
                                        const next = new Date(bike.nextServiceDate || "");
                                        const diff = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                                        return (
                                            <div key={bike._id} className={cn(
                                                "p-4 rounded-2xl border flex items-center justify-between gap-4",
                                                diff < 15 ? "bg-red-500/10 border-red-500/30" : "bg-zinc-800/30 border-zinc-700"
                                            )}>
                                                <div>
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{bike.bikeModel}</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{diff < 0 ? 'Overdue' : `Due in ${diff} days`}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                                    diff < 15 ? "bg-red-500/20" : "bg-racing-blue/20"
                                                )}>
                                                    <Wrench className={cn("w-4 h-4", diff < 15 ? "text-red-500" : "text-racing-blue")} />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <Wrench className="w-20 h-20 text-racing-blue" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Service History</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Track all workshop visits in one place</p>
                            <button className="flex items-center gap-2 text-[10px] font-black text-racing-blue uppercase tracking-widest group">
                                View Full Log <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
