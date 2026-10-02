import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { fallbackBlogs, siteConfig } from "@/lib/constants";
import { absoluteUrl, jsonLdScript, pageMetadata } from "@/lib/seo";
import type { IBlog } from "@/types";
import { BlogPostView } from "./blog-post-view";

// Render on the server so crawlers get the article, then refresh hourly.
export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

const getPost = cache(async (slug: string): Promise<IBlog | null> => {
  try {
    const conn = await dbConnect();
    if (conn) {
      const post = await Blog.findOne({ slug, published: true }).lean();
      if (post) {
        return JSON.parse(JSON.stringify(post)) as IBlog;
      }
    }
  } catch (error) {
    console.debug("Blog page database lookup failed, checking fallback:", error);
  }

  const fallback = fallbackBlogs.find((b) => b.slug === slug);
  return fallback ? (JSON.parse(JSON.stringify(fallback)) as IBlog) : null;
});

export async function generateStaticParams() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const posts = await Blog.find({ published: true }).select("slug").lean();
      if (posts && posts.length > 0) {
        return posts.map((post) => ({ slug: post.slug }));
      }
    }
  } catch (error) {
    console.debug("Blog static params database lookup failed, using fallback:", error);
  }
  return fallbackBlogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found", robots: { index: false } };

  const metadata = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
  });
  return {
    ...metadata,
    keywords: post.tags,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: [siteConfig.url],
      tags: post.tags,
      images: post.coverImage ? [post.coverImage] : metadata.openGraph?.images,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const articleJsonLd = jsonLdScript({
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt ?? post.publishedAt ?? post.createdAt,
    keywords: post.tags?.join(", "),
    image: post.coverImage || absoluteUrl("/opengraph-image"),
    author: { "@id": `${siteConfig.url}/#person`, "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@id": `${siteConfig.url}/#person` },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  });

  return (
    <>
      <BlogPostView post={post} />
      {/* After the view: shared styles target `main > section:first-child`. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
    </>
  );
}
