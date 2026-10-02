"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { soundManager } from "@/lib/sounds";

export function AiCore3D({
  className = "",
  size = 280,
}: {
  className?: string;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Core group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 3. Outer Wireframe Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x10b981 : 0x059669,
      wireframe: true,
      emissive: 0x10b981,
      emissiveIntensity: isDark ? 0.6 : 0.3,
      roughness: 0.2,
      metalness: 0.8,
    });
    const outerIco = new THREE.Mesh(icoGeometry, icoMaterial);
    coreGroup.add(outerIco);

    // 4. Middle Concentric Torus Ring
    const torusGeometry = new THREE.TorusGeometry(1.9, 0.03, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x6366f1,
      transparent: true,
      opacity: 0.7,
    });
    const torusRing1 = new THREE.Mesh(torusGeometry, torusMaterial);
    torusRing1.rotation.x = Math.PI / 3;
    coreGroup.add(torusRing1);

    const torusRing2 = new THREE.Mesh(torusGeometry, torusMaterial);
    torusRing2.rotation.y = Math.PI / 3;
    coreGroup.add(torusRing2);

    // 5. Inner Pulsing Core Orb
    const innerGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerOrb);

    // 6. Point Lights
    const pointLight = new THREE.PointLight(0x10b981, 2.5, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 7. Ambient Particle Dust
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0x6ee7b7 : 0x10b981,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 8. Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let pulseScale = 1;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handleClick = () => {
      soundManager.playPop();
      pulseScale = 1.35; // Trigger instant ripple burst
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // 9. Render Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth mouse tracking tilt
      targetX += (mouseX * 0.8 - targetX) * 0.05;
      targetY += (mouseY * 0.8 - targetY) * 0.05;

      coreGroup.rotation.y = elapsed * 0.45 + targetX;
      coreGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.2 + targetY;

      torusRing1.rotation.z += 0.015;
      torusRing2.rotation.z -= 0.012;

      // Pulse physics decay
      pulseScale += (1 - pulseScale) * 0.08;
      const breathing = 1 + Math.sin(elapsed * 3) * 0.08;
      innerOrb.scale.set(
        breathing * pulseScale,
        breathing * pulseScale,
        breathing * pulseScale
      );

      outerIco.scale.set(pulseScale, pulseScale, pulseScale);
      particles.rotation.y -= 0.005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark, size]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="Interactive 3D Neural Core - Click to pulse"
    >
      <div className="absolute inset-0 rounded-full bg-primary/10 filter blur-2xl pointer-events-none animate-pulse" />
    </div>
  );
}
