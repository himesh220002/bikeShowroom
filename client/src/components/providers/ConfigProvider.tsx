"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "@/lib/config";

interface ShowroomConfig {
    showroomPhone: string;
    showroomEmail: string;
    showroomAddress: string;
    showroomMap: string;
}

interface ConfigContextType {
    config: ShowroomConfig;
    loading: boolean;
    refreshConfig: () => Promise<void>;
}

const defaultConfig: ShowroomConfig = {
    showroomPhone: "+917004100062",
    showroomEmail: "choudharyyamaha.ktr@gmail.com",
    showroomAddress: "CHOUDHARY YAMAHA, Manihari mor, Mirchaibari, Katihar, Bihar - 854105",
    showroomMap: "https://maps.app.goo.gl/oL32WDatncPRcLCC6"
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<ShowroomConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/config`);
            const data = await res.json();
            if (data.success) {
                setConfig({
                    showroomPhone: data.data.showroomPhone || defaultConfig.showroomPhone,
                    showroomEmail: data.data.showroomEmail || defaultConfig.showroomEmail,
                    showroomAddress: data.data.showroomAddress || defaultConfig.showroomAddress,
                    showroomMap: data.data.showroomMap || defaultConfig.showroomMap
                });
            }
        } catch (err) {
            console.error("Config fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
}
