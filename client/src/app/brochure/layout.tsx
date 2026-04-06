export default function BrochureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative">
            <div className="bg-fixed-layer" />
            <main className="font-sans relative z-10">{children}</main>
        </div>
    );
}
