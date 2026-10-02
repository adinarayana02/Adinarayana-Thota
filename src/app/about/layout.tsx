import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Adinarayana Thota, an AI / ML Developer pursuing M.Tech in Information Technology at Andhra University, building Multi-Agent Systems, AI Agents, RAG pipelines, and high-performance FastAPI backends.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
