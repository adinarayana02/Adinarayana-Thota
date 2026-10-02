import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Certifications & Honors",
  description:
    "Certifications and achievements earned by Adinarayana Thota in AI, machine learning, cloud computing, and entrepreneurship.",
  path: "/certificates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
