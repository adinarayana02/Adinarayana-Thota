"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";
import { Github } from "@/components/shared/brand-icons";

interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  metrics?: Record<string, string>;
}

export function ProjectCard({
  title,
  slug,
  description,
  techStack,
  category,
  githubUrl,
  liveUrl,
  featured,
  metrics,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="anime-card rounded-xl p-6 h-full flex flex-col">
        {/* Category & Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="anime-badge">
              {category}
            </span>
            {featured && (
              <span className="anime-badge-violet flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Featured
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <Link href={`/projects/${slug}`} className="cursor-pointer flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-2 group-hover:text-primary transition-colors flex items-center gap-1.5 text-foreground">
              {title}
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
              {description}
            </p>
            {metrics && (
              <div className="mb-4 grid grid-cols-3 gap-1.5 border-t border-border/20 pt-3">
                {Object.entries(metrics).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="bg-muted/40 border border-border/20 rounded-lg p-1.5 text-center">
                    <div className="text-[9px] font-mono text-muted-foreground capitalize truncate" title={key}>{key}</div>
                    <div className="text-xs font-bold font-mono text-primary mt-0.5 truncate" title={val}>{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mt-auto pt-4 border-t border-border/40">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/30"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              +{techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
