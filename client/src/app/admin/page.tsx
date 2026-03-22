"use client";

import { useEffect, useState } from "react";
import { BarChart2, Users, Package, Calendar, TrendingUp, Bell, Rocket, Wrench } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LeadsTable } from "@/components/features/LeadsTable";
import { ServicesTable } from "@/components/features/ServicesTable";
import { LeadsTableHot } from "@/components/features/LeadsTableHot";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("http://localhost:5000");

export default function AdminDashboard() {
    const [leads, setLeads] = useState<any[]>([]);
    const [qualifiedLeads, setQualifiedLeads] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"leads" | "services" | "hot">("leads");

    useEffect(() => {
        // 1. Fetch initial data
        const fetchData = async () => {
            try {
                const [leadsRes, servicesRes, qualifiedRes] = await Promise.all([
                    fetch("http://localhost:5000/api/leads"),
                    fetch("http://localhost:5000/api/services"),
                    fetch("http://localhost:5000/api/qualified-leads")
                ]);

                const leadsData = await leadsRes.json();
                const servicesData = await servicesRes.json();
                const qualifiedData = await qualifiedRes.json();

                if (leadsData.success) setLeads(leadsData.data);
                if (servicesData.success) setServices(servicesData.data);
                if (qualifiedData.success) setQualifiedLeads(qualifiedData.data);
            } catch (err) {
                console.error("Failed to sync dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // 2. Listen for Socket events
        socket.on("new_lead", (newLead) => {
            setLeads(prev => [newLead, ...prev]);
            notifyUser("New Inquiry Received!", `${newLead.name} wants to know more about Yamaha.`);
        });

        socket.on("new_service", (newService) => {
            setServices(prev => [newService, ...prev]);
            notifyUser("New Workshop Booking!", `${newService.name} scheduled service for ${newService.bikeModel}.`);
        });

        socket.on("lead_escalated", (data) => {
            setQualifiedLeads(prev => {
                const exists = prev.find(l => l._id === data.lead._id);
                if (exists) {
                    return prev.map(l => l._id === data.lead._id ? data.lead : l);
                }
                return [data.lead, ...prev];
            });
            notifyUser("🔥 HOT LEAD DETECTED!", `${data.customer.name} just made another inquiry. Priority heightened.`);
        });

        const notifyUser = (title: string, body: string) => {
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification(title, { body });
            }
        };

        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => {
            socket.off("new_lead");
            socket.off("new_service");
            socket.off("lead_escalated");
        };
    }, []);

    const stats = [
        { label: "Active Inquiries", value: leads.length.toString(), icon: Users, change: "Live", trend: "up" },
        { label: "Hot Leads 🔥", value: qualifiedLeads.length.toString(), icon: Rocket, change: "Escalating", trend: "up" },
        { label: "Workshop Queue", value: services.length.toString(), icon: Wrench, change: "Live", trend: "up" },
        { label: "Inventory", value: "15", icon: Package, change: "Stable", trend: "neutral" },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">
                        Admin <span className="text-gradient">COMMAND CENTER</span>
                    </h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Unified Dashboard for Inquiries and Workshop Bookings</p>
                </div>
                <div className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-900 px-6 py-3 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Neural Sink Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-8 bg-zinc-900/50 border border-zinc-900 rounded-[2.5rem] shadow-2xl group hover:border-racing-blue/50 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <stat.icon className="w-6 h-6 text-racing-blue" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                stat.trend === "up" ? "text-green-400 bg-green-500/10 border border-green-500/10" :
                                    stat.trend === "down" ? "text-red-400 bg-red-500/10 border border-red-500/10" : "text-gray-400 bg-zinc-800"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</h3>
                        <p className="text-4xl font-display font-black text-white italic tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-8">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-zinc-800/50">
                    <button
                        onClick={() => setActiveTab("leads")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "leads" ? "text-white" : "text-gray-600 hover:text-gray-400"
                        )}
                    >
                        Pre-Sales Inquiries
                        {activeTab === "leads" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-racing-blue" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("hot")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "hot" ? "text-white" : "text-gray-600 hover:text-gray-400"
                        )}
                    >
                        Hot Leads 🔥
                        {activeTab === "hot" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-orange-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("services")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "services" ? "text-white" : "text-gray-600 hover:text-gray-400"
                        )}
                    >
                        Post-Sales Services
                        {activeTab === "services" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-racing-blue" />}
                    </button>
                </div>

                <div className="p-1 gap-1 bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-racing-blue/10 flex items-center justify-center">
                                {activeTab === "leads" ? <Users className="w-5 h-5 text-racing-blue" /> :
                                    activeTab === "hot" ? <Rocket className="w-5 h-5 text-orange-500" /> :
                                        <Wrench className="w-5 h-5 text-racing-blue" />}
                            </div>
                            <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">
                                {activeTab === "leads" ? "Inquiry Stream" :
                                    activeTab === "hot" ? "Priority Prospects" :
                                        "Workshop Queue"}
                            </h3>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                            <Bell className="w-3.5 h-3.5" />
                            Live Sync Active
                        </button>
                    </div>
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <Rocket className="w-8 h-8 text-racing-blue animate-bounce" />
                            <div className="animate-pulse text-gray-500 uppercase font-black text-[10px] tracking-[0.3em]">
                                CALIBRATING NEURAL LINK...
                            </div>
                        </div>
                    ) : (
                        activeTab === "leads" ? <LeadsTable leads={leads} /> :
                            activeTab === "hot" ? <LeadsTableHot leads={qualifiedLeads} /> :
                                <ServicesTable services={services} />
                    )}
                </div>
            </div>
        </div>
    );
}
