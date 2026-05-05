"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { LogIn, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationBell } from "@/components/features/NotificationBell";
import { useConfig } from "@/components/providers/ConfigProvider";
import { Compass, Warehouse, Bike, Wrench, MessageCircle } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();
    const { user, login, logout, loading: authLoading } = useAuth();
    const { config } = useConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const isAdmin = pathname?.startsWith("/admin");
    const isService = pathname === "/service";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Explore", href: "/#explore", icon: Compass },
        { name: "My Garage", href: "/garage", icon: Warehouse },
        { name: "Products", href: "/products", icon: Bike },
        { name: "Service & Spares", href: "/service", icon: Wrench },
        { name: "Inquiry", href: "/inquiry", icon: MessageCircle },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500 py-3",
            (isScrolled || isAdmin || isService || pathname === "/" || pathname === "/products" || pathname === "/garage") ? "glass shadow-lg shadow-black/5" : "glass shadow-lg shadow-black/5",
            isAdmin && "lg:left-64 lg:w-[calc(100%-16rem)] border-b border-border"
        )}>
            <div className="mx-20px px-4 sm:px-6 lg:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:scale-110">
                            <Image
                                src="/images/YamahaLogo.png"
                                alt="Yamaha Logo"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-0 md:gap-0">
                            <span className="text-[1rem] font-display font-black tracking-tighter text-gradient-text leading-none">
                                CHOUDHARY
                            </span>
                            <span className="text-[0.8rem] uppercase font-black tracking-[0.2em] text-red-500  -mt-0.5">
                                YAMAHA
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden xl:flex items-center gap-6 2xl:gap-10">
                        {navLinks.map((link) => {
                            const isActive = link.href.startsWith('/#')
                                ? pathname === '/'
                                : pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-[0.6rem] font-black uppercase tracking-[0.2rem] transition-colors relative group",
                                        isActive ? "text-foreground" : "text-secondary hover:text-racing-blue"
                                    )}
                                >
                                    {link.name}
                                    <span className={cn(
                                        "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-800/60 to-racing-blue/40 transition-all duration-300 rounded-full",
                                        isActive ? "w-full" : "w-0 group-hover:w-full"
                                    )} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden xl:flex items-center gap-4">
                        <Link href="/admin" target="_blank">
                            <div className="hidden xl:flex items-center gap-2 p-2 opacity-0 hover:opacity-4 hover:bg-muted/50 rounded-full transition-colors cursor-pointer group">A</div>
                        </Link>
                        <Link
                            href={`tel:${config.showroomPhone.replace(/\s+/g, '')}`}
                            className="p-3 rounded-full hover:bg-muted transition-colors group border border-transparent hover:border-border"
                        >
                            <Phone className="w-4 h-4 text-muted-foreground group-hover:text-racing-blue" />
                        </Link>

                        <ThemeToggle />
                        {user && <NotificationBell />}

                        {authLoading ? (
                            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 bg-card hover:bg-muted rounded-full border border-border transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-racing-blue/50">
                                        {user.avatar ? (
                                            <Image src={user.avatar} alt={user.displayName} width={32} height={32} className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-racing-blue flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gradient-text">{user.displayName.split(' ')[0]}</span>
                                    <ChevronDown className={cn("w-3 h-3 text-gray-600 transition-transform", isProfileOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                                        >
                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue transition-colors">
                                                <UserIcon className="w-4 h-4" /> Profile
                                            </Link>
                                            <button
                                                onClick={() => logout()}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-zinc-800/50 hover:bg-zinc-800 text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border border-foreground/20 flex items-center gap-2"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                Sign In
                            </Link>
                        )}

                        <Link
                            href="/test-ride"
                            className="bg-yamaha-blue hover:bg-dark-racing text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yamaha-blue/20 flex items-center gap-2"
                        >
                            Test Ride
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="flex xl:hidden gap-2 items-center">
                        <Link href="/inquiry" className="px-4 py-2 text-white font-medium bg-gradient-to-r from-blue-900 to-purple-700 rounded-xl hover:bg-green-900">Inquiry</Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="2xl:hidden p-2.5 text-white bg-zinc-900/80 rounded-xl backdrop-blur-lg border border-white/10 shadow-xl"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="xl:hidden fixed inset-0 min-h-screen bg-background shadow-2xl"
                    >
                        <div className="h-screen flex flex-col">
                            <div className="px-6 pt-6 pb-4 border-b border-border bg-background">
                                <div className="flex items-center justify-end">
                                    {/* <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Menu</span> */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close mobile menu"
                                        className="p-2.5 rounded-xl bg-muted border border-border text-foreground hover:text-racing-blue transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-around pt-4">
                                    {/* <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Theme / Notifications</span> */}
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Menu</span>

                                    <div className="flex items-center gap-4">
                                        <ThemeToggle />
                                        {user && <NotificationBell />}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {navLinks.map((link, idx) => {
                                    const isActive = link.href.startsWith('/#')
                                        ? pathname === '/'
                                        : pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));

                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center justify-center gap-10 text-xl font-display font-black uppercase tracking-tight py-4 border-b transition-colors group",
                                                    isActive ? "text-blue-800 border-racing-blue" : "text-foreground border-border"
                                                )}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <link.icon className={cn("w-5 h-5", isActive ? "text-blue-800" : "text-muted-foreground group-hover:text-racing-blue")} />
                                                    {link.name}
                                                </span>
                                                <ChevronRight className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-800" : "text-muted-foreground group-hover:text-racing-blue")} />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <div className="pt-6 pb-10 space-y-4">
                                    {authLoading ? (
                                        <div className="h-14 bg-muted rounded-3xl animate-pulse" />
                                    ) : user ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-3xl border border-border">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-racing-blue">
                                                    {user.avatar ? (
                                                        <Image src={user.avatar} alt={user.displayName} width={48} height={48} className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-racing-blue flex items-center justify-center">
                                                            <UserIcon className="w-6 h-6 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-foreground uppercase tracking-wider">{user.displayName}</span>
                                                    <Link href="/profile" onClick={() => setIsOpen(false)} className="text-[10px] font-black text-racing-blue uppercase tracking-[0.2em] mt-0.5">View Profile</Link>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => { logout(); setIsOpen(false); }}
                                                    className="bg-muted py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] text-red-500 border border-border"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                                </button>
                                                <Link
                                                    href="/test-ride"
                                                    onClick={() => setIsOpen(false)}
                                                    className="bg-racing-blue text-white py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
                                                >
                                                    Test Ride
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="bg-muted py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] text-foreground border border-border"
                                            >
                                                <LogIn className="w-4 h-4 mr-2" /> Sign In
                                            </Link>
                                            <Link
                                                href="/test-ride"
                                                onClick={() => setIsOpen(false)}
                                                className="bg-racing-blue text-white py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
                                            >
                                                Test Ride
                                            </Link>
                                        </div>
                                    )}
                                    <Link
                                        href={`tel:${config.showroomPhone.replace(/\s+/g, '')}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center py-4 bg-muted/30 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border border-border/30"
                                    >
                                        Contact Dealer: {config.showroomPhone}
                                    </Link>
                                    <Link
                                        href="/admin"
                                        target="_blank"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center py-4 bg-muted/30 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border border-border/30"
                                    >
                                        Admin
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
