"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Filter,
  Code2,
  Sparkles,
  ArrowRight,
  Layers,
  Activity,
  Zap,
  Briefcase,
  Mail,
  Trophy,
  Cpu,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
} from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import { Floating3DCard } from "@/components/effects/floating-3d-card";
import { ProjectPreviewVisual } from "@/components/shared/project-preview-visual";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { projects as fallbackProjects, siteConfig } from "@/lib/constants";
import type { IProject } from "@/types";

const categoryOptions = [
  { label: "All Projects", value: "All" },
  { label: "Agentic AI & LLMs", value: "AI" },
  { label: "Full-Stack & APIs", value: "FullStack" },
  { label: "Automation & Multi-Agent", value: "Automation" },
];

const popularTechFilters = [
  "LangGraph",
  "FastAPI",
  "Qdrant",
  "ChromaDB",
  "TensorFlow",
  "Whisper",
  "DenseNet121",
  "Llama",
  "MLflow",
  "React.js",
  "Google Gemini",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          const array = Array.isArray(data) ? data : (data.projects || data);
          if (Array.isArray(array) && array.length > 0) {
            setProjects(array);
          } else {
            setProjects(fallbackProjects);
          }
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      
      const matchesTech =
        !selectedTech ||
        p.techStack.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.techStack.some((t) => t.toLowerCase().includes(query)) ||
        (p.challenges && p.challenges.toLowerCase().includes(query)) ||
        (p.solutions && p.solutions.toLowerCase().includes(query));

      return matchesCategory && matchesTech && matchesSearch;
    });
  }, [projects, activeCategory, selectedTech, search]);

  const stats = useMemo(() => {
    const total = projects.length;
    const aiCount = projects.filter((p) => p.category === "AI" || p.techStack.some(t => t.includes("Agent") || t.includes("Lang") || t.includes("Gemini"))).length;
    const ragCount = projects.filter((p) => p.techStack.includes("RAG") || p.description.includes("RAG") || p.techStack.includes("Qdrant") || p.techStack.includes("ChromaDB")).length;
    return { total, aiCount, ragCount };
  }, [projects]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden border-b border-border/40 py-20 lg:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-eyebrow">
                <Code2 size={14} className="text-primary" />
                Production Systems & Case Studies
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Trophy size={13} />
                Hackathon Winner
              </span>
            </div>

            <h1 className="editorial-display mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Engineered for Production. Powered by Agentic AI.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Explore deployed multi-agent platforms, hybrid RAG retrieval pipelines, real-time speech ML architectures, computer vision fraud detection systems, and high-throughput FastAPI backends.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Layers size={13} className="text-primary" />
                  <span>Total Projects</span>
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-foreground">{stats.total}</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Cpu size={13} className="text-emerald-500" />
                  <span>Agentic Systems</span>
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-emerald-500">{stats.aiCount}</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Zap size={13} className="text-amber-500" />
                  <span>Hybrid RAG Engines</span>
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-amber-500">{stats.ragCount}</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Activity size={13} className="text-primary" />
                  <span>Avg Precision</span>
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-primary">96.2%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filters, Tech Pills & Search */}
      <section className="sticky top-16 z-20 border-b border-border/60 bg-background/90 backdrop-blur-xl py-4 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            {/* Top Row: Categories + Search + View Mode */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {categoryOptions.map((cat) => {
                  const count =
                    cat.value === "All"
                      ? projects.length
                      : projects.filter((p) => p.category === cat.value).length;

                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setActiveCategory(cat.value);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeCategory === cat.value
                          ? "bg-foreground text-background shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border/60"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          activeCategory === cat.value
                            ? "bg-background/20 text-background"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search + View Mode Switcher */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    name="project-search"
                    aria-label="Search projects by title, tech stack, or description"
                    autoComplete="off"
                    placeholder="Search stack, agent, RAG…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="anime-input w-full pl-9 pr-8 py-1.5 text-xs font-mono"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* View Mode Buttons */}
                <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-md p-1.5 transition ${
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-md p-1.5 transition ${
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Detailed List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Quick Tech Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs text-muted-foreground">
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground/80">Filter by tech:</span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {popularTechFilters.map((tech) => {
                  const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
                  return (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(isSelected ? null : tech)}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-mono transition whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40"
                      }`}
                    >
                      {tech}
                      {isSelected && <X size={10} className="ml-0.5" />}
                    </button>
                  );
                })}
                {selectedTech && (
                  <button
                    onClick={() => setSelectedTech(null)}
                    className="text-[11px] font-mono text-primary underline ml-1 whitespace-nowrap"
                  >
                    Reset tech
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid / List */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Showing {filtered.length} {filtered.length === 1 ? "Project" : "Projects"}
              </span>
              {(search || selectedTech || activeCategory !== "All") && (
                <span className="text-xs font-mono text-muted-foreground">
                  (filtered results)
                </span>
              )}
            </div>

            {(search || selectedTech || activeCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedTech(null);
                  setActiveCategory("All");
                }}
                className="text-xs font-mono text-primary hover:underline"
              >
                Clear all active filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-88 rounded-2xl bg-card border border-border animate-shimmer"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground">No matching projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                No projects matched your criteria. Try adjusting your search keyword or selected technology filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedTech(null);
                  setActiveCategory("All");
                }}
                className="mt-5 anime-btn-outline text-xs"
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 gap-8 md:grid-cols-2"
              >
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="h-full"
                  >
                    <Floating3DCard depth={8} glareColor="rgba(37, 99, 235, 0.12)" className="h-full">
                      <article className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/90 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl h-full backdrop-blur-sm">
                        <div>
                          {/* Visual Preview */}
                          <Link href={`/projects/${project.slug}`} className="block overflow-hidden rounded-xl group-hover:opacity-95 transition-opacity">
                            <ProjectPreviewVisual
                              image={project.image}
                              title={project.title}
                              label={project.category}
                            />
                          </Link>

                          <div className="pt-4">
                            {/* Tags Header */}
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold text-foreground border border-border/50">
                                {project.category}
                              </span>
                              {project.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                  <Star size={10} fill="currentColor" />
                                  Featured Case Study
                                </span>
                              )}
                            </div>

                            {/* Title & Description */}
                            <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              <Link href={`/projects/${project.slug}`}>
                                {project.title}
                              </Link>
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {project.description}
                            </p>

                            {/* Features Highlights */}
                            {project.features && project.features.length > 0 && (
                              <ul className="mt-3.5 space-y-1.5 list-none pl-0">
                                {project.features.slice(0, 2).map((feat, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-muted-foreground flex items-start gap-1.5"
                                  >
                                    <Sparkles size={12} className="text-primary mt-0.5 shrink-0" />
                                    <span className="line-clamp-1">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Key Performance Metrics Bar */}
                            {project.metrics && (
                              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                                {Object.entries(project.metrics).slice(0, 3).map(([key, val]) => (
                                  <div
                                    key={key}
                                    className="rounded-lg bg-muted/50 p-2 text-center border border-border/30"
                                  >
                                    <div
                                      className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground truncate"
                                      title={key}
                                    >
                                      {key}
                                    </div>
                                    <div
                                      className="mt-0.5 font-mono text-xs font-bold text-foreground truncate"
                                      title={val}
                                    >
                                      {val}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Technology Stack Pills */}
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {project.techStack.slice(0, 6).map((tech) => (
                                <button
                                  key={tech}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedTech(tech);
                                  }}
                                  className="rounded-md bg-muted/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted cursor-pointer transition"
                                >
                                  {tech}
                                </button>
                              ))}
                              {project.techStack.length > 6 && (
                                <span className="rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40">
                                  +{project.techStack.length - 6}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between gap-3">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary hover:underline"
                          >
                            <span>Read Case Study</span>
                            <ArrowRight size={13} />
                          </Link>

                          <div className="flex items-center gap-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
                              >
                                <Github size={12} />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    </Floating3DCard>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Detailed List / Matrix View */
            <div className="space-y-4">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-border/70 bg-card/80 p-5 backdrop-blur hover:border-primary/40 transition-all shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10px] font-semibold text-foreground border border-border/50">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            Featured
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                          <Link href={`/projects/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h3>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>

                      {project.challenges && project.solutions && (
                        <div className="text-xs text-muted-foreground/90 bg-muted/30 p-2.5 rounded-lg border border-border/30 space-y-1">
                          <div><strong className="text-foreground font-semibold">Challenge:</strong> {project.challenges}</div>
                          <div><strong className="text-foreground font-semibold">Solution:</strong> {project.solutions}</div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-muted/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 lg:w-72 lg:shrink-0 lg:border-l lg:border-border/40 lg:pl-5">
                      {project.metrics && (
                        <div className="space-y-1.5 text-xs font-mono">
                          {Object.entries(project.metrics).slice(0, 3).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center text-muted-foreground border-b border-border/20 pb-1">
                              <span className="capitalize text-[11px]">{k}:</span>
                              <span className="font-bold text-foreground">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                          <span>Case Study</span>
                          <ArrowRight size={13} />
                        </Link>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-border bg-muted/50 text-foreground hover:bg-muted"
                            title="View Source Code"
                          >
                            <Github size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="border-t border-border/60 bg-card/20 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <span className="editorial-eyebrow">
                <Briefcase size={14} />
                Collaborate with Adinarayana
              </span>
              <h2 className="editorial-display mt-6 max-w-2xl text-3xl md:text-5xl">
                Have a complex AI system or platform to build?
              </h2>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                Let&apos;s turn your high-level vision into scalable production architectures with Multi-Agent workflows, Hybrid RAG, and high-performance FastAPI microservices.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact" className="anime-btn">
                  <Mail size={16} />
                  <span>Get in touch for projects</span>
                </Link>
                <Link href="/skills" className="anime-btn-outline">
                  <Layers size={16} />
                  <span>View Tech Capabilities</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

