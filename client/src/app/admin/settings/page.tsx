"use client";

import { useState, useEffect } from "react";
import { Save, Phone, Mail, Loader2, CheckCircle2, MapPin } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        showroomPhone: "",
        showroomEmail: "",
        showroomAddress: "",
        showroomMap: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/config");
                const data = await res.json();
                if (data.success) {
                    setSettings({
                        showroomPhone: data.data.showroomPhone || "",
                        showroomEmail: data.data.showroomEmail || "",
                        showroomAddress: data.data.showroomAddress || "",
                        showroomMap: data.data.showroomMap || ""
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            const res = await fetch("http://localhost:5000/api/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save settings:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Loading Configuration...</span>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                    GENERAL <span className="text-gradient">SETTINGS</span>
                </h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Configure showroom contact details and messaging defaults</p>
            </div>

            <form onSubmit={handleSave} className="max-w-2xl space-y-8">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="showroomPhone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Showroom Phone (WhatsApp)</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                <input
                                    id="showroomPhone"
                                    type="text"
                                    value={settings.showroomPhone}
                                    onChange={(e) => setSettings({ ...settings, showroomPhone: e.target.value })}
                                    placeholder="+91 91223 45678"
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="showroomEmail" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Showroom Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                <input
                                    id="showroomEmail"
                                    type="email"
                                    value={settings.showroomEmail}
                                    onChange={(e) => setSettings({ ...settings, showroomEmail: e.target.value })}
                                    placeholder="contact@choudharyautomobile.com"
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="showroomAddress" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Showroom Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                <input
                                    id="showroomAddress"
                                    type="text"
                                    value={settings.showroomAddress}
                                    onChange={(e) => setSettings({ ...settings, showroomAddress: e.target.value })}
                                    placeholder="Full Showroom Address"
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="showroomMap" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Google Maps Location (URL)</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                <input
                                    id="showroomMap"
                                    type="text"
                                    value={settings.showroomMap}
                                    onChange={(e) => setSettings({ ...settings, showroomMap: e.target.value })}
                                    placeholder="Google Maps URL"
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-4 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-racing-blue/20 disabled:opacity-50 disabled:scale-100"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? "Saving Changes..." : "Save Settings"}
                        </button>

                        {success && (
                            <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-left-4">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Saved Successfully</span>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
