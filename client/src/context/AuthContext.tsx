"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

interface User {
    _id: string;
    googleId?: string;
    displayName: string;
    email: string;
    avatar?: string;
    phone?: string;
    role: 'user' | 'admin';
    authProvider: 'google' | 'local';
    vaultPinSet?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    loginLocal: (data: any) => Promise<{ success: boolean; message?: string }>;
    register: (data: any) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
            const data = res.data as any;
            if (data.success) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    const loginLocal = async (data: any) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, data, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                setUser(resData.data);
                return { success: true };
            }
            return { success: false, message: resData.message };
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (data: any) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, data, { withCredentials: true });
            const resData = res.data as any;
            if (resData.success) {
                setUser(resData.data);
                return { success: true };
            }
            return { success: false, message: resData.message };
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
            setUser(null);
            router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginLocal, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
