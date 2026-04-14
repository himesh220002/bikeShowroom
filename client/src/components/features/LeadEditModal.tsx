"use client";

import { useState } from "react";
import { X, Save, User, Calendar, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";
import { Lead } from "./LeadsTable";

interface LeadEditModalProps {
    lead: Lead;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function LeadEditModal({ lead, isOpen, onClose, onUpdate }: LeadEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: lead.status || "New",
        assignedAgent: lead.assignedAgent || "",
        followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : "",
        score: lead.score || 0,
        heat: lead.heat || "Cold",
        preferredColor: lead.preferredColor || "",
        adminNotes: lead.adminNotes || ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/leads/${lead._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                onUpdate();
                onClose();
            } else {
                alert("Failed to update lead: " + data.error);
            }
        } catch (err) {
            console.error("Error updating lead:", err);
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
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Edit Lead</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{lead.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Test Ride">Test Ride</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Heat</label>
                            <select
                                value={formData.heat}
                                onChange={(e) => setFormData({ ...formData, heat: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all"
                            >
                                <option value="Cold">Cold</option>
                                <option value="Warm">Warm</option>
                                <option value="Hot">Hot</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 text-racing-blue">Scheduled Visit / Test Ride</label>
                            <input
                                type="datetime-local"
                                value={formData.followUpDate ? new Date(formData.followUpDate).toISOString().slice(0, 16) : ""}
                                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Score (0-10)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={formData.score}
                                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                className="flex-1 accent-racing-blue"
                            />
                            <span className="text-xs font-black text-racing-blue w-8">{formData.score}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Preferred Color (Optional)</label>
                        <input
                            type="text"
                            value={formData.preferredColor}
                            onChange={(e) => setFormData({ ...formData, preferredColor: e.target.value })}
                            placeholder="e.g., Racing Blue, Matte Black..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all font-sans"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Admin Notes</label>
                        <textarea
                            value={formData.adminNotes}
                            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                            placeholder="Add internal notes about this lead..."
                            rows={3}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all resize-none font-sans"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all text-muted-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 px-6 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-racing-blue/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
