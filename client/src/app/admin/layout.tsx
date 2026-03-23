import { AdminSidebar } from "@/components/features/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background transition-colors duration-300">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-24 md:pt-32 lg:ml-64">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="min-h-full p-4 md:p-8 bg-gray-200 dark:bg-gray-800 rounded-[2rem] transition-colors duration-300 shadow-xl border border-border/50">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
