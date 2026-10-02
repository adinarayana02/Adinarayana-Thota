"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { skillCategories as fallbackCategories } from "@/lib/constants";
import type { ISkill } from "@/types";
import { NeuralVectorCloud } from "@/components/effects/neural-vector-cloud";
import { TechGlobe3D } from "@/components/effects/tech-globe-3d";
import { soundManager } from "@/lib/sounds";
import { Brain, Code2, Globe, LayoutGrid } from "lucide-react";

// Dynamically resolve lucide icons from string name
function getIcon(name: string) {
  const pascalName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const iconMap = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;
  const IconComponent = iconMap[pascalName];
  return IconComponent || LucideIcons.Code2;
}

interface SkillGroup {
  category: string;
  skills: ISkill[];
}

export default function SkillsPage() {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "3d-cloud" | "3d-globe">("grid");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const data = await res.json();
          const skillsList: ISkill[] = Array.isArray(data) ? data : (data.skills || data);
          
          if (skillsList.length > 0) {
            // Group skills by category
            const categories = Array.from(new Set(skillsList.map((s) => s.category)));
            const grouped = categories.map((cat) => ({
              category: cat,
              skills: skillsList
                .filter((s) => s.category === cat)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            }));
            setSkillGroups(grouped);
          } else {
            setSkillGroups(fallbackCategories as unknown as SkillGroup[]);
          }
        } else {
          setSkillGroups(fallbackCategories as unknown as SkillGroup[]);
        }
      } catch {
        setSkillGroups(fallbackCategories as unknown as SkillGroup[]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-mono mb-4 border border-border">
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <span>Technical Stack & Proficiency</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight">
              Skills & <span className="text-primary">Architectures</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Core technologies, frameworks, and tools powering my production applications, RAG pipelines, and automated workflows.
            </p>

            {/* View Mode Switcher */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-card border border-border shadow-sm gap-1.5 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setViewMode("grid");
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Matrix Grid</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setViewMode("3d-cloud");
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  viewMode === "3d-cloud"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>3D Vector Space</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setViewMode("3d-globe");
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  viewMode === "3d-globe"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>3D Tech Globe</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 border-t border-border min-h-[600px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {viewMode === "3d-cloud" && (
              <motion.div
                key="3d-cloud"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <NeuralVectorCloud />
              </motion.div>
            )}

            {viewMode === "3d-globe" && (
              <motion.div
                key="3d-globe"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="anime-card p-6 sm:p-12 rounded-3xl border border-border/80 shadow-2xl flex flex-col items-center justify-center bg-card/60 backdrop-blur-xl"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                    Interactive 3D Tech Sphere
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Drag with your cursor to spin with angular momentum. Click any technology to focus.
                  </p>
                </div>
                <TechGlobe3D radius={220} />
              </motion.div>
            )}

            {viewMode === "grid" && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-16"
              >
          {loading ? (
            <div className="space-y-12">
              {[1, 2].map((n) => (
                <div key={n} className="space-y-4">
                  <div className="h-6 bg-muted rounded w-1/4 animate-shimmer" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((m) => (
                      <div key={m} className="h-24 rounded-xl bg-card border border-border animate-shimmer" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            skillGroups.map((group, catIdx) => {
              return (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full bg-primary" />
                    <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                      {group.category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.skills.map((skill, skillIdx) => {
                      const Icon = getIcon(skill.icon || "code-2");
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: skillIdx * 0.03 }}
                          className="group anime-card rounded-xl p-5 flex items-center gap-4 cursor-default"
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted text-primary flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                              {skill.name}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
