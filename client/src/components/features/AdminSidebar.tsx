"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bike,
    LayoutDashboard,
    Users,
    Settings,
    BarChart2,
    Package,
    LogOut,
    Calendar,
    UserCheck,
    Sun,
    Moon
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/providers/ThemeProvider";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Sales Leads", href: "/admin/leads" },
    { icon: UserCheck, label: "Customer CRM", href: "/admin/crm" },
    { icon: BarChart2, label: "Ads & Marketing", href: "/admin/ads" },
    { icon: Calendar, label: "Service Schedule", href: "/admin/services" },
    { icon: Package, label: "Inventory", href: "/admin/inventory" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col fixed left-0 top-24 md:top-32 py-8 h-[calc(100vh-8rem)]">
            {/* <div className="p-6 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="bg-yamaha-blue p-1.5 rounded-lg">
                        <Bike className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col -gap-1">
                        <span className="text-lg font-display font-black tracking-tighter text-white">
                            YAMAHA
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 -mt-1">
                            Katihar Admin
                        </span>
                    </div>
                </div>
            </div> */}

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                isActive
                                    ? "bg-racing-blue/10 text-racing-blue"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-racing-blue" : "text-muted-foreground")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all text-left"
                >
                    {theme === "light" ? (
                        <>
                            <Moon className="w-5 h-5 text-muted-foreground" />
                            Dark Mode
                        </>
                    ) : (
                        <>
                            <Sun className="w-5 h-5 text-muted-foreground" />
                            Light Mode
                        </>
                    )}
                </button>
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    General Settings
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all text-left"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
