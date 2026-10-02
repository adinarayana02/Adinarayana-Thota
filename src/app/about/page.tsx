"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  BookOpen,
  Video,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Instagram, Youtube } from "@/components/shared/brand-icons";
import { siteConfig } from "@/lib/constants";
import { usePortfolio } from "@/hooks/usePortfolio";
import { SectionHeading } from "@/components/section-heading";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1000;
          const steps = 40;
          const stepTime = duration / steps;
          let current = 0;
          const increment = target / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  const { data } = usePortfolio();
  const { education } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const stats = [
    { label: "Projects Built", value: 10, suffix: "+", icon: Target },
    { label: "Technologies", value: 20, suffix: "+", icon: Lightbulb },
    { label: "Internships", value: 3, suffix: "", icon: Users },
    { label: "Certifications", value: 6, suffix: "+", icon: TrendingUp },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-card/5 grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight">
              About <span className="text-primary">Me</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Engineering background, philosophy, and production focus
            </p>
          </motion.div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight">
                Professional <span className="text-primary">Summary</span>
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                <p>
                  I&apos;m <strong className="text-foreground">{siteConfig.name}</strong>, an AI / ML Developer &amp; Generative AI Specialist pursuing my M.Tech in Information Technology at Andhra University (CGPA: 8.5/10), holding a B.Tech in Information Technology from Vasireddy Venkatadri Institute of Technology (CGPA: 7.91/10).
                </p>
                <p>
                  My focus is architecting production AI systems and agentic workflows - from agentic recruitment platforms (Hybrid AI Recruitment with Qdrant and LangGraph) and enterprise-grade multi-agent systems (Autonomous Enterprise Manager) to production speech ML pipelines (Voice Activity Detection with Whisper) and fraud detection systems (NeoDetect).
                </p>
                <p>
                  As a Data Science Intern at <strong className="text-foreground">Afrov Pvt Limited</strong>, I engineered <strong className="text-foreground">NeoDetect</strong>, an end-to-end document and image fraud detection system utilizing DenseNet121 computer vision, Llama LLMs, RAG, and high-performance FastAPI backends with batch inference and async I/O.
                </p>
                <p>
                  During my internship at <strong className="text-foreground">TELIC INFO SERVICES PRIVATE LIMITED</strong>, I worked on a B2B AI-powered business automation platform that automates sales, lead management, marketing, and SEO workflows. I engineered specialized AI agents including a Voice Calling Agent for live query handling and call summarization, a Social Media &amp; SEO Automation Agent for localized content, and an automated Lead Management pipeline using Python, FastAPI, LLM APIs, RAG, ChromaDB, and MLflow. I also won a Hackathon for building an AI-powered Virtual Try-On system and served as a Student Ambassador on the Entrepreneur Council.
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="anime-card rounded-xl p-6 text-center group"
                >
                  <stat.icon className="w-5 h-5 mx-auto mb-3 text-primary" />
                  <p className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 border-t border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Education"
            subtitle="My academic background and foundations"
          />

          <div ref={containerRef} className="relative pl-6 space-y-10 ml-2 mt-12">
            {/* Background timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border" />
            {/* Animated scroll progress timeline line */}
            <motion.div
              className="absolute left-0 top-0 w-[1px] bg-primary origin-top"
              style={{ scaleY: scrollYProgress }}
            />
            {education.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-background" />

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
                      {edu.degree}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary font-[family-name:var(--font-body)]">
                    {edu.institution} {edu.location && <><span className="text-muted-foreground/30"> • </span> {edu.location}</>}
                  </p>
                  {edu.grade && (
                    <span className="text-xs text-muted-foreground font-mono mt-0.5 inline-block">
                      Grade: {edu.grade}
                    </span>
                  )}

                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {edu.coursework.map((course) => (
                          <span
                            key={course}
                            className="text-[10px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium border border-border"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Content & Video Channels */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="AI Content & Tech Videos"
            subtitle="Creating videos on AI Agents, GenAI, and Modern AI Architectures"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="anime-card rounded-2xl p-8 border border-border/80 bg-gradient-to-br from-pink-500/5 via-card to-background relative overflow-hidden group"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                      Tech Talks 02
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">@techtalks02 on Instagram</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-500 border border-pink-500/20">
                  <Sparkles size={12} /> AI Agents Video
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Creating short-form and breakdown videos focused on AI Agents, Agentic workflows, Multi-Agent systems, Prompt Engineering, and cutting-edge GenAI tools.
              </p>
              <a
                href={siteConfig.links.instagram || "https://www.instagram.com/techtalks02/"}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn inline-flex items-center gap-2 text-xs font-semibold"
              >
                Watch on Instagram <ArrowUpRight size={14} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="anime-card rounded-2xl p-8 border border-border/80 bg-gradient-to-br from-red-500/5 via-card to-background relative overflow-hidden group"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Youtube size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                      TechTalks02 AI
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">@Techtalks02-ai on YouTube</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                  <Video size={12} /> Tech & AI Systems
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Deep dives, architectural breakdowns, hands-on tutorials, and demonstrations of AI frameworks, LLM pipelines, and AI agent architectures.
              </p>
              <a
                href={siteConfig.links.youtube || "https://www.youtube.com/@Techtalks02-ai"}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn inline-flex items-center gap-2 text-xs font-semibold"
              >
                Subscribe on YouTube <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Goals */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Career Goals"
            subtitle="Where I'm headed and what drives me"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "AI Innovation",
                desc: "Build production-grade AI systems that leverage LLMs, RAG, and agentic workflows to solve real-world problems at scale.",
                icon: Lightbulb,
              },
              {
                title: "Full Stack Mastery",
                desc: "Architect end-to-end web applications using modern frameworks, serverless infrastructure, and best DevOps practices.",
                icon: Target,
              },
              {
                title: "Community Impact",
                desc: "Contribute to open-source projects, mentor aspiring developers, and share knowledge through writing and talks.",
                icon: Users,
              },
            ].map((goal, i) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="anime-card rounded-xl p-8"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <goal.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-foreground">
                  {goal.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {goal.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
