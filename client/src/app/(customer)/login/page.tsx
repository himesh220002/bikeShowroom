"use client";

import { useAuth } from "@/context/AuthContext";
import { LogIn, Bike, ChevronRight, ShieldCheck, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export default function LoginPage() {
    const { login, loginLocal, register, user } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'options'>('options');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) {
        window.location.href = '/profile';
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = mode === 'login'
            ? await loginLocal({ email: formData.email, password: formData.password })
            : await register(formData);

        if (!res.success) {
            setError(res.message || 'Action failed');
            setLoading(false);
        } else {
            window.location.href = '/profile';
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-racing-blue/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-racing-blue/5 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass p-10 rounded-[3rem] border border-zinc-800 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="relative w-20 h-20 mx-auto mb-6 transition-transform duration-500 hover:scale-110">
                        <Image
                            src="/images/YamahaLogo.png"
                            alt="Yamaha"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">
                        {mode === 'options' ? 'Join the Garage' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest px-4">
                        {mode === 'options' ? 'Digital Service Passport for Yamaha Owners' : 'Access your digital maintenance record'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'options' ? (
                        <motion.div
                            key="options"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={login}
                                className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-[2rem] flex items-center justify-center gap-4 transition-all group active:scale-95 shadow-2xl shadow-white/5"
                            >
                                <div className="relative w-5 h-5">
                                    <Image
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                        alt="Google"
                                        fill
                                    />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Continue with Google</span>
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
                                <div className="relative flex justify-center text-[8px] uppercase font-black"><span className="bg-background px-4 text-zinc-500 tracking-[0.3em]">Or use Email</span></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setMode('login')}
                                    className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-racing-blue transition-all group text-left"
                                >
                                    <LogIn className="w-5 h-5 text-racing-blue mb-4 transition-transform group-hover:scale-110" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white">Guest Login</p>
                                </button>
                                <button
                                    onClick={() => setMode('register')}
                                    className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-racing-blue transition-all group text-left"
                                >
                                    <UserIcon className="w-5 h-5 text-racing-blue mb-4 transition-transform group-hover:scale-110" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white">New Account</p>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <button
                                type="button"
                                onClick={() => setMode('options')}
                                className="flex items-center gap-2 text-[8px] font-black text-racing-blue uppercase tracking-widest mb-4 hover:opacity-70 transition-opacity"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back to options
                            </button>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider text-center">
                                    {error}
                                </div>
                            )}

                            {mode === 'register' && (
                                <div className="space-y-1">
                                    <label htmlFor="displayName" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            id="displayName"
                                            required
                                            type="text"
                                            placeholder="Yamaha Rider"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-12 py-4 text-white text-xs focus:outline-none focus:border-racing-blue transition-all"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        id="email"
                                        required
                                        type="email"
                                        placeholder="rider@yamaha.com"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-12 py-4 text-white text-xs focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-4">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        id="password"
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-12 py-4 text-white text-xs focus:outline-none focus:border-racing-blue transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className={cn(
                                    "w-full bg-racing-blue text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-racing-blue/20 transition-all active:scale-95 disabled:opacity-50 mt-4",
                                    loading && "animate-pulse"
                                )}
                            >
                                {loading ? 'Processing...' : mode === 'login' ? 'Authorize Mission' : 'Ignite Journey'}
                            </button>

                            <p className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                    className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-racing-blue transition-colors"
                                >
                                    {mode === 'login' ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                                </button>
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>

                <p className="mt-10 text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
                    By signing in, you agree to our <span className="text-zinc-600 underline">Terms</span> and <span className="text-zinc-600 underline">Privacy Policy</span>.
                </p>
            </motion.div>
        </div>
    );
}
