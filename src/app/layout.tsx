import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TimelineProvider } from "@/providers/TimelineProvider";
import { DebugProvider } from "@/providers/DebugProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { UniversalScrollLogger } from "@/components/UniversalScrollLogger";
import { Navbar } from "@/components/sections/Nav/NavBar";
// import { DebugPanel } from "@/components/DebugPanel";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Use inter.variable in your HTML className

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Ashay Tamrakar — Full Stack Developer",
  icons: {
    icon: "/assets/ATLOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col ">
        <SmoothScrollProvider>
          <DebugProvider>
            <UniversalScrollLogger />
            {/* Global navbar — visible on every page */}
            <header className="fixed inset-x-0 top-0 z-50 bg-white/60 backdrop-blur-md">
              <Navbar />
            </header>
            <TimelineProvider>{children}</TimelineProvider>
            {/* <DebugPanel /> */}
          </DebugProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
