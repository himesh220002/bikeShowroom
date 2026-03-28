import { AdminSidebar } from "@/components/features/AdminSidebar";
import { AdminAuth } from "@/components/auth/AdminAuth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuth>
            <div className="flex min-h-screen bg-background transition-colors duration-300">
                <AdminSidebar />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto lg:ml-64 pt-20 lg:pt-8">
                    <div className="max-w-7xl mx-auto h-full">
                        <div className="min-h-full p-4 md:p-8 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] border border-border/50 shadow-2xl transition-colors duration-300">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AdminAuth>
    );
}
