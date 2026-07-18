import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/api/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Divelop ESG",
    default: "Divelop ESG Platform",
  },
  description:
    "Plataforma centralizada para la gestión del proceso de reporting de sostenibilidad e indicadores ESG — Divelop Sostenibilidad S.A.C.",
  keywords: ["ESG", "GRI", "SASB", "ODS", "sostenibilidad", "reporting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full animated-bg antialiased">
        <AuthProvider>
          <TooltipProvider delayDuration={300}>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
