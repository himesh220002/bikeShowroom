import { ServiceBooking } from "@/components/features/ServiceBooking";
import { Wrench, Shield, Zap } from "lucide-react";

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-20 md:pt-28 pb-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-8 h-1 bg-racing-blue rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue">Expert Care</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter mb-6">
                                PREMIUM <br /><span className="text-gradient">SERVICE</span>
                            </h1>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                Our Katihar service center is equipped with state-of-the-art diagnostic tools and Yamaha-certified technicians to ensure your ride never compromises on performance.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                {
                                    icon: Wrench,
                                    title: "Genuine Spares",
                                    desc: "We only use Yamaha Authorized parts for maximum longevity and factory-spec performance."
                                },
                                {
                                    icon: Shield,
                                    title: "Warranty Protection",
                                    desc: "Official service stamps ensure your manufacturer warranty remains valid and your resale value stays high."
                                },
                                {
                                    icon: Zap,
                                    title: "Quick Turnaround",
                                    desc: "Expedited service for minor repairs and periodic maintenance to get you back on the road."
                                }
                            ].map((item) => (
                                <div key={item.title} className="flex gap-4">
                                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="lg:col-span-2">
                        <ServiceBooking />
                    </div>
                </div>
            </div>
        </div>
    );
}
