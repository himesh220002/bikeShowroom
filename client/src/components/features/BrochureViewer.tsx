"use client";

import { Download, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Bike } from "@/lib/constants/bikes";

interface BrochureViewerProps {
    bike: Bike;
}

export function BrochureViewer({ bike }: BrochureViewerProps) {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = bike.brochureUrl!;
        link.download = `${bike.name}_Brochure.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-[100dvh] bg-[#0a0a0a] text-zinc-300 flex flex-col font-sans overflow-hidden">
            {/* Minimal Premium Header */}
            <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0 shadow-2xl">
                <div className="flex items-center gap-6">
                    <Link href={`/bikes/${bike.slug}`} className="p-2.5 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-racing-blue border border-transparent hover:border-white/10 active:scale-95">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-8 w-px bg-white/10 hidden sm:block" />
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white leading-none">{bike.name}</h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5 opacity-60">Authorized Digital Brochure</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `${bike.name} Brochure`,
                                    text: `Check out the official brochure for the ${bike.name} from Choudhary Yamaha!`,
                                    url: window.location.href,
                                });
                            }
                        }}
                        className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10 hidden sm:flex"
                        title="Share Link"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2.5 bg-racing-blue text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-dark-racing hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-racing-blue/30"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                        <span className="sm:hidden">Download</span>
                    </button>
                </div>
            </header>

            {/* Immersive Viewer Area */}
            <main className="flex-1 overflow-hidden bg-[#111111] relative">
                {/* Immersive Backdrop Glow */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-racing-blue/5 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-racing-blue/5 blur-[120px] pointer-events-none rounded-full" />

                <div className="w-full h-full p-2 sm:p-6 lg:p-10 flex flex-col items-center">
                    <div className="w-full h-full max-w-7xl bg-black rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 relative ring-1 ring-white/10">
                        {/* Interactive Frame */}
                        <iframe
                            src={`${bike.brochureUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full border-none"
                            title={`${bike.name} Brochure Cinematic View`}
                        />

                        {/* Mobile Navigation Helper Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 pointer-events-none md:hidden animate-pulse shadow-2xl">
                            Scroll Down to Explore
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
