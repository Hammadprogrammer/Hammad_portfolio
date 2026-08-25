import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import ProjectDetail from "@/components/projects/ProjectDetail";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const description = `${project.tagline} ${project.description}`;
  const url = `/projects/${project.slug}`;

  return {
    title: project.title,
    description,
    keywords: project.tech,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${project.title} — Muhammad Hammad`,
      description,
      url,
      ...(project.cover ? { images: [{ url: project.cover }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Muhammad Hammad`,
      description,
      ...(project.cover ? { images: [project.cover] } : {}),
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.description,
    abstract: project.tagline,
    url: `${siteUrl}/projects/${project.slug}`,
    dateCreated: project.year,
    genre: project.category,
    keywords: project.tech.join(", "),
    creator: { "@type": "Person", name: "Muhammad Hammad", url: siteUrl },
    ...(project.cover ? { image: `${siteUrl}${project.cover}` } : {}),
  };

  return (
    <>
      <JsonLd data={schema} />
      <ProjectDetail project={project} />
    </>
  );
}
