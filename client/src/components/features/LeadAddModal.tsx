"use client";

import { useState, useEffect } from "react";
import { X, Save, User, PlusCircle, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";
import { BIKES } from "@/lib/constants/bikes";

interface LeadAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    initialData?: {
        inquiryId?: string;
        name?: string;
        phone?: string;
        interests?: string[];
        adminNotes?: string;
    };
}

export function LeadAddModal({ isOpen, onClose, onUpdate, initialData }: LeadAddModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        inquiryId: initialData?.inquiryId || "",
        name: initialData?.name || "",
        phone: initialData?.phone || "",
        interests: initialData?.interests || [] as string[],
        status: "New",
        heat: "Warm",
        adminNotes: initialData?.adminNotes || "",
        source: "Admin Manual"
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                inquiryId: initialData.inquiryId || prev.inquiryId,
                name: initialData.name || prev.name,
                phone: initialData.phone || prev.phone,
                interests: initialData.interests || prev.interests,
                adminNotes: initialData.adminNotes || prev.adminNotes
            }));
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            alert("Please provide at least a name and phone number.");
            return;
        }

        const endpoint = formData.inquiryId ? `${API_URL}/leads/manual-escalate` : `${API_URL}/leads`;

        setLoading(true);
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                onUpdate();
                onClose();
            } else {
                alert("Failed to add lead: " + data.error);
            }
        } catch (err) {
            console.error("Error adding lead:", err);
            alert("An error occurred while adding the lead.");
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-racing-blue/10 rounded-lg">
                            <PlusCircle className="w-5 h-5 text-racing-blue" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                                {formData.inquiryId ? "Escalate to Hot Lead" : "Manual Lead Entry"}
                            </h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                {formData.inquiryId ? "Promote existing inquiry to priority status" : "Create a new pre-sale inquiry"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Prospect Name"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-sans"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Mobile Number"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-sans"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Interest Selection</label>
                        <div className="grid grid-cols-4 gap-2">
                            {BIKES.map((bike) => (
                                <button
                                    key={bike.slug}
                                    type="button"
                                    onClick={() => toggleInterest(bike.name)}
                                    className={cn(
                                        "p-2 rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all",
                                        formData.interests.includes(bike.name)
                                            ? "bg-racing-blue text-white border-racing-blue shadow-lg shadow-racing-blue/20"
                                            : "bg-background border-border hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    {bike.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-sans appearance-none"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Test Ride">Test Ride</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Initial Heat</label>
                            <select
                                value={formData.heat}
                                onChange={(e) => setFormData({ ...formData, heat: e.target.value as any })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-sans appearance-none"
                            >
                                <option value="Cold">Cold</option>
                                <option value="Warm">Warm</option>
                                <option value="Hot">Hot</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Admin Remarks / Response</label>
                        <textarea
                            value={formData.adminNotes}
                            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                            placeholder="e.g., Interested in EMI, will visit on Saturday..."
                            rows={3}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-sans resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all text-muted-foreground"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 px-6 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-racing-blue/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            {formData.inquiryId ? "Escalate Lead" : "Create Lead"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
