"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, Bike, CheckCircle2, AlertCircle, MoreVertical, Search, Filter, Wrench, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ServiceSchedule() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/services");
                const data = await res.json();
                if (data.success) {
                    const formatted = data.data.map((s: any) => ({
                        id: s._id,
                        customer: s.name,
                        bike: `${s.bikeModel} (${s.regNumber})`,
                        type: s.serviceType,
                        time: s.appointmentTime || "Not Set",
                        status: s.status,
                        priority: s.priority || "Normal"
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Retrieving Service Queue...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                        SERVICE <span className="text-gradient">SCHEDULE</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Manage daily workshop operations</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-racing-blue transition-colors" />
                        <input
                            placeholder="Search jobs..."
                            className="bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-racing-blue transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Today's Jobs", value: jobs.length.toString(), color: "text-white" },
                    { label: "In-Progress", value: jobs.filter(j => j.status === "In-Progress").length.toString(), color: "text-blue-400" },
                    { label: "Completed", value: jobs.filter(j => j.status === "Completed").length.toString(), color: "text-green-400" },
                    { label: "Pending", value: jobs.filter(j => j.status === "Pending").length.toString(), color: "text-amber-400" },
                ].map((stat) => (
                    <div key={stat.label} className="p-6 bg-zinc-900/50 border border-zinc-900 rounded-[2rem] text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">{stat.label}</span>
                        <span className={cn("text-3xl font-display font-black italic", stat.color)}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Job List */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900/50 border-b border-zinc-800">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Time</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Customer & Bike</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Service Type</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center opacity-20 italic text-sm font-medium">
                                        No active jobs in the workshop...
                                    </td>
                                </tr>
                            )}
                            {jobs.map((job) => (
                                <tr key={job.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-racing-blue" />
                                            <span className="text-sm font-black text-white italic">{job.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-racing-blue/50 transition-colors">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{job.customer}</h4>
                                                <span className="text-[10px] font-bold text-gray-500">{job.bike}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{job.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            job.status === "In-Progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                job.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                    job.status === "Completed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                        "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all">
                                            <MoreVertical className="w-4 h-4 text-gray-500" />
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
