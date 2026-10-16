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

const SITE_TITLE = "Ashay Tamrakar — Full-Stack AI Engineer";
const SITE_DESCRIPTION =
  "Full-Stack AI Engineer with 3+ years owning products end to end — full-stack depth in Node.js and Next.js, now building RAG and agentic AI systems in Python.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://portfolio-web-steel-eta.vercel.app",
    siteName: "Ashay Tamrakar",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // No `icons` override — `src/app/favicon.ico` is picked up by Next's file
  // convention. Re-add it once /public/assets/ATLOGO.png actually exists.
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
      {/* Extensions like Grammarly inject attributes here before React
          hydrates, which React reports as a mismatch. Suppression is shallow —
          it covers this element's own attributes, not the tree below. */}
      <body className="min-h-full flex flex-col " suppressHydrationWarning>
        <SmoothScrollProvider>
          <DebugProvider>
            <UniversalScrollLogger />
            {/* Global navbar — visible on every page, except while the
                fullscreen city view owns the viewport (see .city-view). */}
            <header
              data-site-header
              className="fixed inset-x-0 top-0 z-50 bg-white/60 backdrop-blur-md"
            >
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
