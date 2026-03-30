"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart2, Users, Package, Calendar, TrendingUp, Bell, Rocket, Wrench, ChevronDown, ShoppingCart, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LeadsTable, type Lead } from "@/components/features/LeadsTable";
import { ServicesTable, type ServiceBooking } from "@/components/features/ServicesTable";
import { LeadsTableHot, type Lead as HotLead } from "@/components/features/LeadsTableHot";
import { SalesTable } from "@/components/features/SalesTable";
import { AdminTableControls } from "@/components/ui/AdminTableControls";
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
    const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
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

    // Scroll to top of table on tab change
    useEffect(() => {
        if (!loading) {
            const element = document.getElementById("data-tabs");
            if (element) {
                const yOffset = -100; // Offset to keep the tab header visible
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, [activeTab]);

    const totalStock = bikes.reduce((acc, bike) => {
        const bikeStock = (bike.colors || []).reduce((sum: number, color: any) => sum + (color.stock || 0), 0);
        return acc + bikeStock;
    }, 0);

    const stats = [
        { label: "Active Inquiries", value: leads.length.toString(), icon: Users, change: "Live", trend: "up", tab: "leads" as const },
        { label: "Hot Leads 🔥", value: qualifiedLeads.length.toString(), icon: Rocket, change: "Escalating", trend: "up", tab: "hot" as const },
        { label: "Workshop Queue", value: services.length.toString(), icon: Wrench, change: "Live", trend: "up", tab: "services" as const },
        { label: "Inventory", value: totalStock.toString(), icon: Package, change: "Stable", trend: "neutral", href: "/admin/inventory" },
    ];

    // Data Filtering & Sorting Logic
    const processedLeads = useMemo(() => {
        let filtered = [...leads];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.name?.toLowerCase().includes(q) ||
                l.phone?.toLowerCase().includes(q) ||
                l.interests?.join(" ").toLowerCase().includes(q)
            );
        }
        if (filterStatus !== "all") {
            filtered = filtered.filter(l => l.status === filterStatus);
        }
        if (startDate) {
            filtered = filtered.filter(l => new Date(l.createdAt || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(l => new Date(l.createdAt || 0) <= end);
        }
        return filtered.sort((a: any, b: any) => {
            if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }, [leads, searchQuery, filterStatus, sortBy, startDate, endDate]);

    const processedHotLeads = useMemo(() => {
        let filtered = [...qualifiedLeads];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.customerId?.name?.toLowerCase().includes(q) ||
                l.customerId?.phone?.toLowerCase().includes(q) ||
                l.leadStage?.toLowerCase().includes(q)
            );
        }
        if (startDate) {
            filtered = filtered.filter(l => new Date(l.updatedAt || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(l => new Date(l.updatedAt || 0) <= end);
        }
        return filtered.sort((a: any, b: any) => {
            if (sortBy === "name") return (a.customerId?.name || "").localeCompare(b.customerId?.name || "");
            if (sortBy === "oldest") return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
            return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        });
    }, [qualifiedLeads, searchQuery, sortBy, startDate, endDate]);

    const processedServices = useMemo(() => {
        let filtered = [...services];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(q) ||
                s.phone?.toLowerCase().includes(q) ||
                s.bikeModel?.toLowerCase().includes(q) ||
                s.regNumber?.toLowerCase().includes(q)
            );
        }
        if (filterStatus !== "all") {
            filtered = filtered.filter(s => s.status === filterStatus);
        }
        if (startDate) {
            filtered = filtered.filter(s => new Date(s.appointmentDate || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(s => new Date(s.appointmentDate || 0) <= end);
        }
        return filtered.sort((a: any, b: any) => {
            if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "oldest") return new Date(a.appointmentDate || 0).getTime() - new Date(b.appointmentDate || 0).getTime();
            return new Date(b.appointmentDate || 0).getTime() - new Date(a.appointmentDate || 0).getTime();
        });
    }, [services, searchQuery, filterStatus, sortBy, startDate, endDate]);

    const processedSales = useMemo(() => {
        let filtered = [...sales];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.customerName?.toLowerCase().includes(q) ||
                s.customerPhone?.toLowerCase().includes(q) ||
                s.bikeName?.toLowerCase().includes(q)
            );
        }
        if (startDate) {
            filtered = filtered.filter(s => new Date(s.saleDate || 0) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(s => new Date(s.saleDate || 0) <= end);
        }
        return filtered.sort((a: any, b: any) => {
            if (sortBy === "name") return (a.customerName || "").localeCompare(b.customerName || "");
            if (sortBy === "price-desc") return Number(b.salePrice) - Number(a.salePrice);
            if (sortBy === "price-asc") return Number(a.salePrice) - Number(b.salePrice);
            if (sortBy === "oldest") return new Date(a.saleDate || 0).getTime() - new Date(b.saleDate || 0).getTime();
            return new Date(b.saleDate || 0).getTime() - new Date(a.saleDate || 0).getTime();
        });
    }, [sales, searchQuery, sortBy, startDate, endDate]);

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

            <div className="bg-card border border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
                <button
                    onClick={() => setIsSaleFormOpen(!isSaleFormOpen)}
                    className="w-full p-10 flex items-center justify-between hover:bg-muted/30 transition-all text-left"
                >
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-12 h-12 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                            <TrendingUp className={cn("w-6 h-6 text-racing-blue transition-transform duration-500", isSaleFormOpen && "rotate-90")} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">Record New Sale</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Add to CRM & Auto-Subtract from Inventory</p>
                        </div>
                    </div>
                    <div className={cn("w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all", isSaleFormOpen ? "bg-racing-blue text-white border-racing-blue" : "text-muted-foreground")}>
                        <motion.div animate={{ rotate: isSaleFormOpen ? 180 : 0 }}>
                            <ChevronDown className="w-5 h-5" />
                        </motion.div>
                    </div>
                </button>

                <AnimatePresence>
                    {isSaleFormOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className="px-10 pb-10">
                                <div className="p-8 bg-background/50 border border-border/50 rounded-[2rem]">
                                    <SaleForm
                                        bikes={bikes}
                                        onSaleComplete={() => {
                                            fetchData(); // Sync all lists and stats
                                            setActiveTab("sales"); // Automatically show the new sale row
                                            setIsSaleFormOpen(false); // Close after sale
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div id="data-tabs" className="p-1 px-1.5 bg-card border border-border rounded-[3rem] overflow-hidden shadow-2xl">
                {/* Integrated Tabs Header */}
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border-b border-border">
                    {[
                        { id: "leads", label: "Pre-Sales Inquiries", icon: Users, color: "#007bff" }, // racing-blue
                        { id: "hot", label: "Hot Leads 🔥", icon: Rocket, color: "#f97316" }, // orange-500
                        { id: "services", label: "Post-Sales Services", icon: Wrench, color: "#007bff" },
                        { id: "sales", label: "Sales CRM", icon: ShoppingCart, color: "#22c55e" } // green-500
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                setSearchQuery("");
                                setFilterStatus("all");
                            }}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id
                                    ? "bg-background text-foreground shadow-lg border border-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                            style={activeTab === tab.id ? { boxShadow: `0 10px 30px -10px ${tab.color}20` } : {}}
                        >
                            <tab.icon className="w-4 h-4" style={{ color: activeTab === tab.id ? tab.color : undefined }} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tab.color }} />
                            )}
                        </button>
                    ))}
                </div>
                <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50">
                    <div className="flex items-center gap-4 min-w-fit">
                        <div className="w-10 h-10 rounded-xl bg-racing-blue/10 flex items-center justify-center">
                            {activeTab === "leads" ? <Users className="w-5 h-5 text-racing-blue" /> :
                                activeTab === "hot" ? <Rocket className="w-5 h-5 text-orange-500" /> :
                                    activeTab === "services" ? <Wrench className="w-5 h-5 text-racing-blue" /> :
                                        <ShoppingCart className="w-5 h-5 text-green-500" />}
                        </div>
                        <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">
                            {activeTab === "leads" ? "Inquiry Stream" :
                                activeTab === "hot" ? "Priority Prospects" :
                                    activeTab === "services" ? "Workshop Queue" :
                                        "Sales History"}
                        </h3>
                    </div>

                    <AdminTableControls
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        sortOptions={[
                            { label: "Newest First", value: "newest" },
                            { label: "Oldest First", value: "oldest" },
                            { label: "Name A-Z", value: "name" },
                            ...(activeTab === "sales" ? [
                                { label: "Price: High to Low", value: "price-desc" },
                                { label: "Price: Low to High", value: "price-asc" }
                            ] : [])
                        ]}
                        filterStatus={(activeTab === "leads" || activeTab === "services") ? filterStatus : undefined}
                        onFilterChange={setFilterStatus}
                        filterOptions={(activeTab === "leads" || activeTab === "services") ? (activeTab === "leads" ? [
                            { label: "All Status", value: "all" },
                            { label: "New", value: "New" },
                            { label: "Contacted", value: "Contacted" },
                            { label: "Test Ride", value: "Test Ride" },
                            { label: "Closed", value: "Closed" }
                        ] : [
                            { label: "All Status", value: "all" },
                            { label: "Booked", value: "booked" },
                            { label: "In Progress", value: "in-progress" },
                            { label: "Completed", value: "completed" },
                            { label: "Delivered", value: "delivered" }
                        ]) : undefined}
                        startDate={startDate}
                        onStartDateChange={setStartDate}
                        endDate={endDate}
                        onEndDateChange={setEndDate}
                        placeholder={`Search ${activeTab}...`}
                        className="flex-1"
                    />

                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors ml-auto">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Live Sync Active</span>
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
                    activeTab === "leads" ? <LeadsTable leads={processedLeads} /> :
                        activeTab === "hot" ? <LeadsTableHot leads={processedHotLeads} /> :
                            activeTab === "services" ? <ServicesTable services={processedServices} /> :
                                <div className="p-8"><SalesTable sales={processedSales} /></div>
                )}
            </div>
        </div>
    );
}
