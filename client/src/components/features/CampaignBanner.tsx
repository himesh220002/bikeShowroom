"use client";

import { motion } from "framer-motion";
import { MessageSquare, Timer, ArrowRight, Zap, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";

type CampaignAd = {
    _id: string;
    name: string;
    description?: string;
    image: string;
    link: string;
    type: string;
    status: string;
    endDate?: string;
};

export function CampaignBanner() {
    const [campaign, setCampaign] = useState<CampaignAd | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await fetch(`${API_URL}/ads`);
                const data = await res.json();
                if (data.success) {
                    // Find the first active Banner ad
                    const activeBanner = data.data.find((ad: CampaignAd) =>
                        ad.type === "Banner" && ad.status === "Active"
                    );
                    setCampaign(activeBanner || null);
                }
            } catch (err) {
                console.error("Failed to fetch campaign banner:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, []);

    useEffect(() => {
        if (!campaign?.endDate) return;

        const timer = setInterval(() => {
            const end = new Date(campaign.endDate!).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign]);

    if (loading || !campaign) return null;

    const waLink = `https://wa.me/917004100062?text=I am interested in the ${campaign.name} offer!`;

    return (
        <section id="promotions" className="hidden md:block py-24 bg-zinc-950 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-racing-blue rounded-[3rem] p-8 md:p-16 overflow-hidden group shadow-2xl shadow-racing-blue/20 transition-all duration-700 hover:shadow-racing-blue/30"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/20 blur-[100px] rounded-full pointer-events-none" />
                    <Sparkles className="absolute top-12 right-12 w-12 h-12 text-white/10 group-hover:rotate-12 transition-transform duration-700" />

                    {/* Visual context via image if available (using it as a subtle overlay or separate section if desired, but for this banner style we'll keep it clean) */}

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6 animate-pulse">
                                    <Zap className="w-3.5 h-3.5" />
                                    Seasonal Special
                                </div>
                                <h3 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
                                    {campaign.name.split(' ').slice(0, -1).join(' ')} <br />
                                    <span className="text-black">{campaign.name.split(' ').pop()}</span>
                                </h3>
                                <p className="text-white/80 text-lg font-medium max-w-md leading-relaxed">
                                    {campaign.description || "Secure exclusive benefits on your favorite models. A limited-time offer for our Yamaha community."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-racing-blue px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Claim via WhatsApp
                                </a>
                                <a
                                    href={campaign.link}
                                    className="px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] text-white border border-white/30 hover:bg-white/10 transition-all flex items-center gap-3 group/btn"
                                >
                                    View Details
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col items-center lg:items-end justify-center">
                            <div className="bg-black/20 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 text-center space-y-8">
                                <div className="flex items-center justify-center gap-3 text-white/60 mb-2">
                                    <Timer className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Offer Ends In</span>
                                </div>
                                <div className="flex gap-4 md:gap-8">
                                    {[
                                        { value: timeLeft.days, label: "Days" },
                                        { value: timeLeft.hours, label: "Hours" },
                                        { value: timeLeft.minutes, label: "Mins" },
                                        { value: timeLeft.seconds, label: "Secs" }
                                    ].map((unit) => (
                                        <div key={unit.label} className="flex flex-col items-center">
                                            <div className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter mb-1">
                                                {String(unit.value).padStart(2, '0')}
                                            </div>
                                            <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                                                {unit.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                                        Limited Stock • T&C Apply
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
