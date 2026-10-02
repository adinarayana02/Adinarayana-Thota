"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.4 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    },
    [cursorX, cursorY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.body.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const updateCursorType = () => {
      const handleOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isClickable =
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") ||
          target.closest("button") ||
          target.closest("[role='button']") ||
          window.getComputedStyle(target).cursor === "pointer";
        setIsPointer(!!isClickable);
      };
      document.addEventListener("mouseover", handleOver);
      return () => document.removeEventListener("mouseover", handleOver);
    };
    
    const cleanup = updateCursorType();
    setMounted(true);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cleanup();
    };
  }, [handleMouseMove, handleMouseLeave]);

  if (!mounted) return null;
  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      {/* Central Targeting Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPointer ? 0.8 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
      </motion.div>

      {/* Outer Targeting Reticle */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 0.85 : 0,
          scale: isPointer ? 1.35 : 1,
          rotate: isPointer ? 90 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Target Ring */}
          <div className="absolute inset-0 border border-primary/30 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.1)]" />
          
          {/* Active indicator ring on hover */}
          {isPointer && (
            <motion.div 
              className="absolute inset-[-4px] border border-dashed border-secondary/50 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          )}

          {/* Crosshair lines (ticks) */}
          <div className="absolute top-[-3px] bottom-[-3px] left-1/2 w-[1px] bg-primary/45 -translate-x-1/2 scale-y-[0.15]" />
          <div className="absolute left-[-3px] right-[-3px] top-1/2 h-[1px] bg-primary/45 -translate-y-1/2 scale-x-[0.15]" />

          {/* Corner HUD Brackets when hovering over clickables */}
          {isPointer && (
            <>
              <div className="absolute top-[-2px] left-[-2px] w-1.5 h-1.5 border-t border-l border-primary" />
              <div className="absolute top-[-2px] right-[-2px] w-1.5 h-1.5 border-t border-r border-primary" />
              <div className="absolute bottom-[-2px] left-[-2px] w-1.5 h-1.5 border-b border-l border-primary" />
              <div className="absolute bottom-[-2px] right-[-2px] w-1.5 h-1.5 border-b border-r border-primary" />
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
