"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Star,
  GitFork,
  ExternalLink,
} from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fallbackGitHub, siteConfig } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";
import { ContributionGrid } from "@/components/shared/contribution-grid";
import type { GitHubStats } from "@/types";

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
};

const PIE_COLORS = ["#22c55e", "#10b981", "#059669", "#64748b", "#334155"];

export default function GitHubPage() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const res = await fetch("/api/github");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats(fallbackGitHub as GitHubStats);
        }
      } catch {
        setStats(fallbackGitHub as GitHubStats);
      } finally {
        setLoading(false);
      }
    }
    fetchGitHub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-dashed border-primary/40 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const languageData = Object.entries(stats.languages).map(([name, value], index) => ({
    name,
    value,
    color: LANG_COLORS[name] || PIE_COLORS[index % PIE_COLORS.length],
  }));

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-foreground">
              GitHub <span className="gradient-text">Stats</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              My open-source contributions and coding activity
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Card */}
      <section className="py-16 border-t border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="anime-card rounded-xl p-8 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Github className="w-10 h-10 text-primary" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                {stats.name}
              </h2>
              <p className="text-sm text-muted-foreground">@{stats.username}</p>
              {stats.bio && (
                <p className="mt-2 text-sm text-muted-foreground max-w-md">{stats.bio}</p>
              )}

              <div className="mt-4 flex items-center justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm text-foreground">{stats.publicRepos}</span>
                  <span className="text-xs text-muted-foreground">Repos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm text-foreground">{stats.followers}</span>
                  <span className="text-xs text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm text-foreground">{stats.following}</span>
                  <span className="text-xs text-muted-foreground">Following</span>
                </div>
              </div>
            </div>

            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-btn cursor-pointer inline-flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View Profile
            </a>
          </motion.div>
        </div>
      </section>

      {/* Language Chart + Stats */}
      <section className="py-16 border-t border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Language Distribution"
            subtitle="Languages used across repositories"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="anime-card rounded-xl p-6"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-xl)",
                      color: "var(--color-foreground)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                    formatter={(value: any) => [`${value}%`, ""]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Language bars */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="anime-card rounded-xl p-6 flex flex-col justify-center space-y-4"
            >
              {languageData.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{lang.name}</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {lang.value}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>



      {/* Top Repos */}
      <section className="py-16 border-t border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Top Repositories"
            subtitle="Most notable repositories"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {stats.topRepos.map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.url || `${siteConfig.links.github}/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group anime-card rounded-xl p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <h3 className="mt-3 font-bold font-[family-name:var(--font-heading)] group-hover:text-primary transition-colors duration-200 text-foreground">
                  {repo.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          LANG_COLORS[repo.language] || "#3b82f6",
                      }}
                    />
                    {repo.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stars}
                  </span>
                  {repo.forks !== undefined && (
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forks}
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
