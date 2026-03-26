"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    googleId: string;
    displayName: string;
    email: string;
    avatar: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
            if (res.data.success) {
                setUser(res.data.data);
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
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const logout = async () => {
        try {
            await axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
            setUser(null);
            window.location.href = '/';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
