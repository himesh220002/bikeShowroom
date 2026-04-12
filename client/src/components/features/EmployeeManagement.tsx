"use client";

import { useState, useEffect } from "react";
import {
    X, UserPlus, Phone, Mail, Calendar,
    Briefcase, ShieldCheck, History, Edit3,
    Trash2, ChevronRight, Loader2, CheckCircle2,
    Users, Upload, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils/cn";

interface Employee {
    _id?: string;
    name: string;
    position: string;
    phone: string;
    email: string;
    imageUrl?: string;
    age?: number;
    gender?: string;
    joiningDate: string;
    leavingDate?: string;
    status: 'Active' | 'Resigned';
    history: Array<{
        date: string;
        event: string;
        note: string;
    }>;
}

interface EmployeeManagementProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EmployeeManagement({ isOpen, onClose }: EmployeeManagementProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'add' | 'edit' | 'history'>('list');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [statusFilter, setStatusFilter] = useState<'Active' | 'Resigned'>('Active');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Employee>>({
        name: "",
        position: "",
        phone: "",
        email: "",
        imageUrl: "",
        age: 25,
        gender: "Male",
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) fetchEmployees();
    }, [isOpen, statusFilter]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/employees?status=${statusFilter}`);
            const data = await res.json();
            if (data.success) {
                // Prepend base URL for local images if they start with /images/
                const formatted = data.data.map((emp: Employee) => ({
                    ...emp,
                    imageUrl: emp.imageUrl?.startsWith('/') ? `${API_URL.replace('/api', '')}${emp.imageUrl}` : emp.imageUrl
                }));
                setEmployees(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formDataToSubmit = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined) formDataToSubmit.append(key, value.toString());
            });

            if (selectedFile) {
                formDataToSubmit.append('image', selectedFile);
            }

            const method = view === 'add' ? 'POST' : 'PUT';
            const url = view === 'add' ? `${API_URL}/employees` : `${API_URL}/employees/${selectedEmployee?._id}`;

            const res = await fetch(url, {
                method,
                body: formDataToSubmit // Fetch handles FormData correctly
            });
            const data = await res.json();
            if (data.success) {
                fetchEmployees();
                setSelectedFile(null);
                setPreviewUrl(null);
                setView('list');
            }
        } catch (err) {
            console.error("Failed to save employee:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-racing-blue/10 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-racing-blue" />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tighter italic">
                                Employee <span className="text-racing-blue">Management</span>
                            </h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Team Hierarchy & History</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {view === 'list' && (
                            <div className="flex bg-background border border-border rounded-xl p-1">
                                <button
                                    onClick={() => setStatusFilter('Active')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        statusFilter === 'Active' ? "bg-racing-blue text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setStatusFilter('Resigned')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        statusFilter === 'Resigned' ? "bg-zinc-800 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    History
                                </button>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {view === 'list' ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                    {statusFilter} Staff ({employees.length})
                                </h3>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            name: "", position: "", phone: "", email: "", status: 'Active',
                                            imageUrl: "", age: 25, gender: "Male",
                                            joiningDate: new Date().toISOString().split('T')[0]
                                        });
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                        setView('add');
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-racing-blue/20"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add New Member
                                </button>
                            </div>

                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                                    <Loader2 className="w-8 h-8 animate-spin text-racing-blue" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Syncing Personnel Data...</span>
                                </div>
                            ) : employees.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {employees.map((emp) => (
                                        <div key={emp._id} className="p-5 bg-muted/20 border border-border/50 rounded-2xl group hover:border-racing-blue/30 transition-all flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center text-racing-blue font-display font-black group-hover:bg-racing-blue group-hover:text-white transition-all overflow-hidden">
                                                        {emp.imageUrl ? (
                                                            <img src={emp.imageUrl} alt={emp.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            emp.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black uppercase text-foreground">{emp.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] font-bold text-racing-blue/80 uppercase tracking-widest">{emp.position}</p>
                                                            <span className="text-[8px] font-black text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded italic">
                                                                {emp.gender}, {emp.age}yrs
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0.5 rounded border",
                                                    emp.status === 'Active' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}>
                                                    {emp.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold italic">
                                                    <Phone className="w-3 h-3 text-racing-blue" />
                                                    {emp.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold italic truncate">
                                                    <Mail className="w-3 h-3 text-racing-blue" />
                                                    {emp.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold italic">
                                                    <Calendar className="w-3 h-3 text-racing-blue" />
                                                    In: {new Date(emp.joiningDate).toLocaleDateString()}
                                                </div>
                                                {emp.leavingDate && (
                                                    <div className="flex items-center gap-2 text-[10px] text-red-500/70 font-bold italic">
                                                        <X className="w-3 h-3" />
                                                        Out: {new Date(emp.leavingDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedEmployee(emp);
                                                            setView('history');
                                                        }}
                                                        className="p-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="View History"
                                                    >
                                                        <History className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedEmployee(emp);
                                                            setFormData({
                                                                name: emp.name, position: emp.position, phone: emp.phone,
                                                                email: emp.email,
                                                                imageUrl: emp.imageUrl?.includes('employees/') ? "" : emp.imageUrl || "",
                                                                age: emp.age || 25,
                                                                gender: emp.gender || "Male",
                                                                status: emp.status,
                                                                joiningDate: new Date(emp.joiningDate).toISOString().split('T')[0]
                                                            });
                                                            setPreviewUrl(emp.imageUrl || null);
                                                            setSelectedFile(null);
                                                            setView('edit');
                                                        }}
                                                        className="p-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-racing-blue" title="Edit"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm("Delete this employee record?")) {
                                                            await fetch(`${API_URL}/employees/${emp._id}`, { method: 'DELETE' });
                                                            fetchEmployees();
                                                        }
                                                    }}
                                                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500/50 hover:text-red-500" title="Delete record"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center gap-4 opacity-20">
                                    <Users className="w-12 h-12" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Roster is Empty</span>
                                </div>
                            )}
                        </div>
                    ) : view === 'add' || view === 'edit' ? (
                        <div className="max-w-xl mx-auto space-y-8">
                            <div className="text-center">
                                <h3 className="text-xl font-display font-black text-foreground uppercase italic tracking-tighter">
                                    {view === 'add' ? 'Induct New' : 'Update'} <span className="text-racing-blue">Personnel</span>
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Personnel Detail Entry</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="w-full aspect-square bg-muted rounded-[2rem] border border-border overflow-hidden flex items-center justify-center transition-all group-hover:border-racing-blue/50">
                                                {previewUrl || formData.imageUrl ? (
                                                    <img src={previewUrl || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                                                        <Upload className="w-3 h-3" />
                                                        Select Photo
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                </div>
                                            </div>
                                            <p className="text-[8px] font-bold text-center text-muted-foreground mt-2 uppercase tracking-widest italic">PNG/JPG/WEBP Supported</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Position</label>
                                            <input
                                                required
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                                placeholder="Service Manager"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Image URL (Optional)</label>
                                            <input
                                                value={formData.imageUrl}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, imageUrl: e.target.value });
                                                    setPreviewUrl(null);
                                                }}
                                                className="w-full bg-background border border-border rounded-xl px-5 py-2 text-[11px] font-bold focus:border-racing-blue outline-none transition-all"
                                                placeholder="https://... or /image/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                        <input
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                            placeholder="+91 91223 45678"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                            placeholder="john@yamaha.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Age</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                            className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                            placeholder="25"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Joining Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.joiningDate}
                                            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                            className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm font-bold focus:border-racing-blue outline-none transition-all"
                                        >
                                            <option value="Active">Active Duty</option>
                                            <option value="Resigned">Resigned / Former</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setView('list')}
                                        className="flex-1 px-8 py-4 bg-muted border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all font-display italic"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-[2] flex items-center justify-center gap-2 px-8 py-4 bg-racing-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-racing-blue/20 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                        {saving ? "Processing..." : view === 'add' ? "Confirm Induction" : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setView('list')} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5 rotate-45" />
                                </button>
                                <div>
                                    <h3 className="text-lg font-display font-black text-foreground uppercase italic tracking-tighter">
                                        Career <span className="text-racing-blue">History</span> : {selectedEmployee?.name}
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Growth & Milestone Tracking</p>
                                </div>
                            </div>

                            <div className="space-y-6 pl-4 border-l-2 border-border/50 ml-2">
                                <div className="relative">
                                    <div className="absolute -left-[25px] top-0 w-4 h-4 bg-racing-blue rounded-full border-4 border-background shadow-lg shadow-racing-blue/40" />
                                    <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-black uppercase text-racing-blue tracking-widest">
                                            {selectedEmployee?.joiningDate ? new Date(selectedEmployee.joiningDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <h4 className="text-xs font-black uppercase text-foreground">Inducted as {selectedEmployee?.position}</h4>
                                        <p className="text-[10px] text-muted-foreground italic">Employee record created in the system.</p>
                                    </div>
                                </div>

                                {selectedEmployee?.history?.map((entry, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[25px] top-0 w-4 h-4 bg-muted rounded-full border-4 border-background" />
                                        <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-1">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </p>
                                            <h4 className="text-xs font-black uppercase text-foreground">{entry.event}</h4>
                                            <p className="text-[10px] text-muted-foreground italic">{entry.note}</p>
                                        </div>
                                    </div>
                                ))}

                                {selectedEmployee?.status === 'Resigned' && (
                                    <div className="relative">
                                        <div className="absolute -left-[25px] top-0 w-4 h-4 bg-zinc-800 rounded-full border-4 border-background" />
                                        <div className="p-4 bg-zinc-900/40 border border-border/50 rounded-2xl space-y-1">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                                {selectedEmployee?.leavingDate ? new Date(selectedEmployee.leavingDate).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <h4 className="text-xs font-black uppercase text-foreground">Service Terminated</h4>
                                            <p className="text-[10px] text-muted-foreground italic">Status changed to Resigned.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-racing-blue/5 border border-racing-blue/20 rounded-3xl space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-racing-blue">Log New Career Milestone</h4>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const event = (form.elements.namedItem('event') as HTMLInputElement).value;
                                        const note = (form.elements.namedItem('note') as HTMLTextAreaElement).value;

                                        const res = await fetch(`${API_URL}/employees/${selectedEmployee?._id}`, {
                                            method: 'PUT',
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                history: [...(selectedEmployee?.history || []), { date: new Date().toISOString(), event, note }]
                                            })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setSelectedEmployee(data.data);
                                            form.reset();
                                        }
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required name="event" placeholder="Event (e.g. Promotion)" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:border-racing-blue" />
                                        <button className="bg-racing-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Add History Log</button>
                                    </div>
                                    <textarea name="note" placeholder="Milestone details..." className="w-full bg-background border border-border rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:border-racing-blue resize-none" rows={2} />
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
