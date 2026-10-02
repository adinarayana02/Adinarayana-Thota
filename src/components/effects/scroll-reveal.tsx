"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

// Short travel: long slides read as lag when the page is scrolled quickly.
const directionOffset = {
  up: { y: 18 },
  down: { y: -18 },
  left: { x: 24 },
  right: { x: -24 },
};

// Staggers stack up in long lists; past this the content just looks late.
const MAX_DELAY = 0.12;

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.4,
  className = "",
  // Playing once keeps content visible when scrolling back up instead of
  // hiding and re-fading every block the reader has already seen.
  once = true,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = directionOffset[direction];

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      // Fire as soon as any edge enters, with a small head start below the
      // fold, so a fast scroll lands on content that is already fading in.
      viewport={{ once, amount: 0, margin: "0px 0px 80px 0px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : Math.min(delay, MAX_DELAY),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
