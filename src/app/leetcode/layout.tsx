import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "LeetCode Stats",
  description:
    "Adinarayana Thota's problem-solving progress: algorithms, data structures, and competitive programming practice.",
  path: "/leetcode",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
