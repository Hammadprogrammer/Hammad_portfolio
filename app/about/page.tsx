import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import DeferredAbout from "@/components/about/DeferredAbout";

const description =
  "The story, experience and skills behind the code — Full Stack Developer at 7CTECH, Karachi. React, Next.js, ASP.NET Core, Node.js and interactive 3D.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Muhammad Hammad",
    description,
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <DeferredAbout />
    </>
  );
}
