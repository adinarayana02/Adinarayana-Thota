"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Code2, Database, GitBranch, Rocket } from "lucide-react";
import { useRef } from "react";

const storySteps = [
  {
    icon: Code2,
    kicker: "01 / map",
    title: "Scope the system like an engineer, not a decorator.",
    body: "Start with the user path, the data model, and the reliability risks before choosing animation or interface patterns.",
    command: "npx create-signal --intent production",
  },
  {
    icon: Database,
    kicker: "02 / compose",
    title: "Build the stack around useful AI behavior.",
    body: "RAG pipelines, workflow automations, and APIs are presented as architecture, so visitors can read how the work actually functions.",
    command: "pnpm wire rag --latency-budget 200ms",
  },
  {
    icon: GitBranch,
    kicker: "03 / verify",
    title: "Expose tradeoffs, metrics, and implementation choices.",
    body: "Project cards prioritize constraints, outcomes, and tech decisions instead of generic screenshots and buzzwords.",
    command: "git diff --check-craft",
  },
  {
    icon: Rocket,
    kicker: "04 / ship",
    title: "Make the portfolio itself demonstrate craft.",
    body: "Scroll, hover, and 3D effects are intentionally paced and reduced-motion aware, so the interaction feels premium rather than noisy.",
    command: "vercel deploy --confidence high",
  },
];

export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const y = useTransform(scrollYProgress, [0, 1], [34, -34]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.28, 0.5, 0.34]);

  return (
    <section
      id="story"
      ref={ref}
      className="scroll-story relative z-10 border-t border-border/40 px-4 py-24 sm:px-6 md:py-32 scroll-mt-20"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:h-[calc(100dvh-8rem)]">
          <span className="eyebrow">
            <Code2 size={14} aria-hidden="true" />
            Scroll the build path
          </span>
          <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-[-0.06em] sm:text-5xl md:text-6xl">
            A portfolio that behaves like a product case study.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground">
            The new interaction model borrows from high-end WebGL portfolios:
            one controlled scroll narrative, sticky depth, tactile cards, and
            proof-first content.
          </p>

          <motion.div
            style={shouldReduceMotion ? undefined : { rotate, y }}
            className="scroll-story__console mt-10 hidden overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 shadow-2xl backdrop-blur-xl lg:block"
          >
            <div className="flex h-11 items-center gap-2 border-b border-border/60 px-4">
              <span />
              <span />
              <span />
              <small>adinarayana.dev / craft-check</small>
            </div>
            <div className="space-y-5 p-6 font-mono text-xs leading-6">
              <p className="text-muted-foreground">
                <span className="text-primary">const</span> portfolio = audit(&#123;
              </p>
              <p className="pl-5 text-muted-foreground">signal: “AI systems”,</p>
              <p className="pl-5 text-muted-foreground">motion: “scroll-linked”,</p>
              <p className="pl-5 text-muted-foreground">noise: false,</p>
              <p className="text-muted-foreground">&#125;);</p>
              <motion.div
                style={{ opacity: glow }}
                className="scroll-story__orb"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>

        <div className="space-y-5">
          {storySteps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.34, once: false }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                delay: shouldReduceMotion ? 0 : index * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="scroll-story__card spatial-surface group"
            >
              <div className="flex items-start gap-4">
                <div className="scroll-story__icon">
                  <step.icon size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                    {step.kicker}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.045em] text-foreground md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    {step.body}
                  </p>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-background/50 px-4 py-3 font-mono text-xs text-muted-foreground">
                    <span className="text-primary">➜</span> {step.command}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
