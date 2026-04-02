"use client";

import { useState } from "react";
import { X, Save, Wrench, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";
import { ServiceBooking } from "./ServicesTable";

interface ServiceStatusModalProps {
    service: ServiceBooking;
    newStatus: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function ServiceStatusModal({ service, newStatus, isOpen, onClose, onUpdate }: ServiceStatusModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: newStatus,
        technicianName: service.technicianName || "",
        estimatedCompletionTime: service.estimatedCompletionTime || "",
        notes: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/services/${service._id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                onUpdate();
                onClose();
            } else {
                alert("Failed to update service: " + data.error);
            }
        } catch (err) {
            console.error("Error updating service:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-racing-blue/10 rounded-lg">
                            <Wrench className="w-5 h-5 text-racing-blue" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Update Service</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{service.regNumber} • {newStatus}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assign Technician</label>
                            <div className="relative">
                                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={formData.technicianName}
                                    onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                                    placeholder="Technician Name"
                                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. Completion (e.g. 2 hours)</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={formData.estimatedCompletionTime}
                                    onChange={(e) => setFormData({ ...formData, estimatedCompletionTime: e.target.value })}
                                    placeholder="2 hours / 5 PM"
                                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Notes / Timeline Update</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Engine oil changed, brake pads checked..."
                                    rows={2}
                                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-racing-blue/30 transition-all resize-none"
                                />
                            </div>
                        </div>
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
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
