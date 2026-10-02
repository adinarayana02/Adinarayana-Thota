import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills",
  description:
    "Adinarayana Thota's technical skills: Python, React.js, FastAPI, Django, LLMs, RAG, LangChain, ChromaDB, TensorFlow, DenseNet121, MySQL, PostgreSQL, AWS, and Docker.",
  path: "/skills",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
