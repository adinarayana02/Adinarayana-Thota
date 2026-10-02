"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import type { IProject } from "@/types";

export function ProjectDetailView({ project }: { project: IProject }) {
  return (
    <>
      {/* Header */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)]">
              {project.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              {project.description}
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium cursor-pointer hover:opacity-90 transition-opacity duration-200"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Long description */}
          {project.longDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                {project.longDescription}
              </p>
            </motion.div>
          )}

          {/* Project Screenshot / Visual Representation */}
          {project.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border border-border/80 bg-black/40 shadow-2xl p-1"
            >
              {/* Mock Browser Header */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/40 bg-muted/20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="w-40 h-4 rounded bg-muted/65 mx-auto text-[9px] font-mono text-muted-foreground flex items-center justify-center tracking-wider">
                  localhost:3000/{project.slug}
                </div>
              </div>
              
              <div className="relative w-full overflow-hidden bg-muted/30">
                <img 
                  src={project.image} 
                  alt={`${project.title} Interface`}
                  className="block h-auto w-full hover:scale-[1.01] transition-transform duration-500" 
                />
              </div>
            </motion.div>
          )}

          {/* Diagnostics / Performance Metrics Dashboard */}
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xs font-mono text-primary uppercase tracking-wider">
                // System Diagnostics & Performance Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(project.metrics).map(([key, val]) => (
                  <div
                    key={key}
                    className="relative overflow-hidden rounded-xl bg-black/60 border border-border/80 p-4 flex flex-col justify-between group hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest truncate" title={key}>{key}</span>
                    <span className="text-base md:text-lg font-bold font-mono text-foreground mt-2 group-hover:text-primary transition-colors duration-250 truncate" title={val}>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* System Pipeline flowchart */}
          {project.architectureSteps && project.architectureSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-mono text-primary uppercase tracking-wider">
                  // Core Pipeline & Systems Architecture Flow
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sequential data ingestion, processing, representation model routing, and generation steps.
                </p>
              </div>

              {/* Responsive Flowchart */}
              <div className="border border-border/60 rounded-2xl bg-card/15 p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4">
                  {project.architectureSteps.map((step, idx) => {
                    const isLast = idx === (project.architectureSteps?.length ?? 0) - 1;
                    return (
                      <div key={idx} className="flex-1 flex flex-col lg:flex-row items-center gap-4 w-full relative">
                        {/* Step Card */}
                        <div className="w-full bg-muted/30 border border-border/40 rounded-xl p-4 flex flex-col gap-1.5 relative group hover:border-primary/30 transition-colors duration-200 h-full">
                          {/* Step Number */}
                          <div className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-black border border-primary/40 flex items-center justify-center text-[9px] font-mono text-primary font-bold">
                            {idx + 1}
                          </div>
                          <h4 className="text-xs font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors truncate">
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            {step.description}
                          </p>
                        </div>

                        {/* Connector Arrow */}
                        {!isLast && (
                          <div className="flex items-center justify-center shrink-0 w-8 h-4 lg:w-4 lg:h-auto">
                            {/* Mobile Down Arrow, Desktop Right Arrow */}
                            <svg
                              className="w-4 h-4 text-primary/40 lg:rotate-0 rotate-90"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Challenge & Solution */}
          {(project.challenges || project.solutions) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {project.challenges && (
                <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-6 space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>The Challenge (Bottlenecks)</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground">Technical Obstacles</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{project.challenges}</p>
                </div>
              )}
              {project.solutions && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span>The Solution (Architectural Choice)</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground">Engineering Solution</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{project.solutions}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 glass-card rounded-xl p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
