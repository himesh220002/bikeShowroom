"use client";

import { AdminSidebar } from "@/components/features/AdminSidebar";
import { AdminAuth } from "@/components/auth/AdminAuth";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useTheme();

    return (
        <AdminAuth>
            <div className="flex min-h-screen bg-background transition-colors duration-300">
                <AdminSidebar />
                <main className="flex-1 p-0 md:p-8 xl:p-0 overflow-y-auto xl:ml-64 pt-16 md:pt-20 xl:pt-0">
                    <div className="max-w-[1600px] mx-auto h-full">
                        <div className={`${theme} min-h-full bg-zinc-100 p-0 sm:p-4 md:rounded-[2rem] xl:rounded-none border border-border/50 shadow-2xl transition-colors duration-300`}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AdminAuth>
    );
}
