"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type RoutePalette = {
  primary: string;
  secondary: string;
  offset: number;
};

const ROUTE_PALETTES: Record<string, RoutePalette> = {
  "/": { primary: "#9688ff", secondary: "#52d4ee", offset: 0 },
  "/about": { primary: "#7c8cff", secondary: "#5ce1bd", offset: 0.7 },
  "/projects": { primary: "#aa7cff", secondary: "#5dc9ff", offset: 1.4 },
  "/skills": { primary: "#668cff", secondary: "#73e1ff", offset: 2.1 },
  "/experience": { primary: "#967cff", secondary: "#5ce1bd", offset: 2.8 },
  "/github": { primary: "#7788ff", secondary: "#74e0c1", offset: 3.5 },
  "/leetcode": { primary: "#a485ff", secondary: "#f4ad68", offset: 4.2 },
  "/contact": { primary: "#a478ff", secondary: "#64dbea", offset: 4.9 },
};

const MODULE_POSITIONS: Array<[number, number, number, number]> = [
  [-5.6, 2.8, -3.5, 0.34],
  [-4.2, -2.7, -4.5, 0.22],
  [5.1, 2.4, -4.2, 0.28],
  [4.8, -2.8, -3.2, 0.2],
  [-6.2, 0.1, -6.5, 0.18],
  [6.4, -0.2, -5.8, 0.24],
];

function seededRandom(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (seededRandom(index * 3) - 0.5) * 18;
    positions[index * 3 + 1] = (seededRandom(index * 3 + 1) - 0.5) * 11;
    positions[index * 3 + 2] = -1 - seededRandom(index * 3 + 2) * 10;
  }
  return positions;
}

const PARTICLE_POSITIONS = createParticlePositions(520);

function ParticleField({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.006;
    pointsRef.current.rotation.x += delta * 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.025}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingModules({ color }: { color: string }) {
  return (
    <group>
      {MODULE_POSITIONS.map(([x, y, z, scale], index) => (
        <Float
          key={`${x}-${y}`}
          speed={0.55 + index * 0.05}
          rotationIntensity={0.32}
          floatIntensity={0.45}
        >
          <mesh position={[x, y, z]} scale={scale}>
            {index % 2 === 0 ? (
              <octahedronGeometry args={[1, 0]} />
            ) : (
              <icosahedronGeometry args={[1, 0]} />
            )}
            <meshStandardMaterial
              color={color}
              wireframe
              transparent
              opacity={0.24}
              emissive={color}
              emissiveIntensity={0.45}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function CoreSculpture({ palette }: { palette: RoutePalette }) {
  const sculptureRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!sculptureRef.current || !innerRef.current) return;
    sculptureRef.current.rotation.y += delta * 0.075;
    sculptureRef.current.rotation.x = THREE.MathUtils.lerp(
      sculptureRef.current.rotation.x,
      state.pointer.y * 0.15,
      0.035
    );
    innerRef.current.rotation.z -= delta * 0.11;
  });

  return (
    <group
      ref={sculptureRef}
      position={[3.9, 0.3, -4.8]}
      rotation={[0.18, palette.offset, -0.1]}
    >
      <mesh scale={1.65}>
        <torusKnotGeometry args={[1.15, 0.17, 150, 16, 2, 3]} />
        <meshStandardMaterial
          color={palette.primary}
          roughness={0.24}
          metalness={0.72}
          transparent
          opacity={0.42}
          emissive={palette.primary}
          emissiveIntensity={0.18}
        />
      </mesh>

      <mesh ref={innerRef} scale={1.28}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color={palette.secondary}
          wireframe
          transparent
          opacity={0.28}
          emissive={palette.secondary}
          emissiveIntensity={0.55}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.3, 0, 0]} scale={2.45}>
        <torusGeometry args={[1, 0.008, 8, 160]} />
        <meshBasicMaterial color={palette.secondary} transparent opacity={0.28} />
      </mesh>

      <mesh rotation={[0.3, Math.PI / 2, 0]} scale={2.1}>
        <torusGeometry args={[1, 0.006, 8, 160]} />
        <meshBasicMaterial color={palette.primary} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function WorldRig({ palette }: { palette: RoutePalette }) {
  const rigRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgressRef.current = window.scrollY / maxScroll;
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useFrame((state, delta) => {
    if (!rigRef.current) return;
    const targetX = state.pointer.y * 0.26 + scrollProgressRef.current * 0.8;
    const targetY = state.pointer.x * 0.34 + scrollProgressRef.current * 1.2;
    rigRef.current.rotation.x = THREE.MathUtils.damp(
      rigRef.current.rotation.x,
      targetX,
      2.2,
      delta
    );
    rigRef.current.rotation.y = THREE.MathUtils.damp(
      rigRef.current.rotation.y,
      targetY,
      2.2,
      delta
    );
    rigRef.current.position.y = THREE.MathUtils.damp(
      rigRef.current.position.y,
      -scrollProgressRef.current * 1.8,
      1.6,
      delta
    );
  });

  return (
    <group ref={rigRef}>
      <CoreSculpture palette={palette} />
      <FloatingModules color={palette.primary} />
      <ParticleField color={palette.secondary} />
    </group>
  );
}

function Scene({ palette }: { palette: RoutePalette }) {
  return (
    <>
      <ambientLight intensity={0.55} color="#dfe4ff" />
      <directionalLight position={[4, 5, 4]} intensity={1.05} color="#ffffff" />
      <pointLight
        position={[3.5, 1.5, -1]}
        intensity={2.2}
        distance={10}
        color={palette.secondary}
      />
      <WorldRig palette={palette} />
    </>
  );
}

export function SpatialWorld() {
  const pathname = usePathname();
  const palette = useMemo(() => {
    const exact = ROUTE_PALETTES[pathname];
    if (exact) return exact;
    const prefix = Object.keys(ROUTE_PALETTES).find(
      (route) => route !== "/" && pathname.startsWith(route)
    );
    return prefix ? ROUTE_PALETTES[prefix] : ROUTE_PALETTES["/"];
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="spatial-world" aria-hidden="true">
      <Canvas
        style={{ pointerEvents: "none" }}
        camera={{ position: [0, 0, 7.5], fov: 48, near: 0.1, far: 40 }}
        dpr={[1, 1.35]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        performance={{ min: 0.6 }}
      >
        <Scene palette={palette} />
      </Canvas>
    </div>
  );
}

export function SpatialInteractions() {
  useEffect(() => {
    let activeSurface: HTMLElement | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resetSurface = (surface: HTMLElement | null) => {
      if (!surface) return;
      surface.style.setProperty("--surface-rx", "0deg");
      surface.style.setProperty("--surface-ry", "0deg");
      surface.style.setProperty("--surface-light-x", "50%");
      surface.style.setProperty("--surface-light-y", "50%");
    };

    const updateSurface = () => {
      frame = 0;
      if (!activeSurface) return;
      const rect = activeSurface.getBoundingClientRect();
      const normalizedX = (pointerX - rect.left) / rect.width - 0.5;
      const normalizedY = (pointerY - rect.top) / rect.height - 0.5;
      activeSurface.style.setProperty("--surface-rx", `${normalizedY * -4}deg`);
      activeSurface.style.setProperty("--surface-ry", `${normalizedX * 5}deg`);
      activeSurface.style.setProperty(
        "--surface-light-x",
        `${Math.max(0, Math.min(100, (normalizedX + 0.5) * 100))}%`
      );
      activeSurface.style.setProperty(
        "--surface-light-y",
        `${Math.max(0, Math.min(100, (normalizedY + 0.5) * 100))}%`
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target as HTMLElement | null;
      const nextSurface = target?.closest<HTMLElement>(
        ".anime-card, .glass-card, .glass-panel, .spatial-surface"
      ) ?? null;

      if (nextSurface !== activeSurface) {
        resetSurface(activeSurface);
        activeSurface = nextSurface;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (activeSurface && frame === 0) {
        frame = window.requestAnimationFrame(updateSurface);
      }
    };

    const handlePointerLeave = () => {
      resetSurface(activeSurface);
      activeSurface = null;
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
