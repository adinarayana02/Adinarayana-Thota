"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundManager } from "@/lib/sounds";
import { Brain, Layers, Cpu } from "lucide-react";

type ArchitectureMode = "ai" | "fullstack" | "automation";

export function Interactive3DWorkspace() {
  const [activeMode, setActiveMode] = useState<ArchitectureMode>("ai");
  const mountRef = useRef<HTMLDivElement>(null);
  const activeModeRef = useRef<ArchitectureMode>("ai");

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5, 5, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2.5, 20);
    pointLight.position.set(4, 6, 4);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x6366f1, 2, 20);
    blueLight.position.set(-4, -2, -4);
    scene.add(blueLight);

    // 3. Isometric Workspace / Layer Architecture Objects
    const group = new THREE.Group();
    scene.add(group);

    // Create 3 stackable isometric layers with glowing wireframes
    const layerMeshes: THREE.Mesh[] = [];
    const wireframeMeshes: THREE.LineSegments[] = [];
    const layerColors = [0x10b981, 0x38bdf8, 0x6366f1];

    for (let i = 0; i < 3; i++) {
      const boxGeo = new THREE.BoxGeometry(2.4, 0.28, 2.4);
      const boxMat = new THREE.MeshStandardMaterial({
        color: layerColors[i],
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.y = (i - 1) * 0.55;
      group.add(box);
      layerMeshes.push(box);

      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5 });
      const wire = new THREE.LineSegments(edges, lineMat);
      box.add(wire);
      wireframeMeshes.push(wire);
    }

    // Center Core Sphere (AI / Processor Orb)
    const sphereGeo = new THREE.IcosahedronGeometry(0.5, 2);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
      wireframe: true,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    coreSphere.position.set(0, 0, 0);
    group.add(coreSphere);

    // Connecting Synapse / Data Pillar Rings
    const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 4. Mouse Interactive Hover Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 1.5;
      targetMouseY = ((e.clientY - rect.top) / height - 0.5) * 1.5;
    };

    mount.addEventListener("pointermove", handlePointerMove);

    // 5. Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      const t = (performance.now() - startTime) / 1000;

      // Smooth mouse tilt
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      group.rotation.y = t * 0.35 + mouseX;
      group.rotation.x = 0.25 + mouseY * 0.4;

      coreSphere.rotation.x = t * 0.8;
      coreSphere.rotation.y = t * 1.2;

      ring1.rotation.z = t * 0.5;
      ring2.rotation.z = -t * 0.4;

      // Mode-specific unpacking physics
      const current = activeModeRef.current;
      if (current === "ai") {
        // AI: Unpacked Neural Layer Stack with floating gaps
        layerMeshes[0].position.y = THREE.MathUtils.lerp(layerMeshes[0].position.y, -0.9, 0.1);
        layerMeshes[1].position.y = THREE.MathUtils.lerp(layerMeshes[1].position.y, 0, 0.1);
        layerMeshes[2].position.y = THREE.MathUtils.lerp(layerMeshes[2].position.y, 0.9, 0.1);
        coreSphere.scale.setScalar(1 + Math.sin(t * 4) * 0.1);
        pointLight.color.setHex(0x10b981);
      } else if (current === "fullstack") {
        // Full-Stack: Compact, interleaved robust server layers
        layerMeshes[0].position.y = THREE.MathUtils.lerp(layerMeshes[0].position.y, -0.4, 0.1);
        layerMeshes[1].position.y = THREE.MathUtils.lerp(layerMeshes[1].position.y, 0, 0.1);
        layerMeshes[2].position.y = THREE.MathUtils.lerp(layerMeshes[2].position.y, 0.4, 0.1);
        layerMeshes[0].rotation.y = Math.sin(t * 0.5) * 0.1;
        layerMeshes[2].rotation.y = -Math.sin(t * 0.5) * 0.1;
        pointLight.color.setHex(0x38bdf8);
      } else {
        // Automation: Wide exploded pipeline ring
        layerMeshes[0].position.y = THREE.MathUtils.lerp(layerMeshes[0].position.y, -1.2, 0.1);
        layerMeshes[1].position.y = THREE.MathUtils.lerp(layerMeshes[1].position.y, 0, 0.1);
        layerMeshes[2].position.y = THREE.MathUtils.lerp(layerMeshes[2].position.y, 1.2, 0.1);
        pointLight.color.setHex(0x818cf8);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener("pointermove", handlePointerMove);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  const modeDetails = {
    ai: {
      title: "Agentic AI & Hybrid RAG Pipelines",
      description: "LangGraph orchestration, Qdrant hybrid RAG, cognitive memory, speech VAD, and MLflow production tracking.",
      stats: "110ms hybrid retrieval - 75% screening time cut",
      icon: Brain,
      color: "text-emerald-500",
      accent: "border-emerald-500/40 bg-emerald-500/10",
    },
    fullstack: {
      title: "High-Throughput FastAPI & React",
      description: "Async I/O RESTful APIs, batch inference serving, PostgreSQL/MySQL schemas, and responsive React frontend.",
      stats: "60% response time gain - 800 queries/min",
      icon: Layers,
      color: "text-sky-500",
      accent: "border-sky-500/40 bg-sky-500/10",
    },
    automation: {
      title: "B2B AI Business Automation Platform",
      description: "Voice Calling Agent, Social Media & SEO Automation, Lead Management, and MLflow experiment tracking.",
      stats: "Multi-Agent Automation - Telic Info Services",
      icon: Cpu,
      color: "text-indigo-500",
      accent: "border-indigo-500/40 bg-indigo-500/10",
    },
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
      {/* Category Mode Switcher Tabs */}
      <div className="flex border-b border-border bg-muted/30 p-1.5 gap-1 text-xs font-mono">
        {(["ai", "fullstack", "automation"] as ArchitectureMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveMode(mode);
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === mode
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {mode === "ai" && <Brain size={13} className="text-emerald-500" />}
            {mode === "fullstack" && <Layers size={13} className="text-sky-500" />}
            {mode === "automation" && <Cpu size={13} className="text-indigo-500" />}
            <span className="capitalize">{mode === "ai" ? "AI / RAG" : mode === "fullstack" ? "Full-Stack" : "Automation"}</span>
          </button>
        ))}
      </div>

      {/* 3D Isometric Viewport */}
      <div className="relative h-[250px] sm:h-[280px] w-full flex items-center justify-center overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Floating Tag Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded border border-border">
            Interactive 3D Layer Model (Drag to orbit)
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${modeDetails[activeMode].accent}`}>
            {activeMode.toUpperCase()} ARCHITECTURE
          </span>
        </div>
      </div>

      {/* Mode Details Info Footer */}
      <div className="p-4 sm:p-5 border-t border-border bg-card space-y-2 text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm sm:text-base text-foreground font-[family-name:var(--font-heading)]">
            {modeDetails[activeMode].title}
          </h4>
          <span className="text-[11px] font-mono text-muted-foreground">
            {modeDetails[activeMode].stats}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {modeDetails[activeMode].description}
        </p>
      </div>
    </div>
  );
}
