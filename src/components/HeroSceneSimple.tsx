'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function readThemeColor(variableName: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim() || fallback;
}

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
      [-1.8, -1.4, 1.6],
      [0.4, 1.8, 2.8],
    ];

    return positions.map((pos, index) => (
      <Float key={index} speed={1 + index * 0.4} rotationIntensity={1 + index * 0.5}>
        <mesh position={pos as [number, number, number]}>
          <sphereGeometry args={[0.15 + index * 0.04, 32, 32]} />
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
        <torusKnotGeometry args={[0.48, 0.15, 100, 16]} />
        <meshStandardMaterial color="white" opacity={0.18} transparent />
      </mesh>
    </group>
  );
}

function WireSwarm() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.16 + state.pointer.x * 0.22;
    groupRef.current.rotation.x = elapsed * 0.06 + state.pointer.y * 0.18;
  });

  const wires = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * 2.5,
        Math.sin(angle) * 1.8,
        (Math.random() - 0.5) * 2,
      ]);
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {wires.map((pos, index) => (
        <mesh key={index} position={pos as [number, number, number]}>
          <torusGeometry args={[2.2, 0.03, 24, 120]} />
          <meshStandardMaterial color="white" transparent opacity={0.24} />
        </mesh>
      ))}
      <mesh position={[0, 0, -1.2]}>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function MonolithField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.08;
    groupRef.current.position.x = state.pointer.x * 0.12;
    groupRef.current.position.y = state.pointer.y * 0.08;
  });

  const monoliths = useMemo(() => {
    return [
      { pos: [-1.8, 0, -0.6], rot: [0, 0, 0] },
      { pos: [1.2, 0, 0.8], rot: [0, Math.PI * 0.25, 0] },
      { pos: [0, 0, 1.8], rot: [0, Math.PI * 0.5, 0] },
    ];
  }, []);

  return (
    <group ref={groupRef}>
      {monoliths.map((mono, index) => (
        <mesh
          key={index}
          position={mono.pos as [number, number, number]}
          rotation={mono.rot as [number, number, number]}
        >
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

const sceneComponents = {
  'particleOrbit': FloatingOrbs,
  'wireSwarm': WireSwarm,
  'monolithField': MonolithField,
};

interface HeroSceneProps {
  scenePreset?: string;
}

export default function HeroScene({ scenePreset = 'particleOrbit' }: HeroSceneProps) {
  const SceneComponent = (sceneComponents as any)[scenePreset] || FloatingOrbs;

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <SceneComponent />
      </Canvas>
    </div>
  );
}
