import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import Story from "@/components/about/Story";
import Experience from "@/components/about/Experience";
import Skills from "@/components/about/Skills";
import Education from "@/components/about/Education";

export const metadata: Metadata = {
  title: "About",
  description:
    "Engineer. Builder. Problem solver. The story, experience and skills behind the code.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <Experience />
      <Skills />
      <Education />
    </>
  );
}
