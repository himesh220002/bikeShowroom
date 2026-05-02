"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Package, Info, ShoppingCart, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { submitServiceBooking } from "@/lib/actions/serviceActions";

import { formatPrice } from "@/lib/utils/price";

export function SparesGallery() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [selectedBike, setSelectedBike] = useState<any | null>(null);
    const [spares, setSpares] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<{ [id: string]: { item: any, quantity: number } }>({});
    const [blinkingId, setBlinkingId] = useState<string | null>(null);
    const [demandedIds, setDemandedIds] = useState<string[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('spares_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('spares_cart', JSON.stringify(cart));
        // Dispatch a custom event to notify ServiceBooking if it's on the same page
        window.dispatchEvent(new Event('spares_cart_updated'));
    }, [cart]);

    const addToCart = (item: any) => {
        const currentQty = cart[item._id]?.quantity || 0;
        if (currentQty >= item.stock) {
            setBlinkingId(item._id);
            setTimeout(() => setBlinkingId(null), 1000);
            return;
        }
        setCart(prev => ({
            ...prev,
            [item._id]: {
                item,
                quantity: currentQty + 1
            }
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => {
            if (!prev[id]) return prev;
            const newCart = { ...prev };
            if (newCart[id].quantity > 1) {
                newCart[id].quantity -= 1;
            } else {
                delete newCart[id];
            }
            return newCart;
        });
    };

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

    const cartCount = Object.values(cart).reduce((sum, entry) => sum + entry.quantity, 0);
    const cartTotal = Object.values(cart).reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);

    useEffect(() => {
        // Fetch bikes for selection
        axios.get(`${API_URL}/bikes`)
            .then(res => {
                const data = res.data as any;
                if (data.success) {
                    const fetchedBikes = data.data;
                    setBikes(fetchedBikes);
                    // Default to 'Common Spares' if it exists or define a placeholder
                    setSelectedBike({ _id: 'all', name: 'All Genuine Spares & Accessories' });
                }
            })
            .catch(err => console.error("Failed to fetch bikes:", err));
    }, []);

    useEffect(() => {
        if (selectedBike) {
            setLoading(true);
            let url = `${API_URL}/spares`;
            if (selectedBike._id === 'all') {
                url = `${API_URL}/spares`;
            } else if (selectedBike._id === 'common') {
                url = `${API_URL}/spares?bikeId=common`;
            } else {
                url = `${API_URL}/spares?bikeId=${selectedBike._id}`;
            }

            axios.get(url)
                .then(res => {
                    const data = res.data as any;
                    if (data.success) setSpares(data.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch spares:", err);
                    setLoading(false);
                });
        }
    }, [selectedBike]);

    const sortedSpares = [...spares].sort((a, b) => {
        const subA = a.subCategory || "ZZZ"; // Put items without subCategory at the end
        const subB = b.subCategory || "ZZZ";
        return subA.localeCompare(subB);
    });

    const filteredSpares = sortedSpares.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.bikeIds?.some((b: any) => b.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="w-full space-y-12">
            {/* Selection Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-racing-blue/10 flex items-center justify-center border border-racing-blue/20">
                            <Package className="w-6 h-6 text-racing-blue" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter italic">
                                Genuine <span className="text-gradient">Spares</span>
                            </h2>
                            <p className="text-[8px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1">
                                Factory certified performance parts
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Your Machine</label>
                        <div className="relative group w-full sm:max-w-[350px]">
                            <select
                                value={selectedBike?._id || 'all'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'all') setSelectedBike({ _id: 'all', name: 'All Available Spares' });
                                    else if (val === 'common') setSelectedBike({ _id: 'common', name: 'Common Spares' });
                                    else {
                                        const bike = bikes.find(b => b._id === val);
                                        if (bike) setSelectedBike(bike);
                                    }
                                }}
                                className="w-full bg-muted/80 border border-border rounded-2xl px-6 py-4 text-sm text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none cursor-pointer hover:bg-muted"
                            >
                                <option value="all">All Genuine Spares & Accessories</option>
                                <option value="common">Common & Universal Spares (Oils, Filters etc.)</option>

                                <optgroup label="Bikes & Scooters">
                                    {bikes.map(bike => (
                                        <option key={bike._id} value={bike._id}>{bike.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-racing-blue transition-colors">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:max-w-[320px]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Catalog</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                        <input
                            placeholder="Search parts, oil, filters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/80 border border-border rounded-2xl pl-12 pr-6 py-4 text-sm text-foreground focus:outline-none focus:border-racing-blue transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Spares Grid Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                            Viewing: <span className="text-racing-blue">{selectedBike?.name}</span>
                        </h3>
                    </div>
                    {cartCount > 0 && (
                        <div className="flex-shrink-0 bg-racing-blue/10 border border-racing-blue/20 rounded-2xl px-6 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-widest text-racing-blue leading-none mb-1">Cart Summary</span>
                                <span className="text-sm font-display font-black text-white italic tracking-tighter line-clamp-1">
                                    {cartCount} Items • ₹{formatPrice(cartTotal)}
                                </span>
                            </div>
                            <button
                                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                                className="p-2.5 bg-racing-blue text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-racing-blue/20"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="min-h-[400px] relative">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                            >
                                <div className="w-10 h-10 border-2 border-racing-blue/20 border-t-racing-blue rounded-full animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Catalog...</span>
                            </motion.div>
                        ) : filteredSpares.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredSpares.map((spare) => (
                                    <div key={spare._id} className="group border border-border bg-card rounded-[1.5rem] p-3 hover:border-racing-blue/30 transition-all flex flex-col">
                                        <div className="aspect-square rounded-3xl bg-muted/30 border border-border p-0 mb-6 overflow-hidden relative">
                                            <img
                                                src={spare.image}
                                                alt={spare.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {spare.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500/50 px-4 py-2 rounded-full">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-6 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-racing-blue bg-racing-blue/10 px-3 py-1 rounded-full">
                                                    {spare.category}
                                                </span>
                                                <span className="text-sm font-display font-black text-foreground italic tracking-tighter">₹ {formatPrice(spare.price)}</span>
                                            </div>
                                            <h4 className="text-xl font-display font-black text-foreground tracking-tight mb-2 group-hover:text-racing-blue transition-colors">
                                                {spare.name}
                                            </h4>
                                            <p className="text-[12px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                                {spare.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto">
                                            {spare.stock === 0 ? (
                                                <button
                                                    onClick={() => handleDemandRestock(spare._id)}
                                                    disabled={demandedIds.includes(spare._id)}
                                                    className={cn(
                                                        "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg",
                                                        demandedIds.includes(spare._id)
                                                            ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                                                            : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 active:scale-95"
                                                    )}
                                                >
                                                    {demandedIds.includes(spare._id) ? "RESTOCK DEMANDED" : "DEMAND RESTOCK"}
                                                </button>
                                            ) : cart[spare._id] ? (
                                                <motion.div
                                                    animate={blinkingId === spare._id ? {
                                                        borderColor: ['rgba(255,0,0,0.2)', 'rgba(255,0,0,0.8)', 'rgba(255,0,0,0.2)'],
                                                        backgroundColor: ['rgba(255,0,0,0)', 'rgba(255,0,0,0.05)', 'rgba(255,0,0,0)']
                                                    } : {}}
                                                    transition={{ duration: 0.2, repeat: blinkingId === spare._id ? 5 : 0 }}
                                                    className={cn(
                                                        "flex items-center gap-2 bg-racing-blue/5 rounded-2xl p-1 border border-racing-blue/20",
                                                        blinkingId === spare._id && "border-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                                    )}
                                                >
                                                    <button
                                                        onClick={() => removeFromCart(spare._id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-muted hover:bg-red-500/10 text-foreground hover:text-red-500 rounded-xl transition-all"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <div className="flex-1 text-center flex flex-col">
                                                        <span className="text-xs font-black text-foreground">{cart[spare._id].quantity}</span>
                                                        <span className="text-[7px] font-bold text-muted-foreground uppercase">of {spare.stock}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(spare)}
                                                        disabled={cart[spare._id].quantity >= spare.stock}
                                                        className={cn(
                                                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                                                            cart[spare._id].quantity >= spare.stock
                                                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                                : "bg-racing-blue text-white hover:scale-105"
                                                        )}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(spare)}
                                                    className="w-full py-4 bg-muted hover:bg-racing-blue text-foreground hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group/btn border border-border hover:border-racing-blue shadow-lg shadow-black/5"
                                                >
                                                    <div className="p-1.5 bg-background group-hover/btn:bg-white/20 rounded-lg transition-colors">
                                                        <ShoppingCart className="w-3.5 h-3.5" />
                                                    </div>
                                                    Add to Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center"
                            >
                                <Package className="w-12 h-12 text-muted mx-auto mb-4" />
                                <h4 className="text-lg font-display font-black text-gray-400 uppercase tracking-tight">No Spares Found</h4>
                                <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto mt-2">Try adjusting your search or selecting a different model</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
