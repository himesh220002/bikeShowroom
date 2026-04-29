"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, ChevronRight, ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useConfig } from "@/components/providers/ConfigProvider";


export function Footer() {
    const { config } = useConfig();
    return (
        <footer className="bg-card/80 backdrop-blur-md pt-24 pb-12 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
                    {/* Brand Meta */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center justify-center gap-4 group">
                            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:scale-110">
                                <Image
                                    src="/images/YamahaLogo.png"
                                    alt="Yamaha Logo"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-0 md:gap-0">
                                <span className="text-[1rem] font-display font-black tracking-tighter text-gradient-text leading-none">
                                    CHOUDHARY
                                </span>
                                <span className="text-[0.8rem] uppercase font-black tracking-[0.2em] text-red-500  -mt-0.5">
                                    YAMAHA
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground text-center leading-relaxed font-medium">
                            Choudhary Yamaha - Your authorized Yamaha showroom in Katihar. Engineering thrill,
                            delivering excellence, and building a community of riders near Mirchaibari since 2022.
                        </p>
                        <div className="flex gap-4 justify-center">
                            {[
                                { Icon: Facebook, url: "https://www.facebook.com/ChoudharyYamaha/" },
                                { Icon: Instagram, url: "https://www.instagram.com/choudharyyamaha/" },
                                { Icon: Youtube, url: "https://www.youtube.com/@ChoudharyYamaha" }
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

                    <div className="flex flex-wrap gap-10 justify-center">

                        {/* Discovery */}
                        <div className="lg:ml-12">
                            <h4 className="text-[10px] font-black text-center xl:text-left uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">
                                Showroom Discovery
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    { name: "R-Series", href: "/products#sport" },
                                    { name: "MT-Series", href: "/products#sport" },
                                    { name: "FZ-Series", href: "/products#street" },
                                    { name: "Aerox 155", href: "/products#scooters" },
                                    { name: "Scooters", href: "/products#scooters" },
                                    { name: "About Us", href: "/#experience" },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm font-black text-foreground hover:text-racing-blue transition-colors uppercase tracking-tight flex items-center justify-center xl:justify-start gap-2 group">
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {item.name}
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
                                {[
                                    { name: "Book A Service", href: "/service#booking" },
                                    { name: "Finance / EMI", href: "/#inquiry" },
                                    { name: "Insurance Sync", href: "/#inquiry" },
                                    { name: "Genuine Spares", href: "/service#spares" },
                                    { name: "WhatsApp Connect", href: "https://wa.me/917004100062" },
                                    { name: "Yamaha India Official", href: "https://www.yamaha-motor-india.com/" },
                                    { name: "Careers", href: "/careers" }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm font-black text-foreground hover:text-racing-blue transition-colors uppercase tracking-tight flex items-center justify-center xl:justify-start gap-2 group">
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal & Policies */}
                        <div>
                            <h4 className="text-[10px] font-black text-center xl:text-left uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">
                                Legal &amp; Policies
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    { name: "Terms & Conditions", href: "/legal?s=terms" },
                                    { name: "Privacy Policy", href: "/legal?s=privacy" },
                                    { name: "Return & Refund", href: "/legal?s=returns" },
                                    { name: "Warranty & Service", href: "/legal?s=warranty" },
                                    { name: "Finance & EMI Terms", href: "/legal?s=finance" },
                                    { name: "Disclaimer", href: "/legal?s=disclaimer" },
                                    { name: "Community Guidelines", href: "/legal?s=community" },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm font-black text-foreground hover:text-racing-blue transition-colors uppercase tracking-tight flex items-center justify-center xl:justify-start gap-2 group">
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase text-center xl:text-left tracking-[0.3em] text-muted-foreground/60 mb-8">
                                Our Headquarters
                            </h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-racing-blue/5 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div className="text-sm font-bold max-w-[350px] text-muted-foreground leading-snug">
                                        {config.showroomAddress}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-racing-blue/5 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div className="text-sm font-black text-foreground">
                                        {config.showroomPhone}
                                    </div>
                                </div>
                                <div className="flex gap-4 text-center xl:text-left">
                                    <div className="w-10 h-10 rounded-xl bg-racing-blue/5 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-racing-blue" />
                                    </div>
                                    <div className="text-sm font-black text-foreground flex items-center">
                                        {config.showroomEmail}
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

                </div>

                <div className="mt-24 pt-12 border-t border-border space-y-6">
                    {/* Policy Quick Links */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        {[
                            { name: "Terms & Conditions", href: "/legal?s=terms" },
                            { name: "Privacy Policy", href: "/legal?s=privacy" },
                            { name: "Warranty Policy", href: "/legal?s=warranty" },
                            { name: "Finance Terms", href: "/legal?s=finance" },
                            { name: "Disclaimer", href: "/legal?s=disclaimer" },
                            { name: "Yamaha India", href: "https://www.yamaha-motor-india.com/" },
                            { name: "All Policies", href: "/legal" },
                        ].map(item => (
                            <Link key={item.name} href={item.href} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue transition-colors">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            © 2022 Choudhary Yamaha. Excellence Synchronized. <span>|</span> <Link href="https://myweb-nine-tawny.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-racing-blue hover:text-racing-blue transition-colors">Digitally Empowered by CypherTech</Link>
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
            </div>
        </footer>
    );
}
