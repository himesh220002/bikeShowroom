"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Search, Filter, Loader2 } from "lucide-react";

export default function InventoryPage() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/bikes");
                const data = await res.json();
                if (data.success) setBikes(data.data);
            } catch (err) {
                console.error("Failed to fetch inventory:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBikes();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                        VEHICLE <span className="text-gradient">INVENTORY</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time stock management for Katihar showroom</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20">
                    <Plus className="w-4 h-4" />
                    Add Stock
                </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Syncing Inventory...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                        {bikes.map((bike) => (
                            <div key={bike._id} className="p-8 bg-zinc-900/50 border border-zinc-900 rounded-[2.5rem] shadow-2xl group hover:border-racing-blue/50 transition-all">
                                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Package className="w-6 h-6 text-racing-blue" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{bike.color}</h3>
                                <h4 className="text-xl font-display font-black text-white uppercase tracking-tighter mb-4">{bike.name}</h4>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 block">Current Stock</span>
                                        <span className="text-2xl font-display font-black text-white italic">{bike.stock}</span>
                                    </div>
                                    <span className="text-xs font-black text-racing-blue">₹ {bike.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
