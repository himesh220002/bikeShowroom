"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, Bike, CheckCircle2, AlertCircle, MoreVertical, Search, Filter, Wrench, Loader2, Phone, ShieldAlert, ChevronDown, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ServiceSchedule() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const STATUS_OPTIONS = ['booked', 'in-progress', 'completed', 'delivered', 'cancelled'];
    const statusColors: any = {
        'booked': "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        'in-progress': "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        'completed': "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        'delivered': "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        'cancelled': "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/services/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setJobs(prev => prev.map(job =>
                    job.id === id ? { ...job, status } : job
                ));
            } else {
                alert("Failed to update status: " + data.error);
            }
        } catch (err) {
            console.error("Error updating service status:", err);
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/services");
                const data = await res.json();
                if (data.success) {
                    const formatted = data.data.map((s: any) => ({
                        id: s._id,
                        customer: s.name,
                        phone: s.phone,
                        bike: `${s.bikeModel} (${s.regNumber})`,
                        type: s.serviceType,
                        time: s.appointmentTime || "Not Set",
                        status: s.status, // already lowercase from backend
                        priority: s.priority || "Normal",
                        technician: s.technicianName || "Unassigned"
                    }));
                    setJobs(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch service schedule:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Retrieving Service Queue...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                        SERVICE <span className="text-gradient">SCHEDULE</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Manage daily workshop operations</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-racing-blue transition-colors" />
                        <input
                            placeholder="Search jobs..."
                            className="bg-card border border-border rounded-xl pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-racing-blue transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Today's Jobs", value: jobs.length.toString(), color: "text-foreground" },
                    { label: "In-Progress", value: jobs.filter(j => j.status === "in-progress").length.toString(), color: "text-blue-600 dark:text-blue-400" },
                    { label: "Completed", value: jobs.filter(j => j.status === "completed").length.toString(), color: "text-green-600 dark:text-green-400" },
                    { label: "Booked", value: jobs.filter(j => j.status === "booked").length.toString(), color: "text-amber-600 dark:text-amber-400" },
                ].map((stat) => (
                    <div key={stat.label} className="p-6 bg-card border border-border rounded-[2rem] text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{stat.label}</span>
                        <span className={cn("text-3xl font-display font-black italic", stat.color)}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Job List */}
            <div className="bg-background/90 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-card/50 border-b border-border">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Time & Priority</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer & Vehicle</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Service & Tech</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-border/50">
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center opacity-20 italic text-sm font-medium">
                                        No active jobs in the workshop...
                                    </td>
                                </tr>
                            )}
                            {jobs.map((job) => (
                                <tr key={job.id} className="group hover:bg-muted/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-racing-blue" />
                                                <span className="text-sm font-black text-foreground italic">{job.time}</span>
                                            </div>
                                            <div className={cn(
                                                "flex items-center gap-1.5 px-2 py-0.5 rounded-lg border w-fit",
                                                job.priority === "High" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                            )}>
                                                <ShieldAlert className="w-2.5 h-2.5" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">{job.priority}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:border-racing-blue/50 transition-colors">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">{job.customer}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-muted-foreground">{job.bike}</span>
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-racing-blue/70">
                                                        <Phone className="w-2.5 h-2.5" />
                                                        {job.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{job.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-racing-blue/10 rounded-full flex items-center justify-center border border-racing-blue/20">
                                                    <UserCheck className="w-3 h-3 text-racing-blue" />
                                                </div>
                                                <span className="text-[10px] font-black text-foreground/70 uppercase tracking-tighter">{job.technician}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="relative group/status w-fit">
                                            <span className={cn(
                                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                                                statusColors[job.status] || "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {job.status.replace('-', ' ')}
                                                <ChevronDown className="w-3 h-3 transition-transform group-hover/status:rotate-180" />
                                            </span>
                                            <div className="absolute top-full left-0 pt-2 hidden group-hover/status:block z-50">
                                                <div className="flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden w-40">
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => updateStatus(job.id, opt)}
                                                            className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border-b border-border/50 last:border-0"
                                                        >
                                                            {opt.replace('-', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 border border-border rounded-xl hover:bg-muted transition-all">
                                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
