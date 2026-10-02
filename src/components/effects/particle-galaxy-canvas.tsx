"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function ParticleGalaxyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 16);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. The 4 Scroll-Driven Color & Lighting Stage Palettes
    // Stage 1: Deep Space (Hero)
    const stageDeepSpace = {
      core: new THREE.Color("#10b981"),
      mid: new THREE.Color("#38bdf8"),
      outer: new THREE.Color("#6366f1"),
      ambient: new THREE.Color("#090a16"),
      lightIntensity: 1.2,
    };

    // Stage 2: Neon Cyberpunk (Capabilities & AI Sandboxes)
    const stageCyberpunk = {
      core: new THREE.Color("#00f0ff"),
      mid: new THREE.Color("#10b981"),
      outer: new THREE.Color("#ec4899"),
      ambient: new THREE.Color("#0f172a"),
      lightIntensity: 2.2,
    };

    // Stage 3: Warm Minimalist (Featured Projects)
    const stageWarmMinimal = {
      core: new THREE.Color("#f59e0b"),
      mid: new THREE.Color("#f97316"),
      outer: new THREE.Color("#e11d48"),
      ambient: new THREE.Color("#1c1917"),
      lightIntensity: 1.6,
    };

    // Stage 4: Clean Monochrome (Experience & Contact)
    const stageMonochrome = {
      core: new THREE.Color("#ffffff"),
      mid: new THREE.Color("#a1a1aa"),
      outer: new THREE.Color("#52525b"),
      ambient: new THREE.Color("#09090b"),
      lightIntensity: 1.0,
    };

    // 3. Logarithmic Spiral Galaxy Particles Setup
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);
    const particleRadii = new Float32Array(particleCount);

    const branches = 3;
    const radius = 13;
    const spin = 1.3;
    const randomness = 0.45;
    const randomnessPower = 3.5;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * radius;
      particleRadii[i] = r;
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      const x = Math.cos(branchAngle + spinAngle) * r + randomX;
      const y = randomY * 0.7;
      const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Start with Deep Space stage colors
      const mixedColor = stageDeepSpace.core.clone();
      if (r < radius * 0.35) {
        mixedColor.lerp(stageDeepSpace.mid, r / (radius * 0.35));
      } else {
        mixedColor.lerp(stageDeepSpace.outer, (r - radius * 0.35) / (radius * 0.65));
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = (Math.random() * 0.8 + 0.3) * (1 - r / (radius * 1.5) + 0.3);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Custom Circular Glow Texture
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(0.55, "rgba(255, 255, 255, 0.25)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 0.28,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: isDark ? 0.9 : 0.7,
    });

    const galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    // Subtle Outer Atmosphere Rings
    const ringGeo = new THREE.RingGeometry(12.2, 12.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    // 4. Mouse & Scroll Interaction with 4 Stages Interpolation
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollProgress = 0;
    let smoothScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let shockwaveTime = 0;
    const handleClick = () => {
      shockwaveTime = 1.0;
    };
    window.addEventListener("click", handleClick);

    // 5. Animation Loop with 4-Stage Lighting & Color Morphing
    let animationFrameId: number;
    const startTime = performance.now();

    // Helper to get active interpolated colors across the 4 stages
    const getStageColors = (progress: number) => {
      // 0.00 - 0.33: Deep Space -> Neon Cyberpunk
      // 0.33 - 0.66: Neon Cyberpunk -> Warm Minimalist
      // 0.66 - 1.00: Warm Minimalist -> Clean Monochrome
      const cCore = new THREE.Color();
      const cMid = new THREE.Color();
      const cOuter = new THREE.Color();
      const ringCol = new THREE.Color();

      if (progress < 0.33) {
        const t = progress / 0.33;
        cCore.lerpColors(stageDeepSpace.core, stageCyberpunk.core, t);
        cMid.lerpColors(stageDeepSpace.mid, stageCyberpunk.mid, t);
        cOuter.lerpColors(stageDeepSpace.outer, stageCyberpunk.outer, t);
        ringCol.lerpColors(stageDeepSpace.mid, stageCyberpunk.core, t);
      } else if (progress < 0.66) {
        const t = (progress - 0.33) / 0.33;
        cCore.lerpColors(stageCyberpunk.core, stageWarmMinimal.core, t);
        cMid.lerpColors(stageCyberpunk.mid, stageWarmMinimal.mid, t);
        cOuter.lerpColors(stageCyberpunk.outer, stageWarmMinimal.outer, t);
        ringCol.lerpColors(stageCyberpunk.core, stageWarmMinimal.core, t);
      } else {
        const t = (progress - 0.66) / 0.34;
        cCore.lerpColors(stageWarmMinimal.core, stageMonochrome.core, t);
        cMid.lerpColors(stageWarmMinimal.mid, stageMonochrome.mid, t);
        cOuter.lerpColors(stageWarmMinimal.outer, stageMonochrome.outer, t);
        ringCol.lerpColors(stageWarmMinimal.core, stageMonochrome.core, t);
      }

      return { cCore, cMid, cOuter, ringCol };
    };

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Smooth mouse and scroll interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      smoothScroll += (scrollProgress - smoothScroll) * 0.06;

      // Update particle colors based on smoothScroll stage
      const { cCore, cMid, cOuter, ringCol } = getStageColors(smoothScroll);
      const colorAttr = geometry.attributes.color;

      for (let i = 0; i < particleCount; i++) {
        const r = particleRadii[i];
        const particleCol = cCore.clone();

        if (r < radius * 0.35) {
          particleCol.lerp(cMid, r / (radius * 0.35));
        } else {
          particleCol.lerp(cOuter, (r - radius * 0.35) / (radius * 0.65));
        }

        colorAttr.setXYZ(i, particleCol.r, particleCol.g, particleCol.b);
      }
      colorAttr.needsUpdate = true;

      // Update atmosphere ring color
      ringMat.color.copy(ringCol);

      // Galaxy rotation and tilt physics
      // Stage 1/2: Faster spiral; Stage 3/4: Elegant slow planar drift
      const speedMultiplier = 1 - smoothScroll * 0.45;
      galaxy.rotation.y = elapsedTime * 0.08 * speedMultiplier + mouseX * 0.35;
      galaxy.rotation.x = 0.45 + mouseY * 0.25 + smoothScroll * 1.1;
      galaxy.rotation.z = Math.sin(elapsedTime * 0.2) * 0.06;

      orbitRing.rotation.z = -elapsedTime * 0.04;
      orbitRing.rotation.x = Math.PI / 2 + mouseY * 0.2 + smoothScroll * 0.5;

      // Scroll-driven camera fly-through
      const targetCamY = 3.5 - smoothScroll * 5.0;
      const targetCamZ = 16 - smoothScroll * 6.5;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, -smoothScroll * 2.0, 0);

      // Shockwave ripple
      if (shockwaveTime > 0) {
        shockwaveTime -= 0.03;
        const posAttr = geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const origX = originalPositions[i3];
          const origY = originalPositions[i3 + 1];
          const origZ = originalPositions[i3 + 2];
          const dist = Math.sqrt(origX * origX + origZ * origZ);
          const wave = Math.sin(dist * 0.8 - (1 - shockwaveTime) * 10) * shockwaveTime * 0.6;
          posAttr.setY(i, origY + wave);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
