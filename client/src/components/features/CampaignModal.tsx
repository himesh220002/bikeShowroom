"use client";

import { useState } from "react";
import { X, MessageSquare, Send, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { API_URL } from "@/lib/config";

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientIds: string[];
    onSuccess: () => void;
}

const TEMPLATES = [
    {
        id: "service_reminder",
        name: "Service Reminder",
        type: "Service",
        content: "Hello! This is Choudhary Yamaha. Our records show your bike is due for its periodic service. Safety first! Book your slot now to keep your machine in peak condition. 🏍️"
    },
    {
        id: "promo_offer",
        name: "Festive Promotion",
        type: "Promotion",
        content: "Great news from Choudhary Yamaha! Enjoy 10% OFF on all genuine parts and accessories this week. Visit us today and upgrade your ride! 🛒"
    },
    {
        id: "check_in",
        name: "Customer Check-in",
        type: "Check-in",
        content: "Hi! How's your Yamaha performing? We hope you're enjoying every mile. If you need any assistance or a quick check-up, we're just a message away! 😊"
    },
    {
        id: "announcement",
        name: "New Launch Alert",
        type: "Announcement",
        content: "The legend has arrived! The new Yamaha R15M is now at our showroom. Come over for an exclusive test ride and feel the DNA of a champion. 🏁"
    }
];

export function CampaignModal({ isOpen, onClose, recipientIds, onSuccess }: CampaignModalProps) {
    const [campaignName, setCampaignName] = useState("");
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [customContent, setCustomContent] = useState("");
    const [isLaunching, setIsLaunching] = useState(false);
    const [step, setStep] = useState<'compose' | 'success'>('compose');

    const activeContent = isCustomMode ? customContent : selectedTemplate.content;

    const handleLaunch = async () => {
        if (!campaignName) {
            alert("Please give your campaign a name.");
            return;
        }

        if (isCustomMode && !customContent) {
            alert("Please enter your custom message.");
            return;
        }

        setIsLaunching(true);
        try {
            const res = await fetch(`${API_URL}/campaigns`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: campaignName,
                    type: isCustomMode ? "Custom" : selectedTemplate.type,
                    content: activeContent,
                    recipientIds: recipientIds
                })
            });
            const data = await res.json();
            if (data.success) {
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    // Reset state for next time
                    setStep('compose');
                    setCampaignName("");
                    setCustomContent("");
                }, 3000);
            }
        } catch (err) {
            console.error("Failed to launch campaign:", err);
            alert("Failed to launch campaign. Please check your connection.");
        } finally {
            setIsLaunching(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-racing-blue rounded-xl text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-foreground italic uppercase tracking-tighter">
                                {isCustomMode ? "Custom" : "Template"} <span className="text-racing-blue">WhatsApp Campaign</span>
                            </h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Targeting {recipientIds.length} Relational Customers</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'compose' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Reference Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Summer Service Drive'26"
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-racing-blue/50 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mode Selection</label>
                                            <div className="flex bg-muted rounded-lg p-1 border border-border">
                                                <button
                                                    onClick={() => setIsCustomMode(false)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                                                        !isCustomMode ? "bg-racing-blue text-white shadow-md shadow-racing-blue/20" : "text-muted-foreground hover:bg-white/10"
                                                    )}
                                                >
                                                    Templates
                                                </button>
                                                <button
                                                    onClick={() => setIsCustomMode(true)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                                                        isCustomMode ? "bg-racing-blue text-white shadow-md shadow-racing-blue/20" : "text-muted-foreground hover:bg-white/10"
                                                    )}
                                                >
                                                    Custom
                                                </button>
                                            </div>
                                        </div>

                                        {!isCustomMode ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {TEMPLATES.map((tmpl) => (
                                                    <button
                                                        key={tmpl.id}
                                                        onClick={() => setSelectedTemplate(tmpl)}
                                                        className={cn(
                                                            "px-4 py-3 rounded-xl text-left text-[9px] font-black uppercase tracking-widest border transition-all truncate",
                                                            selectedTemplate.id === tmpl.id
                                                                ? "bg-racing-blue border-racing-blue text-white shadow-lg shadow-racing-blue/20"
                                                                : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                                                        )}
                                                        title={tmpl.name}
                                                    >
                                                        {tmpl.name}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={customContent}
                                                    onChange={(e) => setCustomContent(e.target.value)}
                                                    placeholder="Type your unique campaign message here..."
                                                    className="w-full h-[140px] bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-racing-blue/50 transition-all resize-none shadow-inner"
                                                />
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase text-right italic">Note: Use a relational tone for better conversion.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-[320px] flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Live Preview</label>
                                    <div className="flex-1 bg-[#E4FED3] dark:bg-[#075E54]/20 border border-[#25D366]/20 rounded-2xl p-6 relative overflow-y-auto min-h-[300px]">
                                        <div className="bg-white dark:bg-[#075E54] p-4 rounded-xl rounded-tl-none shadow-md text-xs font-medium text-foreground relative animate-in slide-in-from-left-2 duration-300">
                                            <div className="absolute -left-2 top-0 w-0 h-0 border-t-8 border-t-white dark:border-t-[#075E54] border-l-8 border-l-transparent" />
                                            {activeContent || <span className="opacity-30 italic">Start typing to see preview...</span>}
                                            <div className="text-[8px] text-right mt-2 opacity-50 font-bold">12:34 PM ✓✓</div>
                                        </div>
                                    </div>
                                    <p className="text-[8px] font-bold text-muted-foreground text-center uppercase mt-2 italic">Individual personalized headers will be added</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLaunch}
                                disabled={isLaunching || !campaignName || (isCustomMode && !customContent)}
                                className="w-full py-5 bg-racing-blue text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-racing-blue/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                            >
                                {isLaunching ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Syncing with Meta Cloud API...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Launch Bulk {recipientIds.length} Messages
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce font-black text-2xl">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-display font-black text-foreground italic uppercase tracking-tighter">Campaign <span className="text-green-500">Launched!</span></h3>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-[300px]">Your relational messages are now being queued in the cloud for delivery.</p>
                            </div>
                            <div className="bg-muted/50 border border-border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Closing window in 3 seconds...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
