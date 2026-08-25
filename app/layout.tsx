import type { Metadata, Viewport } from "next";
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
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const description =
  "Muhammad Hammad — Full Stack Developer in Karachi building fast, scalable web applications with React, Next.js, TypeScript, ASP.NET Core and Node.js.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Hammad — Full Stack Developer",
    template: "%s — Muhammad Hammad",
  },
  description,
  applicationName: "Muhammad Hammad — Portfolio",
  authors: [{ name: "Muhammad Hammad", url: siteUrl }],
  creator: "Muhammad Hammad",
  publisher: "Muhammad Hammad",
  keywords: [
    "Muhammad Hammad",
    "Full Stack Developer",
    "Web Developer Karachi",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "ASP.NET Core",
    "Node.js",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Muhammad Hammad — Full Stack Developer",
    title: "Muhammad Hammad — Full Stack Developer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hammad — Full Stack Developer",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#04060d",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Hammad",
  url: siteUrl,
  jobTitle: "Full Stack Developer",
  description,
  email: "mailto:hammadzahid221@gmail.com",
  telephone: "+92-311-8270539",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karachi",
    addressCountry: "PK",
  },
  worksFor: { "@type": "Organization", name: "7CTECH" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Hamdard University, Karachi" },
    { "@type": "EducationalOrganization", name: "Saylani Mass IT Training" },
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "ASP.NET Core",
    "C#",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "Three.js",
  ],
  sameAs: [
    "https://github.com/Hammadprogrammer",
    "https://www.linkedin.com/in/hammad-zahid-543a652a6/",
  ],
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Muhammad Hammad — Full Stack Developer",
  url: siteUrl,
  description,
  inLanguage: "en",
  author: { "@type": "Person", name: "Muhammad Hammad" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain cursor-none-desktop">
        <JsonLd data={personSchema} />
        <JsonLd data={siteSchema} />
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
