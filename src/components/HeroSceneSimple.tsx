'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function readThemeColor(variableName: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || fallback;
}

// Reduced geometry complexity for mobile performance
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = elapsed * 0.08;
      groupRef.current.rotation.y = elapsed * 0.12;
      groupRef.current.position.x = state.pointer.x * 0.25;
      groupRef.current.position.y = state.pointer.y * 0.18;
    }
  });

  const orbs = useMemo(() => {
    const positions = [
      [-2.8, 1.2, -1.5],
      [1.5, -0.8, 2.2],
      [-0.6, 2.1, -0.9],
      [2.2, 0.4, -1.8],
    ];
    return positions.map((pos, index) => (
      <Float key={index} speed={1 + index * 0.4} rotationIntensity={0.6}>
        <mesh position={pos as [number, number, number]}>
          {/* Reduced segments: 16 instead of 32 */}
          <sphereGeometry args={[0.15 + index * 0.04, 16, 16]} />
          <meshStandardMaterial
            color={readThemeColor('--color-primary', '#7c3aed')}
            emissive={readThemeColor('--color-primary', '#7c3aed')}
            emissiveIntensity={0.4}
            transparent
            opacity={0.7 - index * 0.08}
          />
        </mesh>
      </Float>
    ));
  }, []);

  return (
    <group ref={groupRef}>
      {orbs}
      <mesh position={[0, 0, -2]}>
        {/* Reduced segments: 64,8 instead of 100,16 */}
        <torusKnotGeometry args={[0.48, 0.15, 64, 8]} />
        <meshStandardMaterial color="white" opacity={0.18} transparent />
      </mesh>
    </group>
  );
}

function MonolithField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.08;
    groupRef.current.position.x = state.pointer.x * 0.12;
    groupRef.current.position.y = state.pointer.y * 0.08;
  });

  const monoliths = useMemo(() => ([
    { pos: [-1.8, 0, -0.6], rot: [0, 0, 0] },
    { pos: [1.2, 0, 0.8],   rot: [0, Math.PI * 0.25, 0] },
    { pos: [0, 0, 1.8],     rot: [0, Math.PI * 0.5, 0] },
  ]), []);

  return (
    <group ref={groupRef}>
      {monoliths.map((mono, index) => (
        <mesh key={index} position={mono.pos as [number, number, number]} rotation={mono.rot as [number, number, number]}>
          <boxGeometry args={[0.8, 2.4, 0.8]} />
          <meshStandardMaterial
            color={readThemeColor('--color-secondary', '#00f5ff')}
            emissive={readThemeColor('--color-secondary', '#00f5ff')}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      <mesh position={[0, -1.2, 0]}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

const sceneComponents: Record<string, React.ComponentType> = {
  particleOrbit: FloatingOrbs,
  wireSwarm: FloatingOrbs,   // fallback to lighter scene on mobile
  monolithField: MonolithField,
};

interface HeroSceneProps {
  scenePreset?: string;
}

export default function HeroScene({ scenePreset = 'particleOrbit' }: HeroSceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect low-end / mobile devices
    const mobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  // SSR: render nothing
  if (!mounted) return null;

  // Mobile: skip WebGL entirely — use a CSS gradient instead
  if (isMobile) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-cyan-900/20" />
    );
  }

  const SceneComponent = sceneComponents[scenePreset] || FloatingOrbs;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}  // cap pixel ratio — prevents 3x on high-DPI mobile
        performance={{ min: 0.5 }}  // allow frame rate scaling
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <SceneComponent />
      </Canvas>
    </div>
  );
}
