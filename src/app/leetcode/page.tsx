"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Zap,
  Flame,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fallbackLeetCode, siteConfig } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";
import { ContributionGrid } from "@/components/shared/contribution-grid";
import type { LeetCodeStats } from "@/types";

const DIFFICULTY_COLORS = {
  easy: "#10b981",
  medium: "#3b82f6",
  hard: "#ef4444",
};

export default function LeetCodePage() {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeetCode() {
      try {
        const res = await fetch("/api/leetcode");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats(fallbackLeetCode as LeetCodeStats);
        }
      } catch {
        setStats(fallbackLeetCode as LeetCodeStats);
      } finally {
        setLoading(false);
      }
    }
    fetchLeetCode();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const donutData = [
    { name: "Easy", value: stats.easySolved, color: DIFFICULTY_COLORS.easy },
    { name: "Medium", value: stats.mediumSolved, color: DIFFICULTY_COLORS.medium },
    { name: "Hard", value: stats.hardSolved, color: DIFFICULTY_COLORS.hard },
  ];

  const difficulties = [
    {
      label: "Easy",
      solved: stats.easySolved,
      total: stats.totalQuestions.easy,
      color: DIFFICULTY_COLORS.easy,
      icon: CheckCircle2,
    },
    {
      label: "Medium",
      solved: stats.mediumSolved,
      total: stats.totalQuestions.medium,
      color: DIFFICULTY_COLORS.medium,
      icon: Zap,
    },
    {
      label: "Hard",
      solved: stats.hardSolved,
      total: stats.totalQuestions.hard,
      color: DIFFICULTY_COLORS.hard,
      icon: Flame,
    },
  ];

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
              LeetCode <span className="gradient-text">Stats</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Problem-solving progress and competitive coding stats
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="anime-card rounded-2xl p-6 text-center"
            >
              <Trophy className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                {stats.totalSolved}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Problems Solved
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="anime-card rounded-2xl p-6 text-center"
            >
              <Target className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <p className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                {stats.ranking.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Global Ranking
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="anime-card rounded-2xl p-6 text-center"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-accent" />
              <p className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                {Math.round(
                  (stats.totalSolved /
                    (stats.totalQuestions.easy +
                      stats.totalQuestions.medium +
                      stats.totalQuestions.hard)) *
                    100
                )}
                %
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Completion Rate
              </p>
            </motion.div>
          </div>

          {/* Activity Calendar (All Green) */}
          <div className="mb-16">
            <SectionHeading
              title="LeetCode Submissions"
              subtitle="Daily problem-solving activity (365 consecutive days active)"
            />
            <ContributionGrid
              title="Submission Grid"
              subtitle="Vibrant green submission calendar showing active status"
              totalCount={stats.totalSolved}
              label="Solved"
            />
          </div>

          {/* Chart + Progress Bars */}
          <SectionHeading
            title="Difficulty Breakdown"
            subtitle="Problems solved by difficulty level"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donut Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="anime-card rounded-2xl p-6"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-xl)",
                      color: "var(--color-foreground)",
                      boxShadow: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="text-center -mt-[190px] mb-[140px]">
                <p className="text-3xl font-bold font-[family-name:var(--font-heading)]">
                  {stats.totalSolved}
                </p>
                <p className="text-xs text-muted-foreground">Total Solved</p>
              </div>
            </motion.div>

            {/* Progress Bars */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="anime-card rounded-2xl p-6 flex flex-col justify-center space-y-8"
            >
              {difficulties.map((diff) => {
                const percentage = Math.round(
                  (diff.solved / diff.total) * 100
                );
                return (
                  <div key={diff.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <diff.icon
                          className="w-4 h-4"
                          style={{ color: diff.color }}
                        />
                        <span className="font-medium">{diff.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {diff.solved} / {diff.total}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: diff.color }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground text-right">
                      {percentage}%
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href={siteConfig.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-btn inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View LeetCode Profile
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
