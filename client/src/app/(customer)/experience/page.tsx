import { Viewer360 } from "@/components/features/Viewer360";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Zap, Award, Target } from "lucide-react";

export default function ExperiencePage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-[0.2em] w-fit">
                            <Shield className="w-4 h-4" />
                            Official Yamaha Digital Experience
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-black dark:text-white uppercase tracking-tighter leading-[0.85]">
                            THE <span className="text-racing-blue">FUTURE</span> <br />
                            OF EXPLORATION.
                        </h1>
                        <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
                            Don't just look—explore. Our interactive 3D environment
                            allows you to inspect the engineering excellence of Yamaha
                            motorcycles from every conceivable angle.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 shrink-0">
                        <div className="text-center">
                            <p className="text-4xl font-display font-black dark:text-white">360°</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Full Rotation</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-display font-black dark:text-white">4K</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Texture Precision</p>
                        </div>
                    </div>
                </div>

                {/* Main 3D Viewer */}
                <Viewer360 />

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
                    {[
                        {
                            icon: Zap,
                            title: "Instant Interaction",
                            desc: "Zero-latency rotation optimized for mobile and desktop screens."
                        },
                        {
                            icon: Target,
                            title: "Part Hotspots",
                            desc: "Clickable markers revealing deep technical specifications."
                        },
                        {
                            icon: Award,
                            title: "Factory Finish",
                            desc: "Accurate material rendering reflecting colors available at Katihar."
                        },
                        {
                            icon: Shield,
                            title: "Secure Decision",
                            desc: "Build buyer confidence before stepping into the physical showroom."
                        }
                    ].map((feature) => (
                        <div key={feature.title} className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 hover:border-racing-blue/20 transition-all group">
                            <feature.icon className="w-8 h-8 text-racing-blue mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-sm font-black dark:text-white uppercase tracking-wider mb-2">{feature.title}</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>


        </main>
    );
}
