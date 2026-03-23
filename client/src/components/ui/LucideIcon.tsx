"use client";

import {
    Gauge,
    Cpu,
    Binary,
    Shield,
    Zap,
    Fuel,
    Wind,
    Bike,
    Phone,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Clock,
    User,
    Info,
    Volume2,
    Rotate3d,
    Play,
    Pause,
    X
} from "lucide-react";

const iconMap = {
    Gauge,
    Cpu,
    Binary,
    Shield,
    Zap,
    Fuel,
    Wind,
    Bike,
    Phone,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Clock,
    User,
    Info,
    Volume2,
    Rotate3d,
    Play,
    Pause,
    X
};

export type IconName = keyof typeof iconMap;

interface LucideIconProps {
    name: string;
    className?: string;
}

export function LucideIcon({ name, className }: LucideIconProps) {
    const IconComponent = iconMap[name as IconName];

    if (!IconComponent) {
        // Fallback to a default icon or null
        return null;
    }

    return <IconComponent className={className} />;
}
