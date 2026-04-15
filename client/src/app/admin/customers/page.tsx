"use client";

import { useEffect, useState } from "react";
import { CustomerMasterDatabase } from "@/components/features/CustomerMasterDatabase";
import { API_URL } from "@/lib/config";
import { Database, Search, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function MasterCustomerPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/customers`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            } else {
                setError(json.error || "Failed to fetch master data");
            }
        } catch (err) {
            setError("Network error fetching master data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8 min-h-screen bg-black p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-racing-blue" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-racing-blue">Unified Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic leading-none">
                        MASTER <span className="text-gradient">CUSTOMER DATABASE</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">
                        Deep Research Engine • Sales & Service Genealogy • Digital Twin Assets
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchData}
                        className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all flex items-center gap-3"
                    >
                        <Loader2 className={cn("w-4 h-4", loading && "animate-spin")} />
                        Refresh Intel
                    </button>
                    <div className="px-6 py-3 bg-racing-blue/10 border border-racing-blue/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-racing-blue">
                        Status: Operational
                    </div>
                </div>
            </div>

            {loading && !data.length ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-racing-blue/20 border-t-racing-blue rounded-full animate-spin" />
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">
                        Synchronizing Master Records...
                    </div>
                </div>
            ) : error ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6 p-12 bg-red-500/5 border border-red-500/10 rounded-[3rem]">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div className="text-center">
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter italic">Intelligence Failure</h3>
                        <p className="text-sm text-gray-500 font-medium mt-2">{error}</p>
                    </div>
                    <button onClick={fetchData} className="px-8 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        Retry Link
                    </button>
                </div>
            ) : (
                <CustomerMasterDatabase data={data} />
            )}
        </div>
    );
}
