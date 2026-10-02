"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  baseAlpha: number;
}

interface Meteor {
  x: number;
  y: number;
  z: number;
  length: number;
  speed: number;
  angle: number;
  color: string;
  opacity: number;
  width: number;
  active: boolean;
}

export function ShootingStars3D({
  className = "",
  starCount = 120,
}: {
  className?: string;
  starCount?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Color palette for shooting stars
    const meteorColors = isDark
      ? ["#10b981", "#38bdf8", "#818cf8", "#a855f7", "#34d399"]
      : ["#059669", "#0284c7", "#6366f1", "#9333ea", "#10b981"];

    // 1. Initialize 3D Constellation Stars
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const baseAlpha = Math.random() * 0.7 + 0.3;
      stars.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100, // 3D depth
        size: Math.random() * 1.5 + 0.5,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        baseAlpha,
      });
    }

    // 2. Meteors / Shooting Stars Pool
    const meteors: Meteor[] = [];
    const maxMeteors = 3;

    const spawnMeteor = (): Meteor => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // ~45 degrees diagonal
      return {
        x: Math.random() * width * 1.2 - width * 0.1,
        y: Math.random() * (height * 0.4) - 50,
        z: Math.random() * 300 + 50,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 12 + 10,
        angle,
        color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
        opacity: 1,
        width: Math.random() * 1.8 + 1.2,
        active: true,
      };
    };

    // Spawn initial meteor
    meteors.push(spawnMeteor());

    let nextSpawnTime = Date.now() + Math.random() * 2500 + 1500;

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 60;
      targetMouseY = ((e.clientY - rect.top) / height - 0.5) * 60;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Optional click burst: clicking spawns an instant shooting star
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const meteor = spawnMeteor();
      meteor.x = e.clientX - rect.left;
      meteor.y = e.clientY - rect.top;
      meteor.speed = 18;
      meteors.push(meteor);
    };

    window.addEventListener("click", handleCanvasClick);

    // 3. Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const fov = 400;
      const centerX = width / 2 + mouseX;
      const centerY = height / 2 + mouseY;

      // Draw Twinkling 3D Stars
      stars.forEach((star) => {
        // Twinkle sine oscillation
        star.alpha += star.twinkleSpeed;
        const currentAlpha = Math.abs(Math.sin(star.alpha)) * star.baseAlpha;

        // 3D Perspective Projection
        const scale = fov / (fov + star.z);
        const screenX = centerX + star.x * scale;
        const screenY = centerY + star.y * scale;
        const screenSize = star.size * scale;

        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.5, screenSize), 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${currentAlpha * 0.85})`
            : `rgba(16, 185, 129, ${currentAlpha * 0.6})`;
          ctx.fill();

          // Subtle glow halo for larger stars
          if (screenSize > 1) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, screenSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = isDark
              ? `rgba(16, 185, 129, ${currentAlpha * 0.15})`
              : `rgba(59, 130, 246, ${currentAlpha * 0.12})`;
            ctx.fill();
          }
        }
      });

      // Spawn periodic meteors
      if (Date.now() > nextSpawnTime && meteors.filter((m) => m.active).length < maxMeteors) {
        meteors.push(spawnMeteor());
        nextSpawnTime = Date.now() + Math.random() * 3000 + 2000;
      }

      // Draw & Update Meteors (Shooting Stars)
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) continue;

        // Move meteor along angle
        const vx = Math.cos(m.angle) * m.speed;
        const vy = Math.sin(m.angle) * m.speed;

        m.x += vx;
        m.y += vy;

        // Perspective scale for meteor
        const scale = fov / (fov + m.z);
        const currentLength = m.length * scale;

        const tailX = m.x - Math.cos(m.angle) * currentLength;
        const tailY = m.y - Math.sin(m.angle) * currentLength;

        // Linear gradient for glowing shooting tail
        const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.6, `${m.color}33`);
        gradient.addColorStop(0.9, `${m.color}cc`);
        gradient.addColorStop(1, isDark ? "#ffffff" : m.color);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.width * scale;
        ctx.lineCap = "round";
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Glowing Meteor Head Core
        ctx.beginPath();
        ctx.arc(m.x, m.y, (m.width + 1) * scale, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#ffffff" : m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();

        // Deactivate if out of bounds
        if (m.x > width + 150 || m.y > height + 150) {
          m.active = false;
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // 4. Handle Window Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark, starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
