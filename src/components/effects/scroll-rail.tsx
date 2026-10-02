"use client";

import { useEffect, useRef, useState } from "react";
import { soundManager } from "@/lib/sounds";

interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "experience", label: "Journey" },
  { id: "services", label: "Capabilities" },
  { id: "playground", label: "AI Twin" },
  { id: "rag-simulator", label: "RAG Demo" },
  { id: "projects", label: "Projects" },
  { id: "signal", label: "Signal" },
  { id: "contact", label: "Contact" },
];

export function ScrollRail() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let sectionTops: { id: string; top: number }[] = [];

    // Section offsets only change on resize/content changes, so measure them
    // once here instead of forcing layout on every scroll event.
    const measure = () => {
      sectionTops = SECTIONS.flatMap(({ id }) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top + window.scrollY }] : [];
      });
    };

    const update = () => {
      frame = 0;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      // Written straight to the DOM: a React re-render per scroll frame is
      // what made the page stutter.
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${progress})`;
      }

      const scrollPos = window.scrollY + 300;
      for (let i = sectionTops.length - 1; i >= 0; i--) {
        if (scrollPos >= sectionTops[i].top) {
          setActiveSection(sectionTops[i].id);
          break;
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    // Late-loading content (images, data) shifts section offsets.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    soundManager.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Section Navigation Rail"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 p-2 rounded-full bg-card/90 border border-border/40 shadow-lg"
    >
      {/* Scroll track fill bar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[1.5px] bg-border/40 -z-10">
        <div
          ref={progressRef}
          className="h-full w-full origin-top bg-primary rounded-full"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            aria-label={`Scroll to ${sec.label}`}
            className="group relative flex items-center justify-center p-1.5 focus:outline-none"
          >
            {/* Indicator Dot / Pill */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-6 bg-primary shadow-sm shadow-primary/50"
                  : "w-2 h-2 bg-muted-foreground/40 hover:bg-foreground hover:scale-125"
              }`}
            />

            {/* Hover Tooltip */}
            <span className="pointer-events-none absolute right-7 rounded-md bg-popover/90 px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-popover-foreground border border-border/60 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 whitespace-nowrap">
              {sec.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
