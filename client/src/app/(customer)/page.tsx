import { Hero } from "@/components/features/Hero";
import { FeaturedBikes } from "@/components/features/FeaturedBikes";
import { LeadForm } from "@/components/features/LeadForm";
import { Viewer360Carousel } from "@/components/features/Viewer360Carousel";
import { AdCarousel } from "@/components/features/AdCarousel";
import { RideVideo } from "@/components/features/RideVideo";
import { BIKES } from "@/lib/constants/bikes";
import { cn } from "@/lib/utils/cn";
import { MapPin, Clock, Phone, Info, User, ShieldCheck, Award, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-zinc-950/40 overflow-x-hidden">
      <Hero />

      {/* <AdCarousel /> */}

      <FeaturedBikes />

      <AdCarousel />
      <RideVideo />

      {/* Trust Signals Section */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "Authorized & Trusted",
                desc: "100% Genuine Yamaha spares and certified showroom expertise since 2004.",
                color: "text-blue-500"
              },
              {
                icon: Zap,
                title: "Expert Service",
                desc: "Yamaha-trained technicians ensuring peak performance for every ride.",
                color: "text-racing-blue"
              },
              {
                icon: Award,
                title: "Customer First",
                desc: "Seamless documentation and priority support for our elite rider community.",
                color: "text-amber-500"
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-zinc-900/50 rounded-[3rem] border border-white/5 hover:border-racing-blue/20 transition-all group">
                <div className={cn("w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-racing-blue/50 transition-all", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">{item.title}</h4>
                <p className="text-gray-500 text-xs font-bold leading-relaxed tracking-wider uppercase opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 360 Experience Section */}
      <section id="explore" className="py-24 bg-zinc-900/60 backdrop-blur-sm overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
              Virtual Showroom
            </h2>
            <h3 className="text-3xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
              IMMERSIVE <span className="text-gradient">360° VIEW</span>
            </h3>
          </div>
          <Viewer360Carousel />
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="inquiry" className="py-32 bg-zinc-950/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                  Connect With Us
                </h2>
                <h3 className="text-3xl md:text-6xl font-display font-black text-white mb-8 uppercase tracking-tighter">
                  BOOK A TEST RIDE <br />
                  <span className="text-racing-blue">AT CHOUDHARY Yamaha</span>
                </h3>
                <p className="text-lg text-gray-400 mb-12 max-w-lg font-medium leading-relaxed">
                  Don't just take our word for it—feel the power of Yamaha engineering for yourself. Fill out the form, and our team at Choudhary Yamaha will arrange everything for you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-8 mt-12">
                  {[
                    { icon: MapPin, title: "Our Location", detail: "Manihari Mor, Mirchaibari, Katihar" },
                    { icon: Clock, title: "Opening Hours", detail: "Mon - Sat: 9:00 AM - 8:00 PM" },
                    { icon: Phone, title: "Direct Contact", detail: "+91 7004100062" },
                    { icon: User, title: "Personalized Consultation", detail: "Expert guidance on model selection" },
                    { icon: Phone, title: "Priority Callback", detail: "Response within 2-4 business hours" }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-6 items-center group">
                      <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl shrink-0 group-hover:border-racing-blue/50 transition-colors">
                        <item.icon className="w-6 h-6 text-racing-blue" />
                      </div>
                      <div>
                        <h4 className="font-black text-[10px] text-white uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400 font-medium">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-racing-blue/10 text-racing-blue text-[10px] font-black uppercase tracking-widest w-fit">
                    <Info className="w-3.5 h-3.5" />
                    Instant Response
                  </div>
                  <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none">
                    SECURE YOUR <br />
                    <span className="text-gradient">DREAM RIDE.</span>
                  </h2>
                  <p className="text-lg text-gray-400 font-medium max-w-md leading-relaxed">
                    Join the elite community of Yamaha riders at Choudhary Yamaha.
                    Our experts are standing by to process your inquiry with priority.
                  </p>
                </div>

                <div className="space-y-6 pt-4">
                  {[
                    { icon: User, title: "Personalized Consultation", desc: "Expert guidance on model selection" },
                    { icon: Phone, title: "Priority Callback", desc: "Response within 2-4 business hours" }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-racing-blue" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-white uppercase tracking-tight text-sm">{item.title}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-racing-blue/20 blur-[100px] opacity-20" />
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* SEO/Local Keywords Footer */}
      <section className="py-12 bg-zinc-950/80 border-t border-zinc-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] text-center leading-relaxed max-w-4xl mx-auto">
            Leading Yamaha Dealer - Choudhary Yamaha • Best Price for R15M • Yamaha MT-15 V2 Katihar Showroom • Authorized Yamaha Service Center • Yamaha Genuine Spares • Purnea • Kishanganj • Araria • Seemanchal Region
          </p>
        </div>
      </section>
    </div>
  );
}
