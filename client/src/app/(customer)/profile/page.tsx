"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { Bike, Calendar, Clock, Plus, Trash2, Wrench, AlertCircle, ChevronRight, CheckCircle2, Edit3, Save, X, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

interface UserBike {
    _id: string;
    bikeId?: string;
    bikeModel: string;
    bikeImage?: string;
    registrationNumber: string;
    purchaseDate: string;
    lastServiceDate?: string;
    nextServiceDate?: string;
    nextServiceKm?: number;
    mileage: number;
    serviceCount: number;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [bikes, setBikes] = useState<UserBike[]>([]);
    const [officialBikes, setOfficialBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isOfficial, setIsOfficial] = useState(true);
    const [isUpdatingOdometer, setIsUpdatingOdometer] = useState<string | null>(null);
    const [newOdometer, setNewOdometer] = useState("");
    const [formData, setFormData] = useState({
        bikeId: "",
        bikeModel: "",
        registrationNumber: "",
        purchaseDate: "",
        lastServiceDate: "",
        mileage: "",
        serviceCount: "0"
    });
    const [bikeServices, setBikeServices] = useState<Record<string, any[]>>({});
    const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

    // Profile Editing State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });
    const [updatingProfile, setUpdatingProfile] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileFormData({
                displayName: user.displayName,
                email: user.email,
                phone: user.phone || ""
            });
        }
    }, [user]);

    const { refreshUser } = useAuth();

    const fetchBikes = async () => {
        try {
            const res = await axios.get(`${API_URL}/user-bikes`, { withCredentials: true });
            if (res.data.success) {
                setBikes(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch bikes:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficialBikes = async () => {
        try {
            const res = await axios.get(`${API_URL}/bikes`);
            if (res.data.success) {
                setOfficialBikes(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch official bikes:", err);
        }
    };

    const fetchServiceHistory = async (id: string) => {
        try {
            const res = await axios.get(`${API_URL}/user-bikes/${id}/services`, { withCredentials: true });
            if (res.data.success) {
                setBikeServices(prev => ({ ...prev, [id]: res.data.data }));
            }
        } catch (err) {
            console.error("Failed to fetch service history:", err);
        }
    };

    const handleUpdateOdometer = async (id: string) => {
        if (!newOdometer || isNaN(Number(newOdometer))) return;
        try {
            const res = await axios.patch(`${API_URL}/user-bikes/${id}/odometer`, { mileage: Number(newOdometer) }, { withCredentials: true });
            if (res.data.success) {
                setBikes(bikes.map(b => b._id === id ? { ...b, mileage: Number(newOdometer) } : b));
                setIsUpdatingOdometer(null);
                setNewOdometer("");
            }
        } catch (err) {
            console.error("Failed to update odometer:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBikes();
            fetchOfficialBikes();
        }
    }, [user]);

    const handleAddBike = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/user-bikes`, formData, { withCredentials: true });
            if (res.data.success) {
                setBikes([res.data.data, ...bikes]);
                setIsAdding(false);
                setFormData({
                    bikeId: "",
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
            const res = await axios.delete(`${API_URL}/user-bikes/${id}`, { withCredentials: true });
            if (res.data.success) {
                setBikes(bikes.filter(b => b._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete bike:", err);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const res = await axios.put(`${API_URL}/auth/profile`, profileFormData, { withCredentials: true });
            if (res.data.success) {
                await refreshUser();
                setIsEditingProfile(false);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdatingProfile(false);
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
        <div className="min-h-screen bg-background pt-24 lg:pt-32 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-border/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-racing-blue/5 to-transparent pointer-events-none" />

                    <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10 p-2">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-racing-blue shadow-2xl shadow-racing-blue/20 shrink-0">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={user.displayName} width={96} height={96} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <Bike className="w-10 h-10 text-racing-blue" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tighter leading-tight">
                                    My <span className="text-racing-blue">Garage</span>
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{user.displayName}</p>
                                    <div className="w-1 h-1 bg-border rounded-full hidden sm:block" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{user.email}</p>
                                    {user.phone && (
                                        <>
                                            <div className="w-1 h-1 bg-border rounded-full hidden sm:block" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-racing-blue/80">{user.phone}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                            <button
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                className={cn(
                                    "flex-1 lg:flex-none px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    isEditingProfile ? "bg-muted text-foreground border border-border" : "bg-foreground/5 text-foreground border border-border hover:bg-foreground/10"
                                )}
                            >
                                {isEditingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                            </button>
                            <button
                                onClick={() => setIsAdding(!isAdding)}
                                className="flex-1 lg:flex-none bg-racing-blue text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-racing-blue/30"
                            >
                                {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {isAdding ? "Cancel" : "Add Bike"}
                            </button>
                        </div>
                    </header>

                    <AnimatePresence>
                        {isEditingProfile && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-12"
                            >
                                <form onSubmit={handleUpdateProfile} className="glass p-8 rounded-[2.5rem] border border-racing-blue/30 shadow-2xl space-y-8 max-w-4xl mx-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
                                            <User className="w-6 h-6 text-racing-blue" />
                                            Personal Information
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                value={profileFormData.displayName}
                                                onChange={(e) => setProfileFormData({ ...profileFormData, displayName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                value={profileFormData.email}
                                                onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                maxLength={10}
                                                className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                value={profileFormData.phone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setProfileFormData({ ...profileFormData, phone: val });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={updatingProfile}
                                        type="submit"
                                        className="w-full bg-racing-blue text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-racing-blue/30 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {updatingProfile ? "Updating Profile..." : "Save Changes"}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Bike List */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence mode="wait">
                                {isAdding ? (
                                    <motion.form
                                        key="add-form"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleAddBike}
                                        className="glass p-8 rounded-[2.5rem] border border-racing-blue/30 shadow-2xl space-y-6"
                                    >
                                        <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter mb-4">Bike Details</h3>

                                        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6 w-fit">
                                            <button
                                                type="button"
                                                onClick={() => setIsOfficial(true)}
                                                className={cn(
                                                    "px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                    isOfficial ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Yamaha Official
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsOfficial(false)}
                                                className={cn(
                                                    "px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                    !isOfficial ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Custom Model
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bike Model</label>
                                                {isOfficial ? (
                                                    <select
                                                        required
                                                        className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none cursor-pointer"
                                                        value={formData.bikeId}
                                                        onChange={(e) => setFormData({ ...formData, bikeId: e.target.value, bikeModel: "" })}
                                                    >
                                                        <option value="" disabled className="bg-card">Select Official Model</option>
                                                        {officialBikes.map(bike => (
                                                            <option key={bike._id} value={bike._id} className="bg-card text-foreground">{bike.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                        placeholder="e.g. Yamaha R15 V4"
                                                        value={formData.bikeModel}
                                                        onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value, bikeId: "" })}
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Registration Number</label>
                                                    <span className="text-[8px] font-black text-racing-blue/60 uppercase tracking-widest bg-racing-blue/5 px-2 py-0.5 rounded-full">Optional</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
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
                                                    className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    value={formData.purchaseDate}
                                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Current Odometer Reading (Total KM)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    placeholder="e.g. 50 (Total distance traveled)"
                                                    value={formData.mileage}
                                                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Previous Services Done</label>
                                                <select
                                                    className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    value={formData.serviceCount}
                                                    onChange={(e) => setFormData({ ...formData, serviceCount: e.target.value })}
                                                >
                                                    <option value="0" className="bg-card text-foreground font-bold">0 (New Bike)</option>
                                                    <option value="1" className="bg-card text-foreground font-bold">1st Service Done</option>
                                                    <option value="2" className="bg-card text-foreground font-bold">2nd Service Done</option>
                                                    <option value="3" className="bg-card text-foreground font-bold">3rd Service Done</option>
                                                    <option value="4" className="bg-card text-foreground font-bold">4th Service Done</option>
                                                    <option value="5" className="bg-card text-foreground font-bold">5+ Services Done</option>
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
                                        key="bike-list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        {bikes.length === 0 ? (
                                            <div className="glass p-20 rounded-[3rem] text-center border border-dashed border-border/50">
                                                <Bike className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                                                <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter mb-2">Garage is Empty</h3>
                                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Register your Yamaha to track service schedules</p>
                                            </div>
                                        ) : (
                                            bikes.map((bike) => {
                                                const isDueByDistance = bike.nextServiceKm && (bike.mileage >= bike.nextServiceKm - 500);
                                                const isOverdueByDistance = bike.nextServiceKm && (bike.mileage >= bike.nextServiceKm);

                                                return (
                                                    <div key={bike._id} className="glass rounded-[1.5rem] sm:rounded-[2.5rem] border border-border hover:border-racing-blue/50 transition-all group overflow-hidden relative">
                                                        <div className="p-8">
                                                            <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                                                <Bike className="w-48 h-48 text-foreground rotate-12" />
                                                            </div>
                                                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                                                                <div className="flex gap-6">
                                                                    <div className="w-24 h-24 rounded-2xl bg-muted border border-border flex items-center justify-center p-2 overflow-hidden relative">
                                                                        {bike.bikeImage ? (
                                                                            <Image
                                                                                src={bike.bikeImage}
                                                                                alt={bike.bikeModel}
                                                                                width={96}
                                                                                height={96}
                                                                                className="object-contain w-full h-full transform group-hover:scale-110 transition-transform"
                                                                            />
                                                                        ) : (
                                                                            <Bike className="w-12 h-12 text-racing-blue" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-3 mb-1">
                                                                            <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">{bike.bikeModel}</h3>
                                                                            <span className={cn(
                                                                                "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                                                                                isOverdueByDistance ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                                                    isDueByDistance ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                                                                                        "bg-racing-blue/10 text-racing-blue border-racing-blue/20"
                                                                            )}>
                                                                                {isOverdueByDistance ? "Overdue" : isDueByDistance ? "Due Soon" : "Active"}
                                                                            </span>
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
                                                                        <div className="flex items-center gap-6 mt-4">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Purchased</span>
                                                                                <span className="text-xs font-bold text-foreground/80">{new Date(bike.purchaseDate).toLocaleDateString()}</span>
                                                                            </div>
                                                                            <div className="flex flex-col relative group/odo">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Odometer</span>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setIsUpdatingOdometer(bike._id);
                                                                                            setNewOdometer(bike.mileage.toString());
                                                                                        }}
                                                                                        className="p-1 hover:bg-muted rounded-md text-racing-blue opacity-60 group-hover/odo:opacity-100 transition-opacity"
                                                                                    >
                                                                                        <Edit3 className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    {isUpdatingOdometer === bike._id ? (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <input
                                                                                                type="number"
                                                                                                value={newOdometer}
                                                                                                onChange={(e) => setNewOdometer(e.target.value)}
                                                                                                className="w-16 bg-background border border-racing-blue/30 rounded px-1.5 py-0.5 text-xs font-bold focus:outline-none"
                                                                                                autoFocus
                                                                                            />
                                                                                            <button onClick={() => handleUpdateOdometer(bike._id)} className="text-green-500 hover:text-green-600"><Save className="w-3 h-3" /></button>
                                                                                            <button onClick={() => setIsUpdatingOdometer(null)} className="text-red-500 hover:text-red-600"><X className="w-3 h-3" /></button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-xs font-bold text-foreground/80">{bike.mileage || 0} KM</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col justify-between items-end">
                                                                    <div className="text-right">
                                                                        <span className="text-[9px] font-black text-racing-blue uppercase tracking-widest block mb-1">Next Service Due</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4 text-racing-blue" />
                                                                            <div className="flex flex-col items-end">
                                                                                <span className="text-xl font-display font-black text-foreground italic">{bike.nextServiceDate ? new Date(bike.nextServiceDate).toLocaleDateString() : 'TBD'}</span>
                                                                                {bike.nextServiceKm && (
                                                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.1em]">or {bike.nextServiceKm} KM</span>
                                                                                )}
                                                                            </div>
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

                                                            {/* Service History Log */}
                                                            <div className="mt-8 pt-8 border-t border-border/50">
                                                                <button
                                                                    onClick={() => {
                                                                        if (expandedHistory === bike._id) {
                                                                            setExpandedHistory(null);
                                                                        } else {
                                                                            setExpandedHistory(bike._id);
                                                                            if (!bikeServices[bike._id]) {
                                                                                fetchServiceHistory(bike._id);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="flex items-center gap-2 text-[10px] font-black text-racing-blue uppercase tracking-widest hover:text-racing-blue/80 transition-colors"
                                                                >
                                                                    <Wrench className="w-3 h-3" />
                                                                    {expandedHistory === bike._id ? "Close Service Log" : "View Service History"}
                                                                    <ChevronRight className={cn("w-3 h-3 transition-transform", expandedHistory === bike._id ? "rotate-90" : "")} />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {expandedHistory === bike._id && (
                                                                        <motion.div
                                                                            key={`history-${bike._id}`}
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="pt-6 space-y-4">
                                                                                {!bikeServices[bike._id] ? (
                                                                                    <div className="flex items-center gap-2 py-4 italic text-[10px] text-muted-foreground uppercase tracking-widest">
                                                                                        <Clock className="w-3 h-3 animate-spin" /> Retrieving logs...
                                                                                    </div>
                                                                                ) : bikeServices[bike._id].length === 0 ? (
                                                                                    <p className="py-4 italic text-[10px] text-muted-foreground uppercase tracking-widest">No service records found for this registration.</p>
                                                                                ) : (
                                                                                    bikeServices[bike._id].map((svc, idx) => (
                                                                                        <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                                            <div className="flex items-center gap-4">
                                                                                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
                                                                                                    <CheckCircle2 className={cn("w-5 h-5", (svc.status === 'delivered' || svc.status === 'completed') ? "text-success" : "text-muted-foreground")} />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-1">{svc.serviceType}</p>
                                                                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(svc.appointmentDate).toDateString()}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-6">
                                                                                                <div className="text-right hidden md:block">
                                                                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-0.5">Technician</span>
                                                                                                    <span className="text-[9px] font-black text-foreground uppercase tracking-tighter">{svc.technicianName || "Unassigned"}</span>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-border bg-background">
                                                                                                    {svc.status}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Reminders & Stats */}
                        <div className="space-y-8">
                            <div className="glass p-8 rounded-[2.5rem] border border-border bg-racing-blue/5">
                                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-racing-blue" /> Service Reminders
                                </h3>
                                <div className="space-y-4">
                                    {bikes.length === 0 ? (
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">Add your bike to receive personalized maintenance alerts.</p>
                                    ) : (
                                        (() => {
                                            const dueBikes = bikes.filter(bike => {
                                                const now = new Date();
                                                const next = new Date(bike.nextServiceDate || "");
                                                const diffDays = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                                const kmLeft = bike.nextServiceKm ? (bike.nextServiceKm - (bike.mileage || 0)) : null;
                                                return diffDays < 15 || (kmLeft !== null && kmLeft <= 500);
                                            });

                                            if (dueBikes.length === 0) {
                                                return <p className="text-[10px] italic text-muted-foreground uppercase tracking-widest">Everything looks good!</p>;
                                            }

                                            return dueBikes.map(bike => {
                                                const now = new Date();
                                                const next = new Date(bike.nextServiceDate || "");
                                                const diffDays = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                                const kmLeft = bike.nextServiceKm ? (bike.nextServiceKm - (bike.mileage || 0)) : null;
                                                const isKmDue = kmLeft !== null && kmLeft <= 500;
                                                const isDateDue = diffDays < 15;

                                                const serviceNum = bike.serviceCount + 1;
                                                const serviceLabel = serviceNum === 1 ? "1st" : serviceNum === 2 ? "2nd" : serviceNum === 3 ? "3rd" : `${serviceNum}th`;

                                                return (
                                                    <div key={bike._id} className={cn(
                                                        "p-4 rounded-2xl border flex items-center justify-between gap-4",
                                                        (diffDays < 0 || (kmLeft !== null && kmLeft < 0)) ? "bg-red-500/10 border-red-500/30" : "bg-muted/50 border-border"
                                                    )}>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">{bike.bikeModel}</p>
                                                                <span className="text-[7px] font-black bg-racing-blue/10 text-racing-blue px-1.5 py-0.5 rounded uppercase tracking-widest">{serviceLabel} SVS</span>
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                {isDateDue && (
                                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">
                                                                        {diffDays < 0 ? 'Date Overdue' : `Due in ${diffDays} days`}
                                                                    </p>
                                                                )}
                                                                {isKmDue && (
                                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">
                                                                        {kmLeft && kmLeft < 0 ? 'KM Overdue' : `Due in ${kmLeft} km`}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                            (diffDays < 0 || (kmLeft !== null && kmLeft < 0)) ? "bg-red-500/20" : "bg-racing-blue/20"
                                                        )}>
                                                            <Wrench className={cn("w-4 h-4", (diffDays < 0 || (kmLeft !== null && kmLeft < 0)) ? "text-red-500" : "text-racing-blue")} />
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()
                                    )}
                                </div>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border border-border bg-muted/20">
                                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Wrench className="w-4 h-4 text-racing-blue" /> Yamaha Maintenance Guide
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-racing-blue uppercase tracking-widest mb-3">Free Service Schedule</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: "1st SVS", km: "1,000 KM", days: "30 Days" },
                                                { label: "2nd SVS", km: "5,000 KM", days: "150 Days" },
                                                { label: "3rd SVS", km: "9,000 KM", days: "270 Days" },
                                                { label: "4th SVS", km: "13,000 KM", days: "390 Days" }
                                            ].map((sv, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-background/50 border border-border flex flex-col gap-1">
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase">{sv.label}</span>
                                                    <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">{sv.km}</span>
                                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{sv.days}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border/50">
                                        <p className="text-[10px] font-black text-racing-blue uppercase tracking-widest mb-2">Paid Service Rule</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                                            After the 4th service, all services are paid with a duration of <span className="text-foreground">+4,000 KM</span> or <span className="text-foreground">+120 Days</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border border-border relative overflow-hidden group">
                                <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <Wrench className="w-20 h-20 text-racing-blue" />
                                </div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4">Service History</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Track all workshop visits in one place</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
