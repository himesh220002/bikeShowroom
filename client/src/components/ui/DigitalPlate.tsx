"use client";

import { motion } from "framer-motion";

interface DigitalPlateProps {
    registrationNumber: string | undefined;
    variant?: "compact" | "full";
}

export function DigitalPlate({ registrationNumber, variant = "full" }: DigitalPlateProps) {
    if (!registrationNumber) {
        return (
            <div className={`bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center ${variant === "compact" ? "px-3 py-1 text-[8px]" : "px-8 py-4 text-xs"} font-black text-gray-400 uppercase tracking-widest`}>
                NO PLATE ASSIGNED
            </div>
        );
    }

    return (
        <motion.div
            initial={{ rotateX: 20, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            className={`relative ${variant === "compact" ? "scale-75 origin-left" : ""}`}
        >
            <div className="bg-white border-2 border-zinc-200 rounded-lg px-6 py-3 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center min-w-[180px]">
                {/* IND Strip */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-blue-700 rounded-l-lg flex flex-col items-center justify-between py-2 overflow-hidden">
                    <div className="w-2 h-2 rounded-full border border-yellow-400" />
                    <span className="text-[6px] font-black text-white origin-center -rotate-90 whitespace-nowrap">INDIA</span>
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                </div>

                {/* Plate Content */}
                <div className="pl-4">
                    <span className="block text-[8px] font-black text-blue-800 uppercase tracking-widest opacity-50 text-center">IND</span>
                    <span className="text-2xl font-display font-black text-zinc-900 tracking-tighter uppercase leading-none">
                        {registrationNumber}
                    </span>
                </div>

                {/* Secure Hologram Dummy */}
                <div className="absolute right-2 top-2 w-3 h-3 rounded-full bg-gradient-to-tr from-zinc-300 to-zinc-100 border border-zinc-200 shadow-inner" />
            </div>
        </motion.div>
    );
}
