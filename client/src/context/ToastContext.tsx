"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { setToastHandler } from '@/lib/api';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    React.useEffect(() => {
        setToastHandler(showToast);
    }, [showToast]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={cn(
                                "pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl",
                                toast.type === 'success' && "bg-green-500/10 border-green-500/20 text-green-500",
                                toast.type === 'error' && "bg-red-500/10 border-red-500/20 text-red-500",
                                toast.type === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-500",
                                toast.type === 'info' && "bg-blue-500/10 border-blue-500/20 text-blue-500"
                            )}
                        >
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}

                            <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
