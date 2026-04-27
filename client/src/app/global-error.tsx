'use client'

import { Inter, Outfit } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-zinc-950 text-foreground flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-racing-blue/10 rounded-3xl flex items-center justify-center mx-auto border border-racing-blue/20">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-white">System Error</h2>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">
            An unexpected error occurred during the static generation or runtime of the showroom platform. 
            Our automated monitoring system has logged this event.
          </p>
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 text-left overflow-hidden">
            <p className="text-[10px] font-mono text-rose-500 break-all">
              {error.message || "Unknown error occurred"}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-gray-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-racing-blue text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-racing-blue/20"
          >
            Refresh System
          </button>
        </div>
      </body>
    </html>
  )
}
