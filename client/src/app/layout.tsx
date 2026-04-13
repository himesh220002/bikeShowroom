import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Choudhary Yamaha | Authorized Yamaha Dealer",
  description: "Experience the best of Yamaha at Choudhary Yamaha in Katihar. Book test rides, services, and explore the latest Yamaha motorcycles including R15, MT-15, and FZ series.",
  keywords: ["Choudhary Yamaha", "Yamaha bikes Katihar", "Yamaha service Katihar", "R15 Katihar", "MT-15 Katihar"],
  viewport: "width=device-width, initial-scale=1.0",
};

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ConfigProvider } from "@/components/providers/ConfigProvider";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-QHG9MD28EF`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QHG9MD28EF');
          `}
        </Script>

        <AuthProvider>
          <ToastProvider>
            <ConfigProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </ConfigProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
