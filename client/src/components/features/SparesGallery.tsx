"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Package, Info, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import axios from "axios";
import { API_URL } from "@/lib/config";

export function SparesGallery() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [selectedBike, setSelectedBike] = useState<any | null>(null);
    const [spares, setSpares] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Fetch bikes for selection
        axios.get(`${API_URL}/bikes`)
            .then(res => {
                if (res.data.success) {
                    const fetchedBikes = res.data.data;
                    setBikes(fetchedBikes);
                    // Default to 'Common Spares' if it exists or define a placeholder
                    setSelectedBike({ _id: 'common', name: 'Common Spares' });
                }
            })
            .catch(err => console.error("Failed to fetch bikes:", err));
    }, []);

    useEffect(() => {
        if (selectedBike) {
            setLoading(true);
            const url = selectedBike._id === 'common'
                ? `${API_URL}/spares?bikeId=common`
                : `${API_URL}/spares?bikeId=${selectedBike._id}`;

            axios.get(url)
                .then(res => {
                    if (res.data.success) setSpares(res.data.data);
                })
                .catch(err => console.error("Failed to fetch spares:", err))
                .finally(() => setLoading(false));
        }
    }, [selectedBike]);

    const filteredSpares = spares.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12">
            {/* Selection Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-racing-blue/10 flex items-center justify-center border border-racing-blue/20">
                            <Package className="w-6 h-6 text-racing-blue" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-black text-foreground uppercase tracking-tighter italic">
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
                                value={selectedBike?._id || 'common'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'common') setSelectedBike({ _id: 'common', name: 'Common Spares' });
                                    else {
                                        const bike = bikes.find(b => b._id === val);
                                        if (bike) setSelectedBike(bike);
                                    }
                                }}
                                className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none cursor-pointer hover:bg-muted"
                            >
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
                            className="w-full bg-muted/50 border border-border rounded-2xl pl-12 pr-6 py-4 text-sm text-foreground focus:outline-none focus:border-racing-blue transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Spares Grid Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tight">
                            Viewing: <span className="text-racing-blue">{selectedBike?.name}</span>
                        </h3>
                    </div>
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
                                            {spare.status === 'Out of Stock' && (
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
                                                <span className="text-sm font-display font-black text-foreground italic tracking-tighter">₹ {spare.price}</span>
                                            </div>
                                            <h4 className="text-lg font-display font-black text-foreground uppercase tracking-tight mb-2 group-hover:text-racing-blue transition-colors">
                                                {spare.name}
                                            </h4>
                                            <p className="text-[12px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                                {spare.description}
                                            </p>
                                        </div>

                                        <button
                                            disabled={spare.status === 'Out of Stock'}
                                            className="w-full py-4 bg-muted hover:bg-racing-blue text-foreground hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                        >
                                            <Info className="w-4 h-4 opacity-50 group-hover/btn:opacity-100" />
                                            Request Quote
                                        </button>
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
                                <h4 className="text-lg font-display font-black text-foreground uppercase tracking-tight">No Spares Found</h4>
                                <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto mt-2">Try adjusting your search or selecting a different model</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
