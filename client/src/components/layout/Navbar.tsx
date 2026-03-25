"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bike, Menu, X, ChevronRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
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
        { name: "Service & Repairs", href: "/service" },
        { name: "Showroom", href: "/#showroom" },
        { name: "Inquiry", href: "/#inquiry" },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500 py-4",
            (isScrolled || isAdmin || isService || pathname === "/") ? "glass shadow-lg shadow-black/5" : "bg-transparent",
            isAdmin && "lg:left-64 lg:w-[calc(100%-16rem)] border-b border-border/50"
        )}>
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-yamaha-blue p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-yamaha-blue/20">
                            <Bike className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-display font-black tracking-tighter text-gray-300 leading-none">
                                CHOUDHARY YAMAHA
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 -mt-0.5">
                                Since 1989
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-racing-blue transition-colors relative group"
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
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="tel:+917004100062"
                            className="p-3 rounded-full hover:bg-zinc-800 transition-colors group border border-transparent hover:border-zinc-700"
                        >
                            <Phone className="w-4 h-4 text-gray-400 group-hover:text-racing-blue" />
                        </Link>
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
                        className="md:hidden p-2 text-gray-300 bg-zinc-800/50 rounded-xl backdrop-blur-md border border-zinc-700/50"
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
                        className="md:hidden absolute top-full left-0 w-full bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 shadow-2xl"
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
                                        className="block text-2xl font-display font-black text-white uppercase tracking-tight py-2 border-b border-zinc-800"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <Link
                                    href="tel:+917004100062"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-zinc-800 py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] text-white border border-zinc-700"
                                >
                                    Call Dealer
                                </Link>
                                <Link
                                    href="/#inquiry"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-racing-blue text-white py-4 rounded-3xl flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
                                >
                                    Test Ride
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
