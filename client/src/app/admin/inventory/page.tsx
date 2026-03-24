"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Loader2, Settings2, Trash2, Edit3 } from "lucide-react";
import io from "socket.io-client";
import { BikeEditModal } from "@/components/features/BikeEditModal";

const socket = io("http://localhost:5000");

export default function InventoryPage() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBike, setSelectedBike] = useState<any | null>(null);

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

    const handleSave = async (formData: any) => {
        const isEdit = !!formData._id;
        const url = isEdit
            ? `http://localhost:5000/api/bikes/${formData._id}`
            : "http://localhost:5000/api/bikes";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (data.success) {
            if (isEdit) {
                setBikes(prev => prev.map(b => b._id === data.data._id ? data.data : b));
            } else {
                setBikes(prev => [...prev, data.data]);
            }
        }
    };

    const deleteBike = async (id: string) => {
        if (!confirm("Are you sure you want to delete this model?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/bikes/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setBikes(prev => prev.filter(b => b._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete bike:", err);
        }
    };

    const motorcycles = bikes.filter(b => b.category === "bike");
    const scooters = bikes.filter(b => b.category === "scooty");

    const renderGrid = (items: any[], title: string) => (
        <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-racing-blue ml-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-racing-blue/30"></span>
                {title}
                <span className="px-2 py-0.5 bg-racing-blue/10 rounded text-[10px]">{items.length} Models</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((bike: any) => (
                    <div key={bike._id} className="p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl group hover:border-racing-blue/30 transition-all flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={() => { setSelectedBike(bike); setIsModalOpen(true); }}
                                className="p-2 bg-racing-blue text-white rounded-xl shadow-lg shadow-racing-blue/20"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteBike(bike._id)}
                                className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-background border border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
                                <Package className="w-6 h-6 text-racing-blue" />
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Variants</span>
                                <span className="text-3xl font-display font-black text-foreground italic tracking-tighter">{bike.colors.length} Colors</span>
                            </div>
                        </div>

                        <h4 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter mb-2 leading-none">
                            {bike.category === 'scooty' ? bike.name.replace('Yamaha ', '') : bike.name}
                        </h4>
                        <div className="inline-block px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[8px] font-black uppercase tracking-widest w-fit mb-6">
                            {bike.tag}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border/10 flex-1">
                            <div className="flex flex-wrap gap-2">
                                {bike.colors.map((color: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="px-2 py-1 rounded-lg bg-muted/50 border border-border/50 flex items-center gap-2"
                                        title={`${color.name}: ${color.stock} in stock`}
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full border border-black/10"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/70">{color.stock}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border/10 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Base Price</span>
                                <span className="text-lg font-display font-black text-foreground italic">₹ {bike.price}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Stock</span>
                                <span className="text-lg font-display font-black text-racing-blue italic">
                                    {bike.colors.reduce((acc: number, c: any) => acc + c.stock, 0)}
                                </span>
                            </div>
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
                    <h2 className="text-2xl font-display font-black text-gray-200 uppercase tracking-tighter">
                        VEHICLE <span className="text-gradient">INVENTORY</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Consolidated model-wise stock control</p>
                </div>
                <button
                    onClick={() => { setSelectedBike(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Model
                </button>
            </div>

            <div className="bg-background/90 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Inventory...</span>
                    </div>
                ) : (
                    <div className="p-8 space-y-20">
                        {motorcycles.length > 0 && renderGrid(motorcycles, "Motorcycles")}
                        {scooters.length > 0 && renderGrid(scooters, "Scooters & Maxi-Scooters")}
                    </div>
                )}
            </div>

            <BikeEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bike={selectedBike}
                onSave={handleSave}
            />
        </div>
    );
}
