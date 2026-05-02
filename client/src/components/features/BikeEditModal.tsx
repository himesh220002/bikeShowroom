"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cleanImageUrl } from "@/lib/utils/url";

interface Color {
    name: string;
    hex: string;
    image: string;
    colorOption: string;
    stock: number;
    price?: string;
}

interface Variant {
    name: string;
    price: string;
    colors: Color[];
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
    image2?: string;
    colors: Color[];
    variants?: Variant[];
    fullSpecs: {
        engine: string;
        power: string;
        torque: string;
        transmission: string;
        brakes: string;
        fuelCapacity: string;
        weight: string;
        seatHeight: string;
        tyres: string;
        topSpeed?: string;
        mileage?: string;
        features: string[];
    };
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
        colorBaseUrl: "",
        brochureUrl: "",
        image2: "",
        colors: [{ name: "", hex: "", image: "", colorOption: "", stock: 0, price: "" }],
        variants: [],
        fullSpecs: {
            engine: "",
            power: "",
            torque: "",
            transmission: "",
            brakes: "",
            fuelCapacity: "",
            weight: "",
            seatHeight: "",
            tyres: "",
            topSpeed: "",
            mileage: "",
            features: []
        }
    });
    const [saving, setSaving] = useState(false);
    const [featuresInput, setFeaturesInput] = useState("");

    useEffect(() => {
        if (bike) {
            setFormData({
                _id: bike._id,
                name: bike.name || "",
                slug: bike.slug || "",
                category: bike.category || "bike",
                tag: bike.tag || "",
                description: bike.description || "",
                price: bike.price || "",
                threeSixtyUrl: bike.threeSixtyUrl || "",
                threeSixtyImageCount: bike.threeSixtyImageCount ?? 40,
                colorBaseUrl: bike.colorBaseUrl || "",
                brochureUrl: bike.brochureUrl || "",
                image2: bike.image2 || "",
                colors: (bike.colors || []).map(c => ({
                    name: c.name || "",
                    hex: c.hex || "",
                    image: c.image || "",
                    colorOption: c.colorOption || "",
                    stock: c.stock ?? 0,
                    price: c.price || ""
                })),
                variants: (bike.variants || []).map(v => ({
                    name: v.name || "",
                    price: v.price || "",
                    colors: (v.colors || []).map(vc => ({
                        name: vc.name || "",
                        hex: vc.hex || "",
                        image: vc.image || "",
                        colorOption: vc.colorOption || "",
                        stock: vc.stock ?? 0,
                        price: vc.price || ""
                    }))
                })),
                fullSpecs: {
                    engine: bike.fullSpecs?.engine || "",
                    power: bike.fullSpecs?.power || "",
                    torque: bike.fullSpecs?.torque || "",
                    transmission: bike.fullSpecs?.transmission || "",
                    brakes: bike.fullSpecs?.brakes || "",
                    fuelCapacity: bike.fullSpecs?.fuelCapacity || "",
                    weight: bike.fullSpecs?.weight || "",
                    seatHeight: bike.fullSpecs?.seatHeight || "",
                    tyres: bike.fullSpecs?.tyres || "",
                    topSpeed: bike.fullSpecs?.topSpeed || "",
                    mileage: bike.fullSpecs?.mileage || "",
                    features: bike.fullSpecs?.features || []
                }
            });
            setFeaturesInput(bike.fullSpecs?.features?.join(", ") || "");
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
                colors: [{ name: "", hex: "", image: "", colorOption: "", stock: 0, price: "" }],
                variants: [],
                fullSpecs: {
                    engine: "",
                    power: "",
                    torque: "",
                    transmission: "",
                    brakes: "",
                    fuelCapacity: "",
                    weight: "",
                    seatHeight: "",
                    tyres: "",
                    topSpeed: "",
                    mileage: "",
                    features: []
                }
            });
            setFeaturesInput("");
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

    const handleFeaturesChange = (value: string) => {
        setFeaturesInput(value);
        const features = value.split(",")
            .map(f => f.trim())
            .filter(f => f !== "");
        setFormData(prev => ({
            ...prev,
            fullSpecs: { ...prev.fullSpecs, features }
        }));
    };

    const addColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: "", hex: "", image: "", colorOption: "", stock: 0, price: "" }]
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

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...(formData.variants || []), { name: "", price: "", colors: [{ name: "", hex: "", image: "", colorOption: "", stock: 0, price: "" }] }]
        });
    };

    const removeVariant = (index: number) => {
        setFormData({
            ...formData,
            variants: (formData.variants || []).filter((_, i) => i !== index)
        });
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };

    const addVariantColor = (vIndex: number) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[vIndex].colors.push({ name: "", hex: "", image: "", colorOption: "", stock: 0, price: "" });
        setFormData({ ...formData, variants: newVariants });
    };

    const removeVariantColor = (vIndex: number, cIndex: number) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[vIndex].colors = newVariants[vIndex].colors.filter((_, i) => i !== cIndex);
        setFormData({ ...formData, variants: newVariants });
    };

    const updateVariantColor = (vIndex: number, cIndex: number, field: string, value: any) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[vIndex].colors[cIndex] = { ...newVariants[vIndex].colors[cIndex], [field]: value };
        setFormData({ ...formData, variants: newVariants });
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
                    <div className="p-4 border-b border-border flex justify-between items-center">
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
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. Yamaha Fascino 125"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Model Slug (URL)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.slug || ""}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. fascino-125"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
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
                                        value={formData.price || ""}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. 78,900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tagline</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.tag || ""}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="e.g. Elegance meets performance"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secondary Angle Image (Top View)</label>
                                    <input
                                        type="text"
                                        value={formData.image2 || ""}
                                        onChange={(e) => setFormData({ ...formData, image2: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        placeholder="/images/bikes/top-view.png"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all resize-none"
                                        placeholder="Detailed description of the model..."
                                    />
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <div className="p-8 bg-blue-300/10 rounded-[2.5rem] border-2 border-racing-blue/5">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-racing-blue mb-8 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-racing-blue animate-pulse" />
                                    Technical Specifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Engine</label>
                                        <input
                                            type="text"
                                            value={formData.fullSpecs.engine || ""}
                                            onChange={(e) => setFormData({ ...formData, fullSpecs: { ...formData.fullSpecs, engine: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Power</label>
                                        <input
                                            type="text"
                                            value={formData.fullSpecs.power || ""}
                                            onChange={(e) => setFormData({ ...formData, fullSpecs: { ...formData.fullSpecs, power: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Torque</label>
                                        <input
                                            type="text"
                                            value={formData.fullSpecs.torque || ""}
                                            onChange={(e) => setFormData({ ...formData, fullSpecs: { ...formData.fullSpecs, torque: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transmission</label>
                                        <input
                                            type="text"
                                            value={formData.fullSpecs.transmission || ""}
                                            onChange={(e) => setFormData({ ...formData, fullSpecs: { ...formData.fullSpecs, transmission: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brakes</label>
                                        <input
                                            type="text"
                                            value={formData.fullSpecs.brakes || ""}
                                            onChange={(e) => setFormData({ ...formData, fullSpecs: { ...formData.fullSpecs, brakes: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fuel Capacity</label>
                                        <input
                                            type="text"
                                            value={formData.fullSpecs.fuelCapacity || ""}
                                            onChange={(e) => setFormData({ ...formData, fullSpecs: { ...formData.fullSpecs, fuelCapacity: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Key Features (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={featuresInput}
                                            onChange={(e) => handleFeaturesChange(e.target.value)}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="e.g. VVA, Traction Control, Quick Shifter"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 360 & Assets Config */}
                            <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/50">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-racing-blue mb-8 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-racing-blue animate-pulse" />
                                    360 Viewer & Assets Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">360 Frames Base URL</label>
                                        <input
                                            type="text"
                                            value={formData.threeSixtyUrl || ""}
                                            onChange={(e) => setFormData({ ...formData, threeSixtyUrl: cleanImageUrl(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="https://.../360/"
                                        />
                                        <p className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Note: Used for the interactive 3D viewer</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color Image Base URL (Fallback)</label>
                                        <input
                                            type="text"
                                            value={formData.colorBaseUrl || ""}
                                            onChange={(e) => setFormData({ ...formData, colorBaseUrl: cleanImageUrl(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="https://.../color/"
                                        />
                                        <p className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Note: Used for main image fallbacks</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">360 Frame Count</label>
                                        <input
                                            type="number"
                                            value={formData.threeSixtyImageCount ?? 40}
                                            onChange={(e) => setFormData({ ...formData, threeSixtyImageCount: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brochure PDF Path / URL</label>
                                        <input
                                            type="text"
                                            value={formData.brochureUrl || ""}
                                            onChange={(e) => setFormData({ ...formData, brochureUrl: cleanImageUrl(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                            placeholder="e.g. /brochure/r15.pdf"
                                        />
                                        <p className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Note: Ensure this is a direct link to the PDF</p>
                                    </div>
                                </div>
                            </div>

                            {/* Model Variants Setup */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Model Variants</h3>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1 italic">Use this for branched versions (e.g., Drum, Disc, S)</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Variant
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {formData.variants?.map((variant, vIdx) => (
                                        <div key={vIdx} className="p-8 bg-muted/40 rounded-[2.5rem] border-2 border-racing-blue/10 relative group/variant">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(vIdx)}
                                                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Variant Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={variant.name || ""}
                                                        onChange={(e) => updateVariant(vIdx, 'name', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="e.g. Fascino Disc"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Variant Price (INR)</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={variant.price || ""}
                                                        onChange={(e) => updateVariant(vIdx, 'price', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="e.g. 91,130"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center px-2">
                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-racing-blue">Variant Colors</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => addVariantColor(vIdx)}
                                                        className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue flex items-center gap-1 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" /> Add Color
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {variant.colors.map((vColor, cIdx) => (
                                                        <div key={cIdx} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-background rounded-2xl border border-border/50 relative group/vcolor">
                                                            <div className="md:col-span-1 space-y-2">
                                                                <label className="text-[8px] font-black uppercase text-muted-foreground">Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={vColor.name || ""}
                                                                    onChange={(e) => updateVariantColor(vIdx, cIdx, 'name', e.target.value)}
                                                                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-[10px] font-bold"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-1 space-y-2">
                                                                <label className="text-[8px] font-black uppercase text-muted-foreground">Hex</label>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={vColor.hex || ""}
                                                                        onChange={(e) => updateVariantColor(vIdx, cIdx, 'hex', e.target.value)}
                                                                        className="flex-1 bg-muted/30 border border-border rounded-xl px-2 py-2 text-[10px] font-bold min-w-0"
                                                                        placeholder="#000"
                                                                    />
                                                                    <div
                                                                        className="w-8 h-8 rounded-lg border border-border shrink-0 shadow-inner transition-all duration-300"
                                                                        style={{ backgroundColor: vColor.hex || '#333' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="md:col-span-1 space-y-2">
                                                                <label className="text-[8px] font-black uppercase text-muted-foreground">Slug</label>
                                                                <input
                                                                    type="text"
                                                                    value={vColor.colorOption || ""}
                                                                    onChange={(e) => updateVariantColor(vIdx, cIdx, 'colorOption', e.target.value)}
                                                                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-[10px] font-bold"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-1 space-y-2">
                                                                <label className="text-[8px] font-black uppercase text-muted-foreground">Price (Opt)</label>
                                                                <input
                                                                    type="text"
                                                                    value={vColor.price || ""}
                                                                    onChange={(e) => updateVariantColor(vIdx, cIdx, 'price', e.target.value)}
                                                                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-[10px] font-bold"
                                                                    placeholder="e.g. 92,000"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-1 space-y-2">
                                                                <label className="text-[8px] font-black uppercase text-muted-foreground">Stock</label>
                                                                <input
                                                                    type="number"
                                                                    value={vColor.stock ?? 0}
                                                                    onChange={(e) => updateVariantColor(vIdx, cIdx, 'stock', parseInt(e.target.value))}
                                                                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-[10px] font-bold"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-1 flex items-end justify-center pb-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeVariantColor(vIdx, cIdx)}
                                                                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="md:col-span-6 space-y-2">
                                                                <label className="text-[8px] font-black uppercase text-muted-foreground">Image Path</label>
                                                                <input
                                                                    type="text"
                                                                    value={vColor.image || ""}
                                                                    onChange={(e) => updateVariantColor(vIdx, cIdx, 'image', e.target.value)}
                                                                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-[10px] font-bold"
                                                                    placeholder="/images/fascino-black.png"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Standard Colors (Fallback) */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Standard Colors (Fallback)</h3>
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="flex items-center gap-2 px-6 py-3 bg-racing-blue/10 text-racing-blue rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all shadow-lg shadow-racing-blue/5"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Color
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {formData.colors.map((color, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-purple-300/20 via-muted/50 to-muted/20 rounded-[2.5rem] border border-border/50 relative group">
                                            <button
                                                type="button"
                                                onClick={() => removeColor(index)}
                                                className="absolute top-2 right-6 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Color Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={color.name || ""}
                                                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">HEX Code</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            required
                                                            type="text"
                                                            value={color.hex || ""}
                                                            onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                            className="flex-1 max-w-[50%] bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        />
                                                        <div className="w-12 h-12 rounded-2xl border border-border shrink-0 shadow-inner" style={{ backgroundColor: color.hex || '#333' }} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Slug</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={color.colorOption || ""}
                                                        onChange={(e) => updateColor(index, 'colorOption', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="e.g. racing-blue"
                                                    />
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Image Path</label>
                                                    <input
                                                        type="text"
                                                        value={color.image || ""}
                                                        onChange={(e) => updateColor(index, 'image', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        placeholder="/images/bike-color.png"
                                                    />
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (Opt)</label>
                                                        <input
                                                            type="text"
                                                            value={color.price || ""}
                                                            onChange={(e) => updateColor(index, 'price', e.target.value)}
                                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                            placeholder="e.g. 1,98,000"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Stock</label>
                                                        <input
                                                            required
                                                            type="number"
                                                            value={color.stock ?? 0}
                                                            onChange={(e) => updateColor(index, 'stock', parseInt(e.target.value) || 0)}
                                                            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-border bg-muted/20 flex justify-end gap-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="bike-form"
                            disabled={saving}
                            className="flex items-center gap-3 px-12 py-5 bg-racing-blue text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-racing-blue/40 disabled:opacity-50 disabled:scale-100"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Check className="w-5 h-5" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
