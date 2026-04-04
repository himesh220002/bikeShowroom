"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, ChevronRight, ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Footer() {
    return (
        <footer className="bg-card/80 backdrop-blur-md pt-24 pb-12 border-t border-border">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 lg:gap-12">
                    {/* Brand Meta */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110">
                                <Image
                                    src="/images/YamahaLogo.png"
                                    alt="Yamaha Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-display font-black tracking-tighter text-foreground leading-none">
                                    CHOUDHARY YAMAHA
                                </span>
                                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-racing-blue -mt-0.5">
                                    THE CALL OF THE BLUE
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground text-center leading-relaxed font-medium">
                            Choudhary Yamaha - Your definitive Yamaha destination in Katihar. Engineering thrill,
                            delivering excellence, and building a community of riders
                            since 2012.
                        </p>
                        <div className="flex gap-4 justify-center">
                            {[
                                { Icon: Facebook, url: "https://www.facebook.com/ChoudharyYamaha/" },
                                { Icon: Instagram, url: "https://www.instagram.com/choudharyyamaha/" },
                                { Icon: Youtube, url: "#" }
                            ].map(({ Icon, url }, i) => (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-racing-blue hover:scale-110 transition-all border border-transparent hover:border-racing-blue/20"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Discovery */}
                    <div className="lg:ml-12">
                        <h4 className="text-[10px] font-black text-center xl:text-left uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">
                            Showroom Discovery
                        </h4>
                        <ul className="space-y-4">
                            {["R-Series", "MT-Series", "FZ-Series", "Aerox 155", "Scooters"].map((item) => (
                                <li key={item}>
                                    <Link href="/#bikes" className="text-sm font-black text-foreground hover:text-racing-blue transition-colors uppercase tracking-tight flex items-center justify-center xl:justify-start gap-2 group">
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Operations */}
                    <div>
                        <h4 className="text-[10px] font-black text-center xl:text-left uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">
                            Services & Support
                        </h4>
                        <ul className="space-y-4">
                            {["Book A Service", "Finance / EMI", "Insurance Sync", "Genuine Spares", "Exchange Valuation"].map((item) => (
                                <li key={item}>
                                    <Link href="/#inquiry" className="text-sm font-black text-foreground hover:text-racing-blue transition-colors uppercase tracking-tight flex items-center justify-center xl:justify-start gap-2 group">
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Local Headquarters */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase text-center xl:text-left tracking-[0.3em] text-muted-foreground/60 mb-8">
                            Our Headquarters
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-racing-blue/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div className="text-sm font-bold text-muted-foreground leading-snug">
                                    Manihari Mor, Mirchaibari Katihar <br />
                                    Katihar, Bihar - 854105
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-racing-blue/5 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div className="text-sm font-black text-foreground">
                                    +91 7004100062
                                </div>
                            </div>
                            <div className="flex gap-4 text-center xl:text-left">
                                <div className="w-10 h-10 rounded-xl bg-racing-blue/5 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div className="text-sm font-black text-foreground flex items-center">
                                    choudharyyamaha.ktr@gmail.com
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-racing-blue/10 flex items-center justify-center shrink-0 ring-4 ring-racing-blue/5">
                                    <ShieldCheck className="w-5 h-5 text-racing-blue" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-racing-blue">
                                    Yamaha Authorized <br />Digital Partner
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        © {new Date().getFullYear()} Choudhary Yamaha. Excellence Synchronized.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/requirements" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue transition-colors">Digital Roadmap</Link>
                        <span className="w-1.5 h-1.5 rounded-full bg-racing-blue opacity-30" />
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-racing-blue" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Certified Dealer</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
