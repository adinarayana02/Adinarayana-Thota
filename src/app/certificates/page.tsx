"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  Sparkles,
  Bot,
  Brain,
  Search,
  Database,
  Trophy,
  Cloud,
  Zap,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { certificates as fallbackCerts } from "@/lib/constants";
import { soundManager } from "@/lib/sounds";

interface Certificate {
  title: string;
  organization: string;
  date?: string;
  issueDate?: string;
  credentialUrl?: string;
  description?: string;
  order?: number;
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "AI & LLMs" | "Engineering & Cloud" | "Honors">("All");

  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.certificates;
          setCerts(items && items.length > 0 ? items : fallbackCerts);
        } else {
          setCerts(fallbackCerts);
        }
      } catch {
        setCerts(fallbackCerts);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  const getCertIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("agent") || t.includes("autonomous")) return Bot;
    if (t.includes("llm") || t.includes("generative")) return Brain;
    if (t.includes("rag") || t.includes("vector") || t.includes("database")) return Database;
    if (t.includes("hackathon") || t.includes("winner")) return Trophy;
    if (t.includes("aws") || t.includes("cloud")) return Cloud;
    if (t.includes("fastapi") || t.includes("backend") || t.includes("api")) return Zap;
    if (t.includes("ambassador") || t.includes("council")) return GraduationCap;
    return Award;
  };

  const categorize = (cert: Certificate) => {
    const t = cert.title.toLowerCase();
    if (t.includes("agent") || t.includes("llm") || t.includes("rag") || t.includes("learning") || t.includes("vision")) {
      return "AI & LLMs";
    }
    if (t.includes("aws") || t.includes("fastapi") || t.includes("cloud") || t.includes("backend")) {
      return "Engineering & Cloud";
    }
    return "Honors";
  };

  const filteredCerts = useMemo(() => {
    return certs.filter((cert) => {
      const matchesSearch =
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.description && cert.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (activeCategory === "All") return true;
      return categorize(cert) === activeCategory;
    });
  }, [certs, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-muted/20 border-b border-border/40">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-5 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified 2026 Credentials & Masters
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-[family-name:var(--font-heading)]">
              Certifications & <span className="gradient-text">AI Credentials</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Verified certifications specializing in <strong className="text-foreground">Autonomous AI Agents</strong>, <strong className="text-foreground">LLM Architecture</strong>, <strong className="text-foreground">Advanced RAG</strong>, Vector Database Systems, and Innovation Leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/40">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {(["All", "AI & LLMs", "Engineering & Cloud", "Honors"] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playPop();
                    setActiveCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                  }`}
                >
                  {cat === "All" && `All (${certs.length})`}
                  {cat === "AI & LLMs" && "AI Agents & LLMs"}
                  {cat === "Engineering & Cloud" && "Cloud & Systems"}
                  {cat === "Honors" && "Honors & Awards"}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="anime-card rounded-2xl p-6 h-56 animate-shimmer"
                />
              ))}
            </div>
          ) : filteredCerts.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No certificates found matching your query.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredCerts.map((cert, i) => {
                  const Icon = getCertIcon(cert.title);
                  const isAI = cert.title.toLowerCase().includes("agent") || cert.title.toLowerCase().includes("llm");
                  const issueYear = cert.issueDate || cert.date || "2026";

                  return (
                    <motion.div
                      key={cert.title}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`relative group rounded-2xl p-6 bg-card border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
                        isAI
                          ? "border-primary/40 hover:border-primary/80 bg-gradient-to-br from-primary/[0.04] to-card"
                          : "border-border/70 hover:border-border"
                      }`}
                    >
                      {/* Glow highlight on hover */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div>
                        {/* Header: Icon & Year Badge */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                              isAI
                                ? "bg-primary/20 text-primary shadow-sm"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>

                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {issueYear}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold font-[family-name:var(--font-heading)] text-lg leading-snug group-hover:text-primary transition-colors">
                          {cert.title}
                        </h3>

                        {/* Organization */}
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          {cert.organization}
                        </p>

                        {/* Description */}
                        {cert.description && (
                          <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {cert.description}
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary/70" />
                          Issued: <span className="font-medium text-foreground">{issueYear}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
