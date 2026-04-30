"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Wrench, Shield, Clock, Calendar, CheckCircle2,
    ChevronRight, Bell, Plus, Edit2, Save, X,
    Activity, History, FileText, Settings,
    Zap, Weight, DollarSign, Image as ImageIcon,
    Clock3, MapPin, ExternalLink, Download,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { DigitalPlate } from "../ui/DigitalPlate";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deriveKey, encryptData, decryptData } from "@/lib/utils/vaultCrypto";
import { Lock, Unlock, KeyRound } from "lucide-react";

interface IModification {
    _id?: string;
    partName: string;
    brand: string;
    cost: number;
    date: string;
    location?: string;
}

interface IDocument {
    _id?: string;
    docType: string;
    docUrl: string;
    expiryDate?: string;
}

interface IPartStatus {
    _id?: string;
    part: string;
    status: "healthy" | "watch" | "critical" | "fixed";
    note?: string;
    updatedAt: string;
}

interface IIssueReport {
    _id?: string;
    title: string;
    system: string;
    severity: "low" | "medium" | "high";
    status: "open" | "in_progress" | "fixed";
    observedAt: string;
    fixedAt?: string;
    note?: string;
}

interface IDiagnosticReport {
    _id?: string;
    title: string;
    summary: string;
    healthScore: number;
    generatedAt: string;
}

interface IRideAnalytics {
    _id?: string;
    periodLabel: string;
    distanceKm: number;
    efficiencyKmpl: number;
    activeHours: number;
    generatedAt: string;
}

interface IConsumables {
    tires: number;
    chain: number;
    brakes: number;
    coolant: number;
}

interface UserBike {
    _id: string;
    bikeId?: string;
    bikeModel: string;
    bikeImage?: string;
    registrationNumber: string;
    registrationVerified?: boolean;
    chassisNumber?: string;
    identitySource?: "owner" | "sale_ledger";
    salePrice?: number;
    purchaseDate: string;
    mileage: number;
    consumables: IConsumables;
    conditionScore: number;
    modifications: IModification[];
    documents: IDocument[];
    partStatuses?: IPartStatus[];
    issueReports?: IIssueReport[];
    diagnosticReports?: IDiagnosticReport[];
    rideAnalytics?: IRideAnalytics[];
    nextServiceDate: string;
}

interface ServiceStep {
    status: string;
    timestamp: string;
    notes?: string;
}

interface IService {
    _id: string;
    serviceType: string;
    appointmentDate: string;
    cost: number;
    status: string;
}

const PROBLEM_LIBRARY: Record<string, { label: string; probableCause: string; recommendedFix: string }[]> = {
    engine: [
        { label: "Engine knocking noise", probableCause: "Low oil quality, timing issue, or abnormal combustion.", recommendedFix: "Run engine diagnostics, inspect timing chain, and replace engine oil/filter." },
        { label: "Hard starting", probableCause: "Weak battery, injector clog, or spark plug wear.", recommendedFix: "Check battery health, clean injector path, and inspect/replace spark plug." },
        { label: "Power drop at high RPM", probableCause: "Fuel-air imbalance, ignition coil weakness, or clogged air filter.", recommendedFix: "Scan ECU, clean throttle body, inspect ignition system, and replace air filter." }
    ],
    brakes: [
        { label: "Soft brake feel", probableCause: "Air in brake line or low brake fluid.", recommendedFix: "Bleed brake lines and refill with spec brake fluid." },
        { label: "Brake squeal/noise", probableCause: "Worn pads or glazing on rotor surface.", recommendedFix: "Inspect pad thickness, clean caliper, and resurface/replace rotor if needed." },
        { label: "Brake vibration", probableCause: "Rotor runout or uneven pad wear.", recommendedFix: "Measure rotor runout and replace damaged components." }
    ],
    electrical: [
        { label: "Battery drains quickly", probableCause: "Charging leak, alternator weakness, or battery age.", recommendedFix: "Load test battery and charging circuit; replace battery if below spec." },
        { label: "Headlight flicker", probableCause: "Loose connector or voltage fluctuation.", recommendedFix: "Inspect harness connection and regulator output." },
        { label: "Self-start intermittent", probableCause: "Starter relay wear or low voltage under load.", recommendedFix: "Check relay and starter motor current draw." }
    ],
    connectivity: [
        { label: "App disconnects frequently", probableCause: "Bluetooth pairing conflict or outdated firmware.", recommendedFix: "Re-pair device, clear app cache, and update communication firmware." },
        { label: "Trip sync missing", probableCause: "Mobile permission block or sync timeout.", recommendedFix: "Enable location/background permissions and perform manual sync diagnostics." },
        { label: "Navigation data lag", probableCause: "Low signal quality or unit software latency.", recommendedFix: "Check connectivity module logs and update software package." }
    ]
};

export function GarageDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bikes, setBikes] = useState<UserBike[]>([]);
    const [selectedBike, setSelectedBike] = useState<UserBike | null>(null);
    const [services, setServices] = useState<IService[]>([]);
    const [officialBikes, setOfficialBikes] = useState<{ _id: string; name: string; price: string }[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [activeTab, setActiveTab] = useState<"overview" | "mods" | "docs" | "timeline">("overview");
    const [showModModal, setShowModModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [showDocModal, setShowDocModal] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [manageFormData, setManageFormData] = useState({ registrationNumber: "", chassisNumber: "", mileage: 0 });
    const [newMod, setNewMod] = useState({ partName: "", brand: "", cost: 0, date: new Date().toISOString().split('T')[0], location: "" });
    const [partStatusForm, setPartStatusForm] = useState({ part: "engine", status: "healthy", note: "" });
    const [issueForm, setIssueForm] = useState({ title: "", system: "engine", problem: PROBLEM_LIBRARY.engine[0].label, severity: "medium", note: "" });
    const [diagnosticForm, setDiagnosticForm] = useState({ title: "", summary: "", healthScore: 100 });
    const [analyticsForm, setAnalyticsForm] = useState({ periodLabel: "Last 30 Days", distanceKm: 0, efficiencyKmpl: 0, activeHours: 0, odometerKm: 0 });
    const [docForm, setDocForm] = useState({ docType: "", docUrl: "", expiryDate: "" });
    const [serviceCenter, setServiceCenter] = useState({ serviceAddress: "Nearest Yamaha Service Center", servicePhone: "N/A" });

    // Vault Security States
    const [vaultKey, setVaultKey] = useState<CryptoKey | null>(null);
    const [vaultPin, setVaultPin] = useState("");
    const [isVerifyingVault, setIsVerifyingVault] = useState(false);
    const [vaultError, setVaultError] = useState("");
    const [decryptedDocs, setDecryptedDocs] = useState<Record<string, string>>({});
    const [showVaultSetup, setShowVaultSetup] = useState(false);
    const [newVaultPin, setNewVaultPin] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (user) {
            fetchBikes();
            fetchOfficialBikes();
            axios.get<any>(`${API_URL}/config`).then((res) => {
                const resData = res.data as any;
                if (resData.success) {
                    setServiceCenter({
                        serviceAddress: resData.data.serviceAddress || "Nearest Yamaha Service Center",
                        servicePhone: resData.data.servicePhone || "N/A"
                    });
                }
            }).catch(() => undefined);
        }
    }, [user, authLoading, router]);

    const fetchBikes = async () => {
        try {
            const res = await axios.get<any>(`${API_URL}/user-bikes`, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                setBikes(resData.data);
                if (resData.data.length > 0) {
                    setSelectedBike(resData.data[0]);
                    fetchServiceHistory(resData.data[0]._id);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficialBikes = async () => {
        try {
            const res = await axios.get<any>(`${API_URL}/bikes`);
            const resData = res.data as any;
            if (resData.success) {
                setOfficialBikes(resData.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchServiceHistory = async (bikeId: string) => {
        try {
            const res = await axios.get<any>(`${API_URL}/user-bikes/${bikeId}/services`, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                setServices(resData.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddMod = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.post<any>(`${API_URL}/user-bikes/${selectedBike._id}/modifications`, newMod, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                setSelectedBike(resData.data);
                setShowModModal(false);
                setNewMod({ partName: "", brand: "", cost: 0, date: new Date().toISOString().split('T')[0], location: "" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteMod = async (modId: string) => {
        if (!selectedBike || !confirm("Are you sure you want to remove this modification?")) return;
        try {
            const res = await axios.delete<any>(`${API_URL}/user-bikes/${selectedBike._id}/modifications/${modId}`, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                setSelectedBike(resData.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateBike = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.put<any>(`${API_URL}/user-bikes/${selectedBike._id}`, manageFormData, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                const updatedBike = resData.data;
                setBikes(bikes.map(b => b._id === updatedBike._id ? updatedBike : b));
                setSelectedBike(updatedBike);
                setIsManaging(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const syncUpdatedBike = (updatedBike: UserBike) => {
        setBikes((prev) => prev.map((b) => (b._id === updatedBike._id ? updatedBike : b)));
        setSelectedBike(updatedBike);
    };

    const handleUpdatePartStatus = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.patch<any>(
                `${API_URL}/user-bikes/${selectedBike._id}/part-status`,
                partStatusForm,
                { withCredentials: true }
            );
            const resData = res.data as any;
            if (resData.success) {
                syncUpdatedBike(resData.data);
                setShowStatusModal(false);
                setPartStatusForm({ part: "engine", status: "healthy", note: "" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddIssue = async () => {
        if (!selectedBike) return;
        try {
            const selectedProblem = (PROBLEM_LIBRARY[issueForm.system] || []).find((p) => p.label === issueForm.problem);
            const autoGeneratedDetail = selectedProblem
                ? `Detected issue: ${selectedProblem.label}. Probable cause: ${selectedProblem.probableCause} Recommended action: ${selectedProblem.recommendedFix} Service recommendation: Visit ${serviceCenter.serviceAddress}. Contact: ${serviceCenter.servicePhone}.`
                : issueForm.note;
            const res = await axios.post<any>(
                `${API_URL}/user-bikes/${selectedBike._id}/issues`,
                {
                    title: issueForm.title || issueForm.problem,
                    system: issueForm.system,
                    severity: issueForm.severity,
                    note: `${autoGeneratedDetail}${issueForm.note ? ` Owner note: ${issueForm.note}` : ""}`
                },
                { withCredentials: true }
            );
            const resData = res.data as any;
            if (resData.success) {
                syncUpdatedBike(resData.data);
                setShowIssueModal(false);
                setIssueForm({ title: "", system: "engine", problem: PROBLEM_LIBRARY.engine[0].label, severity: "medium", note: "" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateIssueStatus = async (issueId: string, status: "open" | "in_progress" | "fixed") => {
        if (!selectedBike) return;
        try {
            const res = await axios.patch<any>(
                `${API_URL}/user-bikes/${selectedBike._id}/issues/${issueId}`,
                { status },
                { withCredentials: true }
            );
            const resData = res.data as any;
            if (resData.success) {
                syncUpdatedBike(resData.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddDiagnostic = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.post<any>(
                `${API_URL}/user-bikes/${selectedBike._id}/diagnostics`,
                diagnosticForm,
                { withCredentials: true }
            );
            const resData = res.data as any;
            if (resData.success) {
                syncUpdatedBike(resData.data);
                setShowDiagnosticModal(false);
                setDiagnosticForm({ title: "", summary: "", healthScore: 100 });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddAnalytics = async () => {
        if (!selectedBike) return;
        try {
            const res = await axios.post<any>(
                `${API_URL}/user-bikes/${selectedBike._id}/ride-analytics`,
                analyticsForm,
                { withCredentials: true }
            );
            const resData = res.data as any;
            if (resData.success) {
                syncUpdatedBike(resData.data);
                setShowAnalyticsModal(false);
                setAnalyticsForm({ periodLabel: "Last 30 Days", distanceKm: 0, efficiencyKmpl: 0, activeHours: 0, odometerKm: 0 });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddDocument = async () => {
        if (!selectedBike || !vaultKey) {
            alert("Please unlock your vault first to secure this document.");
            return;
        }
        try {
            // Encrypt the sensitive URL
            const encryptedUrl = await encryptData(docForm.docUrl, vaultKey);
            
            const res = await axios.post<any>(
                `${API_URL}/user-bikes/${selectedBike._id}/documents`,
                { ...docForm, docUrl: encryptedUrl },
                { withCredentials: true }
            );
            const resData = res.data as any;
            if (resData.success) {
                syncUpdatedBike(resData.data);
                setShowDocModal(false);
                setDocForm({ docType: "", docUrl: "", expiryDate: "" });
                // Immediately decrypt the new doc for display
                const newDoc = resData.data.documents[resData.data.documents.length - 1];
                if (newDoc._id) {
                    setDecryptedDocs(prev => ({ ...prev, [newDoc._id]: docForm.docUrl }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnlockVault = async () => {
        if (!user || !vaultPin) return;
        setIsVerifyingVault(true);
        setVaultError("");
        try {
            const res = await axios.post<any>(`${API_URL}/auth/vault-verify`, { pin: vaultPin }, { withCredentials: true });
            if (res.data.success) {
                const key = await deriveKey(vaultPin, user._id);
                setVaultKey(key);
                setVaultPin("");
                // Trigger decryption for all existing docs
                if (selectedBike) {
                    decryptAllDocs(selectedBike.documents, key);
                }
            }
        } catch (err: any) {
            setVaultError(err.response?.data?.message || "Failed to unlock vault");
        } finally {
            setIsVerifyingVault(false);
        }
    };

    const handleSetupVault = async () => {
        if (!user || !newVaultPin || newVaultPin.length < 4) {
            setVaultError("PIN must be at least 4 digits");
            return;
        }
        setIsVerifyingVault(true);
        try {
            const res = await axios.post<any>(`${API_URL}/auth/vault-setup`, { pin: newVaultPin }, { withCredentials: true });
            if (res.data.success) {
                const key = await deriveKey(newVaultPin, user._id);
                setVaultKey(key);
                setShowVaultSetup(false);
                setNewVaultPin("");
                // Refresh user to update vaultPinSet status
                window.location.reload(); 
            }
        } catch (err: any) {
            setVaultError(err.response?.data?.message || "Failed to setup vault");
        } finally {
            setIsVerifyingVault(false);
        }
    };

    const decryptAllDocs = async (docs: IDocument[], key: CryptoKey) => {
        const decrypted: Record<string, string> = {};
        for (const doc of docs) {
            if (doc._id) {
                try {
                    decrypted[doc._id] = await decryptData(doc.docUrl, key);
                } catch (e) {
                    decrypted[doc._id] = "Decryption Failed";
                }
            }
        }
        setDecryptedDocs(decrypted);
    };

    useEffect(() => {
        if (activeTab === "docs" && selectedBike && vaultKey) {
            decryptAllDocs(selectedBike.documents, vaultKey);
        }
    }, [activeTab, selectedBike, vaultKey]);

    if (loading || authLoading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-racing-blue border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!selectedBike) return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8">
            <div className="p-12 bg-white rounded-[3rem] border border-zinc-100 text-center max-w-md shadow-xl shadow-black/5">
                <Plus className="w-16 h-16 text-racing-blue mx-auto mb-6" />
                <h2 className="text-2xl font-display font-black text-zinc-900 uppercase mb-4">Your Garage is Empty</h2>
                <p className="text-gray-500 font-medium mb-8 uppercase text-[10px] tracking-widest leading-relaxed">Add your first machine to begin tracking its legacy and health.</p>
                <Link href="/profile" className="block w-full py-4 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-racing-blue/20">
                    Register Bike
                </Link>
            </div>
        </div>
    );

    const parsePriceToNumber = (price: string | undefined) => {
        if (!price) return 0;
        const numeric = Number(String(price).replace(/[^0-9.]/g, ""));
        return Number.isFinite(numeric) ? numeric : 0;
    };
    const formatInrCompact = (value: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 1, notation: "compact" }).format(value);

    const matchedOfficialBike = officialBikes.find((bike) =>
        (selectedBike.bikeId && bike._id === selectedBike.bikeId) ||
        bike.name.toLowerCase() === selectedBike.bikeModel.toLowerCase()
    );
    const purchaseValue = selectedBike.salePrice && selectedBike.salePrice > 0
        ? selectedBike.salePrice
        : parsePriceToNumber(matchedOfficialBike?.price);
    const modsCost = selectedBike.modifications?.reduce((acc, mod) => acc + (mod.cost || 0), 0) || 0;
    const totalInvestment = purchaseValue + modsCost;
    const latestAnalytics = selectedBike.rideAnalytics?.[0];
    const latestDiagnostic = selectedBike.diagnosticReports?.[0];
    const selectedProblemDetail = (PROBLEM_LIBRARY[issueForm.system] || []).find((p) => p.label === issueForm.problem);
    const timelineEvents = [
        ...(selectedBike.issueReports || []).map((issue) => ({
            id: issue._id || `${issue.title}-${issue.observedAt}`,
            date: issue.fixedAt || issue.observedAt,
            title: issue.fixedAt ? `Issue fixed: ${issue.title}` : `Issue reported: ${issue.title}`,
            desc: `${issue.system} • ${issue.severity.toUpperCase()} • ${issue.status.replace("_", " ").toUpperCase()}`,
            premium: !!issue.fixedAt
        })),
        ...(selectedBike.modifications || []).map((mod) => ({
            id: mod._id || `${mod.partName}-${mod.date}`,
            date: mod.date,
            title: `Modification: ${mod.partName}`,
            desc: `${mod.brand} • ₹${(mod.cost || 0).toLocaleString()}`,
            premium: true
        })),
        ...(services || []).map((svc) => ({
            id: svc._id,
            date: svc.appointmentDate,
            title: `Service: ${svc.serviceType}`,
            desc: `${svc.status.toUpperCase()} • ₹${(svc.cost || 0).toLocaleString()}`,
            premium: svc.status === "completed" || svc.status === "delivered"
        }))
    ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 12);

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-racing-blue/10">
            {/* Header / Hero */}
            <div className="relative h-[40vh] overflow-hidden border-b border-zinc-100 bg-zinc-50/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.25 }}
                    className="absolute inset-0 bg-cover bg-center mix-blend-multiply transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${selectedBike.bikeImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'})` }}
                />

                <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-end pb-6 px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-0">
                                <span className="px-4 py-1 bg-racing-blue text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-racing-blue/20">Primary Asset</span>
                                <span className="px-4 py-1 bg-white text-emerald-600 border border-emerald-100 shadow-sm text-[9px] font-black uppercase tracking-widest rounded-full">Score: {selectedBike.conditionScore || 100}%</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 text-zinc-900">
                                {selectedBike.bikeModel}
                            </h1>
                            <div className="flex items-center gap-8">
                                <DigitalPlate registrationNumber={selectedBike.registrationNumber} variant="compact" />
                                <div className="h-10 w-px bg-zinc-200 hidden md:block" />
                                <div className="hidden md:block">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Odometer Log</p>
                                    <p className="text-xl font-display font-black uppercase text-white/90 px-3 py-0 bg-gray-200/20 rounded-sm backdrop-blur-xl">{(selectedBike.mileage || 0).toLocaleString()} <span className="text-[10px] font-sans text-gray-400">KM</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setManageFormData({
                                        registrationNumber: selectedBike.registrationNumber || "",
                                        chassisNumber: selectedBike.chassisNumber || "",
                                        mileage: selectedBike.mileage || 0
                                    });
                                    setIsManaging(true);
                                }}
                                className="px-6 py-2 lg:py-3 bg-white border border-zinc-200 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-50 transition-all text-zinc-900 shadow-sm"
                            >
                                <Settings className="w-4 h-4 mr-2 inline-block" /> Manage
                            </button>
                            <Link href="/service#booking" className="px-6 py-2 lg:py-3 bg-racing-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-racing-blue/20">
                                Book Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="flex items-center gap-10 border-b border-zinc-100 mb-12 overflow-x-auto no-scrollbar">
                    {[
                        { id: "overview", label: "Visual Hub", icon: Activity },
                        { id: "mods", label: "Mod Log", icon: Wrench },
                        { id: "docs", label: "Vault", icon: FileText },
                        { id: "timeline", label: "Heritage", icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            //@ts-ignore
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? "text-zinc-900" : "text-gray-400 hover:text-zinc-600"}`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-racing-blue" : ""}`} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-racing-blue shadow-[0_0_10px_rgba(0,149,255,0.3)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {activeTab === "overview" && (
                            <div className="space-y-12">
                                {/* Consumables Grid */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-gray-400 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-racing-blue" /> Component Lifespan Trackers
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { label: "Front & Rear Tires", value: selectedBike.consumables.tires, desc: "Estimated life based on friction coefficient", url: "https://images.unsplash.com/photo-1677064400501-3299bb683cd7?q=80&w=1630" },
                                            { label: "O-Ring Chain & Sprockets", value: selectedBike.consumables.chain, desc: "Log lube every 500km to extend life", url: "https://images.unsplash.com/photo-1657873961503-89a65459de2b?q=80&w=1631" },
                                            { label: "Sintered Brake Pads", value: selectedBike.consumables.brakes, desc: "Hydraulic pressure & thickness estimate", url: "https://images.unsplash.com/photo-1760317890314-e964ffd7e6a6?q=80&w=1169" },
                                            { label: "High-Temp Coolant", value: selectedBike.consumables.coolant, desc: "PH balance and thermal range tracking", url: "/images/temperature-gauge-light-on.jpg" },
                                        ].map((item) => (
                                            <div key={item.label} className="p-8 bg-zinc-50/50 rounded-3xl border border-zinc-100 space-y-5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-2">
                                                        <Image src={item.url} alt={item.label} width={200} height={200} className="w-48 h-24 object-cover rounded-lg" />
                                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 mb-1">{item.label}</h4>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{item.desc}</p>
                                                    </div>
                                                    <span className={`text-2xl font-display font-black ${item.value > 70 ? 'text-emerald-500' : item.value > 30 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                        {item.value}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.value}%` }}
                                                        className={`h-full ${item.value > 70 ? 'bg-emerald-500' : item.value > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Riding Analytics Preview */}
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-racing-blue" /> Riding Analytics
                                        </h3>
                                        <button
                                            onClick={() => setShowAnalyticsModal(true)}
                                            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Ride Snapshot
                                        </button>
                                    </div>
                                    <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{latestAnalytics?.periodLabel || "Last 30 Days"}</p>
                                            <p className="text-3xl font-display font-black text-zinc-900">{latestAnalytics?.distanceKm || 0} <span className="text-xs font-sans text-gray-400">KM</span></p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-emerald-600">Recorded {latestAnalytics ? new Date(latestAnalytics.generatedAt).toLocaleDateString() : "manually"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Avg. Efficiency</p>
                                            <p className="text-3xl font-display font-black text-zinc-900">{latestAnalytics?.efficiencyKmpl || 0} <span className="text-xs font-sans text-gray-400">KM/L</span></p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-amber-600">Strictly owner-entered ride data</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Hours</p>
                                            <p className="text-3xl font-display font-black text-zinc-900">{latestAnalytics?.activeHours || 0} <span className="text-xs font-sans text-gray-400">HRS</span></p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-gray-400">{(selectedBike.rideAnalytics?.length || 0)} snapshots logged</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setShowStatusModal(true)}
                                        className="p-6 bg-white border border-zinc-200 rounded-3xl text-left hover:bg-zinc-50 transition-all cursor-pointer"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Owner Part Updates</p>
                                        <p className="text-lg font-display font-black text-zinc-900">Update engine, brakes, electrical status</p>
                                    </button>
                                    <button
                                        onClick={() => setShowIssueModal(true)}
                                        className="p-6 bg-red-200/50 border border-zinc-200 rounded-3xl text-left hover:bg-zinc-50 transition-all cursor-pointer"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Issue Reporting <span className="text-[14px] font-bold text-gray-700 uppercase tracking-widest">Update here</span></p>
                                        <p className="text-lg font-display font-black text-zinc-900">Log unusual behavior and track fix status</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Report issues like vibration, noise, or performance degradation</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "mods" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modification Log & Genealogy</h3>
                                    <button
                                        onClick={() => setShowModModal(true)}
                                        className="px-6 py-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Install Part
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {selectedBike.modifications?.length > 0 ? (
                                        selectedBike.modifications.map((mod, idx) => (
                                            <div key={mod._id || idx} className="p-8 bg-zinc-50/50 rounded-3xl border border-zinc-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-racing-blue/5 flex items-center justify-center">
                                                        <Zap className="w-7 h-7 text-racing-blue" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black uppercase text-zinc-900 mb-1">{mod.partName}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mod.brand} • Installed {new Date(mod.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-lg font-display font-black uppercase text-zinc-900">₹{(mod.cost || 0).toLocaleString()}</p>
                                                        {mod.location && (
                                                            <p className="text-[9px] font-black text-racing-blue uppercase tracking-widest">Slot: {mod.location}</p>
                                                        )}
                                                    </div>
                                                    {mod._id && (
                                                        <button
                                                            onClick={() => handleDeleteMod(mod._id!)}
                                                            className="p-3 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
                                                            title="Delete Modification"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-20 border-2 border-dashed border-zinc-100 rounded-[3rem] text-center">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No modifications logged yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "docs" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Document Vault & Certification</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {vaultKey ? (
                                                <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                                                    <Unlock className="w-3 h-3" /> Secure Link Established
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1">
                                                    <Lock className="w-3 h-3" /> Vault Locked
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {vaultKey && (
                                            <>
                                                <button
                                                    onClick={() => setShowDiagnosticModal(true)}
                                                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Diagnostic
                                                </button>
                                                <button
                                                    onClick={() => setShowDocModal(true)}
                                                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Document
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {!vaultKey ? (
                                    <div className="p-12 bg-zinc-50 border border-zinc-100 rounded-[3rem] text-center space-y-6">
                                        <div className="w-20 h-20 bg-racing-blue/10 rounded-[2rem] flex items-center justify-center mx-auto">
                                            <KeyRound className="w-10 h-10 text-racing-blue" />
                                        </div>
                                        <div className="max-w-xs mx-auto">
                                            <h4 className="text-xl font-display font-black uppercase text-zinc-900 mb-2">Unlock Your Vault</h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                                Enter your 6-digit Security PIN to decrypt and access your sensitive machine documentation.
                                            </p>
                                        </div>

                                        {!user?.vaultPinSet ? (
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-bold text-amber-600 uppercase">You haven't set up a security PIN yet.</p>
                                                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                                    <input
                                                        type="password"
                                                        placeholder="Create New PIN"
                                                        className="px-6 py-4 bg-white border border-zinc-200 rounded-2xl text-center font-black tracking-[0.5em] outline-none focus:border-racing-blue transition-all"
                                                        value={newVaultPin}
                                                        onChange={(e) => setNewVaultPin(e.target.value)}
                                                        maxLength={6}
                                                    />
                                                    <button
                                                        onClick={handleSetupVault}
                                                        disabled={isVerifyingVault}
                                                        className="w-full py-4 bg-racing-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-racing-blue/20 hover:bg-blue-600 transition-all disabled:opacity-50"
                                                    >
                                                        {isVerifyingVault ? "INITIALIZING..." : "SETUP SECURE VAULT"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                                    <input
                                                        type="password"
                                                        placeholder="••••••"
                                                        className="px-6 py-4 bg-white border border-zinc-200 rounded-2xl text-center font-black tracking-[0.5em] text-2xl outline-none focus:border-racing-blue transition-all"
                                                        value={vaultPin}
                                                        onChange={(e) => setVaultPin(e.target.value)}
                                                        maxLength={6}
                                                    />
                                                    {vaultError && <p className="text-[9px] font-black text-rose-500 uppercase">{vaultError}</p>}
                                                    <button
                                                        onClick={handleUnlockVault}
                                                        disabled={isVerifyingVault}
                                                        className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all disabled:opacity-50"
                                                    >
                                                        {isVerifyingVault ? "VERIFYING..." : "UNLOCK VAULT"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {(selectedBike.documents || []).map((doc, idx) => {
                                                const expiringSoon = doc.expiryDate && new Date(doc.expiryDate).getTime() < (Date.now() + 45 * 24 * 60 * 60 * 1000);
                                                const decryptedUrl = doc._id ? decryptedDocs[doc._id] : null;

                                                return (
                                                    <div key={doc._id || idx} className={`p-8 bg-zinc-50/50 rounded-3xl border transition-all ${expiringSoon ? 'border-amber-200 bg-amber-50/30' : 'border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-black/5'}`}>
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${expiringSoon ? 'bg-amber-100' : 'bg-zinc-100'}`}>
                                                                <FileText className={`w-6 h-6 ${expiringSoon ? 'text-amber-600' : 'text-zinc-600'}`} />
                                                            </div>
                                                            {decryptedUrl ? (
                                                                <a href={decryptedUrl} target="_blank" rel="noreferrer" className="p-3 bg-racing-blue/10 text-racing-blue hover:bg-racing-blue hover:text-white rounded-xl transition-all">
                                                                    <ExternalLink className="w-5 h-5" />
                                                                </a>
                                                            ) : (
                                                                <div className="p-3 bg-zinc-100 rounded-xl">
                                                                    <Lock className="w-5 h-5 text-zinc-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="text-sm font-black uppercase text-zinc-900 mb-1">{doc.docType}</h4>
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${expiringSoon ? 'text-amber-600' : 'text-gray-400'}`}>
                                                            {doc.expiryDate ? `Expires ${new Date(doc.expiryDate).toLocaleDateString()}` : "No expiry"}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {(selectedBike.documents || []).length === 0 && (
                                            <div className="w-full py-8 bg-zinc-50/50 border-2 border-dashed border-zinc-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">
                                                No documents yet. Add RC, insurance, warranty, and invoices.
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Latest Diagnostics</h4>
                                    {(selectedBike.diagnosticReports || []).slice(0, 3).map((report, idx) => (
                                        <div key={report._id || idx} className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                            <p className="text-sm font-black uppercase text-zinc-900">{report.title}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{new Date(report.generatedAt).toLocaleString()}</p>
                                            <p className="text-xs text-zinc-600 mt-3">{report.summary}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-racing-blue mt-3">Health Score: {report.healthScore}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "timeline" && (
                            <div className="space-y-12 pl-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Asset Heritage & Timeline</h3>
                                <div className="relative space-y-12">
                                    <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-100" />

                                    {timelineEvents.length === 0 && (
                                        <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            No timeline events yet. Add modifications, issues, or service updates.
                                        </div>
                                    )}
                                    {timelineEvents.map((event, idx) => (
                                        <div key={event.id || idx} className="relative pl-12 group">
                                            <div className={`absolute left-[-6px] top-2 w-3 h-3 rounded-full border-4 border-white transition-all group-hover:scale-125 ${event.premium ? 'bg-racing-blue shadow-[0_0_15px_rgba(0,149,255,0.4)]' : 'bg-zinc-300'}`} />
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{new Date(event.date).toLocaleString()}</p>
                                                <h4 className={`text-base font-black uppercase mb-1 ${event.premium ? 'text-racing-blue' : 'text-zinc-900'}`}>{event.title}</h4>
                                                <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm">{event.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Issue Tracker</h4>
                                    {(selectedBike.issueReports || []).slice(0, 6).map((issue) => (
                                        <div key={issue._id || `${issue.title}-${issue.observedAt}`} className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-black uppercase text-zinc-900">{issue.title}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{issue.system} • {issue.severity.toUpperCase()} • {issue.status.replace("_", " ").toUpperCase()}</p>
                                            </div>
                                            {issue._id && issue.status !== "fixed" && (
                                                <button
                                                    onClick={() => handleUpdateIssueStatus(issue._id!, "fixed")}
                                                    className="px-3 py-2 bg-racing-blue text-white text-[9px] font-black uppercase tracking-widest rounded-lg"
                                                >
                                                    Mark Fixed
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] space-y-8 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Valuation</h3>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Investment</p>
                                <p className="text-4xl font-display font-black text-zinc-900 uppercase tracking-tighter">
                                    ₹{(totalInvestment || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Purchase Value</span>
                                    <span className="text-zinc-600">{purchaseValue > 0 ? formatInrCompact(purchaseValue) : "Not Available"}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Mods Cost</span>
                                    <span className="text-zinc-600">₹{modsCost.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-racing-blue/5 border border-racing-blue/10 rounded-[2.5rem] space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-racing-blue/10 flex items-center justify-center">
                                    <Clock3 className="w-5 h-5 text-racing-blue" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-racing-blue">Next Milestones</h3>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Periodic Service</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-black uppercase text-zinc-900 leading-none">{new Date(selectedBike.nextServiceDate).toLocaleDateString()}</p>
                                        <p className="text-[10px] font-black text-racing-blue uppercase tracking-widest leading-none">24 Days Left</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">RC Renewal</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-black uppercase text-zinc-900 leading-none">Dec 2029</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Verifiable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModModal(false)}
                            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <h2 className="text-3xl font-display font-black uppercase mb-10 text-zinc-900">Install New Modification</h2>
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Part Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.partName}
                                            onChange={(e) => setNewMod({ ...newMod, partName: e.target.value })}
                                            placeholder="e.g. Akrapovič Slip-On"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Brand</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.brand}
                                            onChange={(e) => setNewMod({ ...newMod, brand: e.target.value })}
                                            placeholder="e.g. Ohlins"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Cost (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.cost}
                                            onChange={(e) => setNewMod({ ...newMod, cost: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Install Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                            value={newMod.date}
                                            onChange={(e) => setNewMod({ ...newMod, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Stock Part Storage Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                        value={newMod.location}
                                        onChange={(e) => setNewMod({ ...newMod, location: e.target.value })}
                                        placeholder="e.g. Garage Shelf B2"
                                    />
                                </div>
                                <button
                                    onClick={handleAddMod}
                                    className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all mt-6 shadow-xl shadow-racing-blue/20"
                                >
                                    Confirm Asset Modification
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showStatusModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStatusModal(false)} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-display font-black uppercase mb-8 text-zinc-900">Update Part Condition</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-6">Select bike part and current condition observed by owner.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bike part / entity</label>
                                    <select
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer"
                                        value={partStatusForm.part}
                                        onChange={(e) => setPartStatusForm({ ...partStatusForm, part: e.target.value })}
                                    >
                                        <option value="" disabled>Select Part</option>
                                        <option value="engine">Engine</option>
                                        <option value="brakes">Brakes</option>
                                        <option value="clutch">Clutch</option>
                                        <option value="chain">Chain & Sprockets</option>
                                        <option value="battery">Battery</option>
                                        <option value="tires">Tires</option>
                                        <option value="coolant">Coolant</option>
                                        <option value="suspension">Suspension</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="lights">Lights / Indicators</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current condition status</label>
                                    <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={partStatusForm.status} onChange={(e) => setPartStatusForm({ ...partStatusForm, status: e.target.value as "healthy" | "watch" | "critical" | "fixed" })}>
                                        <option value="healthy">Healthy</option>
                                        <option value="watch">Watch</option>
                                        <option value="critical">Critical</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observation note</label>
                                    <textarea className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={partStatusForm.note} onChange={(e) => setPartStatusForm({ ...partStatusForm, note: e.target.value })} placeholder="Example: slight knocking sound during cold start between 2k-3k RPM" />
                                </div>
                                <button onClick={handleUpdatePartStatus} className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl">Save Part Status</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showIssueModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowIssueModal(false)} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-display font-black uppercase mb-8 text-zinc-900">Report New Issue</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-6">Choose issue from dropdowns. System auto-generates probable cause and recommended Yamaha fix.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue title (optional)</label>
                                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={issueForm.title} onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })} placeholder="Example: engine knocking after long ride" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bike system</label>
                                    <select
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                                        value={issueForm.system}
                                        onChange={(e) => {
                                            const nextSystem = e.target.value;
                                            const nextProblem = PROBLEM_LIBRARY[nextSystem]?.[0]?.label || "";
                                            setIssueForm({ ...issueForm, system: nextSystem, problem: nextProblem });
                                        }}
                                    >
                                        <option value="engine">Engine</option>
                                        <option value="brakes">Brakes</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="connectivity">Connectivity</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observed problem</label>
                                    <select
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                                        value={issueForm.problem}
                                        onChange={(e) => setIssueForm({ ...issueForm, problem: e.target.value })}
                                    >
                                        {(PROBLEM_LIBRARY[issueForm.system] || []).map((problem) => (
                                            <option key={problem.label} value={problem.label}>{problem.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity level</label>
                                    <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={issueForm.severity} onChange={(e) => setIssueForm({ ...issueForm, severity: e.target.value as "low" | "medium" | "high" })}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner note (optional)</label>
                                    <textarea className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={issueForm.note} onChange={(e) => setIssueForm({ ...issueForm, note: e.target.value })} placeholder="Example: issue appears after 25-30 minutes of city traffic" />
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Auto Generated Issue Details</p>
                                    <p className="text-xs text-zinc-700"><strong>Probable cause:</strong> {selectedProblemDetail?.probableCause || "N/A"}</p>
                                    <p className="text-xs text-zinc-700 mt-1"><strong>Recommended fix:</strong> {selectedProblemDetail?.recommendedFix || "N/A"}</p>
                                    <p className="text-xs text-racing-blue mt-2"><strong>Nearest Yamaha service:</strong> {serviceCenter.serviceAddress} ({serviceCenter.servicePhone})</p>
                                </div>
                                <button onClick={handleAddIssue} className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl">Submit Issue</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showDiagnosticModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDiagnosticModal(false)} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-display font-black uppercase mb-8 text-zinc-900">Add Diagnostic Report</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-6">Use after workshop checkup or self-diagnostic scan.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Report title</label>
                                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={diagnosticForm.title} onChange={(e) => setDiagnosticForm({ ...diagnosticForm, title: e.target.value })} placeholder="Example: 10,000 KM major service inspection" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diagnostic summary</label>
                                    <textarea className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={diagnosticForm.summary} onChange={(e) => setDiagnosticForm({ ...diagnosticForm, summary: e.target.value })} placeholder="Example: chain replaced, brake pads at 60%, ECU scan clean" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overall health score (0-100)</label>
                                    <input type="number" min={0} max={100} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={diagnosticForm.healthScore} onChange={(e) => setDiagnosticForm({ ...diagnosticForm, healthScore: Number(e.target.value) })} placeholder="Example: 87" />
                                </div>
                                <button onClick={handleAddDiagnostic} className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl">Save Diagnostic</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showAnalyticsModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAnalyticsModal(false)} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-display font-black uppercase mb-8 text-zinc-900">Add Ride Analytics</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-6">Enter measured values for the selected ride period. Use odometer/trip meter data for accuracy.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period label</label>
                                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={analyticsForm.periodLabel} onChange={(e) => setAnalyticsForm({ ...analyticsForm, periodLabel: e.target.value })} placeholder="Example: Last 30 days / April week 2 / Weekend trip" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total distance ridden (KM)</label>
                                    <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={analyticsForm.distanceKm} onChange={(e) => setAnalyticsForm({ ...analyticsForm, distanceKm: Number(e.target.value) })} placeholder="Example: 482" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Average efficiency (KM/L)</label>
                                    <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={analyticsForm.efficiencyKmpl} onChange={(e) => setAnalyticsForm({ ...analyticsForm, efficiencyKmpl: Number(e.target.value) })} placeholder="Example: 18.4" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engine-on riding time (hours)</label>
                                    <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={analyticsForm.activeHours} onChange={(e) => setAnalyticsForm({ ...analyticsForm, activeHours: Number(e.target.value) })} placeholder="Example: 12.5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current odometer reading (KM)</label>
                                    <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={analyticsForm.odometerKm} onChange={(e) => setAnalyticsForm({ ...analyticsForm, odometerKm: Number(e.target.value) })} placeholder="Example: 15420 (this updates top odometer log)" />
                                </div>
                                <button onClick={handleAddAnalytics} className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl">Save Ride Analytics</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showDocModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDocModal(false)} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-display font-black uppercase mb-8 text-zinc-900">Add Document</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-6">Attach important bike ownership documents for your vault.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document type</label>
                                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={docForm.docType} onChange={(e) => setDocForm({ ...docForm, docType: e.target.value })} placeholder="Example: Registration Certificate, Insurance, Invoice, Warranty" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document link / URL</label>
                                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={docForm.docUrl} onChange={(e) => setDocForm({ ...docForm, docUrl: e.target.value })} placeholder="Example: https://drive.google.com/... or uploaded file URL" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry date (optional)</label>
                                    <input type="date" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none" value={docForm.expiryDate} onChange={(e) => setDocForm({ ...docForm, expiryDate: e.target.value })} />
                                </div>
                                <button onClick={handleAddDocument} className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl">Save Document</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isManaging && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsManaging(false)}
                            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <h2 className="text-3xl font-display font-black uppercase mb-10 text-zinc-900">Manage Machine Identity</h2>
                            {selectedBike.identitySource === "sale_ledger" && (
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-6 inline-block">
                                    Auto-synced from Sales Ledger
                                </p>
                            )}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Registration Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900 uppercase"
                                        value={manageFormData.registrationNumber}
                                        onChange={(e) => setManageFormData({ ...manageFormData, registrationNumber: e.target.value.toUpperCase() })}
                                        placeholder="e.g. MH 12 AB 1234"
                                        disabled={selectedBike.registrationVerified}
                                    />
                                    {selectedBike.registrationVerified && (
                                        <p className="text-[9px] font-bold text-racing-blue uppercase tracking-widest mt-1">Verified by Showroom (Locked)</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Chassis Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900 uppercase"
                                        value={manageFormData.chassisNumber}
                                        onChange={(e) => setManageFormData({ ...manageFormData, chassisNumber: e.target.value.toUpperCase() })}
                                        placeholder="e.g. ME1..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Odometer (KM)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-racing-blue focus:bg-white transition-all text-zinc-900"
                                        value={manageFormData.mileage}
                                        onChange={(e) => setManageFormData({ ...manageFormData, mileage: Number(e.target.value) })}
                                    />
                                </div>

                                <button
                                    onClick={handleUpdateBike}
                                    className="w-full py-5 bg-racing-blue text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all mt-6 shadow-xl shadow-racing-blue/20"
                                >
                                    Update Machine Intel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
