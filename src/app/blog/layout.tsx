import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Notes, build logs, and tech insights from Adinarayana Thota on AI engineering, autonomous multi-agent systems, and GenAI architectures.",
  path: "/blog",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
