export default function BrochureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative">
            <div 
                className="bg-fixed-layer" 
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/xsr_green-pc.webp')` }}
            />
            <main className="font-sans relative z-10">{children}</main>
        </div>
    );
}
