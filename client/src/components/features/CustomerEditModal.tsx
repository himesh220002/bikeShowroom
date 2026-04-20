"use client";

import { useState } from "react";
import { X, Save, User, MapPin, Contact, IndianRupee, Star, Bike } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";

interface CustomerCRM {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    preferredContact?: string;
    lifetimeValue?: number;
    rating?: number;
    engagement?: number;
    milestone?: string;
    regNumber?: string;
}

interface CustomerEditModalProps {
    customer: CustomerCRM;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function CustomerEditModal({ customer, isOpen, onClose, onUpdate }: CustomerEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        address: customer.address || "",
        preferredContact: customer.preferredContact || "Phone",
        lifetimeValue: customer.lifetimeValue || 0,
        rating: customer.rating || 0,
        engagement: customer.engagement || 0,
        milestone: customer.milestone || "New Customer",
        registrationNumber: customer.regNumber || ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We need a PUT /customers/:id route, let's assume it's created or we'll create it
            const res = await fetch(`${API_URL}/customers/${customer._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                onUpdate();
                onClose();
            } else {
                alert("Failed to update customer: " + data.error);
            }
        } catch (err) {
            console.error("Error updating customer:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-racing-blue/10 rounded-lg">
                            <User className="w-5 h-5 text-racing-blue" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Edit Customer Profile</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{customer.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Permanent Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter full address..."
                                rows={2}
                                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Preference</label>
                            <div className="relative">
                                <Contact className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <select
                                    value={formData.preferredContact}
                                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all appearance-none"
                                >
                                    <option value="Phone">Phone Call</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Email">Email</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lifetime Value (LTV)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    value={formData.lifetimeValue}
                                    onChange={(e) => setFormData({ ...formData, lifetimeValue: parseInt(e.target.value) })}
                                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Engagement Score (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.engagement}
                                onChange={(e) => setFormData({ ...formData, engagement: parseInt(e.target.value) })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Milestone</label>
                            <input
                                type="text"
                                value={formData.milestone}
                                onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all uppercase"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Machine Registration Number</label>
                        <div className="relative">
                            <Bike className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={formData.registrationNumber}
                                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                                placeholder="e.g. BR01AB1234"
                                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all uppercase"
                            />
                        </div>
                        <p className="text-[8px] font-bold text-racing-blue uppercase tracking-widest px-1">Source of Truth (Syncs to Sales & Garage)</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intelligence Rating</label>
                        <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border/50">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="p-1 transition-transform hover:scale-125"
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
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
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
