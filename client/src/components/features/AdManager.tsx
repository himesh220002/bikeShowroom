"use client";

import { useEffect, useState } from "react";
import { Upload, Link as LinkIcon, Eye, Trash2, CheckCircle2, AlertCircle, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Campaign = {
    _id: string;
    name: string;
    type: "Poster" | "Video" | "Banner";
    status: "Active" | "Scheduled" | "Ended";
    impact: string;
    createdAt: string;
};

export function AdManager() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/ads");
                const data = await res.json();
                if (data.success) setCampaigns(data.data);
            } catch (err) {
                console.error("Failed to fetch ads:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Ad Network...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                        AD <span className="text-gradient">MANAGEMENT</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Control your showroom's digital footprint</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-racing-blue/20">
                    <Plus className="w-4 h-4" />
                    New Campaign
                </button>
            </div>

            {/* Upload Zone */}
            <div className="p-12 border-2 border-dashed border-border rounded-[3rem] bg-card/50 flex flex-col items-center justify-center text-center group hover:border-racing-blue/50 transition-colors">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-racing-blue" />
                </div>
                <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter mb-2">Upload Visual Assets</h3>
                <p className="text-xs text-muted-foreground max-w-xs mb-8 font-medium">Drag and drop posters, banners, or motion graphics. Recommended: 1920x1080 for banners.</p>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-card border border-border text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Browse Files</button>
                    <button className="px-6 py-3 border border-border text-muted-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-muted hover:text-foreground transition-all">External Link</button>
                </div>
            </div>

            {/* Campaign List */}
            <div className="bg-background/50 border border-border rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-racing-blue">Active Campaigns</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{campaigns.length} Total</span>
                </div>
                <div className="divide-y border-border/50">
                    {campaigns.length === 0 && (
                        <div className="p-20 text-center opacity-20 italic text-sm font-medium">
                            No active campaigns detected in the stream...
                        </div>
                    )}
                    {campaigns.map((camp) => (
                        <div key={camp._id} className="p-6 md:px-10 flex items-center justify-between hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border">
                                    {camp.type === "Poster" && <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                                    {camp.type === "Video" && <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                    {camp.type === "Banner" && <Plus className="w-5 h-5 text-racing-blue" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">{camp.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{camp.type}</span>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Impact: {camp.impact}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                    camp.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" :
                                        camp.status === "Scheduled" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" :
                                            "bg-muted text-muted-foreground border-border"
                                )}>
                                    {camp.status}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 border border-border rounded-xl hover:bg-muted transition-all">
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 border border-border rounded-xl hover:bg-muted transition-all">
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
