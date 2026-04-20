"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Wrench, Shield, Clock, Calendar, CheckCircle2,
    ChevronRight, Bell, Plus, Edit2, Save, X,
    Activity, History, FileText, Settings,
    Zap, Weight, DollarSign, Image as ImageIcon,
    Clock3, MapPin, ExternalLink, Download,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { DigitalPlate } from "../ui/DigitalPlate";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IModification {
    _id?: string;
    partName: string;
    brand: string;
    cost: number;
    date: string;
    location?: string;
}

interface IDocument {
    _id?: string;
    docType: string;
    docUrl: string;
    expiryDate?: string;
}

interface IConsumables {
    tires: number;
    chain: number;
    brakes: number;
    coolant: number;
}

interface UserBike {
    _id: string;
    bikeModel: string;
    bikeImage?: string;
    registrationNumber: string;
    registrationVerified?: boolean;
    chassisNumber?: string;
    purchaseDate: string;
    mileage: number;
    consumables: IConsumables;
    conditionScore: number;
    modifications: IModification[];
    documents: IDocument[];
    nextServiceDate: string;
}

interface ServiceStep {
    status: string;
    timestamp: string;
    notes?: string;
}

interface IService {
    _id: string;
    serviceType: string;
    appointmentDate: string;
    cost: number;
    status: string;
}

export function GarageDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bikes, setBikes] = useState<UserBike[]>([]);
    const [selectedBike, setSelectedBike] = useState<UserBike | null>(null);
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [activeTab, setActiveTab] = useState<"overview" | "mods" | "docs" | "timeline">("overview");
    const [showModModal, setShowModModal] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [manageFormData, setManageFormData] = useState({ registrationNumber: "", chassisNumber: "", mileage: 0 });
    const [newMod, setNewMod] = useState({ partName: "", brand: "", cost: 0, date: new Date().toISOString().split('T')[0], location: "" });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (user) {
            fetchBikes();
        }
    }, [user, authLoading, router]);

    const fetchBikes = async () => {
        try {
            const res = await axios.get<any>(`${API_URL}/user-bikes`, { withCredentials: true });
            if (res.data.success) {
                setBikes(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedBike(res.data.data[0]);
                    fetchServiceHistory(res.data.data[0]._id);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceHistory = async (bikeId: string) => {
        try {
            const res = await axios.get<any>(`${API_URL}/user-bikes/${bikeId}/services`, { withCredentials: true });
            if (res.data.success) {
                setServices(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddMod = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.post<any>(`${API_URL}/user-bikes/${selectedBike._id}/modifications`, newMod, { withCredentials: true });
            if (res.data.success) {
                setSelectedBike(res.data.data);
                setShowModModal(false);
                setNewMod({ partName: "", brand: "", cost: 0, date: new Date().toISOString().split('T')[0], location: "" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateBike = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.put<any>(`${API_URL}/user-bikes/${selectedBike._id}`, manageFormData, { withCredentials: true });
            if (res.data.success) {
                const updatedBike = res.data.data;
                setBikes(bikes.map(b => b._id === updatedBike._id ? updatedBike : b));
                setSelectedBike(updatedBike);
                setIsManaging(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-racing-blue border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!selectedBike) return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8">
            <div className="p-12 bg-white rounded-[3rem] border border-zinc-100 text-center max-w-md shadow-xl shadow-black/5">
                <Plus className="w-16 h-16 text-racing-blue mx-auto mb-6" />
                <h2 className="text-2xl font-display font-black text-zinc-900 uppercase mb-4">Your Garage is Empty</h2>
                <p className="text-gray-500 font-medium mb-8 uppercase text-[10px] tracking-widest leading-relaxed">Add your first machine to begin tracking its legacy and health.</p>
                <Link href="/profile" className="block w-full py-4 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-racing-blue/20">
                    Register Bike
                </Link>
            </div>
        </div>
    );

    const totalInvestment = (selectedBike.modifications?.reduce((acc, mod) => acc + mod.cost, 0) || 0) + 0; // Purchase price could be added later

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-racing-blue/10 pt-20">
            {/* Header / Hero */}
            <div className="relative h-[45vh] overflow-hidden border-b border-zinc-100 bg-zinc-50/50">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    className="absolute inset-0 bg-cover bg-center mix-blend-multiply transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${selectedBike.bikeImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'})` }}
                />

                <div className="relative z-20 max-w-[1400px] mx-auto h-full flex flex-col justify-end pb-12 px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1 bg-racing-blue text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-racing-blue/20">Primary Asset</span>
                                <span className="px-4 py-1 bg-white text-emerald-600 border border-emerald-100 shadow-sm text-[9px] font-black uppercase tracking-widest rounded-full">Score: {selectedBike.conditionScore || 100}%</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter mb-4 text-zinc-900">
                                {selectedBike.bikeModel}
                            </h1>
                            <div className="flex items-center gap-8">
                                <DigitalPlate registrationNumber={selectedBike.registrationNumber} variant="compact" />
                                <div className="h-10 w-px bg-zinc-200 hidden md:block" />
                                <div className="hidden md:block">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Odometer Log</p>
                                    <p className="text-xl font-display font-black uppercase text-zinc-900">{(selectedBike.mileage || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-400">KM</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setManageFormData({
                                        registrationNumber: selectedBike.registrationNumber || "",
                                        chassisNumber: selectedBike.chassisNumber || "",
                                        mileage: selectedBike.mileage || 0
                                    });
                                    setIsManaging(true);
                                }}
                                className="px-10 py-5 bg-white border border-zinc-200 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-50 transition-all text-zinc-900 shadow-sm"
                            >
                                <Settings className="w-4 h-4 mr-2 inline-block" /> Manage
                            </button>
                            <Link href="/service#booking" className="px-10 py-5 bg-racing-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-racing-blue/20">
                                Book Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-[1400px] mx-auto px-8 py-8">
                <div className="flex items-center gap-10 border-b border-zinc-100 mb-12 overflow-x-auto no-scrollbar">
                    {[
                        { id: "overview", label: "Visual Hub", icon: Activity },
                        { id: "mods", label: "Mod Log", icon: Wrench },
                        { id: "docs", label: "Vault", icon: FileText },
                        { id: "timeline", label: "Heritage", icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            //@ts-ignore
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? "text-zinc-900" : "text-gray-400 hover:text-zinc-600"}`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-racing-blue" : ""}`} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-racing-blue shadow-[0_0_10px_rgba(0,149,255,0.3)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {activeTab === "overview" && (
                            <div className="space-y-12">
                                {/* Consumables Grid */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-gray-400 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-racing-blue" /> Component Lifespan Trackers
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { label: "Front & Rear Tires", value: selectedBike.consumables.tires, desc: "Estimated life based on friction coefficient" },
                                            { label: "O-Ring Chain & Sprockets", value: selectedBike.consumables.chain, desc: "Log lube every 500km to extend life" },
                                            { label: "Sintered Brake Pads", value: selectedBike.consumables.brakes, desc: "Hydraulic pressure & thickness estimate" },
                                            { label: "High-Temp Coolant", value: selectedBike.consumables.coolant, desc: "PH balance and thermal range tracking" },
                                        ].map((item) => (
                                            <div key={item.label} className="p-8 bg-zinc-50/50 rounded-3xl border border-zinc-100 space-y-5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 mb-1">{item.label}</h4>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{item.desc}</p>
                                                    </div>
                                                    <span className={`text-2xl font-display font-black ${item.value > 70 ? 'text-emerald-500' : item.value > 30 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                        {item.value}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.value}%` }}
                                                        className={`h-full ${item.value > 70 ? 'bg-emerald-500' : item.value > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Riding Analytics Preview */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-gray-400 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-racing-blue" /> Riding Analytics
                                    </h3>
                                    <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Last 30 Days</p>
                                            <p className="text-3xl font-display font-black text-zinc-900">482 <span className="text-xs font-sans text-gray-400">KM</span></p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-emerald-600">+12% vs last month</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Avg. Efficiency</p>
                                            <p className="text-3xl font-display font-black text-zinc-900">18.4 <span className="text-xs font-sans text-gray-400">KM/L</span></p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-amber-600">-2% (Aggressive riding)</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Hours</p>
                                            <p className="text-3xl font-display font-black text-zinc-900">12.5 <span className="text-xs font-sans text-gray-400">HRS</span></p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-gray-400">Weekend Warrior Profile</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "mods" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modification Log & Genealogy</h3>
                                    <button
                                        onClick={() => setShowModModal(true)}
                                        className="px-6 py-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Install Part
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {selectedBike.modifications?.length > 0 ? (
                                        selectedBike.modifications.map((mod, idx) => (
                                            <div key={idx} className="p-8 bg-zinc-50/50 rounded-3xl border border-zinc-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-racing-blue/5 flex items-center justify-center">
                                                        <Zap className="w-7 h-7 text-racing-blue" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black uppercase text-zinc-900 mb-1">{mod.partName}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mod.brand} • Installed {new Date(mod.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-display font-black uppercase text-zinc-900">₹{(mod.cost || 0).toLocaleString()}</p>
                                                    {mod.location && (
                                                        <p className="text-[9px] font-black text-racing-blue uppercase tracking-widest">Slot: {mod.location}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-20 border-2 border-dashed border-zinc-100 rounded-[3rem] text-center">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No modifications logged yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "docs" && (
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Document Vault & Certification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { type: "Registration Certificate (RC)", desc: "Valid until 2029", icon: FileText },
                                        { type: "Luxury Insurance Policy", desc: "Expires in 42 days", icon: Shield, warning: true },
                                        { type: "Purchase Invoice", desc: "Verifiable Service History Original", icon: DollarSign },
                                        { type: "Extended Warranty", desc: "Active Tier 1 Protection", icon: CheckCircle2 },
                                    ].map((doc) => (
                                        <div key={doc.type} className={`p-8 bg-zinc-50/50 rounded-3xl border transition-all ${doc.warning ? 'border-amber-200 bg-amber-50/30' : 'border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-black/5'}`}>
                                            <div className="flex justify-between items-start mb-8">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${doc.warning ? 'bg-amber-100' : 'bg-zinc-100'}`}>
                                                    <doc.icon className={`w-6 h-6 ${doc.warning ? 'text-amber-600' : 'text-zinc-600'}`} />
                                                </div>
                                                <button className="p-3 hover:bg-zinc-100 rounded-xl transition-all">
                                                    <Download className="w-5 h-5 text-gray-400" />
                                                </button>
                                            </div>
                                            <h4 className="text-sm font-black uppercase text-zinc-900 mb-1">{doc.type}</h4>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${doc.warning ? 'text-amber-600' : 'text-gray-400'}`}>{doc.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-8 bg-zinc-50/50 border-2 border-dashed border-zinc-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white hover:border-racing-blue/30 hover:text-racing-blue transition-all">
                                    + Add New Document to Vault
                                </button>
                            </div>
                        )}

                        {activeTab === "timeline" && (
                            <div className="space-y-12 pl-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Asset Heritage & Timeline</h3>
                                <div className="relative space-y-12">
                                    <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-100" />

                                    {[
                                        { date: "Oct 24, 2025", title: "Ceramic Coating Applied", desc: "9H Protection layer by Showroom Detailers", icon: Zap, premium: true },
                                        { date: "Aug 12, 2025", title: "1st Periodic Service", desc: "Oil change, chain adjustment, software sync", icon: CheckCircle2 },
                                        { date: "Jun 02, 2025", title: "Asset Delivery", desc: "Brought home from Yamaha Blue Square", icon: ImageIcon, premium: true },
                                    ].map((event, idx) => (
                                        <div key={idx} className="relative pl-12 group">
                                            <div className={`absolute left-[-6px] top-2 w-3 h-3 rounded-full border-4 border-white transition-all group-hover:scale-125 ${event.premium ? 'bg-racing-blue shadow-[0_0_15px_rgba(0,149,255,0.4)]' : 'bg-zinc-300'}`} />
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{event.date}</p>
                                                <h4 className={`text-base font-black uppercase mb-1 ${event.premium ? 'text-racing-blue' : 'text-zinc-900'}`}>{event.title}</h4>
                                                <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm">{event.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] space-y-8 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Valuation</h3>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Investment</p>
                                <p className="text-4xl font-display font-black text-zinc-900 uppercase tracking-tighter">
                                    ₹{(totalInvestment || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Purchase Value</span>
                                    <span className="text-zinc-600">₹5.4L</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Mods Cost</span>
                                    <span className="text-zinc-600">₹{(selectedBike.modifications?.reduce((acc, m) => acc + (m.cost || 0), 0) || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-racing-blue/5 border border-racing-blue/10 rounded-[2.5rem] space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-racing-blue/10 flex items-center justify-center">
                                    <Clock3 className="w-5 h-5 text-racing-blue" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-racing-blue">Next Milestones</h3>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Periodic Service</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-black uppercase text-zinc-900 leading-none">{new Date(selectedBike.nextServiceDate).toLocaleDateString()}</p>
                                        <p className="text-[10px] font-black text-racing-blue uppercase tracking-widest leading-none">24 Days Left</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">RC Renewal</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-black uppercase text-zinc-900 leading-none">Dec 2029</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Verifiable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModModal(false)}
                            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 overflow-hidden shadow-2xl shadow-black/10"
                        >
                            <h2 className="text-3xl font-display font-black uppercase mb-10 text-zinc-900">Install New Modification</h2>
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Part Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.partName}
                                            onChange={(e) => setNewMod({ ...newMod, partName: e.target.value })}
                                            placeholder="e.g. Akrapovič Slip-On"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Brand</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.brand}
                                            onChange={(e) => setNewMod({ ...newMod, brand: e.target.value })}
                                            placeholder="e.g. Ohlins"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Cost (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.cost}
                                            onChange={(e) => setNewMod({ ...newMod, cost: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Install Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.date}
                                            onChange={(e) => setNewMod({ ...newMod, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Stock Part Storage Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                        value={newMod.location}
                                        onChange={(e) => setNewMod({ ...newMod, location: e.target.value })}
                                        placeholder="e.g. Garage Shelf B2"
                                    />
                                </div>
                                <button
                                    onClick={handleAddMod}
                                    className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all mt-6 shadow-xl shadow-racing-blue/20"
                                >
                                    Confirm Asset Modification
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isManaging && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsManaging(false)}
                            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 overflow-hidden shadow-2xl shadow-black/10"
                        >
                            <h2 className="text-3xl font-display font-black uppercase mb-10 text-zinc-900">Manage Machine Identity</h2>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Registration Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900 uppercase"
                                        value={manageFormData.registrationNumber}
                                        onChange={(e) => setManageFormData({ ...manageFormData, registrationNumber: e.target.value.toUpperCase() })}
                                        placeholder="e.g. MH 12 AB 1234"
                                        disabled={selectedBike.registrationVerified}
                                    />
                                    {selectedBike.registrationVerified && (
                                        <p className="text-[9px] font-bold text-racing-blue uppercase tracking-widest mt-1">Verified by Showroom (Locked)</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Chassis Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900 uppercase"
                                        value={manageFormData.chassisNumber}
                                        onChange={(e) => setManageFormData({ ...manageFormData, chassisNumber: e.target.value.toUpperCase() })}
                                        placeholder="e.g. ME1..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Odometer (KM)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                        value={manageFormData.mileage}
                                        onChange={(e) => setManageFormData({ ...manageFormData, mileage: Number(e.target.value) })}
                                    />
                                </div>

                                <button
                                    onClick={handleUpdateBike}
                                    className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all mt-6 shadow-xl shadow-racing-blue/20"
                                >
                                    Update Machine Intel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
