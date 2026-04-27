import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Choudhary Yamaha Katihar | Authorized Yamaha Dealer & Service Center",
  description: "Official Yamaha showroom in Katihar. Best price for Yamaha R15 V4, MT-15 V2, FZ series, and Aerox 155 in Katihar. Authorized service center, genuine parts, and expert repair near Mirchaibari.",
  keywords: [
    "Choudhary Yamaha Katihar",
    "Yamaha showroom Katihar",
    "Yamaha service center Katihar",
    "Yamaha bike dealers Katihar",
    "Authorized Yamaha dealer Katihar",
    "Yamaha R15 V4 price Katihar",
    "Yamaha MT 15 V2 on-road price Katihar",
    "Yamaha bike repair Katihar",
    "Bike showroom near Mirchaibari Katihar"
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <Analytics />
      </body>
    </html>
  );
}
