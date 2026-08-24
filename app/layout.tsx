import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/CustomCursor";
import SceneRoot from "@/components/three/SceneRoot";
import PageTransition from "@/components/layout/PageTransition";
import Preloader from "@/components/Preloader";
import ChapterNav from "@/components/ChapterNav";
import ScrollProgress from "@/components/ScrollProgress";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Muhammad Hammad — Full Stack Developer",
    template: "%s — Muhammad Hammad",
  },
  description:
    "Full Stack Developer building products where engineering meets experience. React, Next.js, .NET, and interactive 3D web.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain cursor-none-desktop">
        <SmoothScroll>
          <Preloader />
          <SceneRoot />
          <CustomCursor />
          <ChapterNav />
          <ScrollProgress />
          <Navbar />
          <PageTransition>
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
