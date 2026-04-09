"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import axios from "axios";
import { API_BASE_URL, API_URL } from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils/cn";

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'broadcast' | 'system' | 'service';
    isRead: boolean;
    createdAt: string;
}

export function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/notifications`, { withCredentials: true });
            if (res.data.success) {
                setNotifications(res.data.data);
                setUnreadCount(res.data.data.filter((n: Notification) => !n.isRead).length);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        const socket = io(API_BASE_URL);

        // Join the room based on user's phone number
        if (user.phone) {
            socket.emit("join", user.phone);
            console.log(`Socket joined room: ${user.phone}`);
        }

        socket.on("connect", () => {
            console.log("Socket.io connected successfully", socket.id);
        });

        socket.on("connect_error", (err: Error) => {
            console.error("Socket.io connection error:", err.message);
        });

        socket.on("new_notification", (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Optional: browser notification
            if ("Notification" in window && Notification.permission === "granted") {
                new window.Notification(notification.title, { body: notification.message });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, { withCredentials: true });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_URL}/notifications/read-all`, {}, { withCredentials: true });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    const nextState = !isOpen;
                    setIsOpen(nextState);
                    setIsSelected(nextState);
                }}
                className={cn(
                    "relative p-3 rounded-full transition-all group",
                    isSelected
                        ? "bg-racing-blue text-white border border-racing-blue" // selected state
                        : "bg-transparent text-muted-foreground border border-none hover:bg-muted hover:border-border" // normal state
                )}
            >
                <Bell
                    className={cn(
                        "w-4 h-4 transition-colors",
                        isSelected ? "text-white" : "text-muted-foreground group-hover:text-racing-blue",
                        unreadCount > 0 && "animate-tada"
                    )}
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-bounce-subtle">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-[calc(100vw-64px)] sm:w-80 md:w-[400px] bg-card/95 backdrop-blur-xl border-2 border-racing-blue/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-6 z-50 overflow-hidden"
                    >
                        <div className="px-6 pb-4 border-b border-border flex justify-between items-center">
                            <div>
                                <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-racing-blue drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]" />
                                    Notifications
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-60">Status: Real-time Active</p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[9px] font-black uppercase tracking-widest text-racing-blue hover:text-dark-racing transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 opacity-50">
                                        <Bell className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                        className={cn(
                                            "px-4 py-3 sm:px-8 sm:py-5 border-b border-border/50 hover:bg-muted/50 transition-all relative group/item cursor-pointer",
                                            !notification.isRead && "bg-racing-blue/5 border-l-4 border-l-racing-blue"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground pr-8">
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 group-hover/item:opacity-100 transition-opacity">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[14px] text-muted-foreground font-medium leading-relaxed">
                                            {notification.message}
                                        </p>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="absolute top-4 right-4 p-1 rounded-full bg-racing-blue/10 text-racing-blue opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110"
                                            >
                                                <Check className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="px-6 pt-4 border-t border-border mt-auto">
                                <button className="w-full text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-racing-blue transition-colors">
                                    View All History
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
