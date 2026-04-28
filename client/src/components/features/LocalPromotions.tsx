"use client";

import { motion } from "framer-motion";
import { Tag, Calendar, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const promotions = [
    {
        id: 1,
        title: "Katihar Exchange Fest",
        subtitle: "Upgrade to R15M",
        description: "Get up to ₹15,000 additional exchange bonus on your old bike. Exclusive at Choudhary Yamaha.",
        tag: "EXCHANGE BONUS",
        date: "Ends 31st March",
        color: "bg-blue-600",
        image: "https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Zero Downpayment",
        subtitle: "MT-15 V2 Special",
        description: "Low interest rates starting from 6.99%. Ride home your dream bike today with minimal documentation.",
        tag: "FINANCE OFFER",
        date: "Limited Period",
        color: "bg-racing-blue",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
    }
];

export function LocalPromotions() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-1 bg-racing-blue rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue">Exclusive Offers</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tighter">
                            KATIHAR <br /><span className="text-gradient">DEALS HUB</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-muted-foreground font-medium text-sm leading-relaxed">
                        Choudhary Yamaha brings you the best Yamaha deals in Bihar. From exchange bonuses to easy finance, we make your dream ride accessible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {promotions.map((promo, idx) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-border shadow-2xl"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${promo.image})` }}
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white",
                                        promo.color
                                    )}>
                                        {promo.tag}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-300">
                                        <Calendar className="w-3 h-3 text-racing-blue" />
                                        {promo.date}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">
                                    {promo.title}
                                </h3>
                                <p className="text-gray-400 text-sm max-w-sm mb-6 font-medium">
                                    {promo.description}
                                </p>
                                <a href="#inquiry" className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group/btn">
                                    Claim This Offer
                                    <ArrowRight className="w-4 h-4 text-racing-blue transition-transform group-hover/btn:translate-x-1" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
