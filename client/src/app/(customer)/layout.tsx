import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen fixed-bg dark">
            <Navbar />
            <main className="font-sans">{children}</main>
            <Footer />
        </div>
    );
}
