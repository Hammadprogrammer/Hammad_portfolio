import type { Metadata } from "next";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectGrid from "@/components/projects/ProjectGrid";

const description =
  "Selected work by Muhammad Hammad — live production platforms, full stack systems, dashboards and interactive 3D experiences built with React, Next.js and .NET.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Muhammad Hammad",
    description,
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <ProjectGrid />
    </>
  );
}
