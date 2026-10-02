import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Professional work journey of Adinarayana Thota at TELIC INFO SERVICES PRIVATE LIMITED (AI/ML Developer) and Afrov Pvt Limited (Data Science Intern - NeoDetect), engineering Multi-Agent platforms, Voice AI, RAG pipelines, and Computer Vision fraud detection.",
  path: "/experience",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

