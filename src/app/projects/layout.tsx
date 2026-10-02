import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "AI/ML, Multi-Agent, and Vision projects by Adinarayana Thota, including NeoDetect, KARAM AI, AI Chatbot Platform, and AI Virtual Try-On, with system architectures and benchmarks.",
  path: "/projects",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
