"use client";

import { useEffect, useState, useMemo } from "react";
import { Package, Plus, Minus, Loader2, Settings2, Trash2, Edit3, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AdminTableControls } from "@/components/ui/AdminTableControls";
import io from "socket.io-client";
import { API_BASE_URL, API_URL } from "@/lib/config";
import { BikeEditModal } from "@/components/features/BikeEditModal";
import { SpareEditModal } from "@/components/features/SpareEditModal";
import { BikeImage } from "@/components/ui/BikeImage";
import { cleanImageUrl } from "@/lib/utils/url";
import { ExportButton } from "@/components/ui/ExportButton";
import { formatPrice } from "@/lib/utils/price";

const socket = io(API_BASE_URL);

export default function InventoryPage() {
    const [bikes, setBikes] = useState<any[]>([]);
    const [spares, setSpares] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"bikes" | "spares">("bikes");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBike, setSelectedBike] = useState<any | null>(null);
    const [selectedSpare, setSelectedSpare] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const fetchInventory = async () => {
        try {
            const [bikesRes, sparesRes] = await Promise.all([
                fetch(`${API_URL}/bikes`),
                fetch(`${API_URL}/spares`)
            ]);
            const bikesData = await bikesRes.json();
            const sparesData = await sparesRes.json();
            if (bikesData.success) setBikes(bikesData.data);
            if (sparesData.success) setSpares(sparesData.data);
        } catch (err) {
            console.error("Failed to fetch inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();

        socket.on("inventory_updated", (updatedBike: any) => {
            setBikes((prev) => prev.map(b => b._id === updatedBike._id ? updatedBike : b));
        });

        socket.on("inventory_synced", (newBikes: any[]) => {
            setBikes(newBikes);
        });

        socket.on("spares_updated", (newSpares: any[]) => {
            setSpares(newSpares);
        });

        return () => {
            socket.off("inventory_updated");
            socket.off("inventory_synced");
            socket.off("spares_updated");
        };
    }, []);

    const handleSaveBike = async (formData: any) => {
        const isEdit = !!formData._id;
        const url = isEdit
            ? `${API_URL}/bikes/${formData._id}`
            : `${API_URL}/bikes`;

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (data.success) {
            fetchInventory(); // Refresh all
        }
    };

    const handleSaveSpare = async (formData: any) => {
        const isEdit = !!formData._id;
        const url = isEdit
            ? `${API_URL}/spares/${formData._id}`
            : `${API_URL}/spares`;

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (data.success) {
            fetchInventory(); // Refresh all
        }
    };

    const deleteBike = async (id: string) => {
        if (!confirm("Are you sure you want to delete this model?")) return;
        try {
            const res = await fetch(`${API_URL}/bikes/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) fetchInventory();
        } catch (err) {
            console.error("Failed to delete bike:", err);
        }
    };

    const deleteSpare = async (id: string) => {
        if (!confirm("Are you sure you want to delete this spare part?")) return;
        try {
            const res = await fetch(`${API_URL}/spares/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) fetchInventory();
        } catch (err) {
            console.error("Failed to delete spare:", err);
        }
    };

    const handleStockChange = async (bikeId: string, colorIndex: number, delta: number, variantIndex?: number) => {
        const bike = bikes.find(b => b._id === bikeId);
        if (!bike) return;

        let updatedBike = { ...bike };
        if (variantIndex !== undefined) {
            const updatedVariants = [...bike.variants];
            const updatedColors = [...updatedVariants[variantIndex].colors];
            const currentStock = updatedColors[colorIndex].stock || 0;
            const newStock = Math.max(0, currentStock + delta);
            if (newStock === currentStock) return;
            updatedColors[colorIndex] = { ...updatedColors[colorIndex], stock: newStock };
            updatedVariants[variantIndex] = { ...updatedVariants[variantIndex], colors: updatedColors };
            updatedBike.variants = updatedVariants;
        } else {
            const updatedColors = [...bike.colors];
            const currentStock = updatedColors[colorIndex].stock || 0;
            const newStock = Math.max(0, currentStock + delta);
            if (newStock === currentStock) return;
            updatedColors[colorIndex] = { ...updatedColors[colorIndex], stock: newStock };
            updatedBike.colors = updatedColors;
        }

        // Optimistic UI update
        setBikes(prev => prev.map(b => b._id === bikeId ? updatedBike : b));

        try {
            const res = await fetch(`${API_URL}/bikes/${bikeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBike)
            });
            const data = await res.json();
            if (!data.success) {
                // Revert on failure
                fetchInventory();
            }
        } catch (err) {
            console.error("Failed to update stock:", err);
            fetchInventory();
        }
    };

    const processedBikes = useMemo(() => {
        let filtered = [...bikes];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.name.toLowerCase().includes(q) ||
                b.tag.toLowerCase().includes(q) ||
                b.category.toLowerCase().includes(q)
            );
        }
        return filtered.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
            if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
            return 0;
        });
    }, [bikes, searchQuery, sortBy]);

    const motorcycles = processedBikes.filter(b => b.category === "bike");
    const scooters = processedBikes.filter(b => b.category === "scooty");

    const renderGrid = (items: any[], title: string) => (
        <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-racing-blue ml-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-racing-blue/30"></span>
                {title}
                <span className="px-2 py-0.5 bg-racing-blue/10 rounded text-[10px]">{items.length} Models</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((bike: any) => {
                    const hasVariants = bike.variants && bike.variants.length > 0;
                    const baseStock = hasVariants ? 0 : bike.colors.reduce((acc: number, c: any) => acc + (c.stock || 0), 0);
                    const variantStock = bike.variants?.reduce((acc: number, v: any) =>
                        acc + v.colors.reduce((cAcc: number, c: any) => cAcc + (c.stock || 0), 0), 0) || 0;
                    const totalStock = baseStock + variantStock;
                    return (
                        <div
                            key={bike._id}
                            className={cn(
                                "p-8 bg-card border-1 border-border rounded-[1.5rem] shadow-2xl group hover:border-racing-blue/30 transition-all flex flex-col relative overflow-hidden",
                                totalStock < 3 ? totalStock == 0 ? "border-t-4 border-x-0 border-b-0 border-red-500 hover:border-red-500/90" : "border-t-4 border-x-0 border-b-0 border-red-300 hover:border-red-300/90" : ""
                            )}
                        >
                            <div className="absolute top-0 right-0 p-2 xl:p-6 flex gap-2 translate-y-1 opacity-70 xl:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-10">
                                <button
                                    onClick={() => { setSelectedBike(bike); setIsModalOpen(true); }}
                                    className="p-2 bg-racing-blue text-white rounded-xl shadow-lg shadow-racing-blue/20"
                                >
                                    <Edit3 className="lg:w-4 w-3 h-3 lg:h-4" />
                                </button>
                                <button
                                    onClick={() => deleteBike(bike._id)}
                                    className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20"
                                >
                                    <Trash2 className="lg:w-4 w-3 h-3 lg:h-4" />
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <div className="w-20 h-20 bg-background border border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5 overflow-hidden p-1">
                                    {bike.colors && bike.colors.length > 0 ? (
                                        <BikeImage
                                            src={(() => {
                                                const img = cleanImageUrl(bike.colors[0].image);
                                                if (img.startsWith('http') || img.startsWith('/')) return img;
                                                // Prevent double 'images/' if paths are inconsistent
                                                const cleanImg = img.startsWith('images/') ? img.replace('images/', '') : img;
                                                return `${cleanImageUrl(bike.colorBaseUrl) || '/images/bikes/'}${cleanImg}`;
                                            })()}
                                            alt={bike.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Package className="w-6 h-6 text-racing-blue" />
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Total Stock</span>
                                    <span className="text-2xl font-display font-black text-racing-blue italic tracking-tighter">
                                        {totalStock}
                                    </span>
                                </div>
                            </div>

                            <h4 className="text-2xl font-display font-black text-foreground  tracking-tighter mb-2 leading-none">
                                {bike.category === 'scooty' ? bike.name.replace('Yamaha ', '') : bike.name}
                            </h4>
                            <div className="inline-block px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[8px] font-black uppercase tracking-widest w-fit mb-6">
                                {bike.tag}
                            </div>

                            <div className="space-y-4">
                                {bike.colors.length > 0 && !hasVariants && (
                                    <div className="flex flex-wrap gap-2">
                                        {bike.colors.map((color: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-between w-full gap-3 group/item transition-all hover:bg-muted"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mr-1">{color.name}</span>
                                                </div>

                                                <div className="flex items-center gap-2 bg-background/50 rounded-lg p-0.5 border border-border/50">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStockChange(bike._id, idx, -1); }}
                                                        className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-red-50 text-red-500 transition-colors shadow-sm"
                                                    >
                                                        <Minus className="w-3 h-3" strokeWidth={3} />
                                                    </button>
                                                    <span className="text-[12px] font-black w-6 text-center text-foreground">{color.stock || 0}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStockChange(bike._id, idx, 1); }}
                                                        className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-green-50 text-green-500 transition-colors shadow-sm"
                                                    >
                                                        <Plus className="w-3 h-3" strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {bike.variants?.map((variant: any, vIdx: number) => (
                                    <div key={vIdx} className="space-y-2">
                                        <div className="flex items-center gap-2 px-2">
                                            <div className="w-1 h-3 bg-racing-blue rounded-full" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-foreground">{variant.name}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {variant.colors.map((color: any, cIdx: number) => (
                                                <div
                                                    key={cIdx}
                                                    className="px-3 py-1.5 rounded-xl bg-blue-500/5 border border-racing-blue/10 flex items-center justify-between w-full gap-3 group/item transition-all hover:bg-racing-blue/10"
                                                >
                                                    <div className="flex gap-2 items-center">
                                                        <div
                                                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                                                            style={{ backgroundColor: color.hex }}
                                                        />

                                                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mr-1">{color.name}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 bg-background/50 rounded-lg p-0.5 border border-border/50">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStockChange(bike._id, cIdx, -1, vIdx); }}
                                                            className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-red-50 text-red-500 transition-colors shadow-sm"
                                                        >
                                                            <Minus className="w-3 h-3" strokeWidth={3} />
                                                        </button>
                                                        <span className="text-[12px] font-black w-6 text-center text-foreground">{color.stock || 0}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStockChange(bike._id, cIdx, 1, vIdx); }}
                                                            className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-green-50 text-green-500 transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/10 flex justify-between items-center">
                                <div className="flex flex-col">
                                    {bike.colors.some((c: any) => c.price && c.price !== bike.price) ? (
                                        <>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-racing-blue blink flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-racing-blue" /> Varied Pricing
                                            </span>
                                            <span className="text-lg font-display font-black text-foreground italic">From ₹ {formatPrice(bike.price)}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Base Price</span>
                                            <span className="text-lg font-display font-black text-foreground italic">₹ {formatPrice(bike.price)}</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Variants</span>
                                    <span className="text-xl font-display font-black text-foreground italic tracking-tighter">
                                        {hasVariants
                                            ? bike.variants.reduce((acc: number, v: any) => acc + v.colors.length, 0)
                                            : bike.colors.length} Colors
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const handleSpareStockChange = async (spareId: string, delta: number) => {
        const spare = spares.find(s => s._id === spareId);
        if (!spare) return;

        const newStock = Math.max(0, (spare.stock || 0) + delta);
        if (newStock === spare.stock) return;

        // Optimistic UI update
        setSpares(prev => prev.map(s => s._id === spareId ? { ...s, stock: newStock } : s));

        try {
            const res = await fetch(`${API_URL}/spares/${spareId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...spare, stock: newStock })
            });
            const data = await res.json();
            if (!data.success) {
                fetchInventory();
            }
        } catch (err) {
            console.error("Failed to update spare stock:", err);
            fetchInventory();
        }
    };

    const renderSpares = () => {
        const filteredSpares = spares.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.bikeIds?.some((b: any) => b.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                {filteredSpares.map((spare: any) => (
                    <div key={spare._id} className="p-6 bg-card border border-border rounded-[2rem] shadow-xl group hover:border-racing-blue/30 transition-all flex flex-col relative overflow-hidden">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                            <button
                                onClick={() => { setSelectedSpare(spare); setIsModalOpen(true); }}
                                className="p-2 bg-racing-blue text-white rounded-lg"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => deleteSpare(spare._id)}
                                className="p-2 bg-red-500 text-white rounded-lg"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="aspect-square bg-background rounded-2xl mb-4 overflow-hidden border border-border p-2">
                            <img src={cleanImageUrl(spare.image)} alt={spare.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-racing-blue bg-racing-blue/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                                {spare.bikeIds && spare.bikeIds.length > 0
                                    ? (spare.bikeIds.length > 2
                                        ? `${spare.bikeIds[0].name} + ${spare.bikeIds.length - 1} more`
                                        : spare.bikeIds.map((b: any) => b.name).join(", "))
                                    : "All Bikes"}
                            </span>
                            <h4 className="text-lg font-display font-black text-foreground uppercase tracking-tight line-clamp-1">{spare.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                {spare.category} {spare.subCategory && `• ${spare.subCategory}`}
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/10 flex justify-between items-center">
                            <div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block">Price</span>
                                <span className="text-md font-display font-black text-foreground italic">₹ {formatPrice(spare.price)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block">Stock</span>
                                <div className="flex items-center gap-2 bg-background/50 rounded-lg p-1 border border-border/50">
                                    <button
                                        onClick={() => handleSpareStockChange(spare._id, -1)}
                                        className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-red-50 text-red-500 transition-colors shadow-sm"
                                    >
                                        <Minus className="w-3 h-3" strokeWidth={3} />
                                    </button>
                                    <span className={cn(
                                        "text-md font-display font-black italic w-6 text-center",
                                        spare.stock > 10 ? "text-green-500" : "text-red-500"
                                    )}>
                                        {spare.stock}
                                    </span>
                                    <button
                                        onClick={() => handleSpareStockChange(spare._id, 1)}
                                        className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-green-50 text-green-500 transition-colors shadow-sm"
                                    >
                                        <Plus className="w-3 h-3" strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-0 gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-gray-500 uppercase tracking-tighter">
                        SHOWROOM <span className="text-gradient">INVENTORY</span>
                    </h2>
                    <div className="flex items-center gap-6 mt-2">
                        <button
                            onClick={() => setActiveTab("bikes")}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] transition-all p-2 rounded-lg bg-cyan-100",
                                activeTab === "bikes" ? "text-racing-blue bg-white border-b-5 border-blue-900 border-rounded-lg" : "text-zinc-500 hover:text-zinc-800"
                            )}
                        >
                            Bikes & Scooters
                        </button>
                        <button
                            onClick={() => setActiveTab("spares")}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] transition-all p-2 rounded-lg bg-cyan-100",
                                activeTab === "spares" ? "text-racing-blue bg-white border-b-5 border-blue-900 border-rounded-lg" : "text-zinc-500 hover:text-zinc-800"
                            )}
                        >
                            Genuine Spares
                        </button>
                    </div>
                </div>
                <AdminTableControls
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOptions={[
                        { label: "Name A-Z", value: "name" },
                        { label: "Price: High to Low", value: "price-desc" },
                        { label: "Price: Low to High", value: "price-asc" }
                    ]}
                    placeholder={activeTab === "bikes" ? "Search bikes..." : "Search spares..."}
                    className="flex-1"
                />
                <div className="flex items-center gap-4">
                    <ExportButton
                        data={activeTab === "bikes" ? processedBikes : spares.filter(s =>
                            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.bikeId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.category.toLowerCase().includes(searchQuery.toLowerCase())
                        )}
                        filename={`Yamaha_${activeTab === "bikes" ? "Inventory" : "Spares"}_Report`}
                        sheetName={activeTab === "bikes" ? "Bikes" : "Spares"}
                    />
                    <button
                        onClick={() => {
                            if (activeTab === "bikes") {
                                setSelectedBike(null);
                                setIsModalOpen(true);
                            } else {
                                setSelectedSpare(null);
                                setIsModalOpen(true);
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20"
                    >
                        <Plus className="w-4 h-4" />
                        {activeTab === "bikes" ? "Add Model" : "Add Spare"}
                    </button>
                </div>
            </div>

            <div className="bg-background/90 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Inventory...</span>
                    </div>
                ) : (
                    <div className="p-8 space-y-20">
                        {activeTab === "bikes" ? (
                            <>
                                {motorcycles.length > 0 && renderGrid(motorcycles, "Motorcycles")}
                                {scooters.length > 0 && renderGrid(scooters, "Scooters & Maxi-Scooters")}
                            </>
                        ) : (
                            renderSpares()
                        )}
                    </div>
                )}
            </div>

            {activeTab === "bikes" ? (
                <BikeEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    bike={selectedBike}
                    onSave={handleSaveBike}
                />
            ) : (
                <SpareEditModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedSpare(null); }}
                    spare={selectedSpare}
                    bikes={bikes}
                    onSave={handleSaveSpare}
                />
            )}
        </div>
    );
}
