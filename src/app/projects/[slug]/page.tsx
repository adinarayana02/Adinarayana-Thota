import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projects as fallbackProjects, siteConfig } from "@/lib/constants";
import { absoluteUrl, jsonLdScript, pageMetadata } from "@/lib/seo";
import type { IProject } from "@/types";
import { ProjectDetailView } from "./project-detail-view";

// Render on the server so crawlers get the case study, then refresh hourly.
export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

const getProject = cache(async (slug: string): Promise<IProject | null> => {
  try {
    const conn = await dbConnect();
    if (conn) {
      const project = await Project.findOne({ slug }).lean();
      // Round-trip through JSON so ObjectIds and Dates become plain props.
      if (project) return JSON.parse(JSON.stringify(project)) as IProject;
    }
  } catch (error) {
    console.debug("Project page database error, using fallback:", error);
  }
  return fallbackProjects.find((p) => p.slug === slug) ?? null;
});

export async function generateStaticParams() {
  return fallbackProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found", robots: { index: false } };

  const metadata = pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
  return {
    ...metadata,
    keywords: project.techStack,
    ...(project.image
      ? { openGraph: { ...metadata.openGraph, images: [project.image] } }
      : {}),
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const url = absoluteUrl(`/projects/${project.slug}`);
  const projectJsonLd = jsonLdScript({
    "@type": "SoftwareApplication",
    "@id": `${url}#project`,
    name: project.title,
    description: project.longDescription || project.description,
    url,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    keywords: project.techStack?.join(", "),
    ...(project.image ? { image: absoluteUrl(project.image) } : {}),
    ...(project.liveUrl ? { sameAs: [project.liveUrl, project.githubUrl].filter(Boolean) } : {}),
    author: { "@id": `${siteConfig.url}/#person`, "@type": "Person", name: siteConfig.name, url: siteConfig.url },
  });

  return (
    <>
      <ProjectDetailView project={project} />
      {/* After the view: shared styles target `main > section:first-child`. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: projectJsonLd }} />
    </>
  );
}
