"use client";

import { useState } from "react";
import {
    ChevronRight, ChevronDown, CheckCircle2, Circle,
    Zap, Database, BarChart, Shield, Target, Award,
    ArrowUpRight, Users, Bike
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
        title: "Core Infrastructure",
        desc: "Foundational Next.js 14 App Router setup",
        status: "Completed",
        children: [
            { id: "core-1", title: "Next.js 14 App Router", desc: "Modular (auth), (customer), (admin) structure", status: "Completed" },
            { id: "core-2", title: "Tailwind CSS v4", desc: "Premium styling with Yamaha design tokens", status: "Completed" },
            { id: "core-3", title: "Framer Motion", desc: "High-performance animations for bike showcases", status: "Completed" },
        ]
    },
    {
        id: "crm",
        title: "CRM & Backend Operations",
        desc: "Server-side logic for lead processing and scoring",
        status: "Completed",
        children: [
            { id: "crm-1", title: "Server Actions", desc: "Secure backend lead submission & validation", status: "Completed" },
            { id: "crm-2", title: "Intent-Based Scoring", desc: "Automated scoring for EMI/Exchange (+50/+45)", status: "Completed" },
            { id: "crm-3", title: "Admin Dashboard UI", desc: "Interactive leads table for sales team", status: "Completed" },
            { id: "crm-4", title: "Zod Data Integrity", desc: "Strict schema validation for zero-error inputs", status: "Completed" },
            { id: "crm-5", title: "Next.js 16 Proxy layer", desc: "Request logging & path-level security (Convention: proxy.ts)", status: "Completed" },
        ]
    },
    {
        id: "readiness",
        title: "Dealer Digital Readiness",
        desc: "Self-assessment checklist for showroom excellence",
        status: "In Progress",
        children: [
            { id: "read-1", title: "Google Maps Listing", desc: "Address, phone, and hours accuracy check", status: "Completed" },
            { id: "read-2", title: "Local SEO (Katihar)", desc: "Ranking for 'Yamaha bikes Katihar' queries", status: "In Progress" },
            { id: "read-3", title: "Consistent Branding", desc: "Unified voice across FB, Insta, and YT", status: "In Progress" },
            { id: "read-4", title: "Online Service Booking", desc: "Customer journey under 30 seconds", status: "Planned" },
        ]
    },
    {
        id: "marketing",
        title: "Hyper-Local Marketing",
        desc: "Katihar-specific digital growth strategies",
        status: "In Progress",
        children: [
            { id: "mkt-1", title: "Brand VI Compliance", desc: "Yamaha Red (#e60012) & Racing Blue alignment", status: "Completed" },
            { id: "mkt-2", title: "Chhath Puja Page", desc: "Localized festive landing page for Bihar", status: "Planned" },
            { id: "mkt-3", title: "Local SEO Optimizer", desc: "Katihar keyword integration for bike searches", status: "In Progress" },
        ]
    },
    {
        id: "advanced",
        title: "Experience & Post-Sale",
        desc: "Immersive buyer journey tools",
        status: "Planned",
        children: [
            { id: "adv-1", title: "360° Bike Viewer", desc: "Interactive rotation for premium models", status: "Planned" },
            { id: "adv-2", title: "WhatsApp Business API", desc: "Automated lead follow-ups via WhatsApp", status: "Planned" },
            { id: "adv-3", title: "Y-Connect Sync", desc: "Maintenance record integration for owners", status: "Planned" },
        ]
    }
];

export default function RequirementsPage() {
    const [expanded, setExpanded] = useState<string[]>(["core", "crm", "readiness"]);

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
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-12 lg:p-24">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                            <Zap className="w-3 h-3" />
                            Strategic Roadmap
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black dark:text-white uppercase tracking-tighter">
                            BRANCH <span className="text-racing-blue">LEVEL</span><br />OPERATIONS
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                            A high-precision look at our Digital Showroom situation. Every branch represents a core business functional unit designed for Choudhary Automobile's success.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 shadow-2xl shadow-black/5">
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" className="stroke-gray-100 dark:stroke-zinc-800 fill-none" strokeWidth="8" />
                                <circle cx="40" cy="40" r="36" className="stroke-racing-blue fill-none transition-all duration-1000"
                                    strokeWidth="8" strokeDasharray={`${totalProgress * 2.26} 226`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-black dark:text-white">
                                {totalProgress}%
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Overall Progress</p>
                            <p className="text-lg font-black dark:text-white uppercase tracking-tight">Showroom Readiness</p>
                        </div>
                    </div>
                </div>

                {/* Requirements Tree */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-4">
                        {INITIAL_DATA.map((branch) => (
                            <div key={branch.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => toggleExpand(branch.id)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-3 rounded-2xl",
                                            branch.status === "Completed" ? "bg-green-100 text-green-600" :
                                                branch.status === "In Progress" ? "bg-racing-blue/10 text-racing-blue" : "bg-gray-100 text-gray-400"
                                        )}>
                                            {branch.id === "core" && <Database className="w-5 h-5" />}
                                            {branch.id === "crm" && <Users className="w-5 h-5" />}
                                            {branch.id === "readiness" && <Shield className="w-5 h-5" />}
                                            {branch.id === "marketing" && <Target className="w-5 h-5" />}
                                            {branch.id === "advanced" && <Award className="w-5 h-5" />}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-display font-black dark:text-white uppercase tracking-tight text-lg">{branch.title}</h3>
                                            <p className="text-xs text-gray-500 font-medium">{branch.desc}</p>
                                        </div>
                                    </div>
                                    {expanded.includes(branch.id) ? <ChevronDown className="w-5 h-5 text-gray-300" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
                                </button>

                                {expanded.includes(branch.id) && (
                                    <div className="px-8 pb-8 pt-2 space-y-4 border-t border-gray-50 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4">
                                        {branch.children?.map(child => (
                                            <div key={child.id} className="flex items-start gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-black/50 border border-transparent hover:border-racing-blue/10 transition-all">
                                                <div className="mt-1">
                                                    {child.status === "Completed" ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    ) : child.status === "In Progress" ? (
                                                        <Zap className="w-4 h-4 text-racing-blue" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-black dark:text-white uppercase tracking-wider mb-1">{child.title}</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{child.desc}</p>
                                                </div>
                                                <div className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] pt-0.5">
                                                    {child.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Strategic Situation Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-racing-blue p-10 rounded-[3rem] text-white shadow-2xl shadow-racing-blue/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <BarChart className="w-12 h-12 mb-8" />
                            <h2 className="text-2xl font-display font-black uppercase mb-6 leading-tight">Sales Engine Situation</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span>Lead Data Health</span>
                                        <span>80%</span>
                                    </div>
                                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-[80%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span>Funnel Velocity</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-[45%]" />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-8 text-xs font-medium text-white/80 leading-relaxed italic">
                                "Our current situation focuses on migrating Excel data to automated scoring systems to maximize Chhath Puja seasonal sales."
                            </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-racing-blue" />
                                <h3 className="font-display font-black dark:text-white uppercase text-sm">Knowledge Base</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-black/50 rounded-2xl flex items-center justify-between group cursor-pointer">
                                    <span className="text-[10px] font-bold dark:text-gray-300 uppercase">Blue Square Aesthetics</span>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-racing-blue transition-colors" />
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-black/50 rounded-2xl flex items-center justify-between group cursor-pointer">
                                    <span className="text-[10px] font-bold dark:text-gray-300 uppercase">Lead Scoring Formula</span>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-racing-blue transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="p-10 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-[3.5rem] border border-dashed border-gray-200 dark:border-zinc-800">
                            <Bike className="w-8 h-8 mx-auto mb-4 text-gray-300 dark:text-zinc-700" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                                Choudhary Automobile <br />Digital Intelligence v1.0.8
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
