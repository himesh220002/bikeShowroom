import { ServiceBooking } from "@/components/features/ServiceBooking";
import { SparesGallery } from "@/components/features/SparesGallery";
import { Wrench, Shield, Zap, MessageSquare } from "lucide-react";

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-20 md:pt-32 pb-24 relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-racing-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-racing-blue/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Header */}
                <div className="mb-10 md:mb-20">

                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-1 bg-racing-blue rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue">Premium Support Hub</span>
                    </div>
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-6xl xl:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none">
                            EXPERT <span className="text-gradient">SERVICE & SPARES</span>
                        </h1>
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <p className="text-gray-400 font-medium leading-relaxed max-w-2xl">
                                Experience world-class maintenance at our Yamaha-certified facility. From high-speed tuning to genuine part replacements, we ensure your ride stays at its peak performance.
                            </p>
                            <div className="flex flex-wrap gap-4 shrink-0">
                                <div className="px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block">WhatsApp Support</span>
                                        <span className="text-xs font-black text-white uppercase tracking-widest">+91 70041 00062</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Side: Booking & Stats */}
                    <div id="booking" className="lg:col-span-12 xl:col-span-5 space-y-12">
                        <ServiceBooking />

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                            {[
                                { icon: Wrench, label: "Certified", value: "Technicians" },
                                { icon: Shield, label: "Official", value: "Warranty" },
                                { icon: Zap, label: "Quick", value: "Turnaround" }
                            ].map((stat, i) => (
                                <div key={i} className="p-3 md:p-6 bg-zinc-900/30 border border-zinc-800 rounded-[2rem] text-center hover:border-racing-blue/20 transition-all group">
                                    <stat.icon className="w-6 h-6 text-racing-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-1">{stat.label}</span>
                                    <span className="text-sm font-black text-white uppercase tracking-tighter italic">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Spare Parts Discovery */}
                    <div id="spares" className="lg:col-span-12 xl:col-span-7 space-y-12">
                        <div className="p-1 px-4 bg-racing-blue/10 border border-racing-blue/20 rounded-full w-fit mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue">Genuine Accessories & Parts</span>
                        </div>
                        <SparesGallery />
                    </div>
                </div>

                {/* Bottom Trust Section */}
                <div className="mt-24 pt-16 border-t border-zinc-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            {
                                title: "Genuine Spares",
                                desc: "Every part we install is a Yamaha Authorized component, maintaining your bike's integrity."
                            },
                            {
                                title: "Warranty Protection",
                                desc: "Official service logs ensure your manufacturer's warranty remains intact and valid."
                            },
                            {
                                title: "Digital History",
                                desc: "Access your complete service and parts replacement records through your digital 'My Garage'."
                            },
                            {
                                title: "Advanced Tuning",
                                desc: "Proprietary Yamaha diagnostic tools (YDT) used for precise engine mapping and health checks."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-4">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <span className="text-racing-blue font-display italic">0{idx + 1}</span>
                                    {item.title}
                                </h4>
                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
