"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { BIKES } from "@/lib/constants/bikes";
import { BikeDetailsHero } from "@/components/features/BikeDetailsHero";
import { BikeSpecifications } from "@/components/features/BikeSpecifications";
import { ZeroDownpaymentBanner } from "@/components/features/ZeroDownpaymentBanner";
import { LeadForm } from "@/components/features/LeadForm";
import { FeaturedBikes } from "@/components/features/FeaturedBikes";
import { Viewer360 } from "@/components/features/Viewer360";
import React from "react";

export default function BikePage() {
    const [activeIntent, setActiveIntent] = React.useState<string | undefined>();
    const params = useParams();
    const slug = (params?.slug as string)?.toLowerCase();

    const bike = BIKES.find(b => b.slug === slug);

    if (!bike) {
        return notFound();
    }

    return (
        <main className="bg-zinc-950 min-h-screen overflow-x-hidden">
            <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-racing-blue to-dark-racing z-[100]" />

            <BikeDetailsHero
                bike={bike}
                onAction={(intent) => {
                    setActiveIntent(intent);
                    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            <div id="specifications">
                <BikeSpecifications bike={bike} />
            </div>

            {/* Added 360 Viewer Section */}
            {bike.threeSixtyUrl && bike.threeSixtyImageCount && bike.threeSixtyImageCount > 35 && (
                <section className="py-24 bg-zinc-900 border-y border-white/5">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                                Interactive Experience
                            </h2>
                            <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
                                EXPLORE IN <span className="text-gradient">360 DEGREES</span>
                            </h3>
                        </div>
                        <Viewer360 bike={bike} />
                    </div>
                </section>
            )}

            <div id="promotion">
                <ZeroDownpaymentBanner
                    bikeName={bike.name}
                    onApply={() => {
                        setActiveIntent("EMI");
                        document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                />
            </div>

            <section className="py-24 bg-zinc-950">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                                    Take the First Step
                                </h2>
                                <h3 className="text-5xl md:text-6xl font-display font-black text-white mb-8 uppercase tracking-tighter leading-none">
                                    READY TO RIDE THE <br />
                                    <span className="text-racing-blue">{bike.name}?</span>
                                </h3>
                                <p className="text-lg text-gray-400 mb-12 max-w-xl font-medium leading-relaxed">
                                    Experience the thrill of Yamaha's engineering. Book a test ride at Choudhary Automobile and feel the difference for yourself.
                                </p>
                            </div>

                            <div className="bg-zinc-900/50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-zinc-800 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-racing-blue/10 blur-3xl -mr-16 -mt-16 group-hover:bg-racing-blue/20 transition-colors" />
                                <h4 className="text-white font-black uppercase tracking-widest mb-6 text-xs md:text-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-racing-blue" />
                                    Exclusive Showroom Advantage
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {[
                                        { text: "Spot exchange valuation", highlight: "Best Price" },
                                        { text: "Low interest EMI schemes", highlight: "Easy Finance" },
                                        { text: "Genuine Yamaha Spares", highlight: "100% Original" },
                                        { text: "8-Year Extended Warranty", highlight: "Peace of Mind" },
                                        { text: "Priority Service Slot", highlight: "Save Time" },
                                        { text: "Free First Service", highlight: "Zero Cost" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-300 font-bold uppercase tracking-tight">
                                                <div className="w-1.5 h-1.5 bg-racing-blue rounded-full shrink-0" />
                                                {item.text}
                                            </div>
                                            <span className="text-[8px] text-racing-blue/60 font-black uppercase tracking-[0.2em] ml-3.5">
                                                {item.highlight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                            id="inquiry"
                        >
                            <div className="absolute -inset-10 bg-racing-blue/10 blur-[120px] opacity-20" />
                            <LeadForm
                                key={activeIntent} // Re-mount to trigger auto-selection
                                bikeModel={bike.name}
                                defaultInterest={activeIntent}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="py-24 border-t border-zinc-900 bg-zinc-950">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-12">
                        EXPLORE OTHER <span className="text-racing-blue">MACHINES</span>
                    </h3>
                </div>
                <FeaturedBikes />
            </div>
        </main>
    );
}
