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

export function Navbar() {
    const pathname = usePathname();
    const { user, login, logout, loading } = useAuth();
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
        { name: "Explore", href: "/#explore" },
        { name: "Special Offers", href: "/#promotions" },
        { name: "Products", href: "/products" },
        { name: "Service & Spares", href: "/service" },
        { name: "Inquiry", href: "/#inquiry" },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500 py-4",
            (isScrolled || isAdmin || isService || pathname === "/") ? "glass shadow-lg shadow-black/5" : "bg-transparent",
            isAdmin && "lg:left-64 lg:w-[calc(100%-16rem)] border-b border-border"
        )}>
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo remains same... */}
                    <Link href="/" className="flex items-center gap-2 md:gap-4 group">
                        <div className="relative w-10 h-10 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-110">
                            <Image
                                src="/images/YamahaLogo.png"
                                alt="Yamaha Logo"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col gap-0 md:gap-1">
                            <span className="text-base md:text-xl font-display font-black tracking-tighter text-foreground leading-none">
                                CHOUDHARY YAMAHA
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-racing-blue -mt-0.5">
                                THE CALL OF THE BLUE
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden xl:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-racing-blue transition-colors relative group"
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-racing-blue group-hover:w-full transition-all duration-300",
                                    isScrolled ? "opacity-100" : "opacity-0"
                                )} />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden xl:flex items-center gap-4">
                        <Link
                            href="tel:+917004100062"
                            className="p-3 rounded-full hover:bg-muted transition-colors group border border-transparent hover:border-border"
                        >
                            <Phone className="w-4 h-4 text-muted-foreground group-hover:text-racing-blue" />
                        </Link>

                        <ThemeToggle />

                        {loading ? (
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
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{user.displayName.split(' ')[0]}</span>
                                    <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", isProfileOpen && "rotate-180")} />
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
                                                <UserIcon className="w-4 h-4" /> My Garage
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
                                className="bg-zinc-800/50 hover:bg-zinc-800 text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border border-zinc-700 flex items-center gap-2"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                Sign In
                            </Link>
                        )}

                        <Link
                            href="/#inquiry"
                            className="bg-yamaha-blue hover:bg-dark-racing text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yamaha-blue/20 flex items-center gap-2"
                        >
                            Book Test Ride
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="xl:hidden p-2 text-gray-300 bg-zinc-800/50 rounded-xl backdrop-blur-md border border-zinc-700/50"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="xl:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl"
                    >
                        <div className="p-8 space-y-6">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block text-xl font-display font-black text-foreground uppercase tracking-tight py-3 border-b border-border"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-4 space-y-4">
                                {loading ? (
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
                                                <Link href="/profile" onClick={() => setIsOpen(false)} className="text-[10px] font-black text-racing-blue uppercase tracking-[0.2em] mt-0.5">View Garage</Link>
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
                                                href="/#inquiry"
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
                                            href="/#inquiry"
                                            onClick={() => setIsOpen(false)}
                                            className="bg-racing-blue text-white py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Test Ride
                                        </Link>
                                    </div>
                                )}
                                <Link
                                    href="tel:+917004100062"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center py-4 bg-muted/30 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border border-border/30"
                                >
                                    Contact Dealer: +91 70041 00062
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
