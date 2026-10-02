"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { soundManager } from "@/lib/sounds";
import { Brain } from "lucide-react";

interface VectorNode {
  id: string;
  name: string;
  category: "AI & LLMs" | "Full-Stack" | "Vector DB & Cloud" | "DevOps & Core";
  vector: [number, number, number]; // 3D coordinates in embedding space
  color: string;
  connections: string[];
  description: string;
  similarityScore: number;
}

const VECTOR_NODES: VectorNode[] = [
  // AI & LLMs cluster
  { id: "llm", name: "Large Language Models", category: "AI & LLMs", vector: [0, 2.2, 0.4], color: "#10b981", connections: ["rag", "langchain", "groq", "gemini"], description: "Transformer architectures, tokenization, temperature sampling & prompt engineering", similarityScore: 0.98 },
  { id: "rag", name: "RAG Pipelines", category: "AI & LLMs", vector: [-1.4, 1.8, 0.8], color: "#10b981", connections: ["llm", "chromadb", "embeddings", "langchain"], description: "Retrieval-Augmented Generation with multi-query fusion & reranking", similarityScore: 0.95 },
  { id: "langchain", name: "LangChain & LlamaIndex", category: "AI & LLMs", vector: [1.2, 1.9, -0.6], color: "#10b981", connections: ["llm", "rag", "groq"], description: "Autonomous agents, tool routing chains, structured output parsers", similarityScore: 0.94 },
  { id: "groq", name: "Groq LPU Acceleration", category: "AI & LLMs", vector: [0.8, 2.8, 0.2], color: "#10b981", connections: ["llm", "langchain"], description: "Sub-100ms ultra-low latency inference pipelines for real-time applications", similarityScore: 0.92 },
  { id: "gemini", name: "Google Gemini Multimodal", category: "AI & LLMs", vector: [-1.8, 2.4, -0.4], color: "#10b981", connections: ["llm", "vapi"], description: "Vision-language analysis, 1M+ context window orchestration", similarityScore: 0.91 },
  { id: "vapi", name: "Vapi Voice AI", category: "AI & LLMs", vector: [-2.2, 1.2, 1.1], color: "#10b981", connections: ["gemini", "nextjs"], description: "Real-time bi-directional WebRTC voice streaming & acoustic synthesis", similarityScore: 0.89 },
  
  // Vector DB & Cloud Cluster
  { id: "chromadb", name: "ChromaDB Vector Store", category: "Vector DB & Cloud", vector: [-2.4, 0.4, 0.6], color: "#8b5cf6", connections: ["rag", "embeddings", "mongodb"], description: "HNSW high-dimensional vector index for sub-millisecond similarity search", similarityScore: 0.96 },
  { id: "embeddings", name: "Sentence Transformers", category: "Vector DB & Cloud", vector: [-1.9, -0.6, 1.4], color: "#8b5cf6", connections: ["chromadb", "rag"], description: "Dense semantic vector spaces and normalized cosine distance metrics", similarityScore: 0.93 },
  { id: "mongodb", name: "MongoDB Atlas", category: "Vector DB & Cloud", vector: [-0.9, -1.8, 0.9], color: "#8b5cf6", connections: ["chromadb", "nodejs", "nextjs"], description: "Document aggregation pipelines, transactional schemas, and Atlas Vector Search", similarityScore: 0.90 },
  
  // Full-Stack Cluster
  { id: "nextjs", name: "Next.js 16 (App Router)", category: "Full-Stack", vector: [1.8, -0.4, 1.2], color: "#3b82f6", connections: ["react", "typescript", "tailwind", "nodejs"], description: "Server components, streaming SSR, Turbopack, and API route handlers", similarityScore: 0.97 },
  { id: "react", name: "React 19 & Hooks", category: "Full-Stack", vector: [2.3, 0.6, 0.4], color: "#3b82f6", connections: ["nextjs", "typescript", "tailwind"], description: "Concurrent rendering, custom hooks, transition hooks, state optimization", similarityScore: 0.96 },
  { id: "typescript", name: "TypeScript 5 Strict", category: "Full-Stack", vector: [1.6, 0.8, -1.4], color: "#3b82f6", connections: ["nextjs", "react", "nodejs"], description: "Type-safe architectures, generics, utility types, and runtime schema validation", similarityScore: 0.95 },
  { id: "tailwind", name: "Tailwind CSS v4", category: "Full-Stack", vector: [2.6, -1.2, 0.2], color: "#3b82f6", connections: ["nextjs", "react"], description: "Design systems, fluid responsive typography, and micro-interaction styling", similarityScore: 0.92 },
  { id: "nodejs", name: "Node.js & Express REST", category: "Full-Stack", vector: [0.4, -2.1, 0.6], color: "#3b82f6", connections: ["mongodb", "nextjs", "docker"], description: "Scalable backend microservices, JWT security, middleware chains, and rate limiters", similarityScore: 0.91 },

  // DevOps & Core Cluster
  { id: "docker", name: "Docker Containerization", category: "DevOps & Core", vector: [-0.8, -2.4, -1.2], color: "#f59e0b", connections: ["nodejs", "fastapi"], description: "Multi-stage production image builds and containerized deployment pipelines", similarityScore: 0.88 },
  { id: "fastapi", name: "FastAPI & Python", category: "DevOps & Core", vector: [0.6, -1.6, -1.8], color: "#f59e0b", connections: ["docker", "llm", "rag"], description: "Asynchronous Python backend for high-throughput model inference endpoints", similarityScore: 0.93 },
];

export function NeuralVectorCloud({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [activeNode, setActiveNode] = useState<VectorNode | null>(VECTOR_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<VectorNode | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Groups
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // 3. Node Meshes & Spheres
    const nodeMeshes: { mesh: THREE.Mesh; node: VectorNode; glowMesh: THREE.Mesh }[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.12, 24, 24);
    const glowGeometry = new THREE.SphereGeometry(0.24, 16, 16);

    VECTOR_NODES.forEach((node) => {
      const color = new THREE.Color(node.color);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.set(...node.vector);

      // Outer pulsating glow halo
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMat);
      glowMesh.position.copy(mesh.position);

      graphGroup.add(mesh);
      graphGroup.add(glowMesh);
      nodeMeshes.push({ mesh, node, glowMesh });
    });

    // 4. Connection Lines (Cosine Similarity Synapses)
    const lineMaterials: { line: THREE.Line; fromId: string; toId: string; mat: THREE.LineBasicMaterial }[] = [];
    
    VECTOR_NODES.forEach((fromNode) => {
      fromNode.connections.forEach((targetId) => {
        const toNode = VECTOR_NODES.find((n) => n.id === targetId);
        if (toNode && fromNode.id < toNode.id) {
          const points = [
            new THREE.Vector3(...fromNode.vector),
            new THREE.Vector3(...toNode.vector),
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const mat = new THREE.LineBasicMaterial({
            color: isDark ? 0x3b82f6 : 0x10b981,
            transparent: true,
            opacity: 0.2,
          });
          const line = new THREE.Line(geometry, mat);
          graphGroup.add(line);
          lineMaterials.push({ line, fromId: fromNode.id, toId: toNode.id, mat });
        }
      });
    });

    // 5. Ambient Dust Particles
    const dustCount = 80;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 10;
      dustPositions[i + 1] = (Math.random() - 0.5) * 10;
      dustPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x94a3b8 : 0x64748b,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    graphGroup.add(dustPoints);

    // 6. Interaction & Mouse Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    const rotationVelocityY = 0.0025;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        previousMousePosition = { x: clientX, y: clientY };
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          soundManager.playPop();
          setActiveNode(hit.node);
        }
      }
    };

    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    container.addEventListener("click", handleClick);
    container.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);

    // 7. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Continuous slow orbital drift + user interaction damping
      if (!isDragging) {
        targetRotationY += rotationVelocityY * 0.5;
        targetRotationX += Math.sin(elapsedTime * 0.5) * 0.0005;
      }

      graphGroup.rotation.y += (targetRotationY - graphGroup.rotation.y) * 0.08;
      graphGroup.rotation.x += (targetRotationX - graphGroup.rotation.x) * 0.08;

      // Pulse glows
      nodeMeshes.forEach(({ glowMesh }, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 2.5 + idx) * 0.15;
        glowMesh.scale.set(scale, scale, scale);
      });

      // Hover Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      let currentHovered: VectorNode | null = null;
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          currentHovered = hit.node;
          document.body.style.cursor = "pointer";
        }
      } else {
        document.body.style.cursor = "default";
      }
      setHoveredNode(currentHovered);

      // Highlight connection lines for hovered or active node
      const focusNodeId = currentHovered?.id || activeNode?.id;
      lineMaterials.forEach(({ fromId, toId, mat }) => {
        if (focusNodeId && (fromId === focusNodeId || toId === focusNodeId)) {
          mat.opacity = 0.85;
          mat.color.set(0x10b981);
        } else {
          mat.opacity = isDark ? 0.15 : 0.25;
          mat.color.set(isDark ? 0x3b82f6 : 0x64748b);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark, activeNode]);

  const displayNode = hoveredNode || activeNode || VECTOR_NODES[0];

  return (
    <div className={`relative w-full h-[520px] md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-card/80 to-card/30 border border-border/80 shadow-2xl backdrop-blur-xl ${className}`}>
      
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/60 text-xs font-mono">
          <Brain className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-semibold text-foreground">3D Semantic Embedding Space</span>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">HNSW Graph</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-muted-foreground bg-background/60 backdrop-blur-md px-3 py-1 rounded-full border border-border/40">
          <span>Drag to rotate - Click node to inspect</span>
        </div>
      </div>

      {/* Node Inspector HUD Overlay (Bottom-left) */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 pointer-events-auto">
        <div className="anime-card p-5 rounded-2xl bg-card/90 backdrop-blur-xl border border-primary/30 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: displayNode.color }} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                {displayNode.category}
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
              Cosine Sim: {(displayNode.similarityScore * 100).toFixed(1)}%
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
              {displayNode.name}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
              {displayNode.description}
            </p>
          </div>

          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-muted-foreground">Connected Vector Synapses:</span>
              {displayNode.connections.map((connId) => {
                const target = VECTOR_NODES.find((n) => n.id === connId);
                return (
                  <span
                    key={connId}
                    onClick={() => {
                      if (target) {
                        soundManager.playClick();
                        setActiveNode(target);
                      }
                    }}
                    className="text-[10px] font-mono font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-2 py-0.5 rounded-full cursor-pointer transition"
                  >
                    {target?.name.split(" ")[0] || connId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Legend (Top Right) */}
      <div className="hidden lg:flex flex-col gap-1.5 absolute top-16 right-4 z-10 bg-background/70 backdrop-blur-md p-3 rounded-2xl border border-border/40 pointer-events-none text-[11px] font-mono">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Vector Clusters</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>AI & LLMs Core</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
          <span>Vector DB & Storage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span>Full-Stack MERN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span>DevOps & Inference</span>
        </div>
      </div>

    </div>
  );
}
