"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Brain,
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";

const ICON_COLORS = ["text-primary", "text-secondary", "text-accent"];

const highlights = [
  {
    title: "Industry Experience",
    content: "Developer (AI / ML, Generative AI) @ TELIC INFO SERVICES PRIVATE LIMITED",
    icon: Briefcase,
  },
  {
    title: "Technical Skills",
    content: "Python, FastAPI, LangGraph, Qdrant, ChromaDB, Gemini, MLflow, React.js, PostgreSQL",
    icon: Code2,
  },
  {
    title: "Key Projects",
    content: "Hybrid AI Recruitment Platform, Autonomous Enterprise Manager, Speech VAD Framework, NeoDetect",
    icon: Brain,
  },
  {
    title: "Education",
    content: "M.Tech IT @ Andhra University (8.5 CGPA), B.Tech IT @ VVIT (7.91 CGPA)",
    icon: GraduationCap,
  },
  {
    title: "Achievements & Honors",
    content: "National AI Hackathon Winner (Virtual Try-On), Entrepreneur Council Student Ambassador",
    icon: Award,
  },
];

export default function ResumePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)]">
              My <span className="gradient-text">Resume</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              View and download my latest curriculum vitae and engineering credentials
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                View / Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Resume Highlights"
            subtitle="Key takeaways and qualifications at a glance"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="anime-card rounded-2xl p-6"
              >
                <h.icon className={`w-7 h-7 mb-3 ${ICON_COLORS[i % ICON_COLORS.length]}`} />
                <h3 className="font-bold font-[family-name:var(--font-heading)]">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {h.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
