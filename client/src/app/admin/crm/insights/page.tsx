"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, Cell, PieChart, Pie, FunnelChart, Funnel, LabelList, ComposedChart
} from "recharts";
import {
    ArrowLeft, TrendingUp, Users, DollarSign,
    Wrench, Sparkles, Filter, Calendar, Loader2,
    PieChart as PieIcon, BarChart3, Target, Activity,
    Box, Wallet, AlertTriangle, CheckCircle2,
    ArrowUpRight, ArrowDownRight, Zap, MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

const COLORS = ["#004da1", "#007bff", "#2D6AFF", "#60A5FA", "#93C5FD", "#BFDBFE"];

export default function InsightsPage() {
    const [period, setPeriod] = useState<"6months" | "ytd" | "all">("6months");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/insights/crm?period=${period}`);
                const result = await res.json();
                if (result.success) setData(result.data);
            } catch (err) {
                console.error("Failed to fetch insights:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [period]);

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
                    <h2 className="text-xl font-display font-black uppercase italic tracking-tighter">Syncing Intelligence <span className="text-racing-blue">Core</span></h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Processing real-time workshop metrics...</p>
                </div>
            </div>
        );
    }

    const {
        monthly = [],
        brandRevenue = [],
        leadFunnel = [],
        inventoryIntelligence = [],
        colorSales = [],
        modelColors = [],
        financeStats = [],
        financialSplit = [],
        overview = {
            totalCustomers: 0,
            totalRevenue: 0,
            activeServices: 0,
            nps: 0,
            serviceCompletionRate: 0,
            inventoryHealth: 0,
            noShowRate: 0
        }
    } = data || {};

    const InsightCard = ({ title, icon: Icon, children, className }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-2xl space-y-6 group hover:border-racing-blue/20 transition-all", className)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-racing-blue/10 rounded-xl group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-racing-blue" />
                    </div>
                    <h3 className="text-lg font-display font-black uppercase italic tracking-tighter text-foreground">{title}</h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-racing-blue animate-pulse" />
            </div>
            <div className="h-auto w-full">
                {children}
            </div>
        </motion.div>
    );

    // Dynamic Recommendation Logic
    const salesPerformance = monthly.reduce((acc: any, curr: any) => acc + curr.sales, 0);
    const targetPerformance = monthly.reduce((acc: any, curr: any) => acc + curr.target, 0);
    const achievementPercent = targetPerformance > 0 ? Math.round((salesPerformance / targetPerformance) * 100) : 0;

    const financeCount = financeStats.find((f: any) => f._id === 'Finance' || f._id === 'EMI')?.count || 0;
    const totalFinanceBase = financeStats.reduce((acc: any, curr: any) => acc + curr.count, 0) || 1;
    const financeUptake = Math.round((financeCount / totalFinanceBase) * 100);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header & Quick Sync */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-card border border-border rounded-xl hover:bg-muted transition-all shadow-lg group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-4xl font-display font-black text-foreground uppercase tracking-tighter italic leading-none">
                            Showroom <span className="text-racing-blue">Intelligence</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operational Performance Dashboard &bull; Live</p>
                        </div>
                    </div>
                </div>

                <div className="flex bg-muted/50 backdrop-blur-md rounded-2xl p-1.5 border border-border/50">
                    {[
                        { label: "Last 6 Months", value: "6months" },
                        { label: "Year to Date", value: "ytd" },
                        { label: "Life-to-Date", value: "all" }
                    ].map((p, i) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value as any)}
                            className={cn(
                                "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                period === p.value ? "bg-racing-blue text-white shadow-xl shadow-racing-blue/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary KPI Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Revenue Target", value: `₹${((overview?.totalRevenue || 0) / 100000).toFixed(1)}L`, trend: "↑ 12%", positive: true, icon: Target },
                    { label: "Service Efficiency", value: `${overview?.serviceCompletionRate || 0}%`, trend: `vs ${overview?.noShowRate || 0}% No-shows`, positive: overview?.serviceCompletionRate > 80, icon: Activity },
                    { label: "Customer NPS", value: (overview?.nps || 0).toFixed(1), trend: "↑ 0.4", positive: true, icon: Sparkles },
                    { label: "Inventory Health", value: `${overview?.inventoryHealth || 0}%`, trend: "Stable", positive: true, icon: Box },
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-racing-blue/5 rounded-2xl">
                                <kpi.icon className="w-5 h-5 text-racing-blue" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
                                kpi.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                            )}>
                                {kpi.trend.includes("Stable") ? <Zap className="w-3 h-3" /> : kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="text-3xl font-display font-black text-foreground italic tracking-tighter mb-1">{kpi.value}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{kpi.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Section 1: Sales Performance */}
            <InsightCard title="Monthly Sales vs Target" icon={BarChart3}>
                <ResponsiveContainer width="100%" height={300} debounce={100}>
                    <BarChart data={monthly}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', color: '#fff' }} />
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                        <Bar dataKey="target" name="Monthly Target" fill="#2D6AFF20" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="sales" name="Actual Performance" fill="#2D6AFF" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </InsightCard>

            {/* Section 1: Core Performance Ratios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InsightCard title="Sales Distribution by Model" icon={PieIcon}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={220} debounce={100}>
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Pie
                                        data={brandRevenue}
                                        dataKey="units"
                                        nameKey="_id"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {brandRevenue?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3 mt-2 overflow-y-auto h-[180px] pr-2 custom-scrollbar">
                            {brandRevenue?.map((item: any, i: number) => {
                                const totalUnits = brandRevenue.reduce((acc: number, curr: any) => acc + curr.units, 0);
                                const percentage = ((item.units / totalUnits) * 100).toFixed(1);
                                const isDominant = parseFloat(percentage) > 30;
                                return (
                                    <div key={i} className="p-2 bg-muted/20 border border-border/50 rounded-xl group/model">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className="text-[10px] font-black uppercase text-foreground">{item._id.replace(/^Yamaha\s+/i, '')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-display font-black text-foreground italic">{item.units} Units</span>
                                                <span className="text-[10px] font-display font-black text-racing-blue italic">{percentage}%</span>
                                            </div>
                                        </div>
                                        <p className="text-[8px] font-medium text-muted-foreground leading-relaxed italic group-hover/model:text-foreground transition-colors uppercase tracking-widest">
                                            {isDominant ? "Market Dominant • Key Volume Driver" : "Targeted Performance • Niche Growth Segment"}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </InsightCard>

                <InsightCard title="Revenue Stream Intelligence" icon={Wallet}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={220} debounce={100}>
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Pie
                                        data={overview.revenueSplit}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {overview.revenueSplit?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3 mt-2 overflow-y-auto h-[180px] pr-2 custom-scrollbar">
                            {overview.revenueSplit?.map((item: any, i: number) => {
                                const percentage = ((item.value / overview.totalRevenue) * 100).toFixed(1);
                                return (
                                    <div key={i} className="p-2 bg-muted/20 border border-border/50 rounded-xl group/rev">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[9px] font-black uppercase text-foreground">{item.name}</span>
                                            </div>
                                            <span className="text-[10px] font-display font-black text-racing-blue italic">{percentage}%</span>
                                        </div>
                                        <p className="text-[8px] font-medium text-muted-foreground leading-relaxed italic group-hover/rev:text-foreground transition-colors">
                                            {item.scalingNote}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/50">
                            <h5 className="text-[8px] font-black uppercase tracking-tighter text-amber-500 flex items-center gap-1 mb-2">
                                <Zap className="w-2 h-2 fill-amber-500" /> Future Scaling Thought
                            </h5>
                            <p className="text-[9px] font-black text-foreground italic leading-tight">
                                {overview.revenueSplit?.[2]?.value / overview.totalRevenue < 0.1
                                    ? "Accessories are currently under-leveraged. Aim to bundle 1 premium accessory with every bike sale to optimize capital ratio."
                                    : "Revenue ratios are healthy. Scale service capacity by 20% to capture spillover demand from high volume vehicle sales."}
                            </p>
                        </div>
                    </div>
                </InsightCard>
            </div>

            {/* Section 2: Service & Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InsightCard title="Service Scheduled vs Completed" icon={Activity}>
                    <ResponsiveContainer width="100%" height={300} debounce={100}>
                        <LineChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="services" name="Total Scheduled" stroke="#93C5FD" strokeWidth={4} dot={{ r: 6, fill: '#93C5FD' }} strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="growth" name="Completed Jobs" stroke="#2D6AFF" strokeWidth={4} dot={{ r: 6, fill: '#2D6AFF' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </InsightCard>

                <InsightCard title="Lead Conversion Funnel" icon={Users}>
                    <ResponsiveContainer width="100%" height={300} debounce={100}>
                        <FunnelChart>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Funnel dataKey="value" data={leadFunnel} isAnimationActive>
                                <LabelList position="right" fill="#888" stroke="none" dataKey="stage" fontSize={10} fontWeight={900} />
                                {leadFunnel?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </InsightCard>
            </div>

            {/* NEW Section: Sales Velocity & Stock Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InsightCard title="Inventory Depletion Urgency" icon={TrendingUp}>
                    <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {inventoryIntelligence.filter((v: any) => v.unitsSold > 0 || v.recentUnitsSold > 0).map((v: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-2xl hover:border-racing-blue/30 transition-all group">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase text-foreground">{v.model.replace(/^Yamaha\s+/i, '')}</h4>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase text-racing-blue">Recent Rate: {Math.round(v.recentVelocity * 30)} units/month</span>
                                            <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40">({v.recentUnitsSold} sold in 30d)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground">Period Rate: {Math.round(v.velocity * 30)} units/month</span>
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                                v.status === 'Critical' ? "bg-red-500/10 text-red-500 animate-pulse" : (v.status === 'Low' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")
                                            )}>
                                                {v.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-display font-black text-foreground italic">{v.daysToOut < 999 ? `${v.daysToOut} Days` : 'Infinite'}</div>
                                    <p className="text-[7px] font-black uppercase text-muted-foreground opacity-60">To Out of Stock</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </InsightCard>

                <InsightCard title="Top Selling Colorways" icon={Sparkles}>
                    <div className="space-y-6 overflow-y-auto h-[300px] pr-2 custom-scrollbar">
                        {colorSales.map((group: any, i: number) => {
                            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            return (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase text-foreground italic flex items-center gap-2">
                                            {group._id.bike.replace(/^Yamaha\s+/i, '')}
                                            <span className="px-2 py-0.5 bg-muted rounded text-[7px] font-black text-muted-foreground">{months[group._id.month - 1]}</span>
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {group.topColors.map((c: any, ci: number) => {
                                            const mColor = modelColors.find((mc: any) => mc.name === group._id.bike)?.colors.find((color: any) => color.name === c.color);
                                            return (
                                                <div
                                                    key={ci}
                                                    className="flex-1 group/color relative"
                                                    title={c.color}
                                                >
                                                    <div className="flex items-center justify-between mb-1 px-1">
                                                        <span className="text-[7px] font-black text-muted-foreground uppercase opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                                                            {c.color}
                                                        </span>
                                                        <span className="text-[9px] font-display font-black text-foreground italic">{c.units}</span>
                                                    </div>
                                                    <div
                                                        className="h-1.5 rounded-full shadow-lg transition-all group-hover/color:scale-y-150"
                                                        style={{ backgroundColor: mColor?.hex || COLORS[ci % COLORS.length] }}
                                                    />

                                                    {/* Tooltip on hover */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white rounded-lg opacity-0 group-hover/color:opacity-100 transition-all pointer-events-none z-50 shadow-2xl border border-white/10 min-w-max">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mColor?.hex || COLORS[ci % COLORS.length] }} />
                                                            <span className="text-[8px] font-black uppercase tracking-widest">{c.color} &bull; {c.units} Sold</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {/* Fill empty slots if less than 3 colors sold */}
                                        {Array.from({ length: Math.max(0, 3 - group.topColors.length) }).map((_, ei) => (
                                            <div key={`empty-${ei}`} className="flex-1">
                                                <div className="h-1.5 bg-muted/20 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </InsightCard>
            </div>

            {/* Section 3: Inventory Intelligence */}
            <div className="grid grid-cols-1 gap-8">
                <InsightCard title="Inventory Supply vs Market Demand" icon={Box}>
                    <ResponsiveContainer width="100%" height={300} debounce={100}>
                        <ComposedChart
                            data={inventoryIntelligence.map((v: any) => {
                                const demand = Math.round(v.recentVelocity * 30);
                                let color = "#10B981"; // Green (Healthy)
                                if (v.stock < demand) color = "#EF4444"; // Red (Critical)
                                else if (v.stock < demand * 2) color = "#2D6AFF"; // Blue (Balanced)

                                return {
                                    name: v.model.replace(/^Yamaha\s+/i, ''),
                                    stock: v.stock,
                                    demand: demand,
                                    color
                                };
                            })}
                        >
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 900, fill: '#888888' }}
                                width={150}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="stock" name="Current Stock" radius={[10, 10, 0, 0]}>
                                {inventoryIntelligence.map((v: any, index: number) => {
                                    const demand = Math.round(v.recentVelocity * 30);
                                    let color = "#10B981";
                                    if (v.stock < demand) color = "#EF4444";
                                    else if (v.stock < demand * 2) color = "#2D6AFF";
                                    return <Cell key={`cell-${index}`} fill={color} />;
                                })}
                                <LabelList dataKey="stock" position="top" fill="#888" fontSize={9} fontWeight={900} />
                            </Bar>
                            <Line
                                type="monotone"
                                dataKey="demand"
                                name="Market Demand (30d)"
                                stroke="#F59E0B"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#F59E0B' }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </InsightCard>
            </div>

            {/* Section 4: Customer Feedback */}
            <InsightCard
                title="Recent Customer Feedback"
                icon={MessageSquare}
                className="overflow-hidden"
                subtitle={
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-foreground">{overview.nps?.toFixed(1) || '0.0'} / 5.0</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-border/50 pl-4">
                            <TrendingUp className="w-3 h-3 text-racing-blue" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase">{overview.npsCount || 0} Total Votes</span>
                        </div>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar p-2">
                    {data?.recentFeedback?.length > 0 ? (
                        data.recentFeedback.map((fb: any, i: number) => (
                            <div key={i} className="p-4 bg-muted/30 rounded-2xl border border-border/50 space-y-2 hover:border-racing-blue/30 transition-all group">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-foreground">{fb.name}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-display font-black text-racing-blue italic">{fb.rating}</span>
                                        <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">/10</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic line-clamp-3">"{fb.feedback}"</p>
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest pt-2 border-t border-border/10">
                                    <span className="text-racing-blue/60">{fb.bikeModel}</span>
                                    <span className="opacity-40">{new Date(fb.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30 gap-4">
                            <MessageSquare className="w-8 h-8" />
                            <span className="text-[10px] uppercase font-black tracking-widest">No Feedback Yet</span>
                        </div>
                    )}
                </div>
            </InsightCard>

            {/* Focus & Recommendations */}
            <div className="space-y-6">
                <h3 className="text-2xl font-display font-black uppercase text-foreground italic tracking-tighter">Engine <span className="text-racing-blue">Recommendations</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            type: "Achievement",
                            title: "Sales Engagement",
                            desc: `We achieved ${achievementPercent}% of the sales target for the selected period. ${brandRevenue?.[0]?._id || 'Primary'} model is leading the chart with ${brandRevenue?.[0]?.units || 0} unit sales.`,
                            icon: CheckCircle2,
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10"
                        },
                        {
                            type: "Lagging Area",
                            title: "Service No-Shows",
                            desc: `Service no-show rate is at ${overview.noShowRate}%. We recommend implementing automated reminder calls and WhatsApp follow-ups to reduce this gap.`,
                            icon: AlertTriangle,
                            color: "text-rose-500",
                            bg: "bg-rose-500/10"
                        },
                        {
                            type: "Focus Area",
                            title: "Restock Priority",
                            desc: inventoryIntelligence.find((v: any) => v.status === 'Critical')
                                ? `URGENT: ${inventoryIntelligence.find((v: any) => v.status === 'Critical').model.replace(/^Yamaha\s+/i, '')} has a monthly sale rate of ${Math.round(inventoryIntelligence.find((v: any) => v.status === 'Critical').recentVelocity * 30)} units with only ${inventoryIntelligence.find((v: any) => v.status === 'Critical').stock} left. Restock within ${inventoryIntelligence.find((v: any) => v.status === 'Critical').daysToOut} days.`
                                : `Inventory levels are currently stable across all high-velocity models. Continue monitoring stock levels.`,
                            icon: Box,
                            color: "text-amber-500",
                            bg: "bg-amber-500/10"
                        }
                    ].map((rec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="bg-card border border-border rounded-[2rem] p-8 space-y-4 hover:shadow-2xl transition-all"
                        >
                            <div className={cn("p-3 w-fit rounded-2xl mb-4", rec.bg)}>
                                <rec.icon className={cn("w-6 h-6", rec.color)} />
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", rec.color)}>{rec.type}</span>
                            <h4 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">{rec.title}</h4>
                            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-70">
                                {rec.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Section 5: External Analytics */}
            <div className="grid grid-cols-1 gap-8">
                <InsightCard title="Web Traffic Intelligence" icon={Activity} className="border-racing-blue/10 bg-gradient-to-br from-card to-racing-blue/50">
                    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-racing-blue/20 blur-3xl rounded-full animate-pulse" />
                            <Activity className="w-16 h-16 text-racing-blue relative z-10" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h4 className="text-xl font-display font-black uppercase italic tracking-tighter">Vercel <span className="text-racing-blue">Real-time</span> Analytics</h4>
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest leading-relaxed opacity-70">
                                Detailed visitor demographics, page views, and conversion path analysis are processed externally to ensure showroom performance remains optimal.
                            </p>
                        </div>
                        <a
                            href="https://vercel.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-racing-blue/20 group/btn"
                        >
                            Open Vercel Dashboard
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </InsightCard>
            </div>
        </div>
    );
}
