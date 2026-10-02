"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  gradient?: boolean;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  gradient = true,
  className = "",
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 space-y-4",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary rounded-full border border-primary/20">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)]",
          gradient ? "gradient-text" : ""
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
