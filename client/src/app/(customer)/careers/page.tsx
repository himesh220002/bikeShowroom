"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, ChevronRight, Upload, Send, CheckCircle2, Loader2, BookOpen, Users, Star, ShieldCheck, Heart, XCircle } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";

interface JobOpening {
    _id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    requirements: string[];
}

export default function CareersPage() {
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        aboutYourself: ""
    });
    const [resume, setResume] = useState<File | null>(null);

    useEffect(() => {
        fetchOpenings();
    }, []);

    const fetchOpenings = async () => {
        try {
            const res = await fetch(`${API_URL}/career/openings`);
            const data = await res.json();
            if (data.success) {
                setOpenings(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch openings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !resume) return;

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("jobId", selectedJob._id);
            formDataToSend.append("aboutYourself", formData.aboutYourself);
            formDataToSend.append("resume", resume);

            const res = await fetch(`${API_URL}/career/apply`, {
                method: "POST",
                body: formDataToSend
            });

            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
                setFormData({ name: "", email: "", phone: "", aboutYourself: "" });
                setResume(null);
                setTimeout(() => {
                    setSubmitted(false);
                    setSelectedJob(null);
                }, 5000);
            }
        } catch (err) {
            console.error("Failed to submit application:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80"
                        alt="Join our team"
                        fill
                        className="object-cover opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-4 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 md:w-16 md:h-16">
                                <Image src="/images/YamahaLogo.png" alt="Yamaha" fill className="object-contain" />
                            </div>
                            <div className="flex flex-col gap-0 md:gap-1 text-left">
                                <span className="text-base md:text-xl font-display font-black tracking-tighter text-gradient-text leading-none">
                                    CHOUDHARY
                                </span>
                                <span className="text-[0.9rem] uppercase font-black tracking-[0.2em] text-red-500  -mt-0.5">
                                    YAMAHA
                                </span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tighter leading-none mt-4">
                            BUILD YOUR <span className="text-gradient">CAREER</span>
                        </h1>
                        <p className="text-base md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                            Join our team of passionate professionals delivering trust, solutions, and friendly service to every rider.
                        </p>
                        <a href="#openings" className="mt-8 px-10 py-5 bg-racing-blue text-white rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-racing-blue/20">
                            View Current Openings
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Values & Culture */}
            <section className="max-w-[1400px] mx-auto px-4 py-24 border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-4xl font-display font-black text-foreground uppercase tracking-tighter leading-none">VALUES & <span className="text-gradient">CULTURE</span></h2>
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-4">The DNA of Choudhary Yamaha</p>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            At Choudhary Yamaha, we believe that our growth is intrinsically linked to the growth of our employees. We foster an environment of professional excellence, trust, and enthusiastic service. Every team member is a solution-oriented professional dedicated to providing the best experience to the Yamaha community in Katihar.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { icon: Star, label: "Enthusiastic" },
                                { icon: ShieldCheck, label: "Trustworthy" },
                                { icon: Briefcase, label: "Professional" },
                                { icon: Heart, label: "Friendly" },
                                { icon: BookOpen, label: "Growth-Oriented" }
                            ].map((val) => (
                                <div key={val.label} className="bg-muted px-6 py-4 rounded-2xl border border-border flex items-center gap-3">
                                    <val.icon className="w-4 h-4 text-racing-blue" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{val.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-border shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80"
                            alt="Team working together"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Training Section */}
            <section className="bg-muted px-4 py-24 border-y border-border">
                <div className="max-w-[1400px] mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tighter leading-none">TRAINING & <span className="text-gradient">GROWTH</span></h2>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.3em]">Structured methods for professional excellence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: BookOpen,
                                title: "Product Knowledge",
                                desc: "Comprehensive sessions on Yamaha's R-DNA, technical specs, and model features."
                            },
                            {
                                icon: Users,
                                title: "Customer Handling",
                                desc: "Interactive workshops on CRM, communication, and solution-oriented service."
                            },
                            {
                                icon: Briefcase,
                                title: "Technical Training",
                                desc: "Hands-on specialized training for service staff using the latest Yamaha diagnostics."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border p-10 rounded-[2.5rem] shadow-xl hover:border-racing-blue transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-racing-blue/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-racing-blue" />
                                </div>
                                <h3 className="text-xl font-display font-black text-foreground uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Openings Section */}
            <section id="openings" className="max-w-[1400px] mx-auto px-4 py-24 space-y-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tighter leading-none">CURRENT <span className="text-gradient">OPENINGS</span></h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] mt-4">Katihar Showroom / Service Center</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted px-6 py-3 rounded-full border border-border">
                        <div className="w-2 h-2 rounded-full bg-racing-blue animate-pulse" />
                        HIRING NOW
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-racing-blue" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Scanning Opportunities...</span>
                    </div>
                ) : openings.length === 0 ? (
                    <div className="py-32 text-center bg-muted/30 rounded-[3rem] border border-dashed border-border space-y-4">
                        <p className="text-xl font-display font-black text-foreground uppercase italic opacity-50">No immediate openings</p>
                        <p className="text-xs text-muted-foreground font-medium">Follow us for future opportunities or send your resume to careers@choudharyyamaha.com</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {openings.map((job) => (
                            <motion.div
                                key={job._id}
                                layoutId={job._id}
                                className="bg-card border border-border p-10 rounded-[3rem] shadow-xl hover:border-racing-blue/50 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-muted px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-racing-blue border border-racing-blue/10">
                                            {job.status}
                                        </div>
                                        <span className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                            <MapPin className="w-3 h-3" /> {job.location}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tight">{job.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{job.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requirements.slice(0, 3).map(req => (
                                            <span key={req} className="text-[8px] font-bold uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(job)}
                                    className="mt-10 w-full py-4 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-racing-blue hover:text-white transition-all flex items-center justify-center gap-2 group"
                                >
                                    Apply for this role
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
                            onClick={() => !isSubmitting && setSelectedJob(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-card border-2 border-racing-blue/20 rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            {submitted ? (
                                <div className="p-16 text-center space-y-6">
                                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in" />
                                    </div>
                                    <h3 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter leading-none">Application Sent</h3>
                                    <div className="space-y-4">
                                        <p className="text-base text-muted-foreground font-medium leading-relaxed">
                                            Thank you for applying for the <span className="text-foreground uppercase">{selectedJob.title}</span> role.
                                            Our team will contact you shortly after reviewing your profile.
                                        </p>
                                        <div className="pt-4">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Direct Email Support</p>
                                            <p className="text-sm font-black text-racing-blue">careers@choudharyyamaha.com</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col max-h-[90vh]">
                                    <div className="p-8 border-b border-border flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-black text-racing-blue uppercase tracking-widest">Apply for position</span>
                                            <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tight leading-none mt-1">{selectedJob.title}</h3>
                                        </div>
                                        <button onClick={() => setSelectedJob(null)} className="p-3 hover:bg-muted rounded-full transition-colors"><XCircle className="w-6 h-6" /></button>
                                    </div>

                                    <form onSubmit={handleApply} className="p-8 space-y-8 overflow-y-auto">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                                    <input
                                                        required
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                                    <input
                                                        required
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all"
                                                        placeholder="+91 91223 45678"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">About Yourself</label>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest",
                                                        formData.aboutYourself.trim().split(/\s+/).filter(w => w.length > 0).length < 10 ? "text-red-500" : "text-green-500"
                                                    )}>
                                                        {formData.aboutYourself.trim().split(/\s+/).filter(w => w.length > 0).length} / 10 WORDS MIN.
                                                    </span>
                                                </div>
                                                <textarea
                                                    required
                                                    value={formData.aboutYourself}
                                                    onChange={e => setFormData({ ...formData, aboutYourself: e.target.value })}
                                                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all min-h-[120px]"
                                                    placeholder="Tell us about yourself and why you're a good fit... (At least 10 words)"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Resume (PDF/DOC)</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={e => setResume(e.target.files?.[0] || null)}
                                                        className="hidden"
                                                        id="resume-upload"
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="resume-upload"
                                                        className={cn(
                                                            "w-full bg-muted/50 border border-dashed border-border rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-racing-blue/50 transition-all",
                                                            resume && "border-racing-blue bg-racing-blue/5"
                                                        )}
                                                    >
                                                        {resume ? (
                                                            <>
                                                                <CheckCircle2 className="w-10 h-10 text-racing-blue" />
                                                                <p className="text-sm font-bold text-foreground">{resume.name}</p>
                                                                <p className="text-[9px] font-black text-racing-blue uppercase">File Selected</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-10 h-10 text-muted-foreground" />
                                                                <p className="text-sm font-bold text-muted-foreground">Click to upload or drag & drop</p>
                                                                <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">Supports PDF, DOC, DOCX</p>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !resume || formData.aboutYourself.trim().split(/\s+/).filter(w => w.length > 0).length < 10}
                                            className="w-full py-5 bg-racing-blue text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-racing-blue/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending Application...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Submit Application
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Direct Email Support */}
            <div className="max-w-[1400px] mx-auto px-4 pt-10 text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Not finding what you're looking for?</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Directly email us at:</span>
                    <a href="mailto:careers@choudharyyamaha.com" className="text-sm font-black text-racing-blue hover:underline">careers@choudharyyamaha.com</a>
                </div>
            </div>
        </div>
    );
}
