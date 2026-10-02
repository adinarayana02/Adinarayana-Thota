import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Resume of Adinarayana Thota, Developer (AI / ML, Generative AI): projects (Hybrid AI Recruitment, Autonomous Enterprise Manager, Speech VAD, NeoDetect), experience at Telic Info Services, and technical skills.",
  path: "/resume",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
