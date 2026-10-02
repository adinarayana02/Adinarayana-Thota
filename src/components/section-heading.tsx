"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  gradient = true,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)]",
          gradient && "gradient-text"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
