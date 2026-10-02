"use client";

import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   Goku Skinned Mesh Vertex Coloring Logic (Fallback for Xbot)
   ────────────────────────────────────────────────────────── */
function applyGokuVertexColors(mesh: THREE.SkinnedMesh) {
  const geometry = mesh.geometry;
  const positionAttr = geometry.attributes.position;
  const skinIndexAttr = geometry.attributes.skinIndex;
  const skinWeightAttr = geometry.attributes.skinWeight;
  const bones = mesh.skeleton.bones;

  if (!positionAttr || !skinIndexAttr || !skinWeightAttr) return;

  const count = positionAttr.count;
  const colors = new Float32Array(count * 3);

  const cSkin = new THREE.Color("#ffd1b3");   // Goku skin tone (warm peach)
  const cOrange = new THREE.Color("#ff5a00"); // Goku Orange Gi
  const cBlue = new THREE.Color("#0036ad");   // Goku Blue Undershirt / Belt / Wristbands

  const tempPos = new THREE.Vector3();

  // Use flat arrays directly to ensure compatibility across all Three.js versions
  const skinIndexArray = skinIndexAttr.array;
  const skinWeightArray = skinWeightAttr.array;

  for (let i = 0; i < count; i++) {
    // Find the primary bone affecting this vertex (highest weight)
    let maxWeight = -1;
    let primaryBoneIndex = -1;
    
    // Each vertex has up to 4 bone influences (4 components)
    for (let k = 0; k < 4; k++) {
      const w = skinWeightArray[i * 4 + k];
      if (w > maxWeight) {
        maxWeight = w;
        primaryBoneIndex = skinIndexArray[i * 4 + k];
      }
    }

    const bone = bones[primaryBoneIndex];
    const boneName = bone ? bone.name.toLowerCase() : "";

    // Get vertex coordinate in bind pose local space
    tempPos.fromBufferAttribute(positionAttr, i);

    let color = cOrange; // Default to Orange Gi

    if (boneName.includes("head") || boneName.includes("neck")) {
      color = cSkin; // Face and neck skin
    } else if (boneName.includes("hand") || boneName.includes("thumb") || boneName.includes("finger")) {
      color = cSkin; // Bare hands
    } else if (boneName.includes("shoulder")) {
      color = cSkin; // Bare shoulders (sleeveless vest style)
    } else if (boneName.includes("arm") && !boneName.includes("forearm")) {
      color = cSkin; // Upper arms skin
    } else if (boneName.includes("forearm")) {
      color = cBlue; // Blue wristbands
    } else if (boneName.includes("foot") || boneName.includes("toe")) {
      color = cBlue; // Blue martial arts boots
    } else if (boneName.includes("upleg") || boneName.includes("leg")) {
      color = cOrange; // Orange pants
    } else if (boneName.includes("spine") || boneName.includes("hips")) {
      // Goku's waist belt / sash (y ≈ 0.91 to 1.03 in local bind pose space)
      if (tempPos.y >= 0.91 && tempPos.y <= 1.03) {
        color = cBlue; // Belt
      } else if (tempPos.y > 1.03) {
        // Chest / vest area
        if (tempPos.z > 0.03 && Math.abs(tempPos.x) < 0.12) {
          const t = (tempPos.y - 1.03) / 0.42; 
          const neckWidth = Math.max(0.01, t * 0.11); 
          if (Math.abs(tempPos.x) < neckWidth) {
            if (Math.abs(tempPos.x) < neckWidth * 0.5) {
              color = cSkin; // Chest skin exposure
            } else {
              color = cBlue; // Blue undershirt
            }
          } else {
            color = cOrange; // Vest
          }
        } else {
          color = cOrange; // Vest back/sides
        }
      } else {
        color = cOrange; // Pants top
      }
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  if (geometry.attributes.color) {
    geometry.attributes.color.needsUpdate = true;
  }
}

/* ──────────────────────────────────────────────────────────
   Super Saiyan Aura Particle System
   ────────────────────────────────────────────────────────── */
interface AuraParticlesProps {
  action: "idle" | "charging" | "firing";
}

function AuraParticles({ action }: AuraParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const count = 90;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.12 + Math.random() * 0.45;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.8 + Math.random() * 1.8;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      spd[i] = 0.25 + Math.random() * 0.5;
    }

    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const speedMult = action === "firing" ? 6.0 : action === "charging" ? 4.0 : 1.0;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += speeds[i] * delta * speedMult;

      if (array[i * 3 + 1] > 1.2) {
        array[i * 3 + 1] = -0.8;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.12 + Math.random() * 0.45;
        array[i * 3] = Math.cos(angle) * radius;
        array[i * 3 + 2] = Math.sin(angle) * radius;
      }

      array[i * 3] += Math.sin(state.clock.elapsedTime * 8.0 + i) * 0.003 * speedMult;
      array[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 8.0 + i) * 0.003 * speedMult;
    }

    posAttr.needsUpdate = true;

    // Update material dynamically
    if (action === "firing") {
      materialRef.current.color.set("#00f3ff");
      materialRef.current.opacity = 0.95;
    } else if (action === "charging") {
      materialRef.current.color.set("#ffe000");
      materialRef.current.opacity = 0.85;
    } else {
      materialRef.current.color.set("#ffe000");
      materialRef.current.opacity = 0.25;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffe000"
        size={0.035}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────
   Super Saiyan Goku Fighter Character
   ────────────────────────────────────────────────────────── */
interface FighterProps {
  theme?: string;
  action: "idle" | "charging" | "firing";
  setAction: (act: "idle" | "charging" | "firing") => void;
  isHolding: boolean;
}

function FighterCharacter({ theme, action, setAction, isHolding }: FighterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flareLightRef = useRef<THREE.PointLight>(null);
  const hairMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const kameBallRef = useRef<THREE.Mesh>(null);
  const kameBeamRef = useRef<THREE.Mesh>(null);
  const beamLightRef = useRef<THREE.PointLight>(null);

  // Load ready-made rigged Goku model
  const { scene, animations } = useGLTF("/goku-model.glb");

  // Create a manual AnimationMixer for explicit frame scheduling control
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);

  // Map incoming animations dynamically supporting goku-model's custom clip naming
  const actions = useMemo(() => {
    // Clean up animation clips first to prevent scale/translation mismatch tearing
    animations.forEach((clip) => {
      clip.tracks = clip.tracks.filter((track) => {
        const name = track.name.toLowerCase();
        // Remove scale tracks completely
        if (name.includes("scale")) return false;
        
        // Remove translation tracks for all bones except Hips/Root
        if (name.includes("position") || name.includes("translation")) {
          const isHips = name.includes("hips") || name.includes("pelvis") || name.includes("root") || name.includes("joint");
          return isHips;
        }
        
        return true;
      });
    });

    const act: Record<string, THREE.AnimationAction> = {};
    animations.forEach((clip) => {
      const name = clip.name.toLowerCase();
      if (name.includes("idle") || name === "00-idle") {
        act.idle = mixer.clipAction(clip);
      } else if (name.includes("walk")) {
        act.walk = mixer.clipAction(clip);
      } else if (name.includes("stance") || name === "02-stance") {
        act.stance = mixer.clipAction(clip);
      } else if (name.includes("kamehameha") || name === "03-kamehameha") {
        act.kamehameha = mixer.clipAction(clip);
      } else if (name.includes("run")) {
        act.run = mixer.clipAction(clip);
      }
      act[clip.name] = mixer.clipAction(clip);
    });

    // Fallback if idle is missing but other clips exist
    if (!act.idle && Object.keys(act).length > 0) {
      const firstKey = Object.keys(act)[0];
      act.idle = act[firstKey];
    }
    return act;
  }, [mixer, animations]);

  const prevPointer = useRef({ x: 0, y: 0 });
  const walkWeight = useRef(0);
  const fightProgress = useRef(0);
  const overrideWeight = useRef(0);
  const defaultHipsY = useRef<number | null>(null);

  // Detect model type dynamically based on named assets or root nodes
  const isGokuModel = useMemo(() => {
    let check = false;
    scene.traverse((child) => {
      if (child.name.toLowerCase().includes("goku") || child.name.toLowerCase().includes("sketchfab")) {
        check = true;
      }
    });
    return check;
  }, [scene]);

  // Map bone objects for direct coordinate rotations using fuzzy search keywords
  const bones = useMemo(() => {
    const b: Record<string, any> = {};
    
    scene.traverse((child) => {
      if (child.isObject3D && child instanceof THREE.Bone) {
        const name = child.name.toLowerCase();
        
        if (name.includes("hips") || name.includes("pelvis")) b.Hips = child;
        else if (name.includes("spine2") || name.includes("chest")) b.Chest = child;
        else if (name.includes("spine")) b.Spine = child;
        else if (name.includes("neck")) b.Neck = child;
        else if (name.includes("head")) b.Head = child;
        
        else if ((name.includes("shoulder") || name.includes("clavicle")) && (name.includes(".l") || name.includes("_l") || name.includes("left"))) b.LeftShoulder = child;
        else if ((name.includes("shoulder") || name.includes("clavicle")) && (name.includes(".r") || name.includes("_r") || name.includes("right"))) b.RightShoulder = child;
        
        else if ((name.includes("upper_arm") || name.includes("arm")) && (name.includes(".l") || name.includes("_l") || name.includes("left"))) {
          if (!name.includes("lower") && !name.includes("fore")) b.LeftArm = child;
        }
        else if ((name.includes("upper_arm") || name.includes("arm")) && (name.includes(".r") || name.includes("_r") || name.includes("right"))) {
          if (!name.includes("lower") && !name.includes("fore")) b.RightArm = child;
        }
        
        else if ((name.includes("lower_arm") || name.includes("forearm")) && (name.includes(".l") || name.includes("_l") || name.includes("left"))) b.LeftForeArm = child;
        else if ((name.includes("lower_arm") || name.includes("forearm")) && (name.includes(".r") || name.includes("_r") || name.includes("right"))) b.RightForeArm = child;
        
        else if (name.includes("hand") && (name.includes(".l") || name.includes("_l") || name.includes("left"))) b.LeftHand = child;
        else if (name.includes("hand") && (name.includes(".r") || name.includes("_r") || name.includes("right"))) b.RightHand = child;
        
        else if ((name.includes("upper_leg") || name.includes("upleg") || name.includes("thigh")) && (name.includes(".l") || name.includes("_l") || name.includes("left"))) b.LeftUpLeg = child;
        else if ((name.includes("upper_leg") || name.includes("upleg") || name.includes("thigh")) && (name.includes(".r") || name.includes("_r") || name.includes("right"))) b.RightUpLeg = child;
        
        else if ((name.includes("lower_leg") || name.includes("leg") || name.includes("calf")) && (name.includes(".l") || name.includes("_l") || name.includes("left"))) {
          if (!name.includes("upper")) b.LeftLeg = child;
        }
        else if ((name.includes("lower_leg") || name.includes("leg") || name.includes("calf")) && (name.includes(".r") || name.includes("_r") || name.includes("right"))) {
          if (!name.includes("upper")) b.RightLeg = child;
        }
        
        else if (name.includes("foot") && (name.includes(".l") || name.includes("_l") || name.includes("left"))) b.LeftFoot = child;
        else if (name.includes("foot") && (name.includes(".r") || name.includes("_r") || name.includes("right"))) b.RightFoot = child;
      }
    });

    // Fallback using the old mixamorig: prefix mapping if keys not found
    scene.traverse((child) => {
      if (child.isObject3D && child.name.includes("mixamorig:")) {
        const key = child.name.replace("mixamorig:", "");
        if (!b[key]) b[key] = child;
      }
    });

    return b;
  }, [scene]);

  // Create a shared material configured to show vertex colors
  const fallbackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.55,
    metalness: 0.1,
  }), []);

  // Programmatically skin the model with Goku colors if using fallback Xbot, 
  // otherwise locate and store the hair material for custom glow flare overrides
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isObject3D) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child instanceof THREE.SkinnedMesh) {
          if (!isGokuModel) {
            applyGokuVertexColors(child);
            child.material = fallbackMaterial;
          } else {
            // Goku Model: optimize existing materials and look for the hair material
            const configureGokuMaterial = (mat: THREE.Material) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.roughness = 0.6;
                mat.metalness = 0.1;
                // Detect and save hair material for power-up glow
                if (mat.name.toLowerCase().includes("hair") || child.name.toLowerCase().includes("hair")) {
                  mat.emissive = new THREE.Color("#ffa500");
                  mat.emissiveIntensity = 0.3;
                  hairMaterialRef.current = mat;
                }
              }
            };

            if (Array.isArray(child.material)) {
              child.material.forEach(configureGokuMaterial);
            } else if (child.material instanceof THREE.Material) {
              configureGokuMaterial(child.material);
            }
          }
        }
      }
    });
  }, [scene, fallbackMaterial, isGokuModel]);

  // Construct and attach Super Saiyan spiky gold hair directly to Head bone (Bypassed if native Goku model is active)
  useEffect(() => {
    if (isGokuModel) return;
    if (!bones.Head) return;

    const existingHair = bones.Head.getObjectByName("goku-hair");
    if (existingHair) {
      bones.Head.remove(existingHair);
    }

    const hairGroup = new THREE.Group();
    hairGroup.name = "goku-hair";

    const hairMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffe000"),
      emissive: new THREE.Color("#ffaa00"),
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.1,
    });
    hairMaterialRef.current = hairMat;

    const spikeGeom = new THREE.ConeGeometry(0.06, 0.35, 5);

    // Goku Super Saiyan massive spiky hair definition (flowing down back/sides + bangs)
    const spikes = [
      // Top crown
      { pos: [0, 0.18, 0], rot: [0, 0, 0], scale: [1.1, 1.3, 1.1] },
      { pos: [0.08, 0.17, 0.02], rot: [0, 0, -0.3], scale: [1.0, 1.2, 1.0] },
      { pos: [-0.08, 0.17, 0.02], rot: [0, 0, 0.3], scale: [1.0, 1.2, 1.0] },
      { pos: [0.14, 0.14, 0.0], rot: [0, 0, -0.6], scale: [0.9, 1.1, 0.9] },
      { pos: [-0.14, 0.14, 0.0], rot: [0, 0, 0.6], scale: [0.9, 1.1, 0.9] },

      // Front forehead bangs
      { pos: [0.03, 0.10, 0.10], rot: [0.5, 0.1, -0.2], scale: [0.7, 0.9, 0.7] },
      { pos: [-0.03, 0.10, 0.10], rot: [0.5, -0.1, 0.2], scale: [0.7, 0.9, 0.7] },
      { pos: [0.08, 0.08, 0.09], rot: [0.4, 0.2, -0.4], scale: [0.7, 0.8, 0.7] },
      { pos: [-0.08, 0.08, 0.09], rot: [0.4, -0.2, 0.4], scale: [0.7, 0.8, 0.7] },

      // Side flares
      { pos: [0.18, 0.08, -0.02], rot: [-0.1, 0.1, -0.9], scale: [1.0, 1.1, 1.0] },
      { pos: [-0.18, 0.08, -0.02], rot: [-0.1, -0.1, 0.9], scale: [1.0, 1.1, 1.0] },

      // Long back hair
      { pos: [0, 0.05, -0.12], rot: [-0.7, 0, 0], scale: [1.1, 1.2, 1.1] },
      { pos: [0.06, 0.01, -0.14], rot: [-1.0, 0.1, -0.2], scale: [1.0, 1.3, 1.0] },
      { pos: [-0.06, 0.01, -0.14], rot: [-1.0, -0.1, 0.2], scale: [1.0, 1.3, 1.0] },
      { pos: [0.10, -0.05, -0.15], rot: [-1.2, 0.2, -0.4], scale: [0.9, 1.4, 0.9] },
      { pos: [-0.10, -0.05, -0.15], rot: [-1.2, -0.2, 0.4], scale: [0.9, 1.4, 0.9] },
      { pos: [0, -0.08, -0.16], rot: [-1.3, 0, 0], scale: [1.1, 1.5, 1.1] },
    ];

    spikes.forEach((s) => {
      const mesh = new THREE.Mesh(spikeGeom, hairMat);
      mesh.position.set(s.pos[0], s.pos[1], s.pos[2]);
      mesh.rotation.set(s.rot[0], s.rot[1], s.rot[2]);
      mesh.scale.set(s.scale[0], s.scale[1], s.scale[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      hairGroup.add(mesh);
    });

    hairGroup.position.set(0, 0.12, 0.02);
    bones.Head.add(hairGroup);

    return () => {
      if (bones.Head) {
        bones.Head.remove(hairGroup);
      }
      spikeGeom.dispose();
      hairMat.dispose();
    };
  }, [bones.Head, isGokuModel]);

  // Activate loops
  useEffect(() => {
    if (actions.idle) {
      actions.idle.reset().fadeIn(0.25).play();
      actions.idle.setLoop(THREE.LoopRepeat, Infinity);
    }
    if (actions.stance) {
      actions.stance.setLoop(THREE.LoopRepeat, Infinity);
    }
    if (actions.kamehameha) {
      actions.kamehameha.setLoop(THREE.LoopRepeat, Infinity);
    }
    return () => {
      actions.idle?.fadeOut(0.25);
      actions.stance?.fadeOut(0.25);
      actions.kamehameha?.fadeOut(0.25);
    };
  }, [actions]);

  // Clean up mixer actions on unmount safely
  useEffect(() => {
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  useFrame((state, delta) => {
    // 1. IMPORTANT: Update the animation mixer manually first!
    mixer.update(delta);

    const pointer = state.pointer;

    // 2. Mouse movement velocity tracking
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    const velocity = Math.sqrt(dx * dx + dy * dy) / delta;
    prevPointer.current = { x: pointer.x, y: pointer.y };

    // 3. Blend animations dynamically based on state
    let targetWalkWeight = 0;
    let targetIdleWeight = 0;
    let targetChargeWeight = 0;

    const isPoweringUp = action === "charging" || action === "firing";

    if (isPoweringUp) {
      if (fightProgress.current < 1.0) {
        fightProgress.current += delta * 2.0; // reaches full charge in 0.5s
        if (fightProgress.current > 1.0) fightProgress.current = 1.0;
      }
      overrideWeight.current = THREE.MathUtils.lerp(overrideWeight.current, 1.0, delta * 10.0);
      targetChargeWeight = overrideWeight.current;
      targetIdleWeight = 1.0 - targetChargeWeight;
      targetWalkWeight = 0;
    } else {
      fightProgress.current = THREE.MathUtils.lerp(fightProgress.current, 0.0, delta * 8.0);
      overrideWeight.current = THREE.MathUtils.lerp(overrideWeight.current, 0.0, delta * 8.0);
      if (velocity > 0.05 && actions.walk) {
        targetWalkWeight = Math.min(velocity * 0.12, 1.0);
      }
      targetIdleWeight = 1.0 - targetWalkWeight;
      targetChargeWeight = 0;
    }

    const ow = overrideWeight.current;

    // Set effective weights for active animation layers
    if (actions.idle) {
      actions.idle.play();
      // Keep idle active as the base motion so Goku has breathing motion even when charging
      actions.idle.setEffectiveWeight(1.0);
    }
    if (actions.walk) {
      if (targetWalkWeight > 0.01) {
        actions.walk.play();
        actions.walk.setEffectiveWeight(targetWalkWeight);
      } else {
        actions.walk.setEffectiveWeight(0);
      }
    }

    // 4. Head, Neck & Whole-Body cursor look-at tracking
    const trackingWeight = 1.0 - (isPoweringUp ? ow * 0.6 : 0.0);

    const targetHipsRotY = pointer.x * 0.38 * trackingWeight;
    const targetHipsRotX = -pointer.y * 0.08 * trackingWeight;
    const targetSpineRotY = pointer.x * 0.28 * trackingWeight;
    const targetSpineRotX = -pointer.y * 0.18 * trackingWeight;

    // Apply look-at twist to hips, spine, neck, and head
    if (bones.Hips) {
      bones.Hips.rotation.setFromQuaternion(bones.Hips.quaternion);
      bones.Hips.rotation.y = THREE.MathUtils.lerp(bones.Hips.rotation.y, targetHipsRotY, 0.08);
      if (!isPoweringUp) {
        bones.Hips.rotation.x = THREE.MathUtils.lerp(bones.Hips.rotation.x, targetHipsRotX, 0.08);
      }
      bones.Hips.quaternion.setFromEuler(bones.Hips.rotation);
    }
    if (bones.Spine) {
      bones.Spine.rotation.setFromQuaternion(bones.Spine.quaternion);
      bones.Spine.rotation.y = THREE.MathUtils.lerp(bones.Spine.rotation.y, targetSpineRotY, 0.08);
      if (!isPoweringUp) {
        bones.Spine.rotation.x = THREE.MathUtils.lerp(bones.Spine.rotation.x, targetSpineRotX, 0.08);
      }
      bones.Spine.quaternion.setFromEuler(bones.Spine.rotation);
    }
    if (bones.Head) {
      bones.Head.rotation.setFromQuaternion(bones.Head.quaternion);
      bones.Head.rotation.y = THREE.MathUtils.lerp(bones.Head.rotation.y, pointer.x * 0.45 * trackingWeight, 0.1);
      bones.Head.rotation.x = THREE.MathUtils.lerp(bones.Head.rotation.x, -pointer.y * 0.25 * trackingWeight, 0.1);
      bones.Head.quaternion.setFromEuler(bones.Head.rotation);
    }
    if (bones.Neck) {
      bones.Neck.rotation.setFromQuaternion(bones.Neck.quaternion);
      bones.Neck.rotation.y = THREE.MathUtils.lerp(bones.Neck.rotation.y, pointer.x * 0.2 * trackingWeight, 0.1);
      bones.Neck.rotation.x = THREE.MathUtils.lerp(bones.Neck.rotation.x, -pointer.y * 0.1 * trackingWeight, 0.1);
      bones.Neck.quaternion.setFromEuler(bones.Neck.rotation);
    }

    // 5. Apply procedural folded/charging Super Saiyan pose (Bypass native clips to avoid bone scale tears)
    const hasBuiltInCharge = false;

    if (ow > 0.001) {
      const easeCharge = action === "firing" ? 1.0 : Math.sin(fightProgress.current * Math.PI * 0.5);

      // Define target Euler angles for the pose
      let targetLeftArmX = 0;
      let targetLeftArmY = 0;
      let targetLeftArmZ = 0;
      let targetLeftForeArmZ = 0;

      let targetRightArmX = 0;
      let targetRightArmY = 0;
      let targetRightArmZ = 0;
      let targetRightForeArmZ = 0;

      let targetSpineX = 0;
      let targetHipsOffsetY = 0;

      if (action === "charging") {
        targetHipsOffsetY = -0.12 * easeCharge;
        targetSpineX = 0.25 * easeCharge; // Lean forward into charging stance

        // Left arm drawn back & down towards right hip (crossing chest)
        targetLeftArmX = -0.55 * easeCharge;
        targetLeftArmY = -0.9 * easeCharge;
        targetLeftArmZ = -0.2 * easeCharge;
        targetLeftForeArmZ = -1.6 * easeCharge; // Deep elbow bend

        // Right arm drawn back & up towards right hip
        targetRightArmX = -0.4 * easeCharge;
        targetRightArmY = -0.6 * easeCharge;
        targetRightArmZ = 0.1 * easeCharge;
        targetRightForeArmZ = 1.4 * easeCharge; // Deep elbow bend
      } else if (action === "firing") {
        targetHipsOffsetY = -0.04;
        targetSpineX = 0.35; // Lean heavily forward into blast

        // Left arm raised & pushed straight forward
        targetLeftArmX = -1.45;
        targetLeftArmY = 0.25;
        targetLeftArmZ = 0.0;
        targetLeftForeArmZ = -0.15; // Forearm almost straight

        // Right arm raised & pushed straight forward
        targetRightArmX = -1.45;
        targetRightArmY = -0.25;
        targetRightArmZ = 0.0;
        targetRightForeArmZ = 0.15; // Forearm almost straight
      }

      // Convert target Euler rotations to quaternions
      const qLeftArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetLeftArmX, targetLeftArmY, targetLeftArmZ));
      const qRightArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRightArmX, targetRightArmY, targetRightArmZ));
      const qLeftForeArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, targetLeftForeArmZ));
      const qRightForeArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, targetRightForeArmZ));
      const qSpine = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetSpineX, bones.Spine ? bones.Spine.rotation.y : 0, 0));

      // Slerp upper arm bones
      if (bones.LeftArm) bones.LeftArm.quaternion.slerp(qLeftArm, ow);
      if (bones.RightArm) bones.RightArm.quaternion.slerp(qRightArm, ow);

      // Slerp forearm bones (elbows)
      if (bones.LeftForeArm) bones.LeftForeArm.quaternion.slerp(qLeftForeArm, ow);
      if (bones.RightForeArm) bones.RightForeArm.quaternion.slerp(qRightForeArm, ow);

      // Slerp Spine bone
      if (bones.Spine) bones.Spine.quaternion.slerp(qSpine, ow);

      // Apply hips vertical stance offset for the crouch (for non-loaded rigs)
      if (!isGokuModel && bones.Hips) {
        if (defaultHipsY.current === null) {
          defaultHipsY.current = bones.Hips.position.y;
        }
        bones.Hips.position.y = THREE.MathUtils.lerp(
          bones.Hips.position.y,
          (defaultHipsY.current ?? bones.Hips.position.y) + targetHipsOffsetY,
          ow
        );
      }

      // Leg wide stance offsets (for non-loaded rigs)
      if (!isGokuModel) {
        const targetLeftUpLegX = 0.35 * easeCharge;
        const targetLeftLegX = -0.7 * easeCharge;
        const targetRightUpLegX = 0.35 * easeCharge;
        const targetRightLegX = -0.7 * easeCharge;

        const qLeftUpLeg = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetLeftUpLegX, 0, 0));
        const qLeftLeg = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetLeftLegX, 0, 0));
        const qRightUpLeg = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRightUpLegX, 0, 0));
        const qRightLeg = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRightLegX, 0, 0));

        if (bones.LeftUpLeg) bones.LeftUpLeg.quaternion.slerp(qLeftUpLeg, ow);
        if (bones.LeftLeg) bones.LeftLeg.quaternion.slerp(qLeftLeg, ow);
        if (bones.RightUpLeg) bones.RightUpLeg.quaternion.slerp(qRightUpLeg, ow);
        if (bones.RightLeg) bones.RightLeg.quaternion.slerp(qRightLeg, ow);
      }
    }

    // Float entire group to follow mouse pointer + shake when charging or firing
    if (groupRef.current) {
      const targetX = pointer.x * 0.6;
      const targetY = pointer.y * 0.4;
      
      const currentX = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06);
      const currentY = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
      
      if (isPoweringUp && ow > 0.4) {
        const factor = action === "firing" ? 2.5 : 1.0;
        const shakeAmplitude = 0.012 * ow * factor;
        groupRef.current.position.x = currentX + (Math.random() - 0.5) * shakeAmplitude;
        groupRef.current.position.y = currentY + (Math.random() - 0.5) * shakeAmplitude;
        groupRef.current.position.z = (Math.random() - 0.5) * shakeAmplitude;
      } else {
        groupRef.current.position.x = currentX;
        groupRef.current.position.y = currentY;
        groupRef.current.position.z = 0;
      }
    }

    // 6. Super Saiyan flare & hair glow intensity update
    const easeChargeVal = Math.sin(fightProgress.current * Math.PI * 0.5);
    const flareIntensity = ow * easeChargeVal;

    if (flareLightRef.current) {
      flareLightRef.current.intensity = flareIntensity * 16.0;
    }

    if (hairMaterialRef.current) {
      const baseGlow = 0.8 + Math.sin(state.clock.elapsedTime * 6.0) * 0.15;
      const surgeGlow = flareIntensity * 2.8;
      hairMaterialRef.current.emissiveIntensity = baseGlow + surgeGlow;
    }

    // 7. Kamehameha Sphere, Beam and Light animations
    if (kameBallRef.current) {
      if (action === "charging") {
        const scale = easeChargeVal * 1.5;
        kameBallRef.current.scale.set(scale, scale, scale);
        kameBallRef.current.visible = true;
        const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 30.0) * 0.15;
        kameBallRef.current.scale.multiplyScalar(pulse);
      } else if (action === "firing") {
        kameBallRef.current.scale.set(2.0, 2.0, 2.0);
        kameBallRef.current.visible = true;
      } else {
        kameBallRef.current.visible = false;
      }
    }

    if (kameBeamRef.current) {
      if (action === "firing") {
        kameBeamRef.current.visible = true;
        const scaleX = 1.0 + Math.sin(state.clock.elapsedTime * 40.0) * 0.2;
        const scaleY = 1.0; 
        const scaleZ = 1.0 + Math.sin(state.clock.elapsedTime * 40.0) * 0.2;
        kameBeamRef.current.scale.set(scaleX, scaleY, scaleZ);
      } else {
        kameBeamRef.current.visible = false;
      }
    }

    if (beamLightRef.current) {
      if (action === "firing") {
        beamLightRef.current.intensity = 25.0 + Math.random() * 5.0;
      } else if (action === "charging") {
        beamLightRef.current.intensity = easeChargeVal * 5.0;
      } else {
        beamLightRef.current.intensity = 0;
      }
    }
  });

  // Calculate scale and position offsets based on model type
  const modelScale = isGokuModel ? 0.38 : 0.78;
  const modelPosition: [number, number, number] = isGokuModel ? [0, -0.65, 0] : [0, -0.8, 0];

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={modelScale} position={modelPosition} />
      
      {/* Super Saiyan glow point light flare */}
      <pointLight 
        ref={flareLightRef} 
        position={[0, 0.1, 0.2]} 
        distance={2.5} 
        color="#ffe600" 
        intensity={0} 
      />

      {/* Kamehameha Energy Sphere */}
      <mesh ref={kameBallRef} position={[0, -0.12, 0.38]}>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshBasicMaterial 
          color="#00f3ff" 
          transparent 
          opacity={0.85} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Kamehameha Energy Beam */}
      <mesh ref={kameBeamRef} position={[0, -0.12, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 1.6, 32]} />
        <meshBasicMaterial 
          color="#00aaff" 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Point light for the Kamehameha blast */}
      <pointLight
        ref={beamLightRef}
        position={[0, -0.12, 0.5]}
        color="#00f3ff"
        distance={4}
        intensity={0}
      />
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Lighting & Scene Setup
   ────────────────────────────────────────────────────────── */
interface SceneProps {
  theme?: string;
  action: "idle" | "charging" | "firing";
  setAction: (act: "idle" | "charging" | "firing") => void;
  isHolding: boolean;
}

function Scene({ theme, action, setAction, isHolding }: SceneProps) {
  const isDark = theme === "dark";
  return (
    <>
      <ambientLight intensity={isDark ? 0.75 : 0.85} color={isDark ? "#dbeafe" : "#e0e4ff"} />
      <directionalLight position={[5, 8, 5]} intensity={isDark ? 1.5 : 1.2} color="#ffffff" castShadow />
      <pointLight position={[-3, 2, 1]} intensity={isDark ? 2.2 : 1.5} color="#8b7cff" distance={9} />

      {/* Super Saiyan aura particles */}
      <AuraParticles action={action} />

      <FighterCharacter theme={theme} action={action} setAction={setAction} isHolding={isHolding} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Fallback Spinner while Loading GLB
   ────────────────────────────────────────────────────────── */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-dashed border-primary/40 border-t-primary animate-spin" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Primary Export Component
   ────────────────────────────────────────────────────────── */
export function Hero3DLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [action, setAction] = useState<"idle" | "charging" | "firing">("idle");
  const [isHolding, setIsHolding] = useState(false);
  const [speech, setSpeech] = useState<string>("");

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Clear timeouts on unmount
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const theme = mounted ? resolvedTheme : "dark";

  const handleClick = () => {
    if (action !== "idle") return; // block multiple clicks during sequence

    // Clear previous timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const addTimeout = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timeoutsRef.current.push(t);
    };

    // 1. KA… (0ms) -> Clench hands & start charging
    setAction("charging");
    setSpeech("KA…");

    // 2. ME… (500ms)
    addTimeout(() => setSpeech("ME…"), 500);

    // 3. HA… (1000ms)
    addTimeout(() => setSpeech("HA…"), 1000);

    // 4. ME… (1500ms)
    addTimeout(() => setSpeech("ME…"), 1500);

    // 5. HAAAA!!!! (2000ms) -> Blast!
    addTimeout(() => {
      setAction("firing");
      setSpeech("HAAAA!!!!");
    }, 2000);

    // 6. Reset to Idle stance (3800ms)
    addTimeout(() => {
      setAction("idle");
      setSpeech("");
    }, 3800);
  };

  return (
    <div 
      onClick={handleClick}
      className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative cursor-pointer select-none group pointer-events-auto"
      title="Click to fire Kamehameha!"
    >
      {/* Speech bubble or overlay text */}
      {speech && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-30">
          <motion.div
            key={speech}
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: [1, 1.25, 1], opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`font-[family-name:var(--font-heading)] font-extrabold tracking-tighter uppercase select-none ${
              speech === "HAAAA!!!!"
                ? "text-4xl sm:text-5xl md:text-6xl text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]"
                : "text-3xl sm:text-4xl md:text-5xl text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.85)]"
            }`}
          >
            {speech}
          </motion.div>
        </div>
      )}

      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 2.1], fov: 45 }}
          dpr={[1, 1.5]}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          shadows={{ type: THREE.PCFShadowMap }}
        >
          <Scene theme={theme} action={action} setAction={setAction} isHolding={isHolding} />
        </Canvas>
      </Suspense>
    </div>
  );
}

// Preload GLB
useGLTF.preload("/goku-model.glb");
