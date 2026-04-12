"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, Clock, Plus, User, Bike, CheckCircle2, AlertCircle, MoreVertical, Search, Filter, Wrench, Loader2, Phone, ShieldAlert, ChevronDown, UserCheck, X, Save, MessageSquare, IndianRupee, Tag, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { AdminTableControls } from "@/components/ui/AdminTableControls";
import { ManualServiceModal } from "./ManualServiceModal";
import io from "socket.io-client";

export function ServiceSchedule() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        customer: "",
        phone: "",
        bikeModel: "",
        regNumber: "",
        serviceType: "",
        appointmentDate: "",
        appointmentTime: "",
        priority: "Normal",
        technician: "",
        billingType: "paid" as 'free' | 'paid',
        cost: 0
    });
    const [updating, setUpdating] = useState(false);
    const [openStatusId, setOpenStatusId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [sortBy, setSortBy] = useState("newest");
    const [filterStatus, setFilterStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tempRemarks, setTempRemarks] = useState<{ [key: string]: string }>({});
    const [savingRemark, setSavingRemark] = useState<string | null>(null);

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

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
        'booked': "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        'in-progress': "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        'completed': "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        'delivered': "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
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
            appointmentDate: job.date,
            appointmentTime: job.time,
            priority: job.priority,
            technician: job.technician === "Unassigned" ? "" : job.technician,
            billingType: job.billingType || 'paid',
            cost: job.cost || 0
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
                    appointmentDate: editForm.appointmentDate,
                    appointmentTime: editForm.appointmentTime,
                    priority: editForm.priority,
                    technicianName: editForm.technician,
                    billingType: editForm.billingType,
                    cost: editForm.cost
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
                        date: updated.appointmentDate,
                        time: updated.appointmentTime,
                        priority: updated.priority,
                        technician: updated.technicianName || "Unassigned",
                        billingType: updated.billingType || 'paid',
                        cost: updated.cost || 0
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
                const updated = data.data;
                setJobs(prev => prev.map(job =>
                    job.id === id ? {
                        ...job,
                        status: updated.status,
                        priority: updated.priority,
                        deliveredAt: updated.deliveredAt
                    } : job
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
        const socket = io(API_URL.replace('/api', ''));

        socket.on('service_updated', (updatedService: any) => {
            setJobs(prev => prev.map(job =>
                job.id === updatedService._id ? {
                    ...job,
                    customer: updatedService.name,
                    phone: updatedService.phone,
                    bikeModel: updatedService.bikeModel,
                    regNumber: updatedService.regNumber,
                    bike: `${updatedService.bikeModel} (${updatedService.regNumber})`,
                    type: updatedService.serviceType,
                    time: updatedService.appointmentTime || "Not Set",
                    date: updatedService.appointmentDate || "",
                    status: updatedService.status,
                    priority: updatedService.priority || "Normal",
                    technician: updatedService.technicianName || "Unassigned",
                    notes: updatedService.notes || "",
                    cost: updatedService.cost || 0,
                    billingType: updatedService.billingType || 'paid',
                    serviceNumber: updatedService.serviceNumber || 1,
                    deliveredAt: updatedService.deliveredAt || null
                } : job
            ));
        });

        socket.on('new_service', (newService: any) => {
            const formatted = {
                id: newService._id,
                customer: newService.name,
                phone: newService.phone,
                bikeModel: newService.bikeModel,
                regNumber: newService.regNumber,
                bike: `${newService.bikeModel} (${newService.regNumber})`,
                type: newService.serviceType,
                time: newService.appointmentTime || "Not Set",
                date: newService.appointmentDate || "",
                status: newService.status,
                priority: newService.priority || "Normal",
                technician: newService.technicianName || "Unassigned",
                notes: newService.notes || "",
                cost: newService.cost || 0,
                billingType: newService.billingType || 'paid',
                serviceNumber: newService.serviceNumber || 1,
                deliveredAt: newService.deliveredAt || null
            };
            setJobs(prev => [formatted, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
                        status: s.status,
                        priority: s.priority || "Normal",
                        technician: s.technicianName || "Unassigned",
                        notes: s.notes || "",
                        cost: s.cost || 0,
                        billingType: s.billingType || 'paid',
                        serviceNumber: s.serviceNumber || 1,
                        deliveredAt: s.deliveredAt || null
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
        const statusOrder = ['booked', 'in-progress', 'completed', 'delivered', 'cancelled', 'deferred'];

        let finalJobs = [...filtered];

        if (sortConfig) {
            const { key, direction } = sortConfig;
            finalJobs.sort((a, b) => {
                let aVal: any = (a as any)[key] || "";
                let bVal: any = (b as any)[key] || "";

                if (key === 'priority') {
                    const pOrder: any = { 'High': 3, 'Normal': 2, 'Low': 1 };
                    aVal = pOrder[a.priority] || 0;
                    bVal = pOrder[b.priority] || 0;
                } else if (key === 'date') {
                    aVal = new Date(a.date).getTime();
                    bVal = new Date(b.date).getTime();
                } else {
                    // Character comparison for others
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
                }

                if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            // Default sorting if no column clicked
            finalJobs.sort((a, b) => {
                if (sortBy === "name") return (a.customer || "").localeCompare(b.customer || "");

                // Primary sort for 'newest' (which is now Status + Time)
                if (sortBy === "newest") {
                    const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                    if (statusDiff !== 0) return statusDiff;

                    // Secondary sort: Time
                    const dateA = new Date(`${a.date} ${a.time}`).getTime();
                    const dateB = new Date(`${b.date} ${b.time}`).getTime();
                    return dateA - dateB;
                }

                if (sortBy === "oldest") {
                    const dateA = new Date(`${a.date} ${a.time}`).getTime();
                    const dateB = new Date(`${b.date} ${b.time}`).getTime();
                    return dateA - dateB;
                }

                // Fallback: Newest first (time based)
                const dateA = new Date(`${a.date || 0} ${a.time || 0}`).getTime();
                const dateB = new Date(`${b.date || 0} ${b.time || 0}`).getTime();
                return dateB - dateA;
            });
        }

        return finalJobs;
    }, [jobs, searchQuery, filterStatus, sortBy, startDate, endDate, sortConfig]);

    const totalPages = Math.ceil(processedJobs.length / pageSize);
    const currentJobs = processedJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                        SERVICE SCHEDULE
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Manage daily workshop operations</p>
                </div>
                <button
                    onClick={() => setIsManualModalOpen(true)}
                    className="group relative flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-2xl overflow-hidden shadow-xl shadow-racing-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Walk-in Service</span>
                </button>
            </div>
            <AdminTableControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: "Status & Queue", value: "newest" },
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
                    { label: "Delivered", value: "delivered" },
                    { label: "Cancelled", value: "cancelled" },
                    { label: "Deferred", value: "deferred" }
                ]}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                placeholder="Search workshop jobs by name, reg, bike or tech..."
                className="md:w-auto flex-1"
            />

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    const isToday = (dateStr: string) => dateStr === today;
                    const deliveredToday = (j: any) => {
                        if (j.status !== 'delivered') return false;
                        if (j.deliveredAt) {
                            return new Date(j.deliveredAt).toISOString().split('T')[0] === today;
                        }
                        return j.date === today;
                    };

                    return [
                        {
                            label: "Today's Intake",
                            value: jobs.filter(j => isToday(j.date)).length.toString(),
                            color: "text-foreground",
                            sub: "Today's Frequency"
                        },
                        {
                            label: "Active Workshop",
                            value: jobs.filter(j => j.status === "in-progress" || j.status === "completed").length.toString(),
                            color: "text-blue-600 dark:text-blue-400",
                            sub: "In-Shop Snapshot"
                        },
                        {
                            label: "Awaiting Today",
                            value: jobs.filter(j => isToday(j.date) && j.status === "booked").length.toString(),
                            color: "text-amber-600 dark:text-amber-400",
                            sub: "Waiting to Arrive"
                        },
                        {
                            label: "Delivered Today",
                            value: jobs.filter(j => deliveredToday(j)).length.toString(),
                            color: "text-emerald-600 dark:text-emerald-400",
                            sub: "Completed & Handed Over"
                        },
                        {
                            label: "Deferred Today",
                            value: jobs.filter(j => isToday(j.date) && j.status === "deferred").length.toString(),
                            color: "text-slate-600 dark:text-slate-400",
                            sub: "Rescheduled Today"
                        },
                        {
                            label: "Loss Today",
                            value: jobs.filter(j => isToday(j.date) && j.status === "cancelled").length.toString(),
                            color: "text-red-600 dark:text-red-400",
                            sub: "Cancelled Today"
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 bg-card border border-border rounded-[1.5rem] text-center flex flex-col justify-center gap-1 group hover:border-racing-blue/30 transition-all">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-racing-blue transition-colors">{stat.label}</span>
                            <span className={cn("text-2xl font-display font-black italic leading-none", stat.color)}>{stat.value}</span>
                            <span className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground/50">{stat.sub}</span>
                        </div>
                    ));
                })()}
            </div>

            {/* Job List */}
            <div className="overflow-x-auto border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[2200px] table-fixed">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[100px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('time')}>
                                <div className="flex items-center justify-center gap-1">
                                    Time
                                    {sortConfig?.key === 'time' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('date')}>
                                <div className="flex items-center justify-center gap-1">
                                    Date
                                    {sortConfig?.key === 'date' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('priority')}>
                                <div className="flex items-center justify-center gap-1">
                                    Priority
                                    {sortConfig?.key === 'priority' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[200px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('customer')}>
                                <div className="flex items-center gap-1">
                                    Customer Name
                                    {sortConfig?.key === 'customer' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[140px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('phone')}>
                                <div className="flex items-center gap-1">
                                    Phone Number
                                    {sortConfig?.key === 'phone' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('bikeModel')}>
                                <div className="flex items-center gap-1">
                                    Machine Model
                                    {sortConfig?.key === 'bikeModel' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[160px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('regNumber')}>
                                <div className="flex items-center gap-1">
                                    Reg #
                                    {sortConfig?.key === 'regNumber' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[150px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('type')}>
                                <div className="flex items-center gap-1">
                                    Job Type
                                    {sortConfig?.key === 'type' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[100px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('billingType')}>
                                <div className="flex items-center justify-center gap-1">
                                    Billing
                                    {sortConfig?.key === 'billingType' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[120px] text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('cost')}>
                                <div className="flex items-center justify-center gap-1">
                                    Cost
                                    {sortConfig?.key === 'cost' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[180px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('technician')}>
                                <div className="flex items-center gap-1">
                                    Technician
                                    {sortConfig?.key === 'technician' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                    )}
                                </div>
                            </th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[250px]">Special Instructions</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r border-border/10 w-[150px] text-center">Work Status</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[130px] text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentJobs.length === 0 ? (
                            <tr>
                                <td colSpan={14} className="py-20 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground/30 italic">
                                    No active jobs in the workshop stream...
                                </td>
                            </tr>
                        ) : (
                            currentJobs.map((job, index) => {
                                const isNearBottom = index > 1 && index >= currentJobs.length - 2;
                                return (
                                    <tr key={job.id} className="border-b border-border/30 group hover:bg-muted/10 transition-colors">
                                        {/* Time */}
                                        <td className="py-3 px-4 border-r border-border/10 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[13px] font-black text-foreground italic">{job.time}</span>
                                                {isAtRisk(job.time, job.date, job.status) && (
                                                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[7px] font-black uppercase tracking-widest rounded-full animate-pulse">
                                                        Risk
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 px-4 border-r border-border/10 text-center uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
                                            {new Date(job.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </td>

                                        {/* Priority */}
                                        <td className="py-3 px-4 border-r border-border/10 text-center">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0.5 rounded border tracking-widest",
                                                job.priority === "High" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-muted/30 text-muted-foreground border-border/50"
                                            )}>
                                                {job.priority}
                                            </span>
                                        </td>

                                        {/* Customer */}
                                        <td className="py-3 px-4 border-r border-border/10">
                                            <p className="text-[13px] font-black text-foreground uppercase tracking-tight truncate">{job.customer}</p>
                                        </td>

                                        {/* Phone */}
                                        <td className="py-3 px-4 border-r border-border/10 uppercase tracking-wider text-[12px] font-bold text-muted-foreground">
                                            {job.phone}
                                        </td>

                                        {/* Machine */}
                                        <td className="py-3 px-4 border-r border-border/10">
                                            <p className="text-[12px] font-black text-foreground uppercase tracking-tighter italic truncate">{job.bikeModel}</p>
                                        </td>

                                        {/* Reg # */}
                                        <td className="py-3 px-4 border-r border-border/10 font-mono text-[11px] font-bold text-muted-foreground tracking-tighter uppercase">
                                            {job.regNumber}
                                        </td>

                                        {/* Job Type */}
                                        <td className="py-3 px-4 border-r border-border/10">
                                            <div className="flex items-center gap-2">
                                                <Wrench className="w-3.5 h-3.5 text-muted-foreground/40" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">{job.type}</span>
                                            </div>
                                        </td>

                                        {/* Billing */}
                                        <td className="py-3 px-4 border-r border-border/10 text-center">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0.5 rounded border tracking-widest",
                                                job.billingType === 'free' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-racing-blue/10 text-racing-blue border-racing-blue/20"
                                            )}>
                                                {job.billingType || 'paid'}
                                            </span>
                                        </td>

                                        {/* Cost */}
                                        <td className="py-3 px-4 border-r border-border/10 text-center">
                                            <div className="flex items-center justify-center gap-0.5 text-[13px] font-black text-racing-blue italic">
                                                <IndianRupee className="w-3 h-3" />
                                                {Number(job.cost).toLocaleString('en-IN')}
                                            </div>
                                        </td>

                                        {/* Technician */}
                                        <td className="py-3 px-4 border-r border-border/10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-racing-blue/5 rounded-full flex items-center justify-center border border-racing-blue/10">
                                                    <UserCheck className="w-3 h-3 text-racing-blue" />
                                                </div>
                                                <span className="text-[11px] font-black text-foreground/70 uppercase tracking-tighter truncate">{job.technician}</span>
                                            </div>
                                        </td>

                                        {/* Remarks */}
                                        <td className="py-3 px-4 border-r border-border/10">
                                            <div className="flex items-center gap-2 group/remark">
                                                <input
                                                    type="text"
                                                    value={tempRemarks[job.id] !== undefined ? tempRemarks[job.id] : (job.notes || "")}
                                                    onChange={(e) => setTempRemarks({ ...tempRemarks, [job.id]: e.target.value })}
                                                    placeholder="Add instructions..."
                                                    className="w-full bg-transparent border-b border-transparent hover:border-border/50 focus:border-racing-blue focus:outline-none text-[12px] font-medium py-1 transition-all placeholder:text-muted-foreground/20"
                                                />
                                                {(tempRemarks[job.id] !== undefined && tempRemarks[job.id] !== job.notes) && (
                                                    <button
                                                        onClick={() => handleSaveRemark(job.id)}
                                                        disabled={savingRemark === job.id}
                                                        className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
                                                    >
                                                        {savingRemark === job.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4 border-r border-border/10 text-center">
                                            <div className="relative inline-block text-left">
                                                <button
                                                    onClick={() => setOpenStatusId(openStatusId === job.id ? null : job.id)}
                                                    className={cn(
                                                        "flex items-center justify-between gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer w-[120px]",
                                                        statusColors[job.status] || "bg-muted text-muted-foreground border-border",
                                                        openStatusId === job.id && "ring-1 ring-racing-blue"
                                                    )}>
                                                    {job.status.replace('-', ' ')}
                                                    <ChevronDown className={cn("w-3 h-3 transition-transform", openStatusId === job.id && "rotate-180")} />
                                                </button>

                                                <AnimatePresence>
                                                    {openStatusId === job.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setOpenStatusId(null)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 10 : -10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 10 : -10 }}
                                                                className={cn(
                                                                    "absolute left-0 z-50 pt-2",
                                                                    isNearBottom ? "bottom-full mb-2" : "top-full mt-2"
                                                                )}
                                                            >
                                                                <div className="flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden w-40">
                                                                    {STATUS_OPTIONS.map((opt) => (
                                                                        <button
                                                                            key={opt}
                                                                            onClick={() => { updateStatus(job.id, opt); setOpenStatusId(null); }}
                                                                            className={cn(
                                                                                "px-4 py-2 text-[9px] font-black uppercase tracking-widest text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0",
                                                                                job.status === opt ? "text-racing-blue bg-racing-blue/5" : "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {opt.replace('-', ' ')}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(job)}
                                                    className="p-1.5 border border-border rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-racing-blue"
                                                    title="Edit Job"
                                                >
                                                    <Wrench className="w-3.5 h-3.5" />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                                                        className={cn(
                                                            "p-1.5 border border-border rounded-lg hover:bg-muted transition-all text-muted-foreground",
                                                            openMenuId === job.id && "bg-muted text-racing-blue border-racing-blue/30"
                                                        )}
                                                    >
                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openMenuId === job.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 10 : -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 10 : -10 }}
                                                                    className={cn(
                                                                        "absolute right-0 z-[60] py-2",
                                                                        isNearBottom ? "bottom-full mb-2" : "top-full mt-2"
                                                                    )}
                                                                >
                                                                    <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden w-48 py-1">
                                                                        <button
                                                                            onClick={() => { window.location.href = `tel:${job.phone}`; setOpenMenuId(null); }}
                                                                            className="w-full px-4 py-2 text-[9px] font-black uppercase tracking-widest text-left hover:bg-green-500/10 transition-colors text-green-600 flex items-center gap-2"
                                                                        >
                                                                            <Phone className="w-3.5 h-3.5" />
                                                                            Call Customer
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                const message = `Hello ${job.customer}! Your ${job.bikeModel} is scheduled for ${job.type} at ${job.time}.`;
                                                                                window.open(`https://wa.me/91${job.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-[9px] font-black uppercase tracking-widest text-left hover:bg-racing-blue/10 transition-colors text-racing-blue flex items-center gap-2"
                                                                        >
                                                                            <MessageSquare className="w-3.5 h-3.5" />
                                                                            WhatsApp
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border border-border rounded-xl">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        Spreadsheet Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1.5 bg-card border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 transition-all"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1.5 bg-card border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-muted disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

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
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Appointment Date</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="date"
                                                    value={editForm.appointmentDate}
                                                    onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-racing-blue transition-all [color-scheme:dark]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Appointment Time</label>
                                            <div className="relative group">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-racing-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 10:30 AM"
                                                    value={editForm.appointmentTime}
                                                    onChange={(e) => setEditForm({ ...editForm, appointmentTime: e.target.value })}
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

                                    {/* Billing Section */}
                                    <div className="border border-border/60 rounded-2xl p-5 space-y-4 bg-muted/10">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <Tag className="w-3 h-3" /> Billing Configuration
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(['paid', 'free'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setEditForm({ ...editForm, billingType: type, cost: type === 'free' ? 0 : editForm.cost })}
                                                    className={cn(
                                                        "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                        editForm.billingType === type
                                                            ? type === 'paid'
                                                                ? "bg-racing-blue text-white border-racing-blue shadow-lg shadow-racing-blue/20"
                                                                : "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                                            : "bg-background text-muted-foreground border-border hover:border-racing-blue/30"
                                                    )}
                                                >
                                                    {type === 'paid' ? '💳 Paid Service' : '🎁 Free Service'}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-racing-blue">
                                                {editForm.billingType === 'free' ? 'Extra Charges (if any)' : 'Final Bill Amount (Service + Parts + Labour)'}
                                            </label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-blue" />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editForm.cost}
                                                    onChange={(e) => setEditForm({ ...editForm, cost: Number(e.target.value) })}
                                                    placeholder="0.00"
                                                    className="w-full bg-racing-blue/5 border border-racing-blue/20 rounded-xl pl-11 pr-4 py-3.5 text-xs font-black text-racing-blue focus:outline-none focus:border-racing-blue/50 transition-all"
                                                />
                                            </div>
                                            {editForm.billingType === 'free' && (
                                                <p className="text-[9px] text-emerald-600 font-bold pl-1">
                                                    Free service — enter amount only if additional work was charged.
                                                </p>
                                            )}
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

            <ManualServiceModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onSuccess={(newJob) => {
                    // socket will handle state update, but we can do it manually too for instant feedback
                    // setJobs(prev => [newJob, ...prev]);
                }}
            />
        </div >
    );
}
