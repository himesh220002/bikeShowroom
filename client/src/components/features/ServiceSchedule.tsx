"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, Clock, User, Bike, CheckCircle2, AlertCircle, MoreVertical, Search, Filter, Wrench, Loader2, Phone, ShieldAlert, ChevronDown, UserCheck, X, Save } from "lucide-react";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { AdminTableControls } from "@/components/ui/AdminTableControls";

export function ServiceSchedule() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        customer: "",
        phone: "",
        bikeModel: "",
        regNumber: "",
        serviceType: "",
        appointmentTime: "",
        priority: "Normal",
        technician: ""
    });
    const [updating, setUpdating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filterStatus, setFilterStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tempRemarks, setTempRemarks] = useState<{ [key: string]: string }>({});
    const [savingRemark, setSavingRemark] = useState<string | null>(null);

    const isAtRisk = (timeStr: string, dateStr: string, status: string) => {
        if (status !== 'booked') return false;
        try {
            const [time, modifier] = timeStr.split(' ');
            let [hoursStr, minutesStr] = time.split(':');
            let hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);

            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const appointmentDate = new Date(dateStr);
            appointmentDate.setHours(hours, minutes, 0, 0);

            const now = new Date();
            const diffInMinutes = (now.getTime() - appointmentDate.getTime()) / (1000 * 60);

            return diffInMinutes > 30;
        } catch (e) {
            return false;
        }
    };

    const STATUS_OPTIONS = ['booked', 'in-progress', 'completed', 'delivered', 'cancelled', 'deferred'];
    const statusColors: any = {
        'booked': "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        'in-progress': "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        'completed': "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        'delivered': "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        'cancelled': "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        'deferred': "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    };

    const handleEdit = (job: any) => {
        setEditingJob(job);
        setEditForm({
            customer: job.customer,
            phone: job.phone,
            bikeModel: job.bikeModel,
            regNumber: job.regNumber,
            serviceType: job.type,
            appointmentTime: job.time,
            priority: job.priority,
            technician: job.technician === "Unassigned" ? "" : job.technician
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch(`${API_URL}/services/${editingJob.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editForm.customer,
                    phone: editForm.phone,
                    bikeModel: editForm.bikeModel,
                    regNumber: editForm.regNumber,
                    serviceType: editForm.serviceType,
                    appointmentTime: editForm.appointmentTime,
                    priority: editForm.priority,
                    technicianName: editForm.technician
                })
            });
            const data = await res.json();
            if (data.success) {
                const updated = data.data;
                setJobs(prev => prev.map(job =>
                    job.id === editingJob.id ? {
                        ...job,
                        customer: updated.name,
                        phone: updated.phone,
                        bikeModel: updated.bikeModel,
                        regNumber: updated.regNumber,
                        bike: `${updated.bikeModel} (${updated.regNumber})`,
                        type: updated.serviceType,
                        time: updated.appointmentTime,
                        priority: updated.priority,
                        technician: updated.technicianName || "Unassigned"
                    } : job
                ));
                setIsEditModalOpen(false);
            } else {
                alert("Failed to update service: " + data.error);
            }
        } catch (err) {
            console.error("Error updating service:", err);
        } finally {
            setUpdating(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API_URL}/services/${id}/status`, {
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

    const handleSaveRemark = async (id: string) => {
        const remark = tempRemarks[id];
        if (remark === undefined) return;

        setSavingRemark(id);
        try {
            const res = await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: remark })
            });
            const data = await res.json();
            if (data.success) {
                setJobs(prev => prev.map(job =>
                    job.id === id ? { ...job, notes: remark } : job
                ));
                const newTemp = { ...tempRemarks };
                delete newTemp[id];
                setTempRemarks(newTemp);
            } else {
                alert("Failed to save remark: " + data.error);
            }
        } catch (err) {
            console.error("Error saving remark:", err);
        } finally {
            setSavingRemark(null);
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/services`);
                const data = await res.json();
                if (data.success) {
                    const formatted = data.data.map((s: any) => ({
                        id: s._id,
                        customer: s.name,
                        phone: s.phone,
                        bikeModel: s.bikeModel,
                        regNumber: s.regNumber,
                        bike: `${s.bikeModel} (${s.regNumber})`,
                        type: s.serviceType,
                        time: s.appointmentTime || "Not Set",
                        date: s.appointmentDate || "",
                        status: s.status, // already lowercase from backend
                        priority: s.priority || "Normal",
                        technician: s.technicianName || "Unassigned",
                        notes: s.notes || ""
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

    const processedJobs = useMemo(() => {
        let filtered = [...jobs];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(j =>
                j.customer?.toLowerCase().includes(q) ||
                j.phone?.toLowerCase().includes(q) ||
                j.bikeModel?.toLowerCase().includes(q) ||
                j.regNumber?.toLowerCase().includes(q) ||
                j.type?.toLowerCase().includes(q) ||
                j.technician?.toLowerCase().includes(q) ||
                j.notes?.toLowerCase().includes(q)
            );
        }
        if (filterStatus !== "all") {
            filtered = filtered.filter(j => j.status === filterStatus);
        }
        if (startDate) {
            filtered = filtered.filter(j => new Date(j.time || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(j => new Date(j.time || 0) <= end);
        }
        return filtered.sort((a, b) => {
            if (sortBy === "name") return (a.customer || "").localeCompare(b.customer || "");
            if (sortBy === "oldest") return new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime();
            return new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime();
        });
    }, [jobs, searchQuery, filterStatus, sortBy, startDate, endDate]);

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
                    <h2 className="text-2xl font-display font-black text-foreground/70 uppercase tracking-tighter">
                        SERVICE <span className="text-gradient">SCHEDULE</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Manage daily workshop operations</p>
                </div>
                <AdminTableControls
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOptions={[
                        { label: "Newest Appointment", value: "newest" },
                        { label: "Oldest Appointment", value: "oldest" },
                        { label: "Customer Name A-Z", value: "name" }
                    ]}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                    filterOptions={[
                        { label: "All Status", value: "all" },
                        { label: "Booked", value: "booked" },
                        { label: "In Progress", value: "in-progress" },
                        { label: "Completed", value: "completed" },
                        { label: "Delivered", value: "delivered" }
                    ]}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    endDate={endDate}
                    onEndDateChange={setEndDate}
                    placeholder="Search workshop jobs by name, reg, bike or tech..."
                    className="md:w-auto flex-1"
                />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    {
                        label: "Today's Jobs",
                        value: jobs.filter(j => j.status !== 'cancelled').length.toString(),
                        color: "text-foreground",
                        sub: "Active + Delivered + Pending"
                    },
                    {
                        label: "Active",
                        value: jobs.filter(j => j.status === "in-progress" || j.status === "completed").length.toString(),
                        color: "text-blue-600 dark:text-blue-400",
                        sub: "In Workshop"
                    },
                    {
                        label: "Delivered",
                        value: jobs.filter(j => j.status === "delivered").length.toString(),
                        color: "text-purple-600 dark:text-purple-400",
                        sub: "Handed Over"
                    },
                    {
                        label: "Pending",
                        value: jobs.filter(j => j.status === "booked").length.toString(),
                        color: "text-amber-600 dark:text-amber-400",
                        sub: "Waiting to Start"
                    },
                    {
                        label: "Cancelled",
                        value: jobs.filter(j => j.status === "cancelled" || j.status === "deferred").length.toString(),
                        color: "text-red-600 dark:text-red-400",
                        sub: "Not Proceeded"
                    },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-card border border-border rounded-[1.5rem] text-center flex flex-col justify-center gap-1 group hover:border-racing-blue/30 transition-all">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-racing-blue transition-colors">{stat.label}</span>
                        <span className={cn("text-2xl font-display font-black italic leading-none", stat.color)}>{stat.value}</span>
                        <span className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground/50">{stat.sub}</span>
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
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Service Remarks</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-border/50">
                            {processedJobs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center opacity-20 italic text-sm font-medium">
                                        No active jobs in the workshop...
                                    </td>
                                </tr>
                            )}
                            {processedJobs.map((job) => (
                                <tr key={job.id} className="group hover:bg-muted/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-racing-blue" />
                                                <span className="text-sm font-black text-foreground italic">{job.time}</span>
                                                {isAtRisk(job.time, job.date, job.status) && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-[7px] font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-red-500/20">
                                                        AT RISK
                                                    </span>
                                                )}
                                            </div>
                                            <div className={cn(
                                                "flex items-center gap-1.5 px-2 py-0.5 rounded-lg border w-fit",
                                                job.priority === "High" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-muted/30 text-muted-foreground border-border/50"
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
                                        <div className="flex items-center gap-2 max-w-[200px] group/remark">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={tempRemarks[job.id] !== undefined ? tempRemarks[job.id] : (job.notes || "")}
                                                    onChange={(e) => setTempRemarks({ ...tempRemarks, [job.id]: e.target.value })}
                                                    placeholder="Add special instructions..."
                                                    className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-racing-blue focus:outline-none text-[14px] font-medium py-1 transition-all placeholder:text-muted-foreground/30"
                                                />
                                            </div>
                                            {(tempRemarks[job.id] !== undefined && tempRemarks[job.id] !== job.notes) && (
                                                <button
                                                    onClick={() => handleSaveRemark(job.id)}
                                                    disabled={savingRemark === job.id}
                                                    className="p-1.5 bg-green-500/10  text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
                                                >
                                                    {savingRemark === job.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Save className="w-3 h-3" />
                                                    )}
                                                </button>
                                            )}
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
                                        <button
                                            onClick={() => handleEdit(job)}
                                            className="p-2 border border-border rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-racing-blue group/edit"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-racing-blue/50 via-racing-blue to-racing-blue/50" />

                            <div className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">
                                            EDIT <span className="text-gradient">SERVICE JOB</span>
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Update job details and assign personnel</p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="p-3 hover:bg-muted rounded-2xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    value={editForm.customer}
                                                    onChange={(e) => setEditForm({ ...editForm, customer: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bike Model</label>
                                            <div className="relative group">
                                                <Bike className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    value={editForm.bikeModel}
                                                    onChange={(e) => setEditForm({ ...editForm, bikeModel: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registration Number</label>
                                            <div className="relative group">
                                                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    value={editForm.regNumber}
                                                    onChange={(e) => setEditForm({ ...editForm, regNumber: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Type</label>
                                            <div className="relative group">
                                                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    value={editForm.serviceType}
                                                    onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
                                            <div className="relative group">
                                                <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <select
                                                    value={editForm.priority}
                                                    onChange={(e: any) => setEditForm({ ...editForm, priority: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="Normal">Normal</option>
                                                    <option value="High">High</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Technician Assigned</label>
                                            <div className="relative group">
                                                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter technician name"
                                                    value={editForm.technician}
                                                    onChange={(e) => setEditForm({ ...editForm, technician: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {updating ? "Saving Changes..." : "Save Job Details"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-8 py-4 bg-muted text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
