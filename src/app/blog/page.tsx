"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock3,
  FileText,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Linkedin, Substack } from "@/components/shared/brand-icons";
import { siteConfig } from "@/lib/constants";
import type { IBlog } from "@/types";

type FeedFilter = "all" | "article" | "linkedin";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function PostCard({ post, index }: { post: IBlog; index: number }) {
  const isLinkedIn = post.source === "linkedin";
  const isSubstack = post.source === "article" || post.externalUrl?.includes("substack");
  const publishedAt = post.publishedAt
    ? dateFormatter.format(new Date(post.publishedAt))
    : null;

  const card = (
    <motion.article
      initial={{ opacity: 0, y: 28, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: Math.min(index * 0.05, 0.25), duration: 0.45 }}
      className="anime-card blog-orbit-card group h-full overflow-hidden rounded-3xl"
    >
      <div className={`blog-orbit-card__visual ${isLinkedIn ? "is-linkedin" : isSubstack ? "is-substack" : ""}`}>
        <div className="blog-orbit-card__rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="blog-orbit-card__source">
          {isLinkedIn ? (
            <Linkedin size={24} />
          ) : isSubstack ? (
            <Substack size={24} className="text-[#ff6719]" />
          ) : (
            <BookOpen size={24} />
          )}
        </div>
        <span className="blog-orbit-card__index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex h-full flex-col p-6 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={
              isLinkedIn
                ? "linkedin-badge"
                : isSubstack
                ? "mono-pill border-[#ff6719]/40 bg-[#ff6719]/10 text-[#ff6719]"
                : "anime-badge"
            }
          >
            {isLinkedIn ? "LinkedIn Post" : isSubstack ? "Substack Article" : "Portfolio Article"}
          </span>
          {post.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="mono-pill">
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {publishedAt ? (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} aria-hidden="true" />
                {publishedAt}
              </span>
            ) : null}
            {!isLinkedIn && post.readingTime ? (
              <span className="flex items-center gap-1.5">
                <Clock3 size={13} aria-hidden="true" />
                {post.readingTime} min read
              </span>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            {isLinkedIn ? "View on LinkedIn" : "Read article"}
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );

  return isLinkedIn ? (
    <a
      href={post.externalUrl || siteConfig.links.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {card}
    </a>
  ) : (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      {card}
    </Link>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || data);
        } else {
          setPosts([]);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(
    () =>
      activeFilter === "all"
        ? posts
        : posts.filter((post) =>
            activeFilter === "linkedin"
              ? post.source === "linkedin"
              : post.source !== "linkedin"
          ),
    [activeFilter, posts]
  );

  const linkedinCount = posts.filter((post) => post.source === "linkedin").length;
  const articleCount = posts.length - linkedinCount;

  return (
    <>
      <section className="py-20 grid-pattern">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="eyebrow mx-auto">
              <Layers3 size={13} aria-hidden="true" />
              Substack Articles &amp; Insights
            </span>
            <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] md:text-6xl lg:text-7xl">
              AI Systems, Agents &amp;
              <br />
              <span className="gradient-text">Substack Articles.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Practical engineering breakdowns on Large Language Models, Multi-Agent architectures, Advanced RAG pipelines, and AI evaluation by <strong>Thota Adinarayana (@techtalks02)</strong>.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={siteConfig.links.substack || "https://thotaadinarayana.substack.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn bg-[#ff6719] hover:bg-[#ff5600] text-white border-none shadow-lg shadow-[#ff6719]/25"
              >
                <Substack size={16} />
                Subscribe on Substack
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn-outline"
              >
                <Linkedin size={16} />
                LinkedIn
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/50 py-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter posts">
            {[
              { value: "all", label: "All Posts", count: posts.length },
              { value: "article", label: "Substack Articles", count: articleCount },
              { value: "linkedin", label: "LinkedIn Posts", count: linkedinCount },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value as FeedFilter)}
                className={`min-h-11 rounded-xl border px-4 text-xs font-semibold transition-colors ${
                  activeFilter === filter.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {filter.label} <span className="ml-1 opacity-70">{filter.count}</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Curated from Thota’s Substack &amp; LinkedIn
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="grid gap-7 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="anime-card h-[420px] animate-shimmer rounded-3xl"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="anime-card mx-auto max-w-2xl rounded-3xl p-10 text-center sm:p-14"
            >
              <div className="mx-auto grid size-20 place-items-center rounded-2xl bg-[#ff6719]/10 text-[#ff6719]">
                {activeFilter === "linkedin" ? (
                  <Linkedin size={34} />
                ) : (
                  <Substack size={34} />
                )}
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-[-0.04em]">
                {activeFilter === "linkedin"
                  ? "LinkedIn sync is ready"
                  : "Explore Substack Articles"}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {activeFilter === "linkedin"
                  ? "Add a LinkedIn post from Admin or sync directly with LinkedIn."
                  : "Read the latest in-depth AI breakdowns on Substack (@techtalks02)."}
              </p>
            </motion.div>
          ) : (
            <div className="grid items-stretch gap-7 md:grid-cols-2">
              {filteredPosts.map((post, index) => (
                <PostCard
                  key={post._id || post.slug}
                  post={post}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
