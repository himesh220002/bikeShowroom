"use client";

import { useState, useEffect, useCallback } from "react";
import { Lock, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ADMIN_SESSION_KEY = "admin_session_active";
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Simple hash simulation for "Yamaha123"
const ADMIN_PASSWORD_HASH = "7884762c2635921869e5d610850257321689163e753900224b11166699"; // Not a real hash, just a token

interface AdminAuthProps {
    children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const checkSession = useCallback(() => {
        const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!sessionStr) return false;

        try {
            const session = JSON.parse(sessionStr);
            const now = Date.now();

            if (now - session.timestamp > SESSION_TIMEOUT) {
                localStorage.removeItem(ADMIN_SESSION_KEY);
                return false;
            }
            return true;
        } catch (e) {
            localStorage.removeItem(ADMIN_SESSION_KEY);
            return false;
        }
    }, []);

    useEffect(() => {
        const authorized = checkSession();
        setIsAuthorized(authorized);

        // Check session every minute
        const interval = setInterval(() => {
            if (!checkSession()) {
                setIsAuthorized(false);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [checkSession]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate small delay for premium feel
        setTimeout(() => {
            if (password === "Yamaha123") {
                const session = {
                    timestamp: Date.now(),
                    token: ADMIN_PASSWORD_HASH
                };
                localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
                setIsAuthorized(true);
            } else {
                setError("Invalid administrative credentials");
                setPassword("");
            }
            setLoading(false);
        }, 8000);
    };

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-racing-blue animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,123,255,0.1),transparent_50%)]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-blue to-transparent" />

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-racing-blue/10 rounded-3xl flex items-center justify-center mb-6 border border-racing-blue/20">
                                <Lock className="w-8 h-8 text-racing-blue" />
                            </div>
                            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight text-center">
                                Restricted Access
                            </h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
                                Admin Credentials Required
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter access code"
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white text-center tracking-[0.2em] focus:ring-2 focus:ring-racing-blue/50 outline-none transition-all placeholder:text-zinc-700 placeholder:tracking-normal placeholder:font-bold placeholder:text-[10px] placeholder:uppercase font-mono"
                                    autoFocus
                                />
                                <div className="absolute inset-0 rounded-2xl bg-racing-blue/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest justify-center bg-red-500/10 py-2 rounded-xl border border-red-500/20"
                                    >
                                        <ShieldAlert className="w-3 h-3" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full bg-racing-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-dark-racing active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-racing-blue/20"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Grant Access
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Encryption Active
                            </div>
                            <span>v2.0.4</span>
                        </div>
                    </div>

                    <p className="text-center mt-6 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                        Unauthorized access is monitored
                    </p>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
