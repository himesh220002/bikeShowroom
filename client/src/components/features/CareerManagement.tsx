"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Loader2, Save, X, Briefcase } from "lucide-react";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";

interface JobOpening {
    _id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    active: boolean;
    requirements: string[];
}

export function CareerManagement({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "Katihar Showroom",
        status: "Immediate Joining",
        active: true,
        requirements: ""
    });

    useEffect(() => {
        if (isOpen) {
            fetchOpenings();
        }
    }, [isOpen]);

    const fetchOpenings = async () => {
        try {
            const res = await fetch(`${API_URL}/career/admin/openings`, { credentials: "include" });
            const data = await res.json();
            if (data.success) {
                setOpenings(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch openings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r !== "")
            };

            const url = editingId
                ? `${API_URL}/career/admin/openings/${editingId}`
                : `${API_URL}/career/admin/openings`;

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await res.json();
            if (data.success) {
                setEditingId(null);
                setFormData({ title: "", description: "", location: "Katihar Showroom", status: "Immediate Joining", active: true, requirements: "" });
                fetchOpenings();
            }
        } catch (err) {
            console.error("Failed to save opening:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job opening?")) return;
        try {
            const res = await fetch(`${API_URL}/career/admin/openings/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                fetchOpenings();
            }
        } catch (err) {
            console.error("Failed to delete opening:", err);
        }
    };

    const startEdit = (job: JobOpening) => {
        setEditingId(job._id);
        setFormData({
            title: job.title,
            description: job.description,
            location: job.location,
            status: job.status,
            active: job.active,
            requirements: job.requirements.join(', ')
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-racing-blue/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-racing-blue" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-black text-gradient-text uppercase tracking-tighter">Manage Career Openings</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">Add or remove job profiles for the showroom</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Add/Edit Form */}
                    <form onSubmit={handleSave} className="bg-muted/30 border border-border rounded-2xl p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-racing-blue transition-all"
                                    placeholder="e.g. Sales Executive"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status / Tag</label>
                                <input
                                    required
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-racing-blue transition-all"
                                    placeholder="e.g. Immediate Joining / Training Provided"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-racing-blue transition-all min-h-[100px]"
                                placeholder="Describe the role and responsibilities..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Requirements (Comma separated)</label>
                            <input
                                value={formData.requirements}
                                onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-racing-blue transition-all"
                                placeholder="e.g. Good Communication, 2 Wheeler License, basic PC knowledge"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Opening Active</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-colors",
                                        formData.active ? "bg-racing-blue" : "bg-muted"
                                    )}
                                >
                                    <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", formData.active ? "translate-x-6" : "translate-x-0")} />
                                </button>
                            </div>
                            <div className="flex gap-4">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingId(null); setFormData({ title: "", description: "", location: "Katihar Showroom", status: "Immediate Joining", active: true, requirements: "" }); }}
                                        className="px-6 py-3 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-racing-blue/20 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Opening" : "Add Opening"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Openings List */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Openings</h4>
                        {loading ? (
                            <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-racing-blue animate-spin" /></div>
                        ) : openings.length === 0 ? (
                            <div className="py-12 text-center text-sm font-bold text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">No openings found. Add your first job posting above.</div>
                        ) : (
                            <div className="grid gap-4">
                                {openings.map(job => (
                                    <div key={job._id} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-racing-blue/30 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                                job.active ? "bg-racing-blue/5 text-racing-blue" : "bg-muted text-muted-foreground"
                                            )}>
                                                {job.active ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h5 className="text-base font-display font-black text-foreground uppercase tracking-tight">{job.title}</h5>
                                                    <span className="px-3 py-1 bg-muted rounded-full text-[8px] font-black uppercase tracking-widest text-muted-foreground">{job.status}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{job.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => startEdit(job)} className="p-3 hover:bg-racing-blue/10 text-racing-blue rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(job._id)} className="p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
