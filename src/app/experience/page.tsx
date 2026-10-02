"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Award,
  Layers,
  Cpu,
  Zap,
  ShieldCheck,
  Building2,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Floating3DCard } from "@/components/effects/floating-3d-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { experiences as fallbackExp, education as fallbackEdu } from "@/lib/constants";
import type { IExperience, IEducation } from "@/types";

interface ExperienceExtra {
  company: string;
  projectSlug?: string;
  projectLabel?: string;
  badgeColor?: string;
  impactMetrics?: { label: string; value: string }[];
}

const experienceMeta: Record<string, ExperienceExtra> = {
  "TELIC INFO SERVICES PRIVATE LIMITED": {
    company: "TELIC INFO SERVICES PRIVATE LIMITED",
    projectSlug: "b2b-ai-automation-platform",
    projectLabel: "B2B Automation Platform Case Study",
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    impactMetrics: [
      { label: "Cost Reduction", value: "50% Operations Saved" },
      { label: "Voice Latency", value: "95ms Response" },
      { label: "Lead Precision", value: "94% Intent Match" },
    ],
  },
  "Afrov Pvt Limited": {
    company: "Afrov Pvt Limited",
    projectSlug: "neodetect",
    projectLabel: "NeoDetect System Case Study",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    impactMetrics: [
      { label: "Fraud Capture", value: "+30% Gain" },
      { label: "API Speed", value: "60% Faster via Async" },
      { label: "Inference", value: "120ms Latency" },
    ],
  },
};

export default function ExperiencePage() {
  const [exps, setExps] = useState<IExperience[]>(fallbackExp as IExperience[]);
  const [edus, setEdus] = useState<IEducation[]>(fallbackEdu as IEducation[]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, eduRes] = await Promise.all([
          fetch("/api/experience"),
          fetch("/api/education"),
        ]);

        if (expRes.ok) {
          const expData = await expRes.json();
          const array = Array.isArray(expData) ? expData : (expData.experiences || expData);
          if (Array.isArray(array) && array.length > 0) {
            setExps(array);
          }
        }

        if (eduRes.ok) {
          const eduData = await eduRes.json();
          const array = Array.isArray(eduData) ? eduData : (eduData.educations || eduData);
          if (Array.isArray(array) && array.length > 0) {
            setEdus(array);
          }
        }
      } catch {
        setExps(fallbackExp as IExperience[]);
        setEdus(fallbackEdu as IEducation[]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
            <span className="editorial-eyebrow">
              <Briefcase size={14} className="text-primary" />
              Work Journey & Engineering Track Record
            </span>

            <h1 className="editorial-display mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Practical Delivery for Real Engineering Teams.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Specialized experience building Multi-Agent automation ecosystems, real-time Voice AI pipelines, Computer Vision fraud detection systems, and high-performance FastAPI microservices.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Building2 size={13} className="text-primary" />
                  <span>Industry Roles</span>
                </div>
                <div className="mt-1 text-2xl font-bold font-mono text-foreground">2 Companies</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Cpu size={13} className="text-emerald-500" />
                  <span>Core Domain</span>
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-emerald-500">GenAI & ML</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Zap size={13} className="text-amber-500" />
                  <span>Sub-100ms</span>
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-amber-500">FastAPI Async</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-3.5">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-primary" />
                  <span>Fraud Detection</span>
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-primary">+30% Gain</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Experience Timeline */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Briefcase className="text-primary" size={24} />
              <span>Professional Roles & Internships</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Direct hands-on engineering experience in AI agents, speech pipelines, RAG, and deep learning.
            </p>
          </div>

          <div ref={containerRef} className="space-y-10">
            {loading ? (
              <div className="space-y-8">
                {[1, 2].map((n) => (
                  <div key={n} className="h-64 rounded-2xl bg-card border border-border animate-shimmer" />
                ))}
              </div>
            ) : (
              exps.map((exp, idx) => {
                const meta = experienceMeta[exp.company] || {
                  company: exp.company,
                  badgeColor: "border-primary/30 bg-primary/10 text-primary",
                };

                return (
                  <ScrollReveal key={`${exp.company}-${exp.role}`} delay={idx * 0.05}>
                    <Floating3DCard depth={6} glareColor="rgba(37, 99, 235, 0.08)">
                      <article className="rounded-2xl border border-border/70 bg-card/90 p-6 sm:p-8 backdrop-blur shadow-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-border/60">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs font-semibold border ${meta.badgeColor}`}>
                                <Building2 size={12} />
                                {exp.company}
                              </span>
                              <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs font-medium text-muted-foreground border border-border/40">
                                {exp.type || "Internship"}
                              </span>
                            </div>

                            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                              {exp.role}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-primary" />
                                {exp.period || (exp.startDate && exp.endDate ? `${exp.startDate.substring(0, 7)} – ${exp.current ? "Present" : exp.endDate.substring(0, 7)}` : "July 2025 – May 2026")}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} className="text-primary" />
                                {exp.location || "India (Remote)"}
                              </span>
                            </div>
                          </div>

                          {/* Related Case Study CTA */}
                          {meta.projectSlug && (
                            <Link
                              href={`/projects/${meta.projectSlug}`}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 shrink-0 self-start cursor-pointer shadow-xs"
                            >
                              <span>{meta.projectLabel || "View Case Study"}</span>
                              <ArrowRight size={13} />
                            </Link>
                          )}
                        </div>

                        {/* Impact Metrics Grid */}
                        {meta.impactMetrics && meta.impactMetrics.length > 0 && (
                          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {meta.impactMetrics.map((m, mIdx) => (
                              <div key={mIdx} className="rounded-xl border border-border/50 bg-muted/40 p-3 text-center">
                                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{m.label}</div>
                                <div className="mt-0.5 text-sm sm:text-base font-bold font-mono text-foreground">{m.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Detailed Bullets */}
                        <div className="mt-6 space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                            // Key Engineering Responsibilities & Impact
                          </h4>
                          <ul className="space-y-2.5 list-none pl-0">
                            {exp.bullets?.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                                <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                  <CheckCircle2 size={12} />
                                </span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies Used */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-7 pt-5 border-t border-border/50">
                            <span className="text-xs font-mono text-muted-foreground block mb-2.5">
                              Technologies & Tools Applied:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md bg-muted/80 px-2.5 py-1 font-mono text-xs text-foreground border border-border/40 font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    </Floating3DCard>
                  </ScrollReveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Academic Background / Education */}
      <section className="py-16 border-t border-border/60 bg-card/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <GraduationCap className="text-primary" size={24} />
              <span>Education & Academic Credentials</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Formal engineering foundation in Information Technology, Machine Learning, and Software Architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {edus.map((edu, idx) => (
              <ScrollReveal key={edu.institution} delay={idx * 0.05}>
                <article className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary">
                        <Award size={13} />
                        {edu.grade || "Distinction"}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {edu.period}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      {edu.institution}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80 flex items-center gap-1">
                      <MapPin size={11} />
                      {edu.location}
                    </p>

                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="mt-5">
                        <span className="text-xs font-mono text-muted-foreground block mb-2">
                          Key Coursework:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {edu.coursework.map((c) => (
                            <span
                              key={c}
                              className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground border border-border/30"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion CTA */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <span className="editorial-eyebrow">
                <Mail size={14} />
                Let&apos;s Build Together
              </span>
              <h2 className="editorial-display mt-6 max-w-2xl text-3xl md:text-5xl">
                Looking for an AI / Generative AI Developer?
              </h2>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                Available for full-time engineering roles, high-impact contract builds, and autonomous AI agent architectures.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact" className="anime-btn">
                  <Mail size={16} />
                  <span>Start a conversation</span>
                </Link>
                <Link href="/projects" className="anime-btn-outline">
                  <Layers size={16} />
                  <span>Explore all projects</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

