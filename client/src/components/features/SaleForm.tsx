"use client";

import { useState } from "react";
import { ShoppingCart, User, Phone, CheckCircle2, Loader2, IndianRupee, Bike } from "lucide-react";

interface SaleFormProps {
    bikes: any[];
    onSaleComplete: () => void;
}

export function SaleForm({ bikes, onSaleComplete }: SaleFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        bikeId: "",
        variant: "",
        salePrice: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setFormData({
                    customerName: "",
                    customerPhone: "",
                    bikeId: "",
                    variant: "",
                    salePrice: "",
                });
                onSaleComplete();
                alert("🎉 Sale recorded successfully! Inventory updated.");
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            console.error("Sale recording failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-racing-blue/10 rounded-2xl">
                    <ShoppingCart className="w-6 h-6 text-racing-blue" />
                </div>
                <div>
                    <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">Record New <span className="text-racing-blue">Sale</span></h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Instant inventory sync enabled</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-racing-blue" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer Intelligence</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                placeholder="Enter customer name"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Phone Number</label>
                            <input
                                type="tel"
                                required
                                maxLength={10}
                                className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                value={formData.customerPhone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val.length <= 10) {
                                        setFormData({ ...formData, customerPhone: val });
                                    }
                                }}
                                placeholder="10-digit Phone Number"
                            />
                        </div>
                    </div>
                </div>

                {/* Bike Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Bike className="w-4 h-4 text-racing-blue" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Selection</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Select Bike Model</label>
                            <select
                                required
                                className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none"
                                value={formData.bikeId + "|" + formData.variant}
                                onChange={(e) => {
                                    const [bikeId, variantName] = e.target.value.split("|");
                                    const bike = bikes.find(b => b._id === bikeId);
                                    const colorInfo = bike?.colors.find((c: any) => c.name === variantName);
                                    setFormData({
                                        ...formData,
                                        bikeId: bikeId,
                                        variant: variantName,
                                        salePrice: colorInfo?.price?.split('-')[0].replace(/[^0-9]/g, '') || bike?.price?.split('-')[0].replace(/[^0-9]/g, '') || ""
                                    });
                                }}
                            >
                                <option value="">Select a bike variant</option>
                                {bikes.flatMap(bike =>
                                    (bike.colors || []).filter((c: any) => c.stock > 0).map((color: any) => (
                                        <option key={`${bike._id}-${color.name}`} value={`${bike._id}|${color.name}`}>
                                            {bike.name} ({color.name}) - {color.stock} left
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1 group-focus-within:text-racing-blue transition-colors">Final Sale Price</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-blue" />
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-5 py-3.5 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    value={formData.salePrice}
                                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading || !formData.bikeId}
                    className="flex items-center gap-3 px-10 py-4 bg-racing-blue hover:bg-racing-blue/90 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-racing-blue/30 active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5" />
                    )}
                    {loading ? "Processing..." : "Confirm & Record Sale"}
                </button>
            </div>
        </form>
    );
}
