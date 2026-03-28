"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Color {
    name: string;
    hex: string;
    image: string;
    colorOption: string;
    stock: number;
}

interface Bike {
    _id?: string;
    name: string;
    slug: string;
    category: 'bike' | 'scooty';
    tag: string;
    description: string;
    price: string;
    threeSixtyUrl: string;
    threeSixtyImageCount: number;
    colorBaseUrl?: string;
    brochureUrl: string;
    colors: Color[];
}

interface BikeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    bike: Bike | null;
    onSave: (bike: any) => Promise<void>;
}

export function BikeEditModal({ isOpen, onClose, bike, onSave }: BikeEditModalProps) {
    const [formData, setFormData] = useState<Bike>({
        name: "",
        slug: "",
        category: "bike",
        tag: "",
        description: "",
        price: "",
        threeSixtyUrl: "",
        threeSixtyImageCount: 40,
        brochureUrl: "",
        colors: [{ name: "", hex: "", image: "", colorOption: "", stock: 0 }]
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (bike) {
            setFormData(bike);
        } else {
            setFormData({
                name: "",
                slug: "",
                category: "bike",
                tag: "",
                description: "",
                price: "",
                threeSixtyUrl: "",
                threeSixtyImageCount: 40,
                colorBaseUrl: "",
                brochureUrl: "",
                colors: [{ name: "", hex: "", image: "", colorOption: "", stock: 0 }]
            });
        }
    }, [bike, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error("Failed to save bike:", err);
        } finally {
            setSaving(false);
        }
    };

    const addColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: "", hex: "", image: "", colorOption: "", stock: 0 }]
        });
    };

    const removeColor = (index: number) => {
        setFormData({
            ...formData,
            colors: formData.colors.filter((_, i) => i !== index)
        });
    };

    const updateColor = (index: number, field: string, value: string | number) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData({ ...formData, colors: newColors });
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
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-border flex justify-between items-center">
                        <h2 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter italic">
                            {bike ? "EDIT" : "ADD"} <span className="text-racing-blue">MODEL</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <form id="bike-form" onSubmit={handleSave} className="space-y-10">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Model Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. Yamaha R15 V4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Model Slug (URL)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. r15v4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                    >
                                        <option value="bike">Motorcycle</option>
                                        <option value="scooty">Scooter</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Base Price (INR)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. 1,82,000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tagline</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. Track Ready"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all resize-none"
                                        placeholder="Detailed description of the model..."
                                    />
                                </div>
                            </div>

                            {/* 360 Config */}
                            <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-racing-blue mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-racing-blue animate-pulse" />
                                    360 Viewer Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">360 Frames Base URL</label>
                                        <input
                                            type="text"
                                            value={formData.threeSixtyUrl}
                                            onChange={(e) => setFormData({ ...formData, threeSixtyUrl: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/360/"
                                        />
                                        <p className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Note: Used for the interactive 3D viewer</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color Image Base URL (Fallback)</label>
                                        <input
                                            type="text"
                                            value={formData.colorBaseUrl}
                                            onChange={(e) => setFormData({ ...formData, colorBaseUrl: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/color/"
                                        />
                                        <p className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Note: Used for main image fallbacks if 360 is unavailable</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">360 Frame Count</label>
                                        <input
                                            type="number"
                                            value={formData.threeSixtyImageCount}
                                            onChange={(e) => setFormData({ ...formData, threeSixtyImageCount: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brochure PDF Path / URL</label>
                                        <input
                                            type="text"
                                            value={formData.brochureUrl}
                                            onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="e.g. /brochure/r15.pdf"
                                        />
                                        <p className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Note: Ensure this is a direct link to the PDF brochure</p>
                                    </div>
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Color Variants</h3>
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="flex items-center gap-2 px-4 py-2 bg-racing-blue/10 text-racing-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Color
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {formData.colors.map((color, index) => (
                                        <div key={index} className="p-6 bg-muted/20 rounded-[2rem] border border-border/50 relative group">
                                            <button
                                                type="button"
                                                onClick={() => removeColor(index)}
                                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-black/5"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={color.name}
                                                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="Racing Blue"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">HEX Code</label>
                                                    <div className="flex gap-3">
                                                        <input
                                                            required
                                                            type="text"
                                                            value={color.hex}
                                                            onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                            className="flex-1 bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                            placeholder="#005aff"
                                                        />
                                                        <div
                                                            className="w-11 h-11 rounded-2xl border border-border shrink-0 shadow-lg"
                                                            style={{ backgroundColor: color.hex || '#333' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color Slug (Yamaha URL)</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={color.colorOption}
                                                        onChange={(e) => updateColor(index, 'colorOption', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="e.g. racing-blue, metallic-grey, dark-knight"
                                                    />
                                                    <p className="text-[8px] text-muted-foreground mt-1 font-bold uppercase">This value completes the dynamic color image URL</p>
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Main Image Path / URL</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={color.image}
                                                        onChange={(e) => updateColor(index, 'image', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="e.g. /images/r15m.png (local) or direct path"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Stock</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        value={color.stock}
                                                        onChange={(e) => updateColor(index, 'stock', parseInt(e.target.value) || 0)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-border bg-muted/20 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="bike-form"
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-4 bg-racing-blue text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-racing-blue/25 disabled:opacity-50 disabled:scale-100"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
