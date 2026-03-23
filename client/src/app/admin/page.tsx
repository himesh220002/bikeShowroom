"use client";

import { useEffect, useState } from "react";
import { BarChart2, Users, Package, Calendar, TrendingUp, Bell, Rocket, Wrench } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LeadsTable, type Lead } from "@/components/features/LeadsTable";
import { ServicesTable, type ServiceBooking } from "@/components/features/ServicesTable";
import { LeadsTableHot, type Lead as HotLead } from "@/components/features/LeadsTableHot";
import { SalesTable } from "@/components/features/SalesTable";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { SaleForm } from "@/components/features/SaleForm";
import { useRouter } from "next/navigation";

const socket = io("http://localhost:5000");

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [qualifiedLeads, setQualifiedLeads] = useState<HotLead[]>([]);
    const [services, setServices] = useState<ServiceBooking[]>([]);
    const [bikes, setBikes] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"leads" | "services" | "hot" | "sales">("leads");
    const router = useRouter();

    const fetchData = async () => {
        try {
            const [leadsRes, servicesRes, qualifiedRes, bikesRes, salesRes] = await Promise.all([
                fetch("http://localhost:5000/api/leads"),
                fetch("http://localhost:5000/api/services"),
                fetch("http://localhost:5000/api/qualified-leads"),
                fetch("http://localhost:5000/api/bikes"),
                fetch("http://localhost:5000/api/sales")
            ]);

            const leadsData = await leadsRes.json();
            const servicesData = await servicesRes.json();
            const qualifiedData = await qualifiedRes.json();
            const bikesData = await bikesRes.json();
            const salesData = await salesRes.json();

            if (leadsData.success) setLeads(leadsData.data);
            if (servicesData.success) setServices(servicesData.data);
            if (qualifiedData.success) setQualifiedLeads(qualifiedData.data);
            if (bikesData.success) setBikes(bikesData.data);
            if (salesData.success) setSales(salesData.data);
        } catch (err) {
            console.error("Failed to sync dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Fetch initial data
        fetchData();

        // 2. Listen for Socket events
        socket.on("new_lead", (newLead: Lead) => {
            setLeads((prev: Lead[]) => [newLead, ...prev]);
            notifyUser("New Inquiry Received!", `${newLead.name} wants to know more about Yamaha.`);
        });

        socket.on("new_service", (newService: ServiceBooking) => {
            setServices((prev: ServiceBooking[]) => [newService, ...prev]);
            notifyUser("New Workshop Booking!", `${newService.name} scheduled service for ${newService.bikeModel}.`);
        });

        socket.on("service_updated", (updatedService: any) => {
            setServices((prev) => prev.map(s => s._id === updatedService._id ? updatedService : s));
        });

        socket.on("lead_escalated", (data: { lead: HotLead; customer: { name: string } }) => {
            setQualifiedLeads((prev: HotLead[]) => {
                const exists = prev.find((l: HotLead) => l._id === data.lead._id);
                if (exists) {
                    return prev.map((l: HotLead) => l._id === data.lead._id ? data.lead : l);
                }
                return [data.lead, ...prev];
            });
            notifyUser("🔥 HOT LEAD DETECTED!", `${data.customer.name} just made another inquiry. Priority heightened.`);
        });

        socket.on("inventory_updated", (updatedBike: any) => {
            setBikes((prev) => prev.map(b => b._id === updatedBike._id ? updatedBike : b));
        });

        socket.on("inventory_synced", (newBikes: any[]) => {
            setBikes(newBikes);
        });

        socket.on("sale_recorded", (newSale: any) => {
            setSales((prev) => [newSale, ...prev]);
            notifyUser("💰 NEW SALE!", `${newSale.customerName} just bought a ${newSale.bikeName}!`);
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
            socket.off("service_updated");
            socket.off("lead_escalated");
            socket.off("sale_recorded");
        };
    }, []);

    const totalStock = bikes.reduce((acc, bike) => acc + (bike.stock || 0), 0);

    const stats = [
        { label: "Active Inquiries", value: leads.length.toString(), icon: Users, change: "Live", trend: "up", tab: "leads" as const },
        { label: "Hot Leads 🔥", value: qualifiedLeads.length.toString(), icon: Rocket, change: "Escalating", trend: "up", tab: "hot" as const },
        { label: "Workshop Queue", value: services.length.toString(), icon: Wrench, change: "Live", trend: "up", tab: "services" as const },
        { label: "Inventory", value: totalStock.toString(), icon: Package, change: "Stable", trend: "neutral", href: "/admin/inventory" },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tighter">
                        Admin <span className="text-gradient">COMMAND CENTER</span>
                    </h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Unified Dashboard for Inquiries and Workshop Bookings</p>
                </div>
                <div className="flex items-center gap-4 bg-card/50 border border-border px-6 py-3 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Neural Sink Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => {
                            if (stat.tab) {
                                setActiveTab(stat.tab);
                                document.getElementById("data-tabs")?.scrollIntoView({ behavior: "smooth" });
                            } else if (stat.href) {
                                router.push(stat.href);
                            }
                        }}
                        className="p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl group hover:border-racing-blue/50 transition-all text-left w-full hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <stat.icon className="w-6 h-6 text-racing-blue" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                stat.trend === "up" ? "text-green-400 bg-green-500/10 border border-green-500/10" :
                                    stat.trend === "down" ? "text-red-400 bg-red-500/10 border border-red-500/10" : "text-muted-foreground bg-muted"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</h3>
                        <p className="text-4xl font-display font-black text-foreground italic tracking-tighter">{stat.value}</p>
                    </button>
                ))}
            </div>

            <div className="p-10 bg-card border border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-32 h-32 text-racing-blue" />
                </div>
                <div className="relative z-10 max-w-4xl">
                    <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter mb-2">Record New Sale</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-8">Add to CRM & Auto-Subtract from Inventory</p>
                    <SaleForm
                        bikes={bikes}
                        onSaleComplete={() => {
                            fetchData(); // Sync all lists and stats
                            setActiveTab("sales"); // Automatically show the new sale row
                        }}
                    />
                </div>
            </div>

            <div className="space-y-8" id="data-tabs">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-border/50">
                    <button
                        onClick={() => setActiveTab("leads")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "leads" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Pre-Sales Inquiries
                        {activeTab === "leads" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-racing-blue" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("hot")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "hot" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Hot Leads 🔥
                        {activeTab === "hot" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-orange-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("services")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "services" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Post-Sales Services
                        {activeTab === "services" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-racing-blue" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("sales")}
                        className={cn(
                            "pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === "sales" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Sales CRM
                        {activeTab === "sales" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-green-500" />}
                    </button>
                </div>

                <div className="p-1 gap-1 bg-card border border-border rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-border flex justify-between items-center bg-card/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-racing-blue/10 flex items-center justify-center">
                                {activeTab === "leads" ? <Users className="w-5 h-5 text-racing-blue" /> :
                                    activeTab === "hot" ? <Rocket className="w-5 h-5 text-orange-500" /> :
                                        <Wrench className="w-5 h-5 text-racing-blue" />}
                            </div>
                            <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">
                                {activeTab === "leads" ? "Inquiry Stream" :
                                    activeTab === "hot" ? "Priority Prospects" :
                                        activeTab === "services" ? "Workshop Queue" :
                                            "Sales History"}
                            </h3>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                            <Bell className="w-3.5 h-3.5" />
                            Live Sync Active
                        </button>
                    </div>
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <Rocket className="w-8 h-8 text-racing-blue animate-bounce" />
                            <div className="animate-pulse text-muted-foreground uppercase font-black text-[10px] tracking-[0.3em]">
                                CALIBRATING NEURAL LINK...
                            </div>
                        </div>
                    ) : (
                        activeTab === "leads" ? <LeadsTable leads={leads} /> :
                            activeTab === "hot" ? <LeadsTableHot leads={qualifiedLeads} /> :
                                activeTab === "services" ? <ServicesTable services={services} /> :
                                    <div className="p-8"><SalesTable sales={sales} /></div>
                    )}
                </div>
            </div>
        </div>
    );
}
