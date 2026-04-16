"use client";

import { useState, useEffect } from "react";
import {
    Plus, Trash2, Edit2, CheckCircle, XCircle, Loader2,
    Save, X, Briefcase, Users, FileText, Download,
    ChevronLeft, ExternalLink, Calendar, Mail, Phone, MapPin
} from "lucide-react";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface JobOpening {
    _id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    active: boolean;
    requirements: string[];
}

interface JobApplication {
    _id: string;
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    aboutYourself: string;
    status: 'applied' | 'rejected' | 'shortlisted';
    jobId: {
        _id: string;
        title: string;
    };
    appliedAt: string;
}

export default function CareerManagementPage() {
    const [activeTab, setActiveTab] = useState<"openings" | "applications">("openings");
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'applied' | 'shortlisted' | 'rejected'>('applied');

    // Rejection states
    const [rejectionTarget, setRejectionTarget] = useState<JobApplication | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "Katihar Showroom",
        status: "Immediate Joining",
        active: true,
        requirements: ""
    });

    useEffect(() => {
        if (activeTab === "openings") {
            fetchOpenings();
        } else {
            fetchApplications();
        }
    }, [activeTab]);

    const fetchOpenings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/career/admin/openings`, { credentials: "include" });
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

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/career/admin/applications`, { credentials: "include" });
            const data = await res.json();
            if (data.success) {
                setApplications(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r !== "")
            };

            const url = editingId
                ? `${API_URL}/career/admin/openings/${editingId}`
                : `${API_URL}/career/admin/openings`;

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await res.json();
            if (data.success) {
                setEditingId(null);
                setShowForm(false);
                setFormData({ title: "", description: "", location: "Katihar Showroom", status: "Immediate Joining", active: true, requirements: "" });
                fetchOpenings();
            }
        } catch (err) {
            console.error("Failed to save opening:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job opening?")) return;
        try {
            const res = await fetch(`${API_URL}/career/admin/openings/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                fetchOpenings();
            }
        } catch (err) {
            console.error("Failed to delete opening:", err);
        }
    };

    const startEdit = (job: JobOpening) => {
        setEditingId(job._id);
        setShowForm(true);
        setFormData({
            title: job.title,
            description: job.description,
            location: job.location,
            status: job.status,
            active: job.active,
            requirements: job.requirements.join(', ')
        });
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${API_URL}/career/admin/applications/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setApplications(applications.map(app =>
                    app._id === id ? { ...app, status: newStatus as any } : app
                ));
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const getRejectionMessage = (app: JobApplication) => {
        return `Dear ${app.name},

Thank you for your interest in the ${app.jobId?.title || 'position'} at Choudhary Yamaha.

We've carefully reviewed your application, and while your background is impressive, we have decided to move forward with other candidates at this time.

Your enthusiasm for the Yamaha brand was evident, and we encourage you to keep building your skills. Please don't be discouraged; your path to success is being built with every experience. We wish you the very best in your career pursuits and hope you'll consider applying for future openings that match your growing expertise.

Stay passionate, stay driven!

Best regards,
Choudhary Yamaha Team`;
    };

    const handleCopyRejection = (msg: string) => {
        navigator.clipboard.writeText(msg);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const resetForm = () => {
        setEditingId(null);
        setShowForm(false);
        setFormData({ title: "", description: "", location: "Katihar Showroom", status: "Immediate Joining", active: true, requirements: "" });
    };

    const getCandidateAppCount = (email: string, phone: string, name: string) => {
        return applications.filter(app =>
            app.email.toLowerCase() === email.toLowerCase() ||
            app.phone === phone ||
            app.name.toLowerCase() === name.toLowerCase()
        ).length;
    };

    const filteredApplications = applications.filter(app => {
        if (appStatusFilter === 'all') return true;
        return app.status === appStatusFilter;
    });

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-racing-blue transition-colors mb-4 w-fit"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Settings
                    </Link>
                    <h1 className="text-4xl font-display font-black text-gradient uppercase tracking-tighter">
                        CAREER <span className="text-foreground">MANAGEMENT</span>
                    </h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest leading-none mt-2">
                        Manage job postings and screen candidate applications
                    </p>
                </div>

                <div className="flex bg-card border border-border rounded-2xl p-1.5 h-fit">
                    <button
                        onClick={() => setActiveTab("openings")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === "openings" ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        Job Openings
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === "applications" ? "bg-racing-blue text-white shadow-lg shadow-racing-blue/20" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        Applications
                    </button>
                </div>
            </div>

            {loading && !showForm ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="w-10 h-10 text-racing-blue animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching {activeTab}...</span>
                </div>
            ) : activeTab === "openings" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">Active Opportunities</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Post New Job
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-card border-2 border-racing-blue/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
                            <button onClick={resetForm} className="absolute top-8 right-8 p-2 hover:bg-muted rounded-full transition-colors"><X className="w-6 h-6" /></button>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-racing-blue">{editingId ? "Update Job Posting" : "Create New Job Opening"}</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Provide accurate role details for potential candidates</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-racing-blue/60 font-bold">Role Title</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all"
                                            placeholder="e.g. Sales Executive"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-racing-blue/60 font-bold">Status Tag</label>
                                        <input
                                            required
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all"
                                            placeholder="e.g. Immediate Joining"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-racing-blue/60 font-bold">Job Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all min-h-[120px]"
                                        placeholder="Describe the role, responsibilities and ideal candidate..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-racing-blue/60 font-bold">Requirements (Comma separated)</label>
                                    <input
                                        value={formData.requirements}
                                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                        className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-racing-blue transition-all"
                                        placeholder="e.g. Good Communication, 2 Wheeler License, 1-2 Years Experience"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/10">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visible to Candidates</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, active: !formData.active })}
                                            className={cn(
                                                "w-14 h-7 rounded-full p-1 transition-colors relative",
                                                formData.active ? "bg-racing-blue" : "bg-muted"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                                                formData.active ? "translate-x-7" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-8 py-4 bg-muted text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-10 py-4 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-racing-blue/20 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {editingId ? "Update Job Posting" : "Publish Job Opening"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {!showForm && openings.length === 0 ? (
                        <div className="py-32 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed border-border flex flex-col items-center gap-4">
                            <Briefcase className="w-12 h-12 text-muted-foreground opacity-20" />
                            <div className="space-y-1">
                                <p className="text-xl font-display font-black text-foreground uppercase italic opacity-50 tracking-tight">No job postings yet</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest uppercase">Start by creating your first opportunity</p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 px-8 py-4 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all shadow-lg active:scale-95 font-bold"
                            >
                                CREATE FIRST POSTING
                            </button>
                        </div>
                    ) : !showForm && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {openings.map(job => (
                                <div key={job._id} className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 group hover:border-racing-blue/30 hover:shadow-2xl hover:shadow-racing-blue/5 transition-all flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className={cn(
                                                "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                job.active ? "bg-green-500/5 text-green-500 border-green-500/20" : "bg-red-500/5 text-red-500 border-red-500/20"
                                            )}>
                                                {job.active ? "Live & Active" : "Inactive / Closed"}
                                            </div>
                                            <span className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                                <MapPin className="w-3.5 h-3.5 text-racing-blue" />
                                                {job.location}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tight line-clamp-1">{job.title}</h3>
                                            <p className="text-[10px] text-racing-blue font-black uppercase tracking-widest mt-1">{job.status}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium">{job.description}</p>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {job.requirements.slice(0, 3).map(req => (
                                                <span key={req} className="px-3 py-1.5 bg-muted/50 rounded-lg text-[8px] font-black uppercase tracking-widest text-muted-foreground border border-border">
                                                    {req}
                                                </span>
                                            ))}
                                            {job.requirements.length > 3 && (
                                                <span className="px-3 py-1.5 bg-muted/50 rounded-lg text-[8px] font-black uppercase tracking-widest text-muted-foreground border border-border">
                                                    +{job.requirements.length - 3} MORE
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6 border-t border-border/10">
                                        <button
                                            onClick={() => startEdit(job)}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-muted hover:bg-racing-blue/10 hover:text-racing-blue rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all font-bold group/btn"
                                        >
                                            <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            Modify Posting
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="p-4 bg-muted hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all group/del"
                                        >
                                            <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">Candidate Submissions</h2>
                        <div className="flex bg-card border border-border rounded-2xl p-1 h-fit">
                            {(['applied', 'shortlisted', 'rejected', 'all'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setAppStatusFilter(status)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all capitalize",
                                        appStatusFilter === status ? "bg-racing-blue text-white shadow-lg" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {status === 'applied' ? 'Pending' : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredApplications.length === 0 ? (
                        <div className="py-32 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed border-border flex flex-col items-center gap-4">
                            <Users className="w-12 h-12 text-muted-foreground opacity-20" />
                            <div className="space-y-1">
                                <p className="text-xl font-display font-black text-foreground uppercase italic opacity-50 tracking-tight">No {appStatusFilter !== 'all' ? appStatusFilter : ''} applications</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest uppercase font-bold">Try changing your filter criteria</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredApplications.map(app => {
                                const count = getCandidateAppCount(app.email, app.phone, app.name);
                                return (
                                    <div key={app._id} className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 space-y-8 hover:border-racing-blue/20 transition-all shadow-xl hover:shadow-2xl">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            <div className="flex gap-6 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-racing-blue/10 border border-racing-blue/20 flex items-center justify-center shrink-0">
                                                    <Users className="w-8 h-8 text-racing-blue" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tight">{app.name}</h3>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                            app.status === 'applied' ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                                                                app.status === 'shortlisted' ? "bg-green-500/5 text-green-500 border-green-500/20" :
                                                                    "bg-red-500/5 text-red-500 border-red-500/20"
                                                        )}>
                                                            {app.status}
                                                        </span>
                                                        {count > 1 && (
                                                            <span className="px-2 py-0.5 bg-racing-blue/10 text-racing-blue border border-racing-blue/20 rounded-full text-[7px] font-black uppercase tracking-tighter">
                                                                {count} Applications
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-racing-blue">
                                                            <Briefcase className="w-3.5 h-3.5" />
                                                            {app.jobId?.title || "Unknown Position"}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                            <Calendar className="w-3.5 h-3.5 text-racing-blue" />
                                                            Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 h-fit">
                                                {app.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => {
                                                            setRejectionTarget(app);
                                                            handleStatusUpdate(app._id, 'rejected');
                                                        }}
                                                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-bold"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Reject
                                                    </button>
                                                )}
                                                {app.status !== 'shortlisted' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                                        className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-bold"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Shortlist
                                                    </button>
                                                )}
                                                <a
                                                    href={`mailto:${app.email}`}
                                                    className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-racing-blue/10 hover:text-racing-blue rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-bold"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                    Email
                                                </a>
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-8 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-racing-blue/20"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    View Resume
                                                </a>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 border border-border rounded-3xl p-8 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-racing-blue" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Statement of Purpose / About</h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap italic">
                                                "{app.aboutYourself}"
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Rejection Modal */}
            {rejectionTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setRejectionTarget(null)} />
                    <div className="relative w-full max-w-2xl bg-card border-2 border-red-500/20 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 text-red-500">
                                        <XCircle className="w-6 h-6" />
                                        <h3 className="text-2xl font-display font-black uppercase tracking-tight leading-none">Application Rejected</h3>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-9">Status updated to rejected. Use the message below to notify the candidate.</p>
                                </div>
                                <button onClick={() => setRejectionTarget(null)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="bg-muted/50 border border-border rounded-[2rem] p-8 space-y-6 relative group">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-racing-blue">Professional Rejection Response</h4>
                                    <button
                                        onClick={() => handleCopyRejection(getRejectionMessage(rejectionTarget))}
                                        className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-racing-blue hover:text-white transition-all active:scale-95"
                                    >
                                        <Save className="w-3 h-3" />
                                        {copySuccess ? "Copied!" : "Copy Message"}
                                    </button>
                                </div>
                                <div className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                                    {getRejectionMessage(rejectionTarget)}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setRejectionTarget(null)}
                                    className="px-8 py-4 bg-muted text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all font-bold"
                                >
                                    Close Dashboard
                                </button>
                                <a
                                    href={`mailto:${rejectionTarget.email}?subject=Regarding your application for ${rejectionTarget.jobId?.title}&body=${encodeURIComponent(getRejectionMessage(rejectionTarget))}`}
                                    className="px-10 py-4 bg-racing-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-racing-blue/20 flex items-center gap-2 group"
                                >
                                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Send via Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
