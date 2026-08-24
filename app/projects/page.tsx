import type { Metadata } from "next";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectGrid from "@/components/projects/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work — systems, interfaces and digital experiences.",
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <ProjectGrid />
    </>
  );
}
