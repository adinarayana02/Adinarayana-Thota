import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/layout/chatbot";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/effects/command-palette";
import { TerminalModal } from "@/components/effects/terminal-modal";
import { siteConfig } from "@/lib/constants";
import {
  defaultDescription,
  defaultOgImage,
  defaultTitle,
  jsonLdScript,
  personJsonLd,
  siteName,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: "%s | Adinarayana Thota",
  },
  description: defaultDescription,
  keywords: [
    "Adinarayana Thota",
    "AI Developer",
    "ML Engineer",
    "AI Agents",
    "Generative AI",
    "Multi-Agent Systems",
    "Tech Talks 02",
    "Techtalks02-ai",
    "RAG",
    "LangChain",
    "FastAPI",
    "Python",
    "React",
    "Portfolio",
  ],
  authors: [{ name: "Adinarayana Thota", url: siteConfig.url }],
  creator: "Adinarayana Thota",
  // "./" resolves to each route's own path, so every page self-canonicalizes.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    title: defaultTitle,
    description:
      "AI/ML Developer specializing in Generative AI, Multi-Agent Systems, AI Agents, RAG pipelines, and scalable APIs.",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description:
      "AI/ML Developer specializing in Generative AI, Multi-Agent Systems, AI Agents, RAG pipelines, and scalable APIs.",
    images: [defaultOgImage.url],
  },
};

const siteJsonLd = jsonLdScript({ "@graph": [personJsonLd, websiteJsonLd] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: siteJsonLd }}
          />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Navbar />
          <main id="main-content" className="min-h-[50vh] pt-20 relative z-10">{children}</main>
          <CommandPalette />
          <TerminalModal />
          <Chatbot />
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                color: "var(--color-foreground)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
