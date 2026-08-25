"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, isTouchDevice } from "@/lib/scroll-state";

/* ------------------------------------------------------------------ */
/* palettes per route theme                                            */
/* ------------------------------------------------------------------ */
const PALETTES: Record<
  string,
  { blob: string; accent: string; particles: string }
> = {
  home: { blob: "#22e0ff", accent: "#8b7bff", particles: "#5eead4" },
  about: { blob: "#8b7bff", accent: "#22e0ff", particles: "#a78bfa" },
  projects: { blob: "#2dd4bf", accent: "#22e0ff", particles: "#67e8f9" },
  contact: { blob: "#a78bfa", accent: "#f0abfc", particles: "#8b7bff" },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** remap p from [a,b] to 0..1 */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* ------------------------------------------------------------------ */
/* Tech core — faceted crystal + wireframe shell + glowing kernel      */
/* ------------------------------------------------------------------ */
function TechCore({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const solidMat = useRef<THREE.MeshStandardMaterial>(null!);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null!);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null!);
  const color = useMemo(() => new THREE.Color(PALETTES.home.blob), []);
  const accent = useMemo(() => new THREE.Color(PALETTES.home.accent), []);

  const r = mobile ? 1.0 : 1.5;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const h = scrollState.hero;

    // ---- phase mapping (hero pin, 0..1) ----
    const grow = seg(h, 0, 0.3); // phase 1: grow + energize
    const travel = seg(h, 0.3, 0.7); // phase 2: travel across
    const shrink = seg(h, 0.75, 1); // phase 3: recede

    const baseX = mobile ? 0 : 2.4;
    const baseY = mobile ? 1.4 : 0.1;
    // services section: glide back to the empty right side
    const svc = mobile ? 0 : scrollState.servicesActive;
    const travelX = THREE.MathUtils.lerp(baseX, mobile ? 0 : -2.6, travel);
    const targetX = THREE.MathUtils.lerp(travelX, 2.8, svc);
    const targetY = baseY + Math.sin(t * 0.6) * 0.12;
    const targetScale =
      (1 + 0.35 * grow) *
      THREE.MathUtils.lerp(THREE.MathUtils.lerp(1, 0.5, shrink), 0.85, svc);

    const g = group.current;
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 3, delta);
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 3, delta);
    g.scale.setScalar(s);

    // slow, precise rotation — sped up by hero progress + scroll velocity
    spin.current.rotation.y +=
      delta * (0.18 + h * 0.7 + Math.abs(scrollState.velocity) * 0.002);
    spin.current.rotation.x = Math.sin(t * 0.2) * 0.25 + h * 1.1;

    // mouse parallax
    g.position.x += scrollState.mouseX * 0.04;
    g.position.y += -scrollState.mouseY * 0.02;

    // palette follows route
    const pal = PALETTES[scrollState.theme] ?? PALETTES.home;
    color.lerp(new THREE.Color(pal.blob), delta * 1.5);
    accent.lerp(new THREE.Color(pal.accent), delta * 1.5);
    if (solidMat.current) {
      solidMat.current.color.copy(color).multiplyScalar(0.35);
      solidMat.current.emissive.copy(color).multiplyScalar(0.12 + grow * 0.1);
      if (solidMat.current.opacity < 1)
        solidMat.current.opacity = Math.min(1, solidMat.current.opacity + delta * 0.6);
    }
    if (wireMat.current) {
      wireMat.current.color.copy(color);
      wireMat.current.opacity = 0.35 + grow * 0.25;
    }
    if (coreMat.current) {
      coreMat.current.color.copy(accent);
      // energized pulse
      const pulse = 0.75 + Math.sin(t * 2.2) * 0.15 + h * 0.3;
      coreMat.current.opacity = Math.min(1, pulse) * 0.9;
    }
  });

  return (
    <group ref={group} position={[mobile ? 0 : 2.4, mobile ? 1.4 : 0.1, 0]}>
      <group ref={spin}>
        {/* faceted crystal body */}
        <mesh>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial
            ref={solidMat}
            flatShading
            transparent
            opacity={0}
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>
        {/* wireframe shell */}
        <mesh scale={1.28}>
          <icosahedronGeometry args={[r, 1]} />
          <meshBasicMaterial ref={wireMat} wireframe transparent opacity={0.35} />
        </mesh>
        {/* glowing kernel */}
        <mesh scale={0.32}>
          <icosahedronGeometry args={[r, 2]} />
          <meshBasicMaterial ref={coreMat} transparent opacity={0.8} />
        </mesh>
      </group>
      {/* orbiting rings */}
      <Rings mobile={mobile} />
    </group>
  );
}

function Rings({ mobile }: { mobile: boolean }) {
  const a = useRef<THREE.Mesh>(null!);
  const b = useRef<THREE.Mesh>(null!);
  const colA = useMemo(() => new THREE.Color(PALETTES.home.accent), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    a.current.rotation.z = t * 0.2;
    a.current.rotation.x = 1.2 + Math.sin(t * 0.3) * 0.2 + scrollState.hero * 2;
    b.current.rotation.z = -t * 0.14;
    b.current.rotation.y = 0.6 + scrollState.page * 3;

    const pal = PALETTES[scrollState.theme] ?? PALETTES.home;
    colA.lerp(new THREE.Color(pal.accent), delta * 1.5);
    (a.current.material as THREE.MeshBasicMaterial).color.copy(colA);
    (b.current.material as THREE.MeshBasicMaterial).color.copy(colA);
  });

  const r = mobile ? 1.7 : 2.5;
  return (
    <>
      <mesh ref={a} rotation={[1.2, 0, 0]}>
        <torusGeometry args={[r, 0.006, 8, 128]} />
        <meshBasicMaterial transparent opacity={0.5} />
      </mesh>
      <mesh ref={b} rotation={[0.4, 0.6, 0]}>
        <torusGeometry args={[r * 1.25, 0.004, 8, 128]} />
        <meshBasicMaterial transparent opacity={0.3} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Particle field                                                      */
/* ------------------------------------------------------------------ */
/** Deterministic PRNG so the particle field is stable across renders. */
function buildParticlePositions(count: number) {
  const arr = new Float32Array(count * 3);
  let seed = 0x9e3779b9;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  for (let i = 0; i < count; i++) {
    const r = 6 + rand() * 14;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    arr[i * 3 + 2] = r * Math.cos(phi) - 4;
  }
  return arr;
}

function Particles({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const count = mobile ? 350 : 1400;

  const positions = useMemo(() => buildParticlePositions(count), [count]);

  const col = useMemo(() => new THREE.Color(PALETTES.home.particles), []);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.015 + scrollState.velocity * 0.00004;
    ref.current.rotation.x = scrollState.page * 0.4;
    const pal = PALETTES[scrollState.theme] ?? PALETTES.home;
    col.lerp(new THREE.Color(pal.particles), delta * 1.5);
    (ref.current.material as THREE.PointsMaterial).color.copy(col);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig — moves with scroll + mouse                              */
/* ------------------------------------------------------------------ */
function Rig({ mobile }: { mobile: boolean }) {
  // camera is read from the per-frame state (not a hook value) so it stays mutable
  useFrame((state, delta) => {
    const { camera } = state;
    const h = scrollState.hero;
    const p = scrollState.page;

    // hero phase 1: push in; phase 3: orbit; rest: gentle drift with page scroll
    const push = seg(h, 0, 0.25);
    const orbit = seg(h, 0.55, 0.8);

    const targetZ = 8 - push * 1.2 + p * 0.8;
    const targetX =
      Math.sin(orbit * Math.PI) * 1.6 +
      (mobile ? 0 : scrollState.mouseX * 0.35);
    const targetY = -p * 1.2 + (mobile ? 0 : -scrollState.mouseY * 0.25);

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.5, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Root canvas                                                         */
/* ------------------------------------------------------------------ */
export default function Scene() {
  const mobile = isTouchDevice() || (typeof window !== "undefined" && window.innerWidth < 768);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        dpr={[1, mobile ? 1.5 : 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#04060d", 8, 26]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[6, 4, 6]} intensity={40} color="#22e0ff" />
        <pointLight position={[-6, -3, 4]} intensity={30} color="#8b7bff" />
        <directionalLight position={[0, 5, 5]} intensity={0.6} color="#ffffff" />
        <TechCore mobile={mobile} />
        <Particles mobile={mobile} />
        <Rig mobile={mobile} />
      </Canvas>
      {/* soft vignette to keep text readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,6,13,0.7)_100%)]" />
    </div>
  );
}
