"use client";

import Link from "next/link";
import Image from "next/image";
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
    Wrench,
    Sun,
    Moon,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState } from "react";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Sales Leads", href: "/admin/leads" },
    { icon: UserCheck, label: "Customer CRM", href: "/admin/crm" },
    { icon: BarChart2, label: "Ads & Marketing", href: "/admin/ads" },
    { icon: Calendar, label: "Service Schedule", href: "/admin/services" },
    { icon: Wrench, label: "Accessories Billing", href: "/admin/accessories" },
    { icon: Package, label: "Inventory", href: "/admin/inventory" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("admin_session_active");
        window.location.href = "/";
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="xl:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-[80] px-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/images/YamahaLogo.png"
                            alt="Yamaha Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-lg font-display font-black tracking-tighter text-foreground uppercase">Admin Portal</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 -mr-2 bg-muted/50 hover:bg-muted rounded-2xl transition-all active:scale-90 border border-border/50"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </header>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="xl:hidden fixed inset-0 bg-background/80 backdrop-blur-md z-[70]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "w-64 bg-card border-r border-border flex flex-col fixed left-0 top-0 py-20 xl:py-5 h-screen z-[75] transition-transform duration-500 ease-in-out xl:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-8 mb-12">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110">
                            <Image
                                src="/images/YamahaLogo.png"
                                alt="Yamaha Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-display font-black tracking-tighter text-foreground uppercase">
                                Choudhary
                            </span>
                            <span className="text-lg uppercase font-black tracking-widest text-muted-foreground -mt-2">
                                YAMAHA
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
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
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    >
                        <Settings className="w-5 h-5 text-muted-foreground" />
                        General Settings
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
