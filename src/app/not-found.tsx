"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 grid-pattern">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Decorative glow */}
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
          <h1 className="relative text-8xl md:text-9xl font-bold gradient-text font-[family-name:var(--font-heading)] animate-float">
            404
          </h1>
        </div>
        <h2 className="mt-4 text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)]">
          Page <span className="gradient-text-anime">Not Found</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="anime-btn inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="anime-btn-outline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </section>
  );
}
