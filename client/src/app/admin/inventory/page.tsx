"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Loader2 } from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function InventoryPage() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchBikes();

        socket.on("inventory_updated", (updatedBike: any) => {
            setBikes((prev) => prev.map(b => b._id === updatedBike._id ? updatedBike : b));
        });

        socket.on("inventory_synced", (newBikes: any[]) => {
            setBikes(newBikes);
        });

        return () => {
            socket.off("inventory_updated");
            socket.off("inventory_synced");
        };
    }, []);

    const updateStock = async (id: string, newStock: number) => {
        try {
            const res = await fetch(`http://localhost:5000/api/bikes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: newStock })
            });
            const data = await res.json();
            if (data.success) {
                setBikes(prev => prev.map(b => b._id === id ? data.data : b));
            }
        } catch (err) {
            console.error("Failed to update stock:", err);
        }
    };

    const motorcycles = bikes.filter(b => b.category === "bike");
    const scooters = bikes.filter(b => b.category === "scooty");

    const groupBikes = (items: any[]) => {
        const groups = items.reduce((acc: any, bike: any) => {
            const name = bike.name;
            if (!acc[name]) {
                acc[name] = {
                    name,
                    category: bike.category,
                    totalStock: 0,
                    variants: []
                };
            }
            acc[name].totalStock += bike.stock;
            acc[name].variants.push(bike);
            return acc;
        }, {});
        return Object.values(groups);
    };

    const groupedMotorcycles = groupBikes(motorcycles);
    const groupedScooters = groupBikes(scooters);

    const renderGrid = (groups: any[], title: string) => (
        <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-racing-blue ml-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-racing-blue/30"></span>
                {title}
                <span className="px-2 py-0.5 bg-racing-blue/10 rounded text-[10px]">{groups.length} Models</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group: any) => (
                    <div key={group.name} className="p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl group hover:border-racing-blue/30 transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-background border border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6 text-racing-blue" />
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Total Stock</span>
                                <span className="text-3xl font-display font-black text-foreground italic tracking-tighter">{group.totalStock}</span>
                            </div>
                        </div>

                        <h4 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter mb-6 leading-none">
                            {group.category === 'scooty' ? group.name.replace('Yamaha ', '') : group.name}
                        </h4>

                        <div className="space-y-4 pt-6 border-t border-border/10">
                            {group.variants.map((variant: any) => (
                                <div key={variant._id} className="flex items-center justify-between group/variant">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{variant.color}</span>
                                        <span className="text-[8px] text-muted-foreground/60 font-bold uppercase tracking-widest">{variant.variant}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border">
                                            <button
                                                onClick={() => updateStock(variant._id, Math.max(0, variant.stock - 1))}
                                                className="w-6 h-6 rounded-md text-racing-blue hover:bg-muted flex items-center justify-center transition-colors text-xs font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-display font-black text-foreground italic min-w-[2ch] text-center">{variant.stock}</span>
                                            <button
                                                onClick={() => updateStock(variant._id, variant.stock + 1)}
                                                className="w-6 h-6 rounded-md text-racing-blue hover:bg-muted flex items-center justify-center transition-colors text-xs font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                        VEHICLE <span className="text-gradient">INVENTORY</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Consolidated model-wise stock control</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20">
                    <Plus className="w-4 h-4" />
                    Add Stock
                </button>
            </div>

            <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Inventory...</span>
                    </div>
                ) : (
                    <div className="p-8 space-y-20">
                        {groupedMotorcycles.length > 0 && renderGrid(groupedMotorcycles, "Motorcycles")}
                        {groupedScooters.length > 0 && renderGrid(groupedScooters, "Scooters & Maxi-Scooters")}
                    </div>
                )}
            </div>
        </div>
    );
}
