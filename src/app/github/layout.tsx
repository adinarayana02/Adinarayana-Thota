import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "GitHub Stats",
  description:
    "Adinarayana Thota's GitHub activity: repositories, languages, and contribution history across AI/ML, AI Agents, and full-stack projects.",
  path: "/github",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
