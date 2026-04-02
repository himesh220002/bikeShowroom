"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2, Package, Tag, Info, DollarSign, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { cleanImageUrl } from "@/lib/utils/url";

interface SpareEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    spare: any | null;
    bikes: any[];
    onSave: (formData: any) => Promise<void>;
}

export function SpareEditModal({ isOpen, onClose, spare, bikes, onSave }: SpareEditModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: "",
        partNumber: "",
        price: 0,
        description: "",
        image: "",
        bikeId: "",
        category: "General",
        stock: 0,
        status: "In Stock"
    });

    useEffect(() => {
        if (spare) {
            setFormData({
                ...spare,
                bikeId: spare.bikeId?._id || spare.bikeId || ""
            });
        } else {
            setFormData({
                name: "",
                partNumber: "",
                price: 0,
                description: "",
                image: "",
                bikeId: bikes[0]?._id || "",
                category: "General",
                stock: 0,
                status: "In Stock"
            });
        }
    }, [spare, bikes, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error("Failed to save spare:", err);
            alert("Failed to save spare part.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-border flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                                {spare ? "Edit" : "Add New"} <span className="text-racing-blue">Spare Part</span>
                            </h2>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Genuine Parts Inventory Control</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="w-6 h-6 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <form id="spare-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-foreground">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                        <Package className="w-3 h-3" /> Part Name
                                    </label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Yamalube 4T Engine Oil"
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                            <Tag className="w-3 h-3" /> Part Number
                                        </label>
                                        <input
                                            value={formData.partNumber}
                                            onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                                            placeholder="PN-123456"
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                            <DollarSign className="w-3 h-3" /> Price (₹)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                        <Box className="w-3 h-3" /> Compatible Bike
                                    </label>
                                    <select
                                        value={formData.bikeId}
                                        onChange={(e) => setFormData({ ...formData, bikeId: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all appearance-none"
                                    >
                                        <option value="">Common / Universal (No Bike)</option>
                                        {bikes.map(bike => (
                                            <option key={bike._id} value={bike._id}>{bike.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                        <Info className="w-3 h-3" /> Description
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed specifications and usage info..."
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Media & Inventory */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                        <Upload className="w-3 h-3" /> Part Image URL
                                    </label>
                                    <input
                                        required
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: cleanImageUrl(e.target.value) })}
                                        placeholder="https://... or /images/spares/..."
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                    />
                                    {formData.image && (
                                        <div className="mt-4 aspect-video rounded-2xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center p-4">
                                            <img src={formData.image} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as any).src = "https://placehold.co/600x400/18181b/ffffff?text=Invalid+Image+URL" }} />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Initial Stock</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                        >
                                            <option value="In Stock">In Stock</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Category</label>
                                    <input
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g. Engine, Electronics, Body"
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-racing-blue transition-all"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-border bg-muted/30 flex justify-between items-center shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            form="spare-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-10 py-4 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-racing-blue/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Package className="w-4 h-4" />
                                    Save Spare Part
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
