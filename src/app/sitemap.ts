import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import { siteConfig, projects as fallbackProjects } from "@/lib/constants";

// Rebuild hourly so new blog posts and projects show up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticPaths = [
    "",
    "/about",
    "/skills",
    "/experience",
    "/projects",
    "/github",
    "/leetcode",
    "/certificates",
    "/blog",
    "/contact",
    "/resume",
  ];

  // No lastModified here: stamping every static page with the build time
  // teaches crawlers to ignore the field.
  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  let blogUrls: MetadataRoute.Sitemap = [];
  let projectUrls: MetadataRoute.Sitemap = fallbackProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  try {
    const conn = await dbConnect();
    if (conn) {
      // Fetch dynamic published blogs
      const blogs = await Blog.find({ published: true }).select("slug updatedAt").lean();
      blogUrls = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

      // Fetch dynamic projects
      const projects = await Project.find({}).select("slug updatedAt").lean();
      if (projects.length > 0) {
        projectUrls = projects.map((project: any) => ({
          url: `${baseUrl}/projects/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.debug("Sitemap generation database note:", error);
  }

  return [...staticUrls, ...blogUrls, ...projectUrls];
}
