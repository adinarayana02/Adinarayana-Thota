"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Floating3DCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glareColor?: string;
  style?: React.CSSProperties;
}

export function Floating3DCard({
  children,
  className = "",
  depth = 14,
  glareColor = "rgba(16, 185, 129, 0.15)",
  style = {},
}: Floating3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // 3D Rotations
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [depth, -depth]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-depth, depth]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normX = clientX / rect.width - 0.5;
    const normY = clientY / rect.height - 0.5;

    x.set(normX);
    y.set(normY);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1200, ...style }}
      className={`relative ${className}`}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full h-full rounded-3xl transition-shadow duration-300"
      >
        {/* Dynamic Specular Glare Layer */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 320px at ${glareX.get()} ${glareY.get()}, ${glareColor}, transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />
        )}

        {/* Content Container with 3D Depth Separation */}
        <div style={{ transform: "translateZ(20px)" }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
