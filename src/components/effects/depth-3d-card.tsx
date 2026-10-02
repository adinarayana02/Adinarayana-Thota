"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Depth3DCardProps {
  children: React.ReactNode;
  className?: string;
  depthStrength?: number;
  glareColor?: string;
  style?: React.CSSProperties;
}

export function Depth3DCard({
  children,
  className = "",
  depthStrength = 18,
  glareColor = "rgba(255, 255, 255, 0.08)",
  style = {},
}: Depth3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for rotation
  const springConfig = { damping: 20, stiffness: 260, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depthStrength, -depthStrength]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depthStrength, depthStrength]), springConfig);

  // Specular glare gradient position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: 1200, ...style }}
      className={`relative ${className}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative transition-shadow duration-300"
      >
        {children}

        {/* Specular glare shine layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-50"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 350px at ${glareX}% ${glareY}%, ${glareColor}, transparent 80%)`,
          }}
        />
      </motion.div>
    </div>
  );
}

export function DepthLayer({
  z = 20,
  children,
  className = "",
}: {
  z?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{
        transform: `translateZ(${z}px)`,
        transformStyle: "preserve-3d",
      }}
      className={`transition-transform duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
