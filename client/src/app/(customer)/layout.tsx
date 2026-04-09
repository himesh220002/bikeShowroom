import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative">
            <div className="bg-fixed-layer" />
            <Navbar />
            <main className="font-sans relative z-10">{children}</main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
