"use client";

import { useAuth } from "@/context/AuthContext";
import { LogIn, Bike, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
    const { login, user } = useAuth();

    if (user) {
        window.location.href = '/profile';
        return null;
    }

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
                    <div className="relative w-24 h-24 mx-auto mb-6 transition-transform duration-500 hover:scale-110">
                        <Image
                            src="/images/YamahaLogo.png"
                            alt="Yamaha"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">Join the <span className="text-racing-blue">Garage</span></h1>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Digital Service Passport for Yamaha Owners</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50">
                            <div className="p-2 bg-racing-blue/10 rounded-xl">
                                <Bike className="w-5 h-5 text-racing-blue" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Manage Your Bikes</h4>
                                <p className="text-[9px] text-muted-foreground font-bold leading-relaxed uppercase">Add your motorcycles to track mileage and history.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50">
                            <div className="p-2 bg-racing-blue/10 rounded-xl">
                                <ShieldCheck className="w-5 h-5 text-racing-blue" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Smart Reminders</h4>
                                <p className="text-[9px] text-muted-foreground font-bold leading-relaxed uppercase">Get automated alerts for upcoming maintenance and insurance.</p>
                            </div>
                        </div>
                    </div>

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
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sign in with Google</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                <p className="mt-10 text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    By signing in, you agree to our Terms of Service.
                </p>
            </motion.div>
        </div>
    );
}
