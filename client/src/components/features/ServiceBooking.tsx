"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/config";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Calendar, Clock, Bike, Package, CheckCircle2, ChevronRight, User, Plus, Minus, Trash2, Search, ShieldAlert, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import { submitServiceBooking } from "@/lib/actions/serviceActions";
import Link from "next/link";

type ServiceType = "General" | "Periodic" | "Repair" | "Spares";

export function ServiceBooking() {
    const { user } = useAuth();
    const [extraNotes, setExtraNotes] = useState("");
    const [blinkingId, setBlinkingId] = useState<string | null>(null);
    const [demandedIds, setDemandedIds] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [serviceType, setServiceType] = useState<ServiceType[]>(["General"]);
    const [cart, setCart] = useState<{ [id: string]: { item: any, quantity: number } }>({});
    const [spares, setSpares] = useState<any[]>([]);
    const [showSparePicker, setShowSparePicker] = useState(false);
    const [spareSearchQuery, setSpareSearchQuery] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userBikes, setUserBikes] = useState<any[]>([]);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [defaultCapacity, setDefaultCapacity] = useState(4);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

    const updateCart = (newCart: { [id: string]: { item: any, quantity: number } }) => {
        localStorage.setItem('spares_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('spares_cart_updated'));
        setCart(newCart);
    };

    const handleQtyChange = (itemId: string, delta: number) => {
        const entry = cart[itemId];
        if (!entry) return;

        if (delta > 0 && entry.quantity >= entry.item.stock) {
            setBlinkingId(itemId);
            setTimeout(() => setBlinkingId(null), 1000);
            return;
        }

        const newCart = { ...cart };
        if (delta < 0 && entry.quantity === 1) {
            delete newCart[itemId];
        } else {
            newCart[itemId] = {
                ...entry,
                quantity: entry.quantity + delta
            };
        }
        updateCart(newCart);
    };

    const handleRemoveItem = (itemId: string) => {
        const newCart = { ...cart };
        delete newCart[itemId];
        updateCart(newCart);
    };

    const STANDARD_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    // Form data state
    const [formData, setFormData] = useState({
        bikeModel: "",
        regNumber: "",
        chassisNumber: "",
        notes: "",
        name: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: ""
    });

    useEffect(() => {
        const fetchUserBikes = async () => {
            if (user) {
                try {
                    setFormData(prev => ({
                        ...prev,
                        name: user.displayName,
                        phone: prev.phone
                    }));

                    const res = await axios.get(`${API_URL}/user-bikes`, { withCredentials: true });
                    const resData = res.data as any;
                    if (resData.success) {
                        setUserBikes(resData.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch user bikes:", err);
                }
            }
        };
        fetchUserBikes();
    }, [user]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (formData.appointmentDate) {
                setLoadingSlots(true);
                try {
                    const res = await axios.get(`${API_URL}/workshop-slots/available?date=${formData.appointmentDate}`);
                    const resData = res.data as any;
                    if (resData.success) {
                        setAvailableSlots(resData.data);
                        if (resData.defaultCapacity) setDefaultCapacity(resData.defaultCapacity);
                    }
                } catch (err) {
                    console.error("Failed to fetch slots:", err);
                } finally {
                    setLoadingSlots(false);
                }
            }
        };
        fetchSlots();
    }, [formData.appointmentDate]);

    useEffect(() => {
        const fetchSpares = async () => {
            try {
                const res = await fetch(`${API_URL}/spares`);
                const data = await res.json();
                if (data.success) {
                    setSpares(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch spares:", err);
            }
        };
        fetchSpares();
    }, []);

    const handleDemandRestock = async (spareId: string) => {
        try {
            const res = await axios.post(`${API_URL}/spares/${spareId}/demand`);
            const data = res.data as any;
            if (data.success) {
                setDemandedIds(prev => [...prev, spareId]);
            }
        } catch (err) {
            console.error("Failed to demand restock:", err);
        }
    };

    useEffect(() => {
        const syncCart = () => {
            const savedCart = localStorage.getItem('spares_cart');
            if (savedCart) {
                try {
                    const cartData = JSON.parse(savedCart);
                    setCart(cartData);

                    if (Object.keys(cartData).length > 0) {
                        setServiceType(prev => prev.includes("Spares") ? prev : [...prev, "Spares"]);
                    } else {
                        setServiceType(prev => prev.filter(t => t !== "Spares"));
                    }
                } catch (e) {
                    console.error("Failed to sync cart", e);
                }
            } else {
                setCart({});
                setServiceType(prev => prev.filter(t => t !== "Spares"));
            }
        };

        syncCart();
        window.addEventListener('spares_cart_updated', syncCart);
        return () => window.removeEventListener('spares_cart_updated', syncCart);
    }, []);

    const serviceOptions = [
        { id: "General", label: "General Checkup", icon: Wrench, desc: "Standard 21-point inspection" },
        { id: "Periodic", label: "Periodic Service", icon: Calendar, desc: "Based on mileage/time" },
        { id: "Repair", label: "Major Repair", icon: Bike, desc: "Engine, transmission, etc." },
        { id: "Spares", label: "Genuine Spares", icon: Package, desc: "Order specific parts" },
    ];

    const cartItems = Object.values(cart).map((entry: any) => ({
        itemId: entry.item._id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.quantity,
        itemType: (entry.item.category === 'Accessory' || !entry.item.bikeId || !['Engine', 'Transmission', 'Electrical'].includes(entry.item.category)) ? 'accessory' : 'spare'
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final frontend validation check
        if (!formData.bikeModel || !formData.name || !formData.phone) {
            alert("Please fill in all required fields (Bike Model, Name, and Phone).");
            return;
        }

        setIsSubmitting(true);

        const result = await submitServiceBooking({
            ...formData,
            serviceType: serviceType.join(" + "),
            items: cartItems
        });

        setIsSubmitting(false);
        if (result.success) {
            setSubmitted(true);
            localStorage.removeItem('spares_cart');
            window.dispatchEvent(new Event('spares_cart_updated'));
        } else {
            alert(result.message || "Booking failed. Please check your details and try again.");
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-card rounded-[3rem] p-12 text-center border border-racing-blue/20 shadow-2xl flex flex-col items-center"
            >
                <div className="w-20 h-20 bg-racing-blue/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-racing-blue" />
                </div>
                <h3 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter mb-4">
                    Booking Confirmed!
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-8 font-medium">
                    Your service request for {formData.bikeModel} has been sent. Our team will contact you at {formData.phone} shortly.
                    <br />
                    <Link
                        href="https://www.yamaha-motor-india.com/"
                        target="_blank"
                        className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest text-racing-blue/60 hover:text-racing-blue transition-colors"
                    >
                        View Official Yamaha India Service Guidelines
                    </Link>
                </p>
                <button
                    onClick={() => { setSubmitted(false); setStep(1); }}
                    className="px-8 py-4 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/80 transition-all border border-border"
                >
                    New Booking
                </button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-card rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 border border-border shadow-2xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                    <motion.div
                        className="h-full bg-racing-blue shadow-[0_0_10px_rgba(0,123,255,0.5)]"
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-2 block">Service Center</span>
                        <h2 className="text-3xl md:text-4xl font-display font-black text-foreground uppercase tracking-tighter">
                            SCHEDULE <span className="text-gradient">SERVICE</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Step</span>
                        <div className="text-2xl font-display font-black text-foreground italic">{step}/3</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    {serviceOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setServiceType(prev =>
                                                    prev.includes(opt.id as any)
                                                        ? prev.filter(t => t !== opt.id)
                                                        : [...prev, opt.id as any]
                                                );
                                            }}
                                            className={cn(
                                                "p-4 rounded-xl border text-left transition-all group flex items-center justify-between",
                                                serviceType.includes(opt.id as any)
                                                    ? "bg-racing-blue/10 border-racing-blue"
                                                    : "bg-background/50 border-border hover:border-racing-blue/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative shrink-0",
                                                    serviceType.includes(opt.id as any) ? "bg-racing-blue text-white" : "bg-muted text-muted-foreground group-hover:text-foreground"
                                                )}>
                                                    <opt.icon className="w-5 h-5" />
                                                    {serviceType.includes(opt.id as any) && (
                                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                                            <CheckCircle2 className="w-2 h-2 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-0.5">{opt.label}</h4>
                                                    <p className="text-[9px] text-muted-foreground font-medium leading-tight">{opt.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {serviceType.includes("Spares") && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Selected Spares</h4>
                                            <button
                                                type="button"
                                                onClick={() => setShowSparePicker(true)}
                                                className="flex items-center gap-2 text-[10px] font-black text-racing-blue uppercase tracking-widest bg-racing-blue/5 px-4 py-2 rounded-xl hover:bg-racing-blue/10 transition-all border border-racing-blue/20"
                                            >
                                                <Package className="w-3.5 h-3.5" /> Add Spare / Accessory
                                            </button>
                                        </div>

                                        {cartItems.length > 0 ? (
                                            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 pt-1">
                                                {Object.values(cart).map((entry: any, idx) => {
                                                    const item = entry.item;
                                                    const quantity = entry.quantity;
                                                    const thumbSrc = item.image
                                                        ? (item.image.startsWith('/uploads') ? `${API_BASE_URL}${item.image}` : item.image)
                                                        : null;
                                                    return (
                                                        <div key={idx} className="flex-shrink-0 w-48 flex flex-col p-3 bg-muted/20 border border-border rounded-2xl group/item relative hover:z-50 transition-all">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div 
                                                                    className="relative w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 cursor-zoom-in"
                                                                    onMouseEnter={(e) => {
                                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                                        thumbSrc && setHoveredImage(thumbSrc);
                                                                        setHoverPos({ x: rect.right + 20, y: rect.top });
                                                                    }}
                                                                    onMouseLeave={() => setHoveredImage(null)}
                                                                >
                                                                    {thumbSrc ? (
                                                                        <img src={thumbSrc} alt={item.name} className="w-full h-full object-contain p-1 rounded-xl" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                                                                    ) : (
                                                                        <Package className="w-4 h-4 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveItem(item._id)}
                                                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-40 group-hover/item:opacity-100"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-col mb-3">
                                                                <span className="text-[10px] font-black uppercase tracking-tight text-foreground line-clamp-1">{item.name}</span>
                                                                <span className="text-[8px] font-bold text-muted-foreground uppercase">₹{formatPrice(item.price)} each</span>
                                                            </div>
                                                            <div className="flex items-center justify-between mt-auto bg-background/50 rounded-xl p-1 border border-border">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQtyChange(item._id, -1)}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-card hover:bg-red-500/10 text-red-500 transition-all border border-border/50 shadow-sm"
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </button>
                                                                <span className="text-xs font-black min-w-[1.5rem] text-center">{quantity}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQtyChange(item._id, 1)}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-card hover:bg-racing-blue/10 text-racing-blue transition-all border border-border/50 shadow-sm"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-8 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center opacity-60">
                                                <Package className="w-8 h-8 text-muted-foreground mb-3" />
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No spares selected yet</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Spare Picker Popover (Booking Form version) */}
                                {showSparePicker && (
                                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowSparePicker(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-[2.5rem] p-8 max-h-[80vh] flex flex-col"
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h4 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">SELECT <span className="text-gradient">SPARE</span></h4>
                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Add genuine parts to your service booking</p>
                                                </div>
                                                <button onClick={() => setShowSparePicker(false)} className="p-2.5 bg-muted hover:bg-racing-blue hover:text-white rounded-xl transition-all"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                                            </div>

                                            <div className="relative mb-6">
                                                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    placeholder="Search spares..."
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-xs font-bold text-foreground focus:border-racing-blue outline-none"
                                                    value={spareSearchQuery}
                                                    onChange={(e) => setSpareSearchQuery(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                                {spares.filter(s => s.name.toLowerCase().includes(spareSearchQuery.toLowerCase())).map((spare) => {
                                                    const thumbSrc = spare.image
                                                        ? (spare.image.startsWith('/uploads') ? `${API_BASE_URL}${spare.image}` : spare.image)
                                                        : null;
                                                    return (
                                                        <button
                                                            key={spare._id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (spare.stock === 0) {
                                                                    handleDemandRestock(spare._id);
                                                                    return;
                                                                }
                                                                const entry = cart[spare._id];
                                                                if (entry) {
                                                                    if (entry.quantity >= spare.stock) {
                                                                        setBlinkingId(spare._id);
                                                                        setTimeout(() => setBlinkingId(null), 1000);
                                                                        return;
                                                                    }
                                                                    const newCart = { ...cart };
                                                                    newCart[spare._id] = {
                                                                        ...entry,
                                                                        quantity: entry.quantity + 1
                                                                    };
                                                                    updateCart(newCart);
                                                                } else {
                                                                    const newCart = { ...cart };
                                                                    newCart[spare._id] = {
                                                                        item: spare,
                                                                        quantity: 1
                                                                    };
                                                                    updateCart(newCart);
                                                                }
                                                            }}
                                                            className={cn(
                                                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all group/item border relative hover:z-50",
                                                                spare.stock === 0
                                                                    ? (demandedIds.includes(spare._id) ? "bg-muted/30 border-border opacity-60 cursor-not-allowed" : "bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40")
                                                                    : (blinkingId === spare._id ? "bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] scale-[1.02]" : "bg-muted/20 hover:bg-racing-blue/5 border-border hover:border-racing-blue/30")
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3 text-left">
                                                                {/* Thumbnail */}
                                                                <div 
                                                                    className="relative w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 cursor-zoom-in"
                                                                    onMouseEnter={(e) => {
                                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                                        thumbSrc && setHoveredImage(thumbSrc);
                                                                        setHoverPos({ x: rect.right + 20, y: rect.top });
                                                                    }}
                                                                    onMouseLeave={() => setHoveredImage(null)}
                                                                >
                                                                    {thumbSrc ? (
                                                                        <img
                                                                            src={thumbSrc}
                                                                            alt={spare.name}
                                                                            className="w-full h-full object-contain p-1 rounded-xl"
                                                                            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                                                                        />
                                                                    ) : (
                                                                        <Package className="w-5 h-5 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <span className={cn(
                                                                            "text-xs font-black uppercase tracking-tight transition-colors",
                                                                            spare.stock === 0 ? "text-red-500" : "text-foreground group-hover/item:text-racing-blue"
                                                                        )}>
                                                                            {spare.name}
                                                                        </span>
                                                                        {spare.stock === 0 && (
                                                                            <span className="text-[7px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-sm">OUT OF STOCK</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                                                        {spare.category} • ₹{formatPrice(spare.price)}
                                                                        {spare.stock > 0 && ` • ${spare.stock} in stock`}
                                                                        {cart[spare._id] && ` • ${cart[spare._id].quantity} added`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className={cn(
                                                                "p-2 rounded-lg transition-all shrink-0",
                                                                spare.stock === 0
                                                                    ? (demandedIds.includes(spare._id) ? "bg-muted text-muted-foreground" : "bg-red-500 text-white shadow-lg shadow-red-500/20")
                                                                    : (cart[spare._id] ? "bg-racing-blue text-white opacity-100" : "bg-racing-blue/10 text-racing-blue opacity-0 group-hover/item:opacity-100")
                                                            )}>
                                                                {spare.stock === 0 ? (
                                                                    demandedIds.includes(spare._id) ? <UserCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />
                                                                ) : (
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-border flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSparePicker(false)}
                                                    className="px-8 py-4 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-racing-blue/20"
                                                >
                                                    Done Selection
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (serviceType.length === 0) {
                                            alert("Please select at least one service type.");
                                            return;
                                        }
                                        if (serviceType.includes("Spares") && cartItems.length === 0) {
                                            alert("You selected Genuine Spares. Please add at least one spare part or unselect Spares.");
                                            return;
                                        }
                                        setStep(2);
                                    }}
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                                        serviceType.length === 0
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-racing-blue text-white shadow-lg shadow-racing-blue/20 hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    Select Vehicle Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {user && userBikes.length > 0 && (
                                    <div className="p-6 bg-racing-blue/5 border border-racing-blue/20 rounded-[2rem] mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-racing-blue/10 rounded-xl">
                                                <User className="w-4 h-4 text-racing-blue" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Select from Your Garage</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {userBikes.map((bike) => (
                                                <button
                                                    key={bike._id}
                                                    type="button"
                                                    onClick={() => setFormData(p => ({
                                                        ...p,
                                                        bikeModel: bike.bikeModel,
                                                        regNumber: bike.registrationNumber,
                                                        chassisNumber: bike.chassisNumber || ""
                                                    }))}
                                                    className={cn(
                                                        "p-4 rounded-xl border text-left transition-all",
                                                        formData.regNumber === bike.registrationNumber
                                                            ? "bg-racing-blue border-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                                            : "bg-background border-border text-muted-foreground hover:border-racing-blue/30"
                                                    )}
                                                >
                                                    <p className="text-[10px] font-black uppercase tracking-tight mb-1">{bike.bikeModel}</p>
                                                    <p className={cn(
                                                        "text-[8px] font-bold uppercase",
                                                        bike.registrationNumber ? "opacity-70" : "text-racing-blue"
                                                    )}>
                                                        {bike.registrationNumber || "Registration Pending"}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Bike Model</label>
                                            <input
                                                required
                                                value={formData.bikeModel}
                                                onChange={(e) => setFormData(p => ({ ...p, bikeModel: e.target.value }))}
                                                placeholder="e.g. R15M V4"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration Number</label>
                                                {!formData.regNumber && <span className="text-[8px] font-black text-racing-blue/60 uppercase tracking-widest bg-racing-blue/5 px-2 py-0.5 rounded-full">Optional for New Bikes</span>}
                                            </div>
                                            <input
                                                value={formData.regNumber}
                                                onChange={(e) => setFormData(p => ({ ...p, regNumber: e.target.value }))}
                                                placeholder="e.g. BR 11 XY 0000"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Chassis Number</label>
                                            <input
                                                value={formData.chassisNumber}
                                                onChange={(e) => setFormData(p => ({ ...p, chassisNumber: e.target.value }))}
                                                placeholder="Vehicle Chassis ID (Optional)"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Additional Notes</label>
                                            <input
                                                value={formData.notes}
                                                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                                                placeholder="Any specific issues?"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all font-medium italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="py-5 bg-muted text-foreground border border-border rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-muted/80 transition-all w-full"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!formData.bikeModel) {
                                                alert("Please select or enter your bike model.");
                                                return;
                                            }
                                            setStep(3);
                                        }}
                                        className={cn(
                                            "py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 w-full",
                                            !formData.bikeModel
                                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                : "bg-racing-blue text-white shadow-lg shadow-racing-blue/20 hover:scale-[1.02] active:scale-[0.98]"
                                        )}
                                    >
                                        Next: Date & Time <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                            placeholder="Your Name"
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            maxLength={10}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                if (val.length <= 10) {
                                                    setFormData(p => ({ ...p, phone: val }));
                                                }
                                            }}
                                            placeholder="10-digit mobile number"
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Preferred Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.appointmentDate}
                                            onChange={(e) => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-racing-blue transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Select Time Slot</label>
                                        {!formData.appointmentDate ? (
                                            <div className="p-8 border border-dashed border-border rounded-3xl text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Please select a date first</p>
                                            </div>
                                        ) : loadingSlots ? (
                                            <div className="grid grid-cols-3 gap-3">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {STANDARD_SLOTS.map(time => {
                                                    const slotInfo = availableSlots.find(s => s.slotTime === time);
                                                    const capacity = slotInfo?.capacity ?? defaultCapacity;
                                                    const bookedCount = slotInfo?.bookedCount ?? 0;
                                                    const isFull = bookedCount >= capacity;
                                                    const isSelected = formData.appointmentTime === time;

                                                    return (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            disabled={isFull}
                                                            onClick={() => setFormData(p => ({ ...p, appointmentTime: time }))}
                                                            className={cn(
                                                                "relative p-4 rounded-xl border transition-all text-center group",
                                                                isSelected
                                                                    ? "bg-racing-blue border-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                                                    : isFull
                                                                        ? "bg-muted/50 border-border opacity-50 cursor-not-allowed"
                                                                        : "bg-background border-border hover:border-racing-blue/50"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "text-[12px] font-black uppercase tracking-tight mb-1",
                                                                isSelected ? "text-white" : "text-foreground"
                                                            )}>
                                                                {time}
                                                            </div>
                                                            <div className={cn(
                                                                "text-[8px] font-bold uppercase tracking-widest",
                                                                isSelected ? "text-white/70" : isFull ? "text-red-500" : "text-racing-blue"
                                                            )}>
                                                                {isFull ? "Fully Booked" : `${capacity - bookedCount} Slots Left`}
                                                            </div>
                                                            {isSelected && (
                                                                <motion.div
                                                                    layoutId="activeSlot"
                                                                    className="absolute inset-0 border-2 border-white/20 rounded-xl"
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="py-5 bg-muted text-foreground border border-border rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-muted/80 transition-all w-full"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={cn(
                                            "py-5 bg-racing-blue text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-lg shadow-racing-blue/20 transition-all flex items-center justify-center gap-2 w-full",
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                                        )}
                                    >
                                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                                    </button>
                                </div>
                                <div className="p-6 bg-racing-blue/10 border border-racing-blue/20 rounded-2xl">
                                    <div className="flex items-center gap-3 text-foreground mb-2">
                                        <Clock className="w-4 h-4 text-racing-blue" />
                                        <span className="text-xs font-black uppercase tracking-widest">Fast Track Protocol</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                        Our workshop manager will call you within 24 hours of submission to confirm your preferred time slot and pickup options.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Global Hover Preview Portal-like Element */}
            <AnimatePresence>
                {hoveredImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed z-[9999] pointer-events-none flex items-center justify-center p-4 bg-card border border-border rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
                        style={{ 
                            width: '200px', 
                            height: '200px',
                            left: `${hoverPos.x}px`,
                            top: `${hoverPos.y}px`,
                        }}
                    >
                        <img src={hoveredImage} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
