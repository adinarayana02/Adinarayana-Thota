"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { soundManager } from "@/lib/sounds";
import { Code2 } from "lucide-react";

interface TechTag {
  name: string;
  category: "AI" | "Frontend" | "Backend" | "Data" | "DevOps";
  color: string;
}

const TECH_TAGS: TechTag[] = [
  // AI & GenAI
  { name: "Google Gemini", category: "AI", color: "#10b981" },
  { name: "LangChain", category: "AI", color: "#10b981" },
  { name: "LlamaIndex", category: "AI", color: "#10b981" },
  { name: "Groq LPU", category: "AI", color: "#10b981" },
  { name: "RAG Architecture", category: "AI", color: "#10b981" },
  { name: "ChromaDB", category: "Data", color: "#8b5cf6" },
  { name: "Vapi Voice AI", category: "AI", color: "#10b981" },
  { name: "Hugging Face", category: "AI", color: "#10b981" },
  { name: "Vector Embeddings", category: "Data", color: "#8b5cf6" },
  { name: "PyTorch", category: "AI", color: "#10b981" },

  // Frontend
  { name: "Next.js 16", category: "Frontend", color: "#3b82f6" },
  { name: "React 19", category: "Frontend", color: "#3b82f6" },
  { name: "TypeScript", category: "Frontend", color: "#3b82f6" },
  { name: "Tailwind CSS v4", category: "Frontend", color: "#3b82f6" },
  { name: "Framer Motion", category: "Frontend", color: "#3b82f6" },
  { name: "Three.js / WebGL", category: "Frontend", color: "#3b82f6" },
  { name: "Shadcn UI", category: "Frontend", color: "#3b82f6" },

  // Backend
  { name: "Node.js", category: "Backend", color: "#06b6d4" },
  { name: "Express.js", category: "Backend", color: "#06b6d4" },
  { name: "FastAPI", category: "Backend", color: "#06b6d4" },
  { name: "REST APIs", category: "Backend", color: "#06b6d4" },
  { name: "JWT Security", category: "Backend", color: "#06b6d4" },
  { name: "WebSockets", category: "Backend", color: "#06b6d4" },

  // Data & DevOps
  { name: "MongoDB Atlas", category: "Data", color: "#8b5cf6" },
  { name: "Mongoose ODM", category: "Data", color: "#8b5cf6" },
  { name: "Redis Cache", category: "Data", color: "#8b5cf6" },
  { name: "Docker", category: "DevOps", color: "#f59e0b" },
  { name: "Vercel CI/CD", category: "DevOps", color: "#f59e0b" },
  { name: "Git / GitHub", category: "DevOps", color: "#f59e0b" },
];

export function TechGlobe3D({
  radius = 210,
  className = "",
  onSelectTag,
}: {
  radius?: number;
  className?: string;
  onSelectTag?: (name: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Compute 3D Fibonacci sphere positions
  const tagsWithCoords = useMemo(() => {
    const total = TECH_TAGS.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    return TECH_TAGS.map((tag, i) => {
      const y = 1 - (i / (total - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      return {
        ...tag,
        x: x * radius,
        y: y * radius,
        z: z * radius,
      };
    });
  }, [radius]);

  const [coords, setCoords] = useState(tagsWithCoords);

  // Rotation physics state
  const rotationRef = useRef({
    rx: 0.0018,
    ry: 0.0032,
    isDragging: false,
    startX: 0,
    startY: 0,
    lastDeltaX: 0,
    lastDeltaY: 0,
  });

  useEffect(() => {
    let animId: number;

    const updateSphere = () => {
      setCoords((prev) => {
        const { rx, ry } = rotationRef.current;
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);

        return prev.map((item) => {
          // Rotate around Y axis
          const x1 = item.x * cosY - item.z * sinY;
          const z1 = item.z * cosY + item.x * sinY;

          // Rotate around X axis
          const y1 = item.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + item.y * sinX;

          return {
            ...item,
            x: x1,
            y: y1,
            z: z2,
          };
        });
      });

      // Apply friction if not dragging
      if (!rotationRef.current.isDragging) {
        rotationRef.current.rx *= 0.96;
        rotationRef.current.ry *= 0.96;
        // Keep minimum baseline gentle spin
        if (Math.abs(rotationRef.current.rx) < 0.0008) rotationRef.current.rx = 0.0008;
        if (Math.abs(rotationRef.current.ry) < 0.0018) rotationRef.current.ry = 0.0018;
      }

      animId = requestAnimationFrame(updateSphere);
    };

    animId = requestAnimationFrame(updateSphere);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    rotationRef.current.isDragging = true;
    rotationRef.current.startX = e.clientX;
    rotationRef.current.startY = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!rotationRef.current.isDragging) return;
    const deltaX = (e.clientX - rotationRef.current.startX) * 0.00025;
    const deltaY = (e.clientY - rotationRef.current.startY) * 0.00025;

    rotationRef.current.ry = deltaX;
    rotationRef.current.rx = -deltaY;
    rotationRef.current.lastDeltaX = deltaX;
    rotationRef.current.lastDeltaY = deltaY;

    rotationRef.current.startX = e.clientX;
    rotationRef.current.startY = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    rotationRef.current.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleTagClick = (tagName: string) => {
    soundManager.playPop();
    setSelectedTag(tagName);
    if (onSelectTag) {
      onSelectTag(tagName);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-[450px] sm:h-[500px] flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Ambient background glow orb */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/10 filter blur-3xl pointer-events-none animate-pulse" />

      {/* Center Core HUD Label */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none z-0">
        <div className="w-16 h-16 rounded-full border border-dashed border-primary/40 flex items-center justify-center animate-spin" style={{ animationDuration: "25s" }}>
          <Code2 className="w-6 h-6 text-primary" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-2">
          {selectedTag ? `Selected: ${selectedTag}` : "Drag 3D Sphere"}
        </span>
      </div>

      {/* 3D Floating Tech Tag Nodes */}
      {coords.map((item) => {
        // Perspective projection calculation
        const focalLength = 400;
        const scale = (focalLength + item.z) / (focalLength + radius);
        const alpha = Math.max(0.18, (item.z + radius) / (2 * radius));
        const zIndex = Math.round((item.z + radius) * 10);
        const isSelected = selectedTag === item.name;

        return (
          <button
            key={item.name}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTagClick(item.name);
            }}
            style={{
              transform: `translate3d(${item.x}px, ${item.y}px, ${item.z}px) scale(${Math.max(0.6, scale)})`,
              opacity: isSelected ? 1 : alpha,
              zIndex,
            }}
            className={`absolute px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-150 cursor-pointer backdrop-blur-md shadow-md border ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/40 scale-110"
                : item.z > 0
                ? "bg-card/90 text-foreground border-border/80 hover:border-primary hover:text-primary hover:scale-110"
                : "bg-card/50 text-muted-foreground border-border/30"
            }`}
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
