"use client";

import { type CSSProperties, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  GitBranch,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Rocket,
  Server,
  Sliders,
  Terminal,
  Video,
  Sparkles,
} from "lucide-react";
import { Magnetic } from "@/components/effects/magnetic";
import { ScrollRail } from "@/components/effects/scroll-rail";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Github, Linkedin, Instagram, Youtube } from "@/components/shared/brand-icons";
import { ProjectPreviewVisual } from "@/components/shared/project-preview-visual";
import { usePortfolio } from "@/hooks/usePortfolio";
import { HeroVideoCard } from "@/components/home/hero-video-card";
import { education as fallbackEducation, siteConfig } from "@/lib/constants";

const stats = [
  { icon: Briefcase, label: "Work roles", value: 4, suffix: "", note: "AI + full-stack delivery" },
  { icon: Rocket, label: "Projects shipped", value: 6, suffix: "+", note: "case-study ready builds" },
  { icon: Code2, label: "DSA problems", value: 200, suffix: "+", note: "algorithmic fundamentals" },
  { icon: Award, label: "Certificates", value: 5, suffix: "+", note: "GenAI, RAG, Agents" },
];

const hiringTickerItems = [
  "Available for freelance projects",
  "Open to AI & full-stack roles",
  "RAG systems",
  "Agentic workflows",
  "MERN + Next.js",
  "Admin panels",
  "Automation systems",
  "Remote-ready from India",
];


const capabilities = [
  {
    title: "AI product MVPs",
    description:
      "Turn an AI idea into a usable product with scoped flows, model integration, auth, admin controls, and polished UX.",
    icon: Cpu,
    points: ["RAG systems", "LLM apps", "MVP delivery"],
  },
  {
    title: "Full-time engineering",
    description:
      "Join product teams as an AI/full-stack engineer who can ship frontend, backend, database models, and production UI.",
    icon: Globe,
    points: ["Next.js", "Node APIs", "MongoDB"],
  },
  {
    title: "Automation systems",
    description:
      "Build workflow tools for lead ops, reporting, reminders, notifications, CRM updates, and repetitive business tasks.",
    icon: Database,
    points: ["Internal tools", "Integrations", "Dashboards"],
  },
  {
    title: "Production handoff",
    description:
      "Package projects with clean deployment, environment setup, docs, performance checks, and maintainable ownership.",
    icon: Terminal,
    points: ["Vercel", "Docs", "Handoff"],
  },
];

const engineeringSignals = [
  {
    title: "Readable systems",
    body: "Every featured project is structured around the problem, architecture, constraints, and measurable outcome.",
    meta: "Case studies",
    icon: Code2,
  },
  {
    title: "AI with boundaries",
    body: "LLM features are treated like production surfaces: context windows, fallback paths, retrieval quality, and cost all matter.",
    meta: "GenAI / RAG",
    icon: Cpu,
  },
  {
    title: "Interface craft",
    body: "The UI is now editorial, restrained, and content-first while keeping the interactive demos that make the portfolio memorable.",
    meta: "UX system",
    icon: Sliders,
  },
];

const OVERLAP_TONES = [
  "overlap-tone-a",
  "overlap-tone-b",
  "overlap-tone-c",
  "overlap-tone-d",
];

/**
 * Props for one panel in the overlapping scroll stack. `index` drives both the
 * paint order (higher index rides over lower) and the surface tint rotation.
 */
const overlapPanel = (index: number, ...extraClasses: string[]) => ({
  className: [
    "overlap-scroll-section",
    OVERLAP_TONES[(index - 1) % OVERLAP_TONES.length],
    index === 1 ? "is-lead" : "",
    ...extraClasses,
  ]
    .filter(Boolean)
    .join(" "),
  style: { "--overlap-index": index } as CSSProperties,
});

export default function HomePage() {
  const { data } = usePortfolio();
  const { profile, experience, projects, education } = data;
  const [copied, setCopied] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (a.highlight && !b.highlight) return -1;
        if (!a.highlight && b.highlight) return 1;
        return b.year.localeCompare(a.year);
      }),
    [projects]
  );

  const featuredProjects = sortedProjects.slice(0, 4);
  const hiringBrief = useMemo(
    () =>
      `# HIRE_ADINARAYANA.md

Candidate: ${profile.name || "Adinarayana Thota"}
Role fit: Developer (AI / ML, Generative AI & Agentic Systems)
Location: ${profile.location || "Andhra Pradesh, India"} - remote-ready

Hire for:
- Agentic AI Engineering & Multi-Agent Systems (LangGraph, AutoGPT)
- Hybrid RAG Pipelines & Vector DBs (Qdrant, ChromaDB, BGE Embeddings)
- Production Speech ML Pipelines & Real-Time Voice Activity Detection (Whisper)
- High-Performance FastAPI Backends, Async I/O, & MLflow Monitoring
- Enterprise Knowledge Systems with Cognitive Memory & Entity Linking
- AI Video & Tech Content Creation (@techtalks02, @Techtalks02-ai)

Proof points:
- Architected Hybrid AI Recruitment Platform & Autonomous Enterprise Manager
- Built Voice Activity Detection Speech ML Pipeline & AI Resort Assistant
- Data Science Intern @ Afrov Pvt Limited (NeoDetect Fraud Detection)
- Developer experience @ TELIC INFO SERVICES PRIVATE LIMITED
- National AI Hackathon Winner (Virtual Try-On)
- M.Tech IT @ Andhra University (CGPA: 8.5/10)

Contact & Channels:
- Email: ${profile.social.email || siteConfig.email}
- LinkedIn: ${profile.social.linkedin || siteConfig.links.linkedin}
- Instagram: ${profile.social.instagram || siteConfig.links.instagram} (AI Agent Videos)
- YouTube: ${profile.social.youtube || siteConfig.links.youtube} (TechTalks02 AI)`,
    [
      profile.location,
      profile.name,
      profile.social.email,
      profile.social.linkedin,
      profile.social.instagram,
      profile.social.youtube,
    ]
  );
  const displayedEducation = [
    ...education,
    ...fallbackEducation.filter(
      (fallback) =>
        !education.some(
          (item) =>
            item.institution.toLowerCase() === fallback.institution.toLowerCase()
        )
    ),
  ].slice(0, 3);

  const handleCopyEmail = () => {
    const email = profile.social.email || siteConfig.email;
    void navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHiringBrief = () => {
    void navigator.clipboard.writeText(hiringBrief);
    setBriefCopied(true);
    setTimeout(() => setBriefCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <ScrollRail />

      <section id="hero" className="editorial-hero scroll-mt-24">
        <div className="editorial-container hero-layout">
          <ScrollReveal>
            <div className="hero-copy-card flex max-w-4xl flex-col items-start text-left">
              <span className="editorial-eyebrow">
                <span className="status-dot" />
                Available for freelance projects - AI & full-stack roles
              </span>

              <h1 className="editorial-display mt-8">
                Hire me to build AI products.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                I&apos;m {profile.shortName || "Adinarayana"} - {profile.tagline}. I help teams and clients turn AI ideas into reliable products: Multi-Agent systems,
                RAG pipelines, fraud detection models, and high-performance FastAPI backends.
              </p>

              <div className="mt-8 flex flex-wrap justify-start gap-3">
                {profile.social.resume || siteConfig.links.resume ? (
                  <Magnetic strength={0.18}>
                    <a
                      href={profile.social.resume || siteConfig.links.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="anime-btn"
                    >
                      <Download size={16} />
                      Download resume
                    </a>
                  </Magnetic>
                ) : null}
                <Magnetic strength={0.18}>
                  <Link href="/contact" className="anime-btn-outline">
                    <Mail size={16} />
                    Hire me for freelance
                  </Link>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <Link href="/contact?type=company" className="anime-btn-outline">
                    <Briefcase size={16} />
                    Hire me full-time
                  </Link>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <Link href="/blog" className="anime-btn-outline">
                    <Code2 size={16} />
                    Read blog
                  </Link>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <a
                    href={profile.social.instagram || siteConfig.links.instagram || "https://www.instagram.com/techtalks02/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anime-btn-outline"
                  >
                    <Instagram size={16} />
                    Tech page (@techtalks02)
                  </a>
                </Magnetic>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <HeroVideoCard />
          </ScrollReveal>
        </div>
      </section>

      <section className="agent-ticker-section" aria-label="Hiring availability highlights">
        <div className="agent-ticker">
          <div className="agent-ticker__track">
            {[...hiringTickerItems, ...hiringTickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section {...overlapPanel(1, "editorial-section")}>
        <div className="editorial-container">
          <div className="proof-header">
            <span className="editorial-eyebrow">
              <Award size={14} />
              Proof in numbers
            </span>
            <h2>Signals clients and hiring teams can scan fast.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.04}>
                <motion.div
                  className="editorial-stat-card"
                  whileHover={{ y: -6, rotateX: 2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <stat.icon size={19} className="text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="text-5xl font-black tracking-[-0.07em]">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em]">{stat.label}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{stat.note}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      <section id="about" {...overlapPanel(3, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-20">
            <ScrollReveal>
              <motion.div
                className="editorial-portrait-card"
                whileInView={{ rotate: 0, scale: 1 }}
                initial={{ rotate: -1.5, scale: 0.97 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="editorial-orbit-mark">
                <Code2 size={72} strokeWidth={1.3} />
                </div>
                <div className="editorial-floating-note editorial-floating-note--one">
                  <span>Location</span>
                  <strong>{profile.location}</strong>
                </div>
                <div className="editorial-floating-note editorial-floating-note--two">
                  <span>Primary stack</span>
                  <strong>GENAI-LLM</strong>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <span className="editorial-eyebrow">
                <MapPin size={14} />
                About the engineer
              </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                Available for freelance projects and product teams.
              </h2>
              <p className="mt-7 text-base leading-8 text-muted-foreground">{profile.bio}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {displayedEducation.map((edu) => (
                  <div key={edu.institution} className="editorial-mini-card">
                    <GraduationCap size={18} />
                    <h3>{edu.institution}</h3>
                    <p>{edu.degree}</p>
                    <span>{edu.period}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="experience" {...overlapPanel(4, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="editorial-eyebrow mx-auto">
              <Briefcase size={14} />
              Work journey
            </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Practical delivery for real teams.
            </h2>
          </div>

          <div className="editorial-timeline">
            {experience.map((exp, index) => (
              <ScrollReveal
                key={`${exp.company}-${exp.role}`}
                delay={index * 0.04}
                direction={index % 2 === 0 ? "left" : "right"}
                className="editorial-timeline-item"
              >
                <article className="editorial-timeline-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {exp.period} - {exp.type}
                      </p>
                      <h3 className="mt-3 text-3xl font-black tracking-[-0.055em]">{exp.role}</h3>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        {exp.company} - {exp.location}
                      </p>
                    </div>
                    <span className="mono-pill">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-6 text-base leading-8 text-muted-foreground">{exp.summary}</p>
                  <ul className="mt-6 grid gap-3 border-t border-border/70 pt-6 md:grid-cols-2">
                    {exp.highlights.slice(0, 4).map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="services" {...overlapPanel(5, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="editorial-eyebrow">
                <Cpu size={14} />
                Hire me for
              </span>
              <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Clear ways I can help you ship.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Pick the path that matches your need: freelance delivery, company role,
                automation buildout, or a clean production handoff.
              </p>
            </div>
            <Link href="/skills" className="anime-btn-outline w-fit">
              View skill architecture
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {capabilities.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.04}>
                <motion.article
                  className="editorial-capability-card"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <div className="mb-10 flex items-center justify-between">
                    <div className="editorial-icon">
                      <item.icon size={20} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black tracking-[-0.055em]">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {item.points.map((point) => (
                      <span key={point} className="mono-pill">{point}</span>
                    ))}
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" {...overlapPanel(6, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="editorial-eyebrow">
                <Code2 size={14} />
                Featured work
              </span>
              <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Work samples that support hiring decisions.
              </h2>
            </div>
            <Link href="/projects" className="anime-btn-outline w-fit">
              All projects
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="space-y-7">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.04}>
                <motion.article
                  className="editorial-project-card"
                  whileHover={{ scale: 0.992 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div className="order-2 lg:order-1">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Project {String(index + 1).padStart(2, "0")} - {project.year}
                      </p>
                      <h3 className="mt-4 text-4xl font-black leading-none tracking-[-0.065em] md:text-6xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {project.subtitle}
                      </p>
                      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                        {project.description}
                      </p>

                      {project.metrics ? (
                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                          {Object.entries(project.metrics).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="editorial-metric">
                              <span>{key}</span>
                              <strong>{value}</strong>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-7 flex flex-wrap gap-2">
                        {project.stack.slice(0, 6).map((tech) => (
                          <span key={tech} className="mono-pill">{tech}</span>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link href={`/projects/${project.id}`} className="anime-btn-outline">
                          Case study
                          <ArrowRight size={15} />
                        </Link>
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="anime-btn-outline"
                          >
                            <Github className="size-4" />
                            Code
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="order-1 lg:order-2">
                      <ProjectPreviewVisual
                        image={project.image}
                        title={project.title}
                        label={project.subtitle}
                        className="min-h-[280px] md:min-h-[390px]"
                      />
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="signal" {...overlapPanel(9, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="editorial-eyebrow mx-auto">
              <Server size={14} />
              Professional signal
            </span>
            <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
              Clear reasons to hire.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {engineeringSignals.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.04}>
                <motion.article
                  className="editorial-signal-card"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <div className="mb-9 flex items-center justify-between">
                    <div className="editorial-icon">
                      <item.icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {item.meta}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-[-0.055em]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-channels" {...overlapPanel(8, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="editorial-eyebrow mx-auto">
              <Video size={14} />
              AI Video Creator & Tech Channels
            </span>
            <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
              Watch me build AI Agents & Systems.
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base leading-8 text-muted-foreground">
              I actively share video breakdowns, tutorials, and deep dives on AI Agents, Agentic workflows, and cutting-edge GenAI implementations across Instagram and YouTube.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal>
              <div className="anime-card rounded-2xl p-8 border border-border/80 bg-gradient-to-br from-pink-500/10 via-card to-background relative overflow-hidden flex flex-col justify-between h-full group hover:border-pink-500/40 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
                        <Instagram size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">
                          Tech Talks 02
                        </h3>
                        <p className="text-xs font-semibold text-pink-500">@techtalks02 on Instagram</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-500 border border-pink-500/30">
                      <Sparkles size={12} /> AI Agents Reels
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                    Bite-sized breakdowns and practical video walkthroughs on building Autonomous AI Agents, Multi-Agent pipelines, Prompt Engineering hacks, and GenAI workflows.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">Instagram / @techtalks02</span>
                  <a
                    href={profile.social.instagram || siteConfig.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anime-btn inline-flex items-center gap-2 text-xs"
                  >
                    Watch Videos <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="anime-card rounded-2xl p-8 border border-border/80 bg-gradient-to-br from-red-500/10 via-card to-background relative overflow-hidden flex flex-col justify-between h-full group hover:border-red-500/40 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center">
                        <Youtube size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">
                          TechTalks02 AI
                        </h3>
                        <p className="text-xs font-semibold text-red-500">@Techtalks02-ai on YouTube</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-500 border border-red-500/30">
                      <Video size={12} /> AI Tech Tutorials
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                    In-depth video tutorials, live coding sessions, AI systems architecture analysis, and full-stack AI project demonstrations.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">YouTube / @Techtalks02-ai</span>
                  <a
                    href={profile.social.youtube || siteConfig.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anime-btn inline-flex items-center gap-2 text-xs"
                  >
                    Subscribe & Watch <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="agent-brief" {...overlapPanel(9, "editorial-section", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="agent-brief-panel">
            <div className="agent-brief-copy">
              <span className="editorial-eyebrow">
                <Terminal size={14} />
                Agent-ready brief
              </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Send this to a recruiter, founder, or hiring bot.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                A professional portfolio should work for humans and screening systems.
                This brief summarizes what I build, where I fit, and how to contact me.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={handleCopyHiringBrief} className="anime-btn">
                  {briefCopied ? <Check size={15} /> : <Copy size={15} />}
                  {briefCopied ? "Brief copied" : "Copy hiring brief"}
                </button>
                <Link href="/contact" className="anime-btn-outline">
                  Start conversation
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="agent-brief-terminal" aria-label="Hiring brief preview">
              <div className="agent-brief-terminal__top">
                <span />
                <span />
                <span />
                <small>HIRE_ADINARAYANA.md</small>
              </div>
              <pre>{hiringBrief}</pre>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" {...overlapPanel(10, "editorial-final-cta", "scroll-mt-24")}>
        <div className="editorial-container">
          <div className="editorial-final-panel">
            <div className="max-w-3xl">
              <span className="editorial-eyebrow editorial-eyebrow--dark">
                <Mail size={14} />
                Available for select opportunities
              </span>
              <h2 className="mt-8 text-5xl font-black leading-[0.95] tracking-[-0.075em] text-white md:text-7xl">
                Bring me a real problem.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
                Hire me for freelance MVPs, AI integrations, automation systems, admin
                dashboards, or full-time AI/full-stack engineering roles.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="anime-btn anime-btn--light">
                  Start hiring conversation
                  <ArrowRight size={15} />
                </Link>
                <a
                  href={profile.social.linkedin || siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-btn-outline anime-btn-outline--dark"
                >
                  <Linkedin className="size-4" />
                  LinkedIn
                </a>
                <a
                  href={profile.social.instagram || siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-btn-outline anime-btn-outline--dark"
                >
                  <Instagram className="size-4" />
                  Instagram
                </a>
                <a
                  href={profile.social.youtube || siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-btn-outline anime-btn-outline--dark"
                >
                  <Youtube className="size-4" />
                  YouTube
                </a>
                <button type="button" onClick={handleCopyEmail} className="anime-btn-outline anime-btn-outline--dark">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Email copied" : "Copy email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
