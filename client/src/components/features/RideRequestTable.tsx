"use client";

import { 
    CheckCircle2, 
    MoreVertical, 
    Phone, 
    MessageSquare, 
    Calendar, 
    Clock, 
    Bike as BikeIcon, 
    Mail, 
    User,
    TrendingUp,
    Check,
    X,
    Loader2,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTestRides, updateTestRideStatus, TestRideData } from "@/lib/services/testRideService";

export function RideRequestTable() {
    const [requests, setRequests] = useState<TestRideData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await getTestRides();
            if (res.success) {
                setRequests(res.data);
            }
        } catch (err) {
            console.error("Error fetching test rides:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = 
                req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.phone.includes(searchQuery) ||
                req.bikeModel.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === "All" || req.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, statusFilter]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const res = await updateTestRideStatus(id, newStatus);
            if (res.success) {
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus as any } : r));
            }
        } catch (err) {
            console.error("Error updating status:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemarkUpdate = async (id: string, remark: string) => {
        try {
            const res = await updateTestRideStatus(id, undefined as any, { staffRemark: remark });
            if (res.success) {
                setRequests(prev => prev.map(r => r._id === id ? { ...r, staffRemark: remark } : r));
            }
        } catch (err) {
            console.error("Error updating remark:", err);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center px-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-500/10 rounded-lg">
                        <BikeIcon className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-black text-gradient uppercase tracking-tighter">
                            RIDE REQUESTS
                        </h2>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Manage test ride schedules and conversions</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input 
                            type="text"
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-racing-blue/20 transition-all"
                        />
                    </div>
                    
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-card border border-border rounded-xl py-2 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none transition-all"
                    >
                        <option value="All">All Status</option>
                        <option value="Unread">Unread</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl bg-card">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Name</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone / Email</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Machine</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Apt Date & Time</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Lead Info</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staff Remark (Feedback)</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="py-20 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-racing-blue opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4">Syncing Ride Requests...</p>
                                </td>
                            </tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-20 text-center">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BikeIcon className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No ride requests found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((req) => (
                                <tr key={req._id} className="border-b border-border/30 group hover:bg-muted/10 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-[10px] font-black uppercase">
                                                {req.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{req.name}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Customer</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                <Phone className="w-3 h-3 opacity-50" />
                                                {req.phone}
                                            </div>
                                            {req.email && (
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                    <Mail className="w-3 h-3 opacity-50" />
                                                    {req.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-1 bg-racing-blue/5 border border-racing-blue/10 rounded text-[9px] font-black uppercase tracking-widest text-racing-blue">
                                                {req.bikeModel}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-foreground uppercase">
                                                <Calendar className="w-3.5 h-3.5 text-racing-blue" />
                                                {new Date(req.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground">
                                                <Clock className="w-3.5 h-3.5 opacity-50" />
                                                {req.preferredTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {req.associatedLead ? (
                                            <div className="p-2 bg-muted/30 border border-border/50 rounded-lg flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        <TrendingUp className="w-3 h-3 text-racing-blue" />
                                                        <span className="text-[9px] font-black uppercase tracking-tight">Active Inquiry</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={cn(
                                                            "text-[8px] font-black px-1.5 rounded border uppercase",
                                                            req.associatedLead.heat === 'HOT' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                        )}>
                                                            {req.associatedLead.heat}
                                                        </span>
                                                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                                                            Score: {req.associatedLead.score}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">No Active Lead</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className={cn(
                                            "inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            req.status === 'Unread' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                            req.status === 'Scheduled' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                            req.status === 'Completed' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                            "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}>
                                            {req.status}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 min-w-[200px]">
                                        <div className="relative group/remark">
                                            <input 
                                                type="text"
                                                defaultValue={req.staffRemark || ""}
                                                placeholder="Add staff feedback..."
                                                onBlur={(e) => handleRemarkUpdate(req._id, e.target.value)}
                                                className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-racing-blue/50 focus:outline-none py-1 text-[10px] font-bold text-muted-foreground transition-all uppercase tracking-tight"
                                            />
                                            <MessageSquare className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover/remark:opacity-30 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {req.status === 'Unread' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(req._id, 'Scheduled')}
                                                    className="p-1.5 bg-purple-500 text-white rounded-lg hover:scale-110 transition-all shadow-lg shadow-purple-500/20"
                                                    title="Schedule Ride"
                                                >
                                                    <Calendar className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {req.status === 'Scheduled' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(req._id, 'Completed')}
                                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:scale-110 transition-all shadow-lg shadow-green-500/20"
                                                    title="Mark Completed"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {(req.status === 'Unread' || req.status === 'Scheduled') && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(req._id, 'Cancelled')}
                                                    className="p-1.5 bg-muted border border-border rounded-lg hover:bg-red-500 hover:text-white transition-all group"
                                                    title="Cancel Request"
                                                >
                                                    <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                                                </button>
                                            )}
                                            {req.status === 'Completed' && (
                                                <div className="flex items-center gap-1.5 text-green-500 font-black uppercase text-[8px] tracking-widest bg-green-500/10 px-2 py-1 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Done
                                                </div>
                                            )}
                                            {req.status === 'Cancelled' && (
                                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50 italic">Archived</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
