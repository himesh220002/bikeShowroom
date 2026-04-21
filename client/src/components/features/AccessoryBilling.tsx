"use client";

import { useState, useEffect } from "react";
import { User, Phone, Package, Plus, Minus, Trash2, Search, IndianRupee, Loader2, Save, X, Bike, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";

interface AccessoryBillingProps {
    onSuccess?: () => void;
}

export default function AccessoryBilling({ onSuccess }: AccessoryBillingProps) {
    const [loading, setLoading] = useState(false);
    const [spares, setSpares] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        bikeModel: "General",
        regNumber: "N/A",
        items: [] as any[],
        cost: 0,
        notes: "Direct Accessory Sale"
    });

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchSpares = async () => {
            try {
                const res = await fetch(`${API_URL}/spares`);
                const data = await res.json();
                if (data.success) setSpares(data.data);
            } catch (err) {
                console.error("Failed to fetch spares:", err);
            }
        };
        fetchSpares();
    }, []);

    const calculateTotal = (items: any[]) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleAddItem = (spare: any) => {
        const existing = form.items.find(i => i.itemId === spare._id);
        let newItems;
        if (existing) {
            newItems = form.items.map(i => i.itemId === spare._id ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            newItems = [...form.items, {
                itemId: spare._id,
                name: spare.name,
                price: spare.price,
                quantity: 1,
                stock: spare.stock,
                itemType: (spare.category === 'Accessory' || !spare.bikeId || !['Engine', 'Transmission', 'Electrical'].includes(spare.category)) ? 'accessory' : 'spare'
            }];
        }
        setForm({ ...form, items: newItems, cost: calculateTotal(newItems) });
        setShowPicker(false);
    };

    const handleUpdateQty = (idx: number, delta: number) => {
        const newItems = [...form.items];
        newItems[idx].quantity = Math.max(1, newItems[idx].quantity + delta);
        setForm({ ...form, items: newItems, cost: calculateTotal(newItems) });
    };

    const handleRemoveItem = (idx: number) => {
        const newItems = form.items.filter((_, i) => i !== idx);
        setForm({ ...form, items: newItems, cost: calculateTotal(newItems) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.items.length === 0) {
            alert("Please add at least one item.");
            return;
        }
        setLoading(true);
        setStatus('idle');
        try {
            const res = await fetch(`${API_URL}/services`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    serviceType: "Accessory Sale",
                    status: "delivered", // Mark as completed/delivered instantly
                    appointmentDate: new Date().toISOString().split('T')[0],
                    appointmentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setForm({
                    name: "",
                    phone: "",
                    bikeModel: "General",
                    regNumber: "N/A",
                    items: [],
                    cost: 0,
                    notes: "Direct Accessory Sale"
                });
                if (onSuccess) onSuccess();
            } else {
                setErrorMessage(data.message || "Failed to process billing");
                setStatus('error');
            }
        } catch (err) {
            setErrorMessage("Connection error. Please try again.");
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const filteredSpares = spares.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.bikeIds?.some((b: any) => b.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50" />

                <div className="p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">
                                INSTANT <span className="text-gradient-orange">ACCESSORY BILLING</span>
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Direct sales portal for spares and accessories</p>
                        </div>
                        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
                            <Plus className="w-5 h-5" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-3xl border border-border/50">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Enter full name"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="10-digit mobile"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Billed Items
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => setShowPicker(true)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                                >
                                    <Search className="w-3.5 h-3.5" /> Find Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {form.items.length === 0 ? (
                                    <div className="py-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                        <Package className="w-10 h-10 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No items added to bill</p>
                                    </div>
                                ) : (
                                    form.items.map((item, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-muted/10 border border-border rounded-2xl group"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-display font-black text-foreground uppercase tracking-tight">{item.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">₹{item.price} • {item.itemType}</span>
                                                    {item.quantity > item.stock && (
                                                        <span className="text-[8px] font-black bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                                                            Low Stock: {item.stock} Avail.
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-3 bg-background border border-border p-1 rounded-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQty(idx, -1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQty(idx, 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-emerald-500 hover:text-white transition-all"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="w-24 text-right">
                                                    <span className="text-sm font-display font-black text-foreground">₹{item.price * item.quantity}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Total & Action */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-border">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Grand Total</span>
                                <div className="flex items-center gap-2 text-3xl font-display font-black text-orange-500 italic tracking-tighter">
                                    <IndianRupee className="w-6 h-6" />
                                    {form.cost}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button
                                    type="submit"
                                    disabled={loading || form.items.length === 0}
                                    className="flex-1 md:flex-none px-12 py-5 bg-orange-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {loading ? "PROCESSING..." : "FINALIZE & BILL"}
                                </button>
                            </div>
                        </div>

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3 text-emerald-600 font-bold text-xs uppercase tracking-widest"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Bill Generated Successfully & Stock Updated!
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-600 font-bold text-xs uppercase tracking-widest"
                            >
                                <X className="w-5 h-5" />
                                {errorMessage}
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>

            {/* Picker Modal */}
            <AnimatePresence>
                {showPicker && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPicker(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">
                                        SELECT <span className="text-orange-500">ITEM</span>
                                    </h3>
                                    <button onClick={() => setShowPicker(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search part name or category..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-orange-500 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
                                    {filteredSpares.map((spare) => (
                                        <button
                                            key={spare._id}
                                            onClick={() => handleAddItem(spare)}
                                            className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-orange-500/5 border border-border rounded-2xl transition-all group/item hover:border-orange-500/30"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-orange-500/50" />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-xs font-black uppercase tracking-tight text-foreground block group-hover/item:text-orange-500 transition-colors">{spare.name}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                        {spare.category} • {spare.bikeIds && spare.bikeIds.length > 0
                                                            ? (spare.bikeIds.length > 1 ? `${spare.bikeIds[0].name} +${spare.bikeIds.length - 1}` : spare.bikeIds[0].name)
                                                            : "All Bikes"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-display font-black text-foreground">₹{spare.price}</span>
                                                <span className={cn("text-[8px] font-black uppercase tracking-widest", spare.stock > 0 ? "text-emerald-500" : "text-red-500")}>
                                                    {spare.stock > 0 ? `In Stock: ${spare.stock}` : "Out of Stock"}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
