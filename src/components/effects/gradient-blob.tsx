"use client";

import { motion } from "framer-motion";

export function GradientBlob() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 w-80 h-80 bg-secondary/8 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 60, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 right-1/3 w-72 h-72 bg-accent/6 rounded-full blur-3xl"
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
