"use client";

import { GarageDashboard } from "@/components/features/GarageDashboard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function GaragePage() {
    return (
        <main className="min-h-screen bg-zinc-950">
            <Navbar />
            <div className="mt-10">
                <GarageDashboard />
            </div>
            <Footer />
        </main>
    );
}
