"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values to track normalize mouse coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse coordinate ratios to degrees of rotation with smooth springs
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    damping: 25,
    stiffness: 260,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    damping: 25,
    stiffness: 260,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (event.clientX - rect.left) / width - 0.5;
    const mouseY = (event.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`h-full cursor-pointer select-none transition-all duration-200 ${className}`}
    >
      <div 
        style={{ 
          transform: "translateZ(25px)", 
          transformStyle: "preserve-3d" 
        }} 
        className="h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
