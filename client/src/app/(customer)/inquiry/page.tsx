import dynamic from "next/dynamic";
import { Phone, User } from "lucide-react";

const LeadForm = dynamic(() => import("@/components/features/LeadForm").then(mod => mod.LeadForm), {
  loading: () => <div className="h-96 w-full animate-pulse bg-zinc-900/20" />
});

export default function InquiryPage() {
  return (
    <div className="flex flex-col bg-zinc-950/40 overflow-x-hidden">
      <section className="py-32 bg-zinc-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-24 items-center">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
                Connect With Us
              </h2>
              <h3 className="text-3xl md:text-4xl xl:text-6xl font-display font-black text-white mb-8 uppercase tracking-tighter">
                SECURE YOUR <br />
                <span className="text-racing-blue">DREAM RIDE.</span>
              </h3>
              <p className="text-lg text-gray-400 mb-12 max-w-lg font-medium leading-relaxed">
                Join the elite community of Yamaha riders at Choudhary Yamaha. Our experts are standing by to process your inquiry with priority.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: Phone, title: "Direct Contact", detail: "+91 7004100062" },
                  { icon: User, title: "Personalized Consultation", detail: "Expert guidance on model selection" }
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

            <div className="relative">
              <div className="absolute -inset-4 bg-racing-blue/20 blur-[100px] opacity-20" />
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
