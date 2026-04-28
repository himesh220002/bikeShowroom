import dynamic from "next/dynamic";
import { Hero } from "@/components/features/Hero";
import { FeaturedBikes } from "@/components/features/FeaturedBikes";
import { QuickAccessTiles } from "@/components/features/QuickAccessTiles";

// Lazy load below-the-fold components
const ShowroomExperience = dynamic(() => import("@/components/features/ShowroomExperience").then(mod => mod.ShowroomExperience), {
  loading: () => <div className="h-96 w-full animate-pulse bg-zinc-900/20" />
});
const Viewer360Carousel = dynamic(() => import("@/components/features/Viewer360Carousel").then(mod => mod.Viewer360Carousel), {
  loading: () => <div className="h-96 w-full animate-pulse bg-zinc-900/20" />
});
const RideVideo = dynamic(() => import("@/components/features/RideVideo").then(mod => mod.RideVideo));
const LeadForm = dynamic(() => import("@/components/features/LeadForm").then(mod => mod.LeadForm));
const AdCarousel = dynamic(() => import("@/components/features/AdCarousel").then(mod => mod.AdCarousel));
const CampaignBanner = dynamic(() => import("@/components/features/CampaignBanner").then(mod => mod.CampaignBanner));
const ServiceInsuranceSection = dynamic(() => import("@/components/features/ServiceInsuranceSection").then(mod => mod.ServiceInsuranceSection));
const FAQ = dynamic(() => import("@/components/features/FAQ").then(mod => mod.FAQ));
const Testimonials = dynamic(() => import("@/components/features/Testimonials").then(mod => mod.Testimonials));

import { MapPin, Phone, User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-zinc-950/40 overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 3. Featured Bikes & Scooters */}
      <FeaturedBikes />

      {/* 2. Quick Access Tiles */}
      <QuickAccessTiles />

      {/* 5. Showroom Experience */}
      <ShowroomExperience />

      {/* 360 Experience Integration (Part of Showroom/Featured) */}
      <section id="explore" className="py-20 bg-zinc-900/20 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-racing-blue mb-4">
              Virtual Showroom
            </h2>
            <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
              IMMERSIVE <span className="text-gradient">360° VIEW</span>
            </h3>
          </div>
          <Viewer360Carousel />
        </div>
      </section>

      <RideVideo />

      {/* 8. Lead Capture Section */}
      <section id="inquiry" className="py-32 bg-zinc-950/40 backdrop-blur-sm">
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

      <AdCarousel />

      {/* 7. Campaigns & Offers */}
      <CampaignBanner />

      {/* 6. Service & Insurance */}
      <ServiceInsuranceSection />

      <FAQ />

      {/* 4. Customer Trust Signals & Testimonials */}
      <Testimonials />

      {/* SEO/Local Keywords Footer */}
      <section className="py-16 bg-zinc-950/80 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
            <div className="space-y-2">
              <p className="text-racing-blue/60 mb-2">Showroom & Dealers</p>
              <p>Yamaha Showroom Katihar • Choudhary Yamaha Katihar • Yamaha Bike Dealers Katihar • Authorized Yamaha Dealer Katihar • Yamaha Motorcycle Sales Katihar • Best Bike Showroom Katihar</p>
            </div>
            <div className="space-y-2">
              <p className="text-racing-blue/60 mb-2">Popular Models</p>
              <p>Yamaha R15 V4 Price Katihar • Yamaha MT 15 V2 On-Road Price Katihar • Yamaha FZ Series Katihar Showroom • Yamaha Aerox 155 Katihar • Yamaha XSR 155 Katihar • Yamaha Scooters Katihar</p>
            </div>
            <div className="space-y-2">
              <p className="text-racing-blue/60 mb-2">Service & Support</p>
              <p>Yamaha Bike Service Katihar • Yamaha Bike Repair Katihar • Yamaha Genuine Parts Katihar • Yamaha Bike EMI Katihar • Yamaha Test Ride Katihar • Yamaha Authorized Service</p>
            </div>
            <div className="space-y-2">
              <p className="text-racing-blue/60 mb-2">Location & Reach</p>
              <p>Bike Showroom Near Mirchaibari Katihar • Yamaha Dealer Near DS College Katihar • Yamaha Showroom Near Sonali Katihar • Purnea • Kishanganj • Araria • Seemanchal Region</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
            <p className="text-[9px] text-gray-600 font-medium uppercase tracking-[0.3em]">
              Choudhary Yamaha Bikes Katihar • Yamaha Bike Offers Katihar • Yamaha Finance Katihar Showroom
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
