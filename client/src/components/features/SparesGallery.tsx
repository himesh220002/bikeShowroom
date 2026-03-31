"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Package, Info, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import axios from "axios";

export function SparesGallery() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [selectedBike, setSelectedBike] = useState<any | null>(null);
    const [spares, setSpares] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Fetch bikes for selection
        axios.get("http://localhost:5000/api/bikes")
            .then(res => {
                if (res.data.success) {
                    setBikes(res.data.data);
                    // Select first bike by default if none selected
                    if (res.data.data.length > 0) setSelectedBike(res.data.data[0]);
                }
            })
            .catch(err => console.error("Failed to fetch bikes:", err));
    }, []);

    useEffect(() => {
        if (selectedBike) {
            setLoading(true);
            axios.get(`http://localhost:5000/api/spares?bikeId=${selectedBike._id}`)
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
            {/* Bike Selection Hub */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {bikes.map((bike) => (
                    <button
                        key={bike._id}
                        onClick={() => setSelectedBike(bike)}
                        className={cn(
                            "group p-4 rounded-3xl border transition-all flex flex-col items-center gap-3",
                            selectedBike?._id === bike._id
                                ? "bg-racing-blue/10 border-racing-blue shadow-lg shadow-racing-blue/10"
                                : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                        )}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-black/40 p-2 flex items-center justify-center overflow-hidden border border-zinc-800 group-hover:scale-110 transition-transform">
                            <img
                                src={bike.colors?.[0]?.image.startsWith('http') ? bike.colors[0].image : `${bike.colorBaseUrl || '/images/bikes/'}${bike.colors?.[0]?.image}`}
                                alt={bike.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest text-center leading-tight",
                            selectedBike?._id === bike._id ? "text-racing-blue" : "text-zinc-500 group-hover:text-zinc-300"
                        )}>
                            {bike.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Spares Grid Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                            GENUINE <span className="text-gradient">SPARES</span> FOR {selectedBike?.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1 italic">
                            Factory-certified components for maximum performance
                        </p>
                    </div>
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-racing-blue transition-colors" />
                        <input
                            placeholder="Search parts, oil, filters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-racing-blue transition-all"
                        />
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syncing Catalog...</span>
                            </motion.div>
                        ) : filteredSpares.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredSpares.map((spare) => (
                                    <div key={spare._id} className="group glass border border-white/5 rounded-[2.5rem] p-6 hover:border-racing-blue/30 transition-all flex flex-col">
                                        <div className="aspect-square rounded-3xl bg-black/40 border border-zinc-800/50 p-6 mb-6 overflow-hidden relative">
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
                                                <span className="text-sm font-display font-black text-white italic tracking-tighter">₹ {spare.price}</span>
                                            </div>
                                            <h4 className="text-lg font-display font-black text-white uppercase tracking-tight mb-2 group-hover:text-racing-blue transition-colors">
                                                {spare.name}
                                            </h4>
                                            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed line-clamp-2">
                                                {spare.description}
                                            </p>
                                        </div>

                                        <button
                                            disabled={spare.status === 'Out of Stock'}
                                            className="w-full py-4 bg-zinc-800/50 hover:bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed group/btn"
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
                                <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                <h4 className="text-lg font-display font-black text-white uppercase tracking-tight">No Spares Found</h4>
                                <p className="text-xs text-zinc-500 font-medium max-w-xs mx-auto mt-2">Try adjusting your search or selecting a different model</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
