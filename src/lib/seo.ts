import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export const siteName = "Adinarayana Thota Portfolio";
export const defaultTitle = "Adinarayana Thota | AI / ML Developer & Generative AI Specialist";
export const defaultDescription =
  "AI/ML Developer specializing in Generative AI, Multi-Agent Systems, AI Agents, RAG pipelines, and scalable APIs. Explore my portfolio, projects, and experience.";

// Explicit because a route that sets its own `openGraph` drops the
// file-based image from app/opengraph-image.tsx.
export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Adinarayana Thota, AI / ML Developer & Generative AI Specialist",
};

export function absoluteUrl(path = "") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path}`;
}

/**
 * Metadata for a single route. Child `openGraph`/`twitter` objects replace the
 * parent's rather than merging, so the shared fields are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    // `absolute` because a nested layout's plain-string title stops the root
    // template from reaching its children (e.g. /blog -> /blog/[slug]).
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName,
      url: path,
      title: fullTitle,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
  };
}

export const personJsonLd = {
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Developer (AI / ML, Generative AI & AI Agents)",
  description: siteConfig.description,
  email: `mailto:${siteConfig.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Andhra University",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Vasireddy Venkatadri Institute of Technology",
    }
  ],
  knowsAbout: [
    "Generative AI",
    "Large Language Models",
    "AI Agents",
    "Multi-Agent Systems",
    "Retrieval-Augmented Generation",
    "LangChain",
    "ChromaDB",
    "Python",
    "FastAPI",
    "React.js",
    "TensorFlow",
    "Deep Learning",
  ],
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.instagram,
    siteConfig.links.youtube,
    siteConfig.links.substack,
  ],
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteName,
  inLanguage: "en",
  publisher: { "@id": `${siteConfig.url}/#person` },
};

/** Serialize JSON-LD for a <script> tag, escaping `<` so content can't close it. */
export function jsonLdScript(data: object) {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
    /</g,
    "\u003c"
  );
}
