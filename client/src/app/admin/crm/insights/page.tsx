"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, Cell, PieChart, Pie
} from "recharts";
import {
    ArrowLeft, TrendingUp, Users, DollarSign,
    Wrench, Sparkles, Filter, Calendar, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export default function InsightsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch(`${API_URL}/insights/crm`);
                const result = await res.json();
                if (result.success) setData(result.data);
            } catch (err) {
                console.error("Failed to fetch insights:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-in fade-in duration-500">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-racing-blue/20 border-t-racing-blue rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-racing-blue" />
                    </div>
                </div>
                <div className="space-y-1 text-center">
                    <h2 className="text-xl font-display font-black uppercase italic tracking-tighter">Analyzing CRM <span className="text-racing-blue">Data</span></h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Aggregating historical records...</p>
                </div>
            </div>
        );
    }

    const { monthly, brandRevenue, overview } = data || {};

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-card border border-border rounded-xl hover:bg-muted transition-all shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter italic">
                            Showroom <span className="text-racing-blue">Intelligence</span>
                        </h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Deep Analytics & Growth Projection</p>
                    </div>
                </div>

                <div className="flex bg-muted rounded-xl p-1 border border-border/50">
                    {["Last 6 Months", "Year to Date", "Life-to-Date"].map((period, i) => (
                        <button
                            key={period}
                            className={cn(
                                "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                i === 0 ? "bg-racing-blue text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Customers", value: overview.totalCustomers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Gross Revenue", value: `₹${(overview.totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Active Services", value: overview.activeServices, icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/10" },
                    { label: "CRM Efficiency", value: "94%", icon: Sparkles, color: "text-racing-blue", bg: "bg-racing-blue/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <div className={cn("absolute -right-2 -top-2 w-20 h-20 opacity-[0.03] transition-all group-hover:scale-150 rotate-12", stat.color)}>
                            <stat.icon className="w-full h-full" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={cn("p-2 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-4 h-4", stat.color)} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-display font-black italic tracking-tighter">{stat.value}</div>
                        <div className="text-[9px] font-bold text-green-500 uppercase mt-2 italic">Trending ↑ 8.4%</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-display font-black uppercase italic tracking-tighter">Operational <span className="text-racing-blue">Velocity</span></h3>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Comparing New Acquisitions, Sales & Services</p>
                        </div>
                        <div className="flex gap-4">
                            {[{ k: "sales", c: "#2D6AFF" }, { k: "services", c: "#FFA500" }, { k: "growth", c: "#22c55e" }].map(l => (
                                <div key={l.k} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.c }} />
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{l.k}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthly}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2D6AFF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2D6AFF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFA500" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#000',
                                        border: 'none',
                                        borderRadius: '16px',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        color: '#fff',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#2D6AFF" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                <Area type="monotone" dataKey="services" stroke="#FFA500" strokeWidth={4} fillOpacity={1} fill="url(#colorServices)" />
                                <Line type="monotone" dataKey="growth" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Brand Revenue Chart */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8 flex flex-col">
                    <div>
                        <h3 className="text-xl font-display font-black uppercase italic tracking-tighter">Brand <span className="text-racing-blue">Dominance</span></h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Revenue Distribution by Bike Model</p>
                    </div>

                    <div className="flex-1 w-full min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={brandRevenue} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888810" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="_id"
                                    type="category"
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: '#000',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar
                                    dataKey="revenue"
                                    radius={[0, 8, 8, 0]}
                                    barSize={24}
                                >
                                    {brandRevenue?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#2D6AFF' : '#2D6AFF40'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
                        {brandRevenue?.slice(0, 3).map((item: any, i: number) => (
                            <div key={item._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-racing-blue" : "bg-muted-foreground/30")} />
                                    <span className="text-[10px] font-bold text-foreground uppercase">{item._id}</span>
                                </div>
                                <span className="text-[10px] font-black text-racing-blue">₹{(item.revenue / 1000).toFixed(1)}k</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
