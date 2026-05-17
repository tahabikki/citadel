import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageContext";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citadel Hôtel | Luxury Hotel in Calais, France",
  description: "Experience luxury at Citadel Hôtel in Calais. Elegant rooms, fine dining, and exceptional service.",
};

export const viewport: Viewport = {
  themeColor: "#867050",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="icon" type="image/png" href="/logo/white_logo.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/logo/white_logo.png" sizes="64x64" />
        <link rel="icon" type="image/png" href="/logo/white_logo.png" sizes="128x128" />
        <link rel="icon" type="image/png" href="/logo/white_logo.png" sizes="256x256" />
        <link rel="apple-touch-icon" href="/logo/white_logo.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ScrollProgress />
            {children}
            <FloatingWidgets />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
