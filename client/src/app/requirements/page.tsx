"use client";

import { useState } from "react";
import {
    ChevronRight, ChevronDown, CheckCircle2, Circle,
    Zap, Database, BarChart, Shield, Target, Award,
    ArrowUpRight, Users, Bike, Rocket, Layout, Settings, FileText
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Requirement = {
    id: string;
    title: string;
    desc: string;
    status: "Completed" | "In Progress" | "Planned";
    children?: Requirement[];
};

const INITIAL_DATA: Requirement[] = [
    {
        id: "core",
        title: "Technical Foundation",
        desc: "High-performance architecture with real-time capabilities",
        status: "Completed",
        children: [
            { id: "core-1", title: "Next.js 14 App Router", desc: "Modular architecture with isolated Auth, Admin, and Customer layers", status: "Completed" },
            { id: "core-2", title: "Socket.io Integration", desc: "Real-time bi-directional sync for lead & workshop notifications", status: "Completed" },
            { id: "core-3", title: "Framer Motion", desc: "Premium, context-aware micro-animations and layout transitions", status: "Completed" },
            { id: "core-4", title: "Unified State Matrix", desc: "Frontend-backend state synchronization via socket event handlers", status: "Completed" },
        ]
    },
    {
        id: "crm",
        title: "Advanced CRM Engine",
        desc: "Intelligence-driven lead management & conversion tracking",
        status: "Completed",
        children: [
            { id: "crm-1", title: "Lead Scoring Module", desc: "Intent-based prioritization for EMI, Exchange & Test Ride inquiries", status: "Completed" },
            { id: "crm-2", title: "Unified Inquiry Stream", desc: "Consolidated view for direct inquiries and CRM-qualified prospects", status: "Completed" },
            { id: "crm-3", title: "Customer Master Database", desc: "Centralized repository for ownership history & follow-up intel", status: "Completed" },
            { id: "crm-4", title: "Sales Ledger", desc: "End-to-end sales recording with automated inventory deduction", status: "Completed" },
        ]
    },
    {
        id: "workshop",
        title: "Workshop & Operations",
        desc: "Automated service scheduling and throughput management",
        status: "Completed",
        children: [
            { id: "wrk-1", title: "Service Slot Management", desc: "Capacity-aware booking system with real-time workshop availability", status: "Completed" },
            { id: "wrk-2", title: "Workshop Queue Logic", desc: "Status-driven state machine with automated priority resets", status: "Completed" },
            { id: "wrk-3", title: "Post-Booking Tracking", desc: "Chassis-level precision tracking for maintenance & history logs", status: "Completed" },
            { id: "wrk-4", title: "Service Reminder System", desc: "Dynamic milestone triggers (30, 150, 270, 390 days) for follow-ups", status: "Completed" },
        ]
    },
    {
        id: "talent",
        title: "Talent & Career Portal",
        desc: "Professional recruitment pipeline for expanding teams",
        status: "Completed",
        children: [
            { id: "tal-1", title: "Career Dashboard", desc: "Admin interface for job management and application screening", status: "Completed" },
            { id: "tal-2", title: "Rejection Workflow", desc: "Automated, professional candidate communication system", status: "Completed" },
            { id: "tal-3", title: "Duplicate Detection", desc: "Matching logic to track repeat applicants across roles", status: "Completed" },
            { id: "tal-4", title: "About Yourself Logic", desc: "Semantic constraints for high-quality candidate submissions", status: "Completed" },
        ]
    },
    {
        id: "intelligence",
        title: "Business Intelligence",
        desc: "Visual analytics and data-driven decision tools",
        status: "Completed",
        children: [
            { id: "intel-1", title: "Performance Insights", desc: "Custom analytical dashboard for revenue, units, and funnel velocity", status: "Completed" },
            { id: "intel-2", title: "Recharts Visualization", desc: "Responsive data plotting with stable, debounced rendering", status: "Completed" },
            { id: "intel-3", title: "Conversion Analytics", desc: "Real-time tracking of lead-to-customer transition metrics", status: "Completed" },
        ]
    },
    {
        id: "experience",
        title: "Showroom Experience",
        desc: "Post-sale value and immersive customer tools",
        status: "Completed",
        children: [
            { id: "exp-1", title: "My Garage (Live Sync)", desc: "Real-time ownership dashboard with maintenance countdowns", status: "Completed" },
            { id: "exp-2", title: "Legal & Compliance", desc: "Accordion-based legal framework for T&C, Privacy and Warranty", status: "Completed" },
            { id: "exp-3", title: "Ad Management", desc: "Seasonal, month-based campaign scheduling and targeting", status: "Completed" },
            { id: "exp-4", title: "Digital Road Map", desc: "Interactive transparent tracking of project developments", status: "Completed" },
        ]
    }
];

export default function RequirementsPage() {
    const [expanded, setExpanded] = useState<string[]>(["core", "crm", "workshop", "talent", "intelligence", "experience"]);

    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const calculateProgress = (reqs: Requirement[]) => {
        const total = reqs.reduce((acc, r) => acc + (r.children?.length || 1), 0);
        const completed = reqs.reduce((acc, r) => {
            if (r.children) {
                return acc + r.children.filter(c => c.status === "Completed").length;
            }
            return acc + (r.status === "Completed" ? 1 : 0);
        }, 0);
        return Math.round((completed / total) * 100);
    };

    const totalProgress = calculateProgress(INITIAL_DATA);

    return (
        <div className="min-h-screen bg-background p-4 md:p-12 lg:p-24">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                            <Rocket className="w-3 h-3" />
                            Project Intelligence v1.2.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tighter italic">
                            PROJECT <span className="text-racing-blue">EVOLUTION</span><br />ROSTER
                        </h1>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs max-w-xl leading-relaxed">
                            A comprehensive technical roster of implemented systems, engineering methodologies, and the digital roadmap for Choudhary Yamaha.
                        </p>
                    </div>
                    <div className="bg-card p-8 rounded-[3rem] border border-border flex items-center gap-6 shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-racing-blue/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" className="stroke-muted fill-none" strokeWidth="8" />
                                <circle cx="40" cy="40" r="36" className="stroke-racing-blue fill-none transition-all duration-1000"
                                    strokeWidth="8" strokeDasharray={`${totalProgress * 2.26} 226`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-foreground">
                                {totalProgress}%
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Architecture Health</p>
                            <p className="text-lg font-black text-foreground uppercase tracking-tight italic">System Ready</p>
                        </div>
                    </div>
                </div>

                {/* Requirements Tree */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-4 pb-20">
                        {INITIAL_DATA.map((branch) => (
                            <div key={branch.id} className="bg-card rounded-[2.5rem] border border-border overflow-hidden transition-all duration-300 hover:border-racing-blue/20 shadow-xl">
                                <button
                                    onClick={() => toggleExpand(branch.id)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "p-4 rounded-2xl shadow-lg transition-all",
                                            branch.status === "Completed" ? "bg-racing-blue text-white shadow-racing-blue/20" :
                                                branch.status === "In Progress" ? "bg-racing-blue/10 text-racing-blue" : "bg-muted text-muted-foreground"
                                        )}>
                                            {branch.id === "core" && <Database className="w-6 h-6" />}
                                            {branch.id === "crm" && <Users className="w-6 h-6" />}
                                            {branch.id === "workshop" && <Wrench className="w-6 h-6" />}
                                            {branch.id === "talent" && <Layout className="w-6 h-6" />}
                                            {branch.id === "intelligence" && <BarChart className="w-6 h-6" />}
                                            {branch.id === "experience" && <Award className="w-6 h-6" />}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-display font-black text-foreground uppercase tracking-tight text-xl">{branch.title}</h3>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-70">{branch.desc}</p>
                                        </div>
                                    </div>
                                    {expanded.includes(branch.id) ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                                </button>

                                {expanded.includes(branch.id) && (
                                    <div className="px-8 pb-8 pt-2 space-y-3 border-t border-border animate-in fade-in slide-in-from-top-4">
                                        {branch.children?.map(child => (
                                            <div key={child.id} className="flex items-center gap-6 p-5 rounded-3xl bg-muted/20 border border-transparent hover:border-racing-blue/10 transition-all group">
                                                <div className="shrink-0">
                                                    {child.status === "Completed" ? (
                                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-1 group-hover:text-racing-blue transition-colors">{child.title}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60 leading-relaxed">{child.desc}</p>
                                                </div>
                                                <div className="text-[9px] font-black uppercase text-racing-blue/40 tracking-[0.2em] pt-0.5 whitespace-nowrap">
                                                    DEPLOYED
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Engineering Principles Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-racing-blue p-10 rounded-[3rem] text-white shadow-2xl shadow-racing-blue/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <Settings className="w-12 h-12 mb-8 animate-spin-slow" />
                            <h2 className="text-2xl font-display font-black uppercase mb-6 leading-tight italic">Engineering<br />Principles</h2>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                                        <span>Unified State Sync</span>
                                        <span>Real-time</span>
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-full shadow-[0_0_10px_white]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                                        <span>Semantic Validation</span>
                                        <span>Strict</span>
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-[95%] shadow-[0_0_10px_white]" />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-10 text-[10px] font-black uppercase tracking-widest text-white/70 leading-relaxed italic border-t border-white/10 pt-6">
                                "Our architecture prioritizes real-time operational intel over static data collection, enabling branch-level split-second decisions."
                            </p>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-[3rem] shadow-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <Shield className="w-6 h-6 text-racing-blue" />
                                <h3 className="font-display font-black text-foreground uppercase text-sm italic tracking-tight">Main Methods</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "Socket.io Protocol", desc: "Push-based synchronization for instant data updates." },
                                    { title: "Atomic Componentry", desc: "Modular, re-usable blocks for rapid system scaling." },
                                    { title: "State-Driven Logic", desc: "Automated status transitions for workshops & talent." },
                                    { title: "Visual Intelligence", desc: "Recharts-based plotting for conversion & revenue." }
                                ].map((method, i) => (
                                    <div key={i} className="p-5 bg-muted/30 rounded-2xl border border-transparent hover:border-racing-blue/10 transition-all flex justify-between items-start group cursor-default">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-racing-blue uppercase tracking-widest">{method.title}</span>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight opacity-60 leading-tight">{method.desc}</p>
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-racing-blue transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 text-center bg-muted/20 rounded-[3.5rem] border-2 border-dashed border-border group hover:border-racing-blue/30 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                                <Bike className="w-6 h-6 text-racing-blue" />
                            </div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] leading-loose">
                                Choudhary Yamaha <br />
                                <span className="text-foreground">Digital Infrastructure</span><br />
                                <span className="text-racing-blue opacity-100">Synchronized v1.2.0</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Wrench = (props: any) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);
