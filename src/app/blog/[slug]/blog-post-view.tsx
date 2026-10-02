"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Clock,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Substack } from "@/components/shared/brand-icons";
import { siteConfig } from "@/lib/constants";
import type { IBlog } from "@/types";

export function BlogPostView({ post }: { post: IBlog }) {
  // Estimate reading time
  const readingTime =
    post.readingTime ||
    Math.max(
      1,
      Math.ceil((post.content?.split(/\s+/).length || 0) / 200)
    );

  const substackUrl =
    post.externalUrl ||
    siteConfig.links.substack ||
    "https://thotaadinarayana.substack.com";

  return (
    <>
      {/* Header */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Articles
              </Link>
              <a
                href={substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ff6719]/10 text-[#ff6719] hover:bg-[#ff6719]/20 transition-colors border border-[#ff6719]/20"
              >
                <Substack size={14} />
                <span>Read on Substack</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="mono-pill text-xs">
                <BookOpen size={12} className="inline mr-1" />
                Tech Talks by Adinarayana
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight tracking-[-0.04em]">
              {post.title}
            </h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {post.description}
            </p>

            <div className="mt-6 flex items-center flex-wrap gap-4 text-sm text-muted-foreground border-t border-border/50 pt-4">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-heading)] prose-a:text-primary prose-code:font-[family-name:var(--font-mono)] prose-code:text-sm prose-pre:bg-card prose-pre:border prose-pre:border-border leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-3 text-foreground">$1</h3>')
                .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground border-b border-border/40 pb-2">$1</h2>')
                .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground border-b border-border/40 pb-2">$1</h2>')
                .replace(/```([\s\S]*?)```/gim, '<pre class="p-4 rounded-xl bg-card border border-border my-6 overflow-x-auto text-sm font-mono"><code>$1</code></pre>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
                .replace(/\*(.*?)\*/gim, "<em>$1</em>")
                .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-muted text-primary text-sm font-mono">$1</code>')
                .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">$1</blockquote>')
                .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc text-muted-foreground mb-1">$1</li>')
                .replace(/\n\n/gim, '<p class="my-4 text-muted-foreground leading-relaxed"></p>')
                .replace(/\n/gim, "<br />"),
            }}
          />

          {/* Substack Author CTA Card */}
          <div className="mt-16 rounded-3xl border border-[#ff6719]/30 bg-gradient-to-br from-[#ff6719]/10 via-background to-card p-8 sm:p-10 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-[#ff6719] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  <Substack size={28} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest font-mono text-[#ff6719] font-bold">
                    Substack Publication
                  </span>
                  <h3 className="text-xl font-bold text-foreground">
                    Thota’s Substack (@techtalks02)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    Exploring Large Language Models, Agentic Architectures, System Design, and AI Innovation.
                  </p>
                </div>
              </div>
              <a
                href={substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn px-6 py-3 whitespace-nowrap bg-[#ff6719] hover:bg-[#ff5600] text-white text-sm font-semibold rounded-xl shadow-md"
              >
                <Substack size={16} />
                Subscribe on Substack
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

