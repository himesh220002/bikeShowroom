import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Choudhary Automobile | Authorized Yamaha Dealer",
  description: "Experience the best of Yamaha at Choudhary Automobile in Katihar. Book test rides, services, and explore the latest Yamaha motorcycles including R15, MT-15, and FZ series.",
  keywords: ["Choudhary Automobile", "Yamaha bikes Katihar", "Yamaha service Katihar", "R15 Katihar", "MT-15 Katihar"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main className="pt-24 md:pt-28">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
