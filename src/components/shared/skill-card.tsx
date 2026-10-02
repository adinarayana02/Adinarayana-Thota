"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Code2, Terminal, Database, Server, Brain, Cpu,
  Link as LinkIcon, Smile, Calculator, BarChart3,
  Monitor, Settings, ScatterChart, MessageSquare,
  GitBranch, Workflow, GitMerge, Send,
  Atom, Layout, FileCode, Palette, Wind, FileType,
  Route, Network, Table, Flame, Search,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "code-2": <Code2 size={16} />,
  terminal: <Terminal size={16} />,
  database: <Database size={16} />,
  server: <Server size={16} />,
  brain: <Brain size={16} />,
  cpu: <Cpu size={16} />,
  link: <LinkIcon size={16} />,
  smile: <Smile size={16} />,
  calculator: <Calculator size={16} />,
  "bar-chart-3": <BarChart3 size={16} />,
  monitor: <Monitor size={16} />,
  settings: <Settings size={16} />,
  "scatter-chart": <ScatterChart size={16} />,
  "message-square": <MessageSquare size={16} />,
  "git-branch": <GitBranch size={16} />,
  workflow: <Workflow size={16} />,
  "git-merge": <GitMerge size={16} />,
  send: <Send size={16} />,
  atom: <Atom size={16} />,
  layout: <Layout size={16} />,
  "file-code": <FileCode size={16} />,
  palette: <Palette size={16} />,
  wind: <Wind size={16} />,
  "file-type": <FileType size={16} />,
  route: <Route size={16} />,
  network: <Network size={16} />,
  table: <Table size={16} />,
  flame: <Flame size={16} />,
  search: <Search size={16} />,
  github: <GitMerge size={16} />,
  sheet: <Table size={16} />,
};

interface SkillCardProps {
  name: string;
  icon?: string;
  className?: string;
}

export function SkillCard({ name, icon, className }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "anime-card rounded-xl p-3 flex items-center gap-3 cursor-default select-none",
        className
      )}
    >
      {/* Icon Wrapper */}
      <div className="p-2 rounded-lg bg-muted text-primary shrink-0 flex items-center justify-center">
        {icon && iconMap[icon] ? iconMap[icon] : <Code2 size={16} />}
      </div>

      {/* Name */}
      <span className="text-xs font-semibold tracking-wide text-foreground">
        {name}
      </span>
    </motion.div>
  );
}
