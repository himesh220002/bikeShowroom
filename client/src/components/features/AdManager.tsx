"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Link as LinkIcon, Eye, Trash2, Plus, Loader2, X, Image as ImageIcon, CheckCircle2, GripVertical, Edit3 } from "lucide-react";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";
import { motion, Reorder } from "framer-motion";

type Campaign = {
    _id: string;
    name: string;
    type: "Poster" | "Video" | "Banner";
    image: string;
    description?: string;
    link: string;
    status: "Active" | "Inactive" | "Scheduled";
    impact: string;
    month?: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
};

export function AdManager() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingAd, setEditingAd] = useState<Campaign | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [type, setType] = useState<"Poster" | "Video" | "Banner">("Poster");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [month, setMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<"Active" | "Inactive" | "Scheduled">("Scheduled");
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchAds = async () => {
        try {
            const res = await fetch(`${API_URL}/ads`);
            const data = await res.json();
            if (data.success) setCampaigns(data.data);
        } catch (err) {
            console.error("Failed to fetch ads:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !link) return;
        if (!editingAd && !image) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('link', link);
        formData.append('description', description);
        if (image) formData.append('image', image);
        formData.append('status', status);
        formData.append('month', month);
        if (startDate) formData.append('startDate', startDate);
        if (endDate) formData.append('endDate', endDate);

        try {
            const url = editingAd ? `${API_URL}/ads/${editingAd._id}` : `${API_URL}/ads`;
            const method = editingAd ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                if (editingAd) {
                    setCampaigns(campaigns.map(c => c._id === editingAd._id ? data.data : c));
                } else {
                    setCampaigns([data.data, ...campaigns]);
                }
                setIsAdding(false);
                setEditingAd(null);
                resetForm();
            }
        } catch (err) {
            console.error("Operation failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleReorder = async (newOrder: Campaign[]) => {
        setCampaigns(newOrder);

        // Prepare reorder data
        const reorderData = newOrder.map((camp, index) => ({
            _id: camp._id,
            priority: index
        }));

        try {
            await fetch(`${API_URL}/ads/reorder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ads: reorderData })
            });
        } catch (err) {
            console.error("Reorder failed:", err);
            // Optionally revert UI state if needed
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            const res = await fetch(`${API_URL}/ads/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setCampaigns(campaigns.filter(c => c._id !== id));
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const resetForm = () => {
        setName("");
        setType("Poster");
        setLink("");
        setDescription("");
        setImage(null);
        setPreviewUrl(null);
        setEditingAd(null);
        setMonth("");
        setStartDate("");
        setEndDate("");
        setStatus("Scheduled");
    };

    const startEditing = (ad: Campaign) => {
        setEditingAd(ad);
        setName(ad.name);
        setType(ad.type);
        setLink(ad.link);
        setDescription(ad.description || "");
        setPreviewUrl(ad.image);
        setMonth(ad.month || "");
        setStartDate(ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : "");
        setEndDate(ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : "");
        setStatus(ad.status);
        setIsAdding(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Ad Network...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 text-foreground">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-0">
                <div>
                    <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                        AD MANAGEMENT
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Control your showroom's digital footprint</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Campaign
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-display font-black uppercase tracking-tighter text-foreground">
                            {editingAd ? `Edit Campaign: ${editingAd.name}` : "Create New Campaign"}
                        </h3>
                        <button onClick={() => { setIsAdding(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="w-5 h-5 text-foreground" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Name</label>
                                <input
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Ram Navami Mahabachat"
                                    className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ad Type</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value as any)}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all appearance-none"
                                    >
                                        <option value="Poster">Poster</option>
                                        <option value="Video">Video</option>
                                        <option value="Banner">Banner</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Social/Video Link</label>
                                    <input
                                        required
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        placeholder="YouTube/Social URL"
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Brief details about the offer..."
                                    rows={3}
                                    className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Month</label>
                                    <select
                                        value={month}
                                        onChange={e => setMonth(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all appearance-none"
                                    >
                                        <option value="">No specific month</option>
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Status</label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as any)}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all appearance-none font-bold"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Schedule Start</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Schedule End</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || (!editingAd && !image)}
                                className="w-full py-4 bg-racing-blue text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-racing-blue/20 hover:bg-dark-racing transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                {uploading ? (editingAd ? "Updating..." : "Broadcasting...") : (editingAd ? "Save Changes" : "Launch Campaign")}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Visual Template</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative aspect-[4/3] w-full border-2 border-dashed border-border rounded-3xl overflow-hidden group cursor-pointer hover:border-racing-blue/50 transition-colors flex flex-col items-center justify-center bg-muted/30"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-xl">
                                            <Upload className="w-6 h-6 text-racing-blue" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Select digital template</p>
                                        <p className="text-[8px] text-muted-foreground mt-2 uppercase font-bold tracking-tighter">PDF, JPG, PNG or MP4 Frames</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {previewUrl && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Campaign List */}
            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                    <span className="text-[10px] font-black uppercase tracking-widest text-racing-blue">Active Streams</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{campaigns.length} Total Campaigns</span>
                </div>
                <Reorder.Group
                    axis="y"
                    values={campaigns}
                    onReorder={handleReorder}
                    className="divide-y border-border/50"
                >
                    {campaigns.length === 0 && (
                        <div className="p-32 text-center">
                            <ImageIcon className="w-12 h-12 text-muted/20 mx-auto mb-4" />
                            <p className="text-xl font-display font-black text-muted/30 uppercase tracking-tighter italic">
                                No active campaigns detected...
                            </p>
                        </div>
                    )}
                    {campaigns.map((camp) => (
                        <Reorder.Item
                            key={camp._id}
                            value={camp}
                            className="p-6 md:px-10 flex items-center justify-between hover:bg-muted/30 transition-colors bg-background/50 cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex items-center gap-8">
                                <div className="text-muted-foreground/30 hover:text-racing-blue transition-colors">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="w-20 h-20 bg-muted rounded-2xl overflow-hidden border border-border flex-shrink-0">
                                    <img src={camp.image} alt={camp.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-display font-black text-foreground uppercase tracking-tight">{camp.name}</h4>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-racing-blue">{camp.type}</span>
                                        {camp.month && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">{camp.month} Edition</span>
                                            </>
                                        )}
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <a href={camp.link} target="_blank" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue flex items-center gap-1 transition-colors">
                                            <LinkIcon className="w-3 h-3" />
                                            Target Link
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4 pt-1">
                                        {camp.startDate && (
                                            <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">
                                                From: {new Date(camp.startDate).toLocaleDateString()}
                                            </span>
                                        )}
                                        {camp.endDate && (
                                            <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">
                                                Until: {new Date(camp.endDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    {camp.description && <p className="text-[10px] text-muted-foreground font-medium max-w-sm line-clamp-1">{camp.description}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Live Status</span>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        camp.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" :
                                            camp.status === "Scheduled" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" :
                                                "bg-red-500/10 text-red-600 border-red-500/20"
                                    )}>
                                        {camp.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={camp.link}
                                        target="_blank"
                                        className="p-3 bg-muted/50 border border-border rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-racing-blue"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => startEditing(camp)}
                                        className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500 hover:text-white transition-all text-blue-600/60 transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(camp._id)}
                                        className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-600/60 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
        </div>
    );
}
