import { ServiceBooking } from "@/components/features/ServiceBooking";
import { SparesGallery } from "@/components/features/SparesGallery";
import { UserBookings } from "@/components/features/UserBookings";
import { Wrench, Shield, Zap, MessageSquare } from "lucide-react";

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-26 pb-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-racing-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-racing-blue/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Header & Booking Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-24">

                    {/* Left Column: Hero Text & Trust Badges */}
                    <div className="lg:col-span-5 space-y-4 sticky top-2">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-racing-blue rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue">Premium Support Hub</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl xl:text-6xl font-display font-black text-white uppercase tracking-tighter leading-[1.1]">
                            YAMAHA <span className="text-gradient block">SERVICE</span>
                        </h1>
                        <p className="text-zinc-400 font-medium leading-relaxed max-w-md text-sm">
                            World-class authorized Yamaha repair at Choudhary Yamaha, Katihar. Certified technicians, genuine parts, and precision care.
                        </p>

                        {/* Sleek Trust Badges */}
                        <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                            {[
                                { icon: Wrench, label: "Certified Technicians", desc: "Factory-trained experts" },
                                // { icon: Shield, label: "Official Warranty", desc: "100% genuine parts" },
                                { icon: Zap, label: "Quick Turnaround", desc: "Express service bay" }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-racing-blue/10 group-hover:border-racing-blue/30 transition-colors shadow-lg">
                                        <stat.icon className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-black text-white uppercase tracking-widest block">{stat.label}</span>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Service Booking Form */}
                    <div id="booking" className="lg:col-span-7 w-full">
                        <ServiceBooking />
                    </div>
                </div>

                {/* Track Your Service */}
                <div className=" border-t border-white/5">
                    <UserBookings />
                </div>

                {/* Genuine Spares Shopping */}
                <div id="spares" className="pt-16 border-t border-white/5">
                    <SparesGallery />
                </div>
            </div>
        </div>
    );
}
