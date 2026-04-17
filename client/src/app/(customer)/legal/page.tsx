"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, FileText, RefreshCw, Wrench,
    CreditCard, AlertTriangle, Users, ChevronDown,
    Download, Scale, ArrowLeft, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const policies = [
    {
        id: "terms",
        icon: FileText,
        color: "text-racing-blue",
        bg: "bg-racing-blue/10",
        accent: "border-racing-blue/30",
        title: "Terms & Conditions",
        subtitle: "Rules governing use of our platform and services",
        effective: "Effective from January 1, 2024",
        sections: [
            {
                heading: "1. Acceptance of Terms",
                content: [
                    "By accessing or using the Choudhary Yamaha website and services, you agree to be bound by these Terms & Conditions.",
                    "These terms apply to all visitors, customers, and others who access or use our platform.",
                    "If you disagree with any part of these terms, please discontinue use of our services immediately.",
                ]
            },
            {
                heading: "2. Purchase Policies",
                content: [
                    "All vehicle purchases are subject to availability and confirmation by our sales team.",
                    "Booking amounts are non-refundable once the delivery process has been initiated.",
                    "Final pricing may vary based on applicable government taxes, registration charges, and insurance premiums at the time of delivery.",
                    "Choudhary Yamaha reserves the right to modify prices without prior notice due to manufacturer price revisions.",
                ]
            },
            {
                heading: "3. Service Booking",
                content: [
                    "Service appointments are subject to workshop capacity and slot availability.",
                    "Customers must present their vehicle registration document and service booklet at the time of service.",
                    "Estimated service completion times are indicative and may vary based on the nature of the repair.",
                    "Uncollected vehicles after 7 days of service completion may incur storage charges.",
                ]
            },
            {
                heading: "4. Showroom Interactions",
                content: [
                    "Test rides are offered at the showroom's discretion and require a valid driving license.",
                    "Choudhary Yamaha staff reserve the right to refuse service in cases of abusive or inappropriate conduct.",
                    "Photography and video recording within the showroom premises require explicit permission from management.",
                ]
            },
            {
                heading: "5. Disclaimers",
                content: [
                    "Vehicle specifications, colours, and features are subject to change by Yamaha Motor India without prior notice.",
                    "Images displayed on this website are for representational purposes only; actual products may vary.",
                    "Choudhary Yamaha is an authorized dealer and operates independently from Yamaha Motor India Ltd.",
                    "We are not responsible for delays caused by RTO processing, insurance companies, or financial institutions.",
                ]
            },
        ]
    },
    {
        id: "privacy",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        accent: "border-emerald-500/30",
        title: "Privacy Policy",
        subtitle: "How we collect, store, and protect your data",
        effective: "Effective from January 1, 2024",
        sections: [
            {
                heading: "1. Information We Collect",
                content: [
                    "Personal details: Name, phone number, email address, and postal address provided during inquiries or bookings.",
                    "Vehicle information: Registration numbers, chassis/engine numbers, and service history.",
                    "Financial data: Income details, documents submitted for finance/EMI applications (handled securely).",
                    "Usage data: Browser type, pages visited, and time spent on our website (collected via analytics tools).",
                ]
            },
            {
                heading: "2. How We Use Your Data",
                content: [
                    "To process vehicle bookings, service appointments, and finance applications.",
                    "To send service reminders, warranty updates, and promotional communications (with your consent).",
                    "To improve our website experience and tailor content to customer preferences.",
                    "To comply with legal and regulatory obligations under applicable Indian data protection laws.",
                ]
            },
            {
                heading: "3. Data Storage & Security",
                content: [
                    "All customer data is stored on secure, encrypted servers with restricted access.",
                    "We employ industry-standard security protocols (SSL/TLS) for data transmission.",
                    "Finance documents are shared only with partner banks and NBFC institutions after your explicit consent.",
                    "We do not sell, rent, or trade your personal information to any third parties.",
                ]
            },
            {
                heading: "4. Your Rights",
                content: [
                    "You may request access to, correction of, or deletion of your personal data at any time.",
                    "To exercise these rights, contact us at choudharyyamaha.ktr@gmail.com.",
                    "We will respond to all data requests within 30 working days.",
                    "You may opt out of marketing communications by clicking 'Unsubscribe' in any email or messaging us directly.",
                ]
            },
            {
                heading: "5. Cookies",
                content: [
                    "Our website uses cookies to enhance your browsing experience and remember your preferences.",
                    "You can disable cookies through your browser settings, though this may affect website functionality.",
                    "We use analytics cookies to understand traffic patterns — no personally identifiable data is tracked.",
                ]
            },
        ]
    },
    {
        id: "returns",
        icon: RefreshCw,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        accent: "border-orange-400/30",
        title: "Return & Refund Policy",
        subtitle: "Conditions and timelines for returns and refunds",
        effective: "Effective from January 1, 2024",
        sections: [
            {
                heading: "1. Vehicle Purchases",
                content: [
                    "Once a vehicle has been registered in the customer's name, it cannot be returned under standard circumstances.",
                    "Booking cancellations made before invoice generation will receive a full refund of the booking amount within 15 working days.",
                    "Cancellations after invoice generation are subject to deduction of applicable charges (RTO, insurance, PDI, etc.).",
                ]
            },
            {
                heading: "2. Genuine Accessories & Merchandise",
                content: [
                    "Unused accessories in original packaging may be returned within 7 days of purchase.",
                    "Items must be in original condition with intact seals and tags, accompanied by the purchase invoice.",
                    "Refunds for accessories are processed within 7–10 working days after inspection.",
                    "Customized or fitted accessories are non-returnable.",
                ]
            },
            {
                heading: "3. Service Booking Fees",
                content: [
                    "Service booking fees (if applicable) are refundable if the appointment is cancelled at least 24 hours in advance.",
                    "No-shows without prior cancellation will forfeit the booking fee.",
                    "In case of service cancellation by the showroom, a full refund will be issued within 5 working days.",
                ]
            },
            {
                heading: "4. How to Initiate a Return",
                content: [
                    "Contact us at choudharyyamaha.ktr@gmail.com or call +91 70041 00062 to initiate a return.",
                    "Refunds will be credited to the original mode of payment (bank transfer for cash payments).",
                    "Carry a valid government-issued photo ID and original purchase invoice for all return requests.",
                ]
            },
        ]
    },
    {
        id: "warranty",
        icon: Wrench,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        accent: "border-purple-500/30",
        title: "Warranty & Service Policy",
        subtitle: "Yamaha warranty terms and service obligations",
        effective: "As per Yamaha Motor India Guidelines",
        sections: [
            {
                heading: "1. Standard Warranty",
                content: [
                    "All new Yamaha motorcycles come with a manufacturer's warranty of 2 years or 30,000 km (whichever comes first) from the date of purchase.",
                    "Scooters are covered under a 3-year or 30,000 km warranty program.",
                    "Yamaha accessories are supplied as fresh, damage-free items but are not covered under warranty once delivered from the service center.",
                ]
            },
            {
                heading: "2. What Is Covered",
                content: [
                    "Manufacturing defects in materials and workmanship under normal operating conditions.",
                    "Engine, transmission, and electrical system failures not caused by external factors.",
                    "Warranty repairs are performed free of charge at any Yamaha authorized service center in India.",
                ]
            },
            {
                heading: "3. What Is Not Covered",
                content: [
                    "Damage from accidents, misuse, neglect, or unauthorized modifications.",
                    "Normal wear-and-tear items: tyres, brake pads, clutch plates, air filters, spark plugs, and bulbs.",
                    "Damage from improper fuel, oil, or fluids not meeting Yamaha specifications.",
                    "Corrosion, oxidation, or scratches from environmental exposure.",
                    "Vehicles that have not adhered to the recommended free service schedule.",
                ]
            },
            {
                heading: "4. Free Service Schedule",
                content: [
                    "1st Free Service: 1 month or 1,000 km from date of purchase.",
                    "2nd Free Service: 3 months or 3,000 km from date of purchase.",
                    "3rd Free Service: 6 months or 5,000 km from date of purchase.",
                    "It is the customer's responsibility to schedule these services on time to maintain warranty validity.",
                ]
            },
        ]
    },
    {
        id: "finance",
        icon: CreditCard,
        color: "text-sky-400",
        bg: "bg-sky-400/10",
        accent: "border-sky-400/30",
        title: "Finance & EMI Terms",
        subtitle: "Eligibility, documentation, and repayment conditions",
        effective: "Subject to Partner Bank / NBFC Terms",
        sections: [
            {
                heading: "1. Eligibility",
                content: [
                    "Applicants must be Indian residents aged 21–65 years at the time of loan maturity.",
                    "A stable source of income (salaried or self-employed) is required for loan approval.",
                    "Credit score and employment history are evaluated by the partner financial institution.",
                    "Choudhary Yamaha facilitates finance applications but does not make final credit decisions.",
                ]
            },
            {
                heading: "2. Required Documents",
                content: [
                    "Identity proof: Aadhaar Card, PAN Card, Passport, or Voter ID.",
                    "Address proof: Aadhaar Card, utility bill, or bank statement (not older than 3 months).",
                    "Income proof: Latest salary slips (3 months) or ITR for self-employed individuals.",
                    "Bank statements: Last 6 months (required by some finance partners).",
                    "Passport-size photographs (2–4 copies).",
                ]
            },
            {
                heading: "3. Loan Terms",
                content: [
                    "Loan tenure typically ranges from 12 to 60 months.",
                    "Interest rates and down payment requirements are determined by the lending institution.",
                    "Processing fees, insurance premiums, and other charges are separate from the on-road price.",
                    "Pre-closure charges may apply — please check with your financing partner before foreclosure.",
                ]
            },
            {
                heading: "4. Showroom's Role",
                content: [
                    "Choudhary Yamaha acts as a facilitator between the customer and the financing institution.",
                    "We do not charge any hidden fees for finance application assistance.",
                    "The showroom is not responsible for loan rejection or delays caused by the finance partner.",
                    "All finance-related queries post-disbursement must be directed to the lending institution.",
                ]
            },
        ]
    },
    {
        id: "disclaimer",
        icon: AlertTriangle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        accent: "border-red-400/30",
        title: "Disclaimer",
        subtitle: "Liability limitations and scope of responsibility",
        effective: "Always in Effect",
        sections: [
            {
                heading: "1. Accuracy of Information",
                content: [
                    "While we strive to keep all information on this website accurate and up-to-date, Choudhary Yamaha makes no warranties about completeness or reliability.",
                    "Vehicle specifications, prices, and availability are subject to change without prior notice.",
                    "Always confirm details with our sales team before making a purchase decision.",
                ]
            },
            {
                heading: "2. Limitation of Liability",
                content: [
                    "Choudhary Yamaha is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services.",
                    "We are not responsible for delays in vehicle delivery caused by supply chain disruptions, customs clearance, or force majeure events.",
                    "RTO registration timelines are governed by government regulations and are beyond our control.",
                    "Insurance claim settlements are handled by the respective insurance companies, not the showroom.",
                ]
            },
            {
                heading: "3. Third-Party Links",
                content: [
                    "Our website may contain links to third-party websites (e.g., Yamaha India, finance partners). We have no control over their content or privacy practices.",
                    "Visiting linked websites is at your own discretion and risk.",
                ]
            },
            {
                heading: "4. External Factors",
                content: [
                    "Fuel efficiency figures quoted are based on standard test conditions and may vary in real-world usage.",
                    "On-road prices are indicative and differ by RTO jurisdiction, state taxes, and insurance premiums.",
                    "Colour availability is subject to batch production and may not always match the website display.",
                ]
            },
        ]
    },
    {
        id: "community",
        icon: Users,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        accent: "border-yellow-400/30",
        title: "Community Guidelines",
        subtitle: "Rules for respectful engagement in our rider community",
        effective: "For All Community Members",
        sections: [
            {
                heading: "1. Core Principles",
                content: [
                    "Our rider community spans 1,200+ enthusiasts — treat every member with respect and courtesy.",
                    "We celebrate the spirit of riding, local road culture, and the Yamaha brotherhood.",
                    "Constructive criticism is welcome; harassment, trolling, or hate speech will not be tolerated.",
                ]
            },
            {
                heading: "2. Content Standards",
                content: [
                    "Share ride experiences, tips, maintenance advice, and local event information.",
                    "Do not post misleading product reviews, spam, or promotional content without authorization.",
                    "Respect intellectual property: credit original photographers and content creators.",
                    "Avoid sharing sensitive personal information (addresses, phone numbers) of other members.",
                ]
            },
            {
                heading: "3. Group Rides & Events",
                content: [
                    "Always follow all traffic regulations during group rides — safety is non-negotiable.",
                    "Ride leaders are responsible for briefing participants on the route, pace, and safety protocols.",
                    "Choudhary Yamaha is not liable for accidents or incidents during community-organized rides.",
                    "Helmet usage is mandatory for all participants in showroom-organized events.",
                ]
            },
            {
                heading: "4. Moderation & Violations",
                content: [
                    "Violations of these guidelines may result in a warning, temporary suspension, or permanent removal from the community.",
                    "Decisions by community moderators are final.",
                    "Report inappropriate content to choudharyyamaha.ktr@gmail.com with 'Community Report' in the subject line.",
                ]
            },
        ]
    },
];

function AccordionItem({ section }: { section: { heading: string; content: string[] } }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-border/50 rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
            >
                <span className="text-xs font-black uppercase tracking-widest text-foreground">{section.heading}</span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <ul className="px-6 py-4 space-y-3 border-t border-border/30">
                            {section.content.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-medium leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-racing-blue mt-2 shrink-0" />
                                    {point}
                                </li>
                            ))}
                            <li className="flex items-start gap-3 pt-4 mt-4 border-t border-border/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                                <Link
                                    href="https://www.yamaha-motor-india.com/"
                                    target="_blank"
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue transition-colors flex items-center gap-2"
                                >
                                    Official Yamaha India Guidelines
                                    <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LegalPage() {
    const [activePolicy, setActivePolicy] = useState("terms");

    // Sync with URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && policies.some(p => p.id === tab)) {
            setActivePolicy(tab);
        }
    }, []);

    const current = policies.find(p => p.id === activePolicy) || policies[0];
    const Icon = current.icon;

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-br from-racing-blue/5 via-background to-background border-b border-border overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                />
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue transition-colors mb-8">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Home
                    </Link>
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-racing-blue/10 rounded-full mb-6">
                            <Scale className="w-4 h-4 text-racing-blue" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-racing-blue">Legal & Policies</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter italic text-foreground mb-4 leading-none">
                            Our Commitment to<br />
                            <span className="text-racing-blue">Transparency & Trust</span>
                        </h1>
                        <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-xl">
                            At Choudhary Yamaha, we believe in clear, honest communication. Every policy below is crafted to protect you — our valued customer — and to ensure a transparent, trustworthy experience across all our services.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-72 shrink-0">
                        <div className="sticky top-24 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-4 px-2">Policy Sections</p>
                            {policies.map(p => {
                                const PIcon = p.icon;
                                const isActive = activePolicy === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setActivePolicy(p.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                                            isActive
                                                ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <PIcon className="w-4 h-4 shrink-0" />
                                        <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{p.title}</span>
                                    </button>
                                );
                            })}

                            {/* Quick Contact */}
                            <div className="mt-6 p-4 bg-racing-blue/5 border border-racing-blue/20 rounded-2xl">
                                <p className="text-[9px] font-black uppercase tracking-widest text-racing-blue mb-2">Need Clarification?</p>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                    Contact us at<br />
                                    <a href="mailto:choudharyyamaha.ktr@gmail.com" className="text-racing-blue font-black hover:underline">
                                        choudharyyamaha.ktr@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Policy Content */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePolicy}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Policy Header */}
                                <div className={cn("flex items-start gap-5 p-6 rounded-3xl border mb-8", current.accent, current.bg)}>
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", current.bg)}>
                                        <Icon className={cn("w-7 h-7", current.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-display font-black uppercase tracking-tighter italic text-foreground">{current.title}</h2>
                                        <p className="text-[11px] text-muted-foreground font-medium mt-1">{current.subtitle}</p>
                                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full", current.bg, current.color)}>
                                                {current.effective}
                                            </span>
                                            <button className={cn("flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors", current.color, "opacity-60 hover:opacity-100")}>
                                                <Download className="w-3 h-3" />
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Accordion Sections */}
                                <div className="space-y-3">
                                    {current.sections.map((section, i) => (
                                        <AccordionItem key={i} section={section} />
                                    ))}
                                </div>

                                {/* Footer Note */}
                                <div className="mt-10 p-5 bg-muted/30 border border-border/50 rounded-2xl">
                                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed text-center">
                                        These policies are reviewed periodically. Last updated:{" "}
                                        <span className="font-black text-foreground">April 2025</span>.
                                        For any concerns, reach us at{" "}
                                        <a href="mailto:choudharyyamaha.ktr@gmail.com" className="text-racing-blue font-black hover:underline">
                                            choudharyyamaha.ktr@gmail.com
                                        </a>{" "}
                                        or call{" "}
                                        <a href="tel:+917004100062" className="text-racing-blue font-black hover:underline">
                                            +91 70041 00062
                                        </a>.
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
