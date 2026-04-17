"use client";

import { useState, useEffect } from "react";
import { Save, Phone, Mail, Loader2, CheckCircle2, MapPin, Lock, ShieldCheck, AlertCircle, Users, Briefcase, ChevronRight } from "lucide-react";
import { API_URL } from "@/lib/config";
import { EmployeeManagement } from "@/components/features/EmployeeManagement";
import Link from "next/link";

export default function SettingsPage() {
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [settings, setSettings] = useState({
        showroomPhone: "",
        showroomEmail: "",
        showroomAddress: "",
        showroomMap: "",
        servicePhone: "",
        serviceAddress: "",
        serviceMap: ""
    });
    const [unreadApplications, setUnreadApplications] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // Security states
    const [security, setSecurity] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [securitySaving, setSecuritySaving] = useState(false);
    const [securitySuccess, setSecuritySuccess] = useState(false);
    const [securityError, setSecurityError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [configRes, unreadRes] = await Promise.all([
                    fetch(`${API_URL}/config`),
                    fetch(`${API_URL}/career/admin/notifications/unread`)
                ]);

                const configData = await configRes.json();
                if (configData.success) {
                    setSettings({
                        showroomPhone: configData.data.showroomPhone || "",
                        showroomEmail: configData.data.showroomEmail || "",
                        showroomAddress: configData.data.showroomAddress || "",
                        showroomMap: configData.data.showroomMap || "",
                        servicePhone: configData.data.servicePhone || "",
                        serviceAddress: configData.data.serviceAddress || "",
                        serviceMap: configData.data.serviceMap || ""
                    });
                }

                const unreadData = await unreadRes.json();
                if (unreadData.success) {
                    setUnreadApplications(unreadData.count);
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
            const res = await fetch(`${API_URL}/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings }),
                credentials: "include"
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

    const handleSecuritySave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSecurityError("");
        setSecuritySuccess(false);

        if (security.newPassword !== security.confirmPassword) {
            setSecurityError("New passwords do not match");
            return;
        }

        if (security.newPassword.length < 6) {
            setSecurityError("Password must be at least 6 characters");
            return;
        }

        setSecuritySaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/auth/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: security.currentPassword,
                    newPassword: security.newPassword
                }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setSecuritySuccess(true);
                setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setTimeout(() => setSecuritySuccess(false), 3000);
            } else {
                setSecurityError(data.message || "Failed to update password");
            }
        } catch (err) {
            setSecurityError("Connection failed");
        } finally {
            setSecuritySaving(false);
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
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                        GENERAL SETTINGS
                    </h2>
                    {unreadApplications > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-racing-blue/10 border border-racing-blue/20 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                            <div className="w-1.5 h-1.5 bg-racing-blue rounded-full" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-racing-blue">New Notifications</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Configure showroom contact details and messaging defaults</p>
            </div>

            <form onSubmit={handleSave} className="max-w-5xl space-y-8">
                <div className={`bg-card border ${unreadApplications > 0 ? 'border-racing-blue/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]' : 'border-border'} rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 transition-all duration-500`}>
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-racing-blue border-b border-racing-blue/10 pb-2">Showroom Contact Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="showroomPhone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone (WhatsApp)</label>
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
                                <label htmlFor="showroomEmail" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                    <input
                                        id="showroomEmail"
                                        type="email"
                                        value={settings.showroomEmail}
                                        onChange={(e) => setSettings({ ...settings, showroomEmail: e.target.value })}
                                        placeholder="contact@choudharyYamaha.com"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    />
                                </div>
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
                            <label htmlFor="showroomMap" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Showroom Map Location (URL)</label>
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

                        <h3 className="text-sm font-black uppercase tracking-widest text-racing-blue border-b border-racing-blue/10 pb-2 pt-4">Service Side Contact Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="servicePhone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Contact</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                    <input
                                        id="servicePhone"
                                        type="text"
                                        value={settings.servicePhone}
                                        onChange={(e) => setSettings({ ...settings, servicePhone: e.target.value })}
                                        placeholder="+91 97333 27604"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="serviceMap" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Map (URL)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                    <input
                                        id="serviceMap"
                                        type="text"
                                        value={settings.serviceMap}
                                        onChange={(e) => setSettings({ ...settings, serviceMap: e.target.value })}
                                        placeholder="Google Maps URL"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="serviceAddress" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                <input
                                    id="serviceAddress"
                                    type="text"
                                    value={settings.serviceAddress}
                                    onChange={(e) => setSettings({ ...settings, serviceAddress: e.target.value })}
                                    placeholder="Full Service Address"
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
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

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEmployeeModalOpen(true)}
                                className="flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95 h-fit whitespace-nowrap"
                            >
                                <Users className="w-4 h-4 text-racing-blue" />
                                Manage Employees
                            </button>

                            <Link
                                href="/admin/settings/careers"
                                className={`flex items-center gap-3 px-8 py-4 bg-zinc-900 border ${unreadApplications > 0 ? 'border-racing-blue animate-pulse' : 'border-white/5'} text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95 h-fit whitespace-nowrap relative`}
                            >
                                <Briefcase className="w-4 h-4 text-racing-blue" />
                                Manage Careers
                                {unreadApplications > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-blue opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-racing-blue items-center justify-center text-[8px] font-black">
                                            {unreadApplications}
                                        </span>
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </form>

            <EmployeeManagement
                isOpen={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
            />

            <div className="pt-8 border-t border-border">
                <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                    SECURITY SETTINGS
                </h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Manage administrative access credentials</p>
            </div>

            <form onSubmit={handleSecuritySave} className="max-w-2xl space-y-8 pb-12">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="currentPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Admin Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={security.currentPassword}
                                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={security.newPassword}
                                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                        placeholder="Min. 6 characters"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={security.confirmPassword}
                                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                        placeholder="Repeat new password"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {securityError && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{securityError}</span>
                        </div>
                    )}

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={securitySaving}
                            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {securitySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {securitySaving ? "Updating..." : "Update Password"}
                        </button>

                        {securitySuccess && (
                            <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-left-4">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Password Updated</span>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
