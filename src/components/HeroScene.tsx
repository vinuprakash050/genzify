'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface FrameState {
  clock: THREE.Clock;
  mouse: THREE.Vector2;
}

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

  useFrame(({ clock, mouse }: FrameState) => {
    const elapsed = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.x = elapsed * 0.08;
      groupRef.current.rotation.y = elapsed * 0.12;
      groupRef.current.position.x = mouse.x * 0.25;
      groupRef.current.position.y = mouse.y * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-1.2, 0.2, -0.8]}>
        <icosahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial color="white" wireframe opacity={0.35} transparent />
      </mesh>
      <mesh position={[1.1, -0.45, -0.6]}>
        <torusKnotGeometry args={[0.48, 0.15, 100, 16]} />
        <meshStandardMaterial color="white" opacity={0.18} transparent />
      </mesh>
    </group>
  );
}

function WireSwarm() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.16 + mouse.x * 0.22;
    groupRef.current.rotation.x = elapsed * 0.06 + mouse.y * 0.18;
  });

  return (
    <group ref={groupRef}>
      {[-1.8, 0, 1.8].map((offset, index) => (
        <Float
          key={offset}
          speed={1.2 + index * 0.3}
          rotationIntensity={1.1}
          floatIntensity={1.4}
          position={[offset, index % 2 === 0 ? 0.3 : -0.4, -0.8]}
        >
          <mesh>
            <octahedronGeometry args={[0.65 - index * 0.08, 0]} />
            <meshStandardMaterial color="white" wireframe transparent opacity={0.38} />
          </mesh>
        </Float>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.3, -1.5]}>
        <torusGeometry args={[2.2, 0.03, 24, 120]} />
        <meshStandardMaterial color="white" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

function MonolithField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.08;
    groupRef.current.position.x = mouse.x * 0.12;
    groupRef.current.position.y = mouse.y * 0.08;
  });

  return (
    <group ref={groupRef}>
      {[
        [-1.8, -0.1, -0.9],
        [-0.5, 0.45, -1.2],
        [0.9, -0.25, -0.7],
        [2.0, 0.35, -1.0],
      ].map((position, index) => (
        <Float
          key={position.join("-")}
          speed={0.9 + index * 0.2}
          rotationIntensity={0.35}
          floatIntensity={0.8}
          position={position as [number, number, number]}
        >
          <mesh>
            <boxGeometry args={[0.34, 1.9 - index * 0.18, 0.34]} />
            <meshStandardMaterial color="white" transparent opacity={0.12 + index * 0.04} />
          </mesh>
        </Float>
      ))}
      <mesh position={[0.6, -0.5, -1.6]}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function PunkSkull() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.28 + mouse.x * 0.38;
    groupRef.current.rotation.x = mouse.y * 0.12;
    groupRef.current.position.y = Math.sin(elapsed * 1.2) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0.5, 0.1, -0.8]}>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.78, 0.44, 0.62]} />
        <meshStandardMaterial color="white" transparent opacity={0.12} />
      </mesh>
      <mesh position={[-0.24, 0.72, 0.52]}>
        <torusGeometry args={[0.1, 0.025, 18, 40]} />
        <meshStandardMaterial color="white" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.24, 0.72, 0.52]}>
        <torusGeometry args={[0.1, 0.025, 18, 40]} />
        <meshStandardMaterial color="white" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.36, 0.5]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.08, 0.22, 4]} />
        <meshStandardMaterial color="white" transparent opacity={0.76} />
      </mesh>
      <mesh position={[0, -0.02, 0.52]}>
        <boxGeometry args={[0.42, 0.08, 0.06]} />
        <meshStandardMaterial color="white" transparent opacity={0.88} />
      </mesh>
      {[-0.18, -0.09, 0, 0.09, 0.18].map((x) => (
        <mesh key={x} position={[x, -0.18, 0.54]}>
          <boxGeometry args={[0.05, 0.16, 0.05]} />
          <meshStandardMaterial color="white" transparent opacity={0.82} />
        </mesh>
      ))}
      <mesh position={[0.52, 1.22, -0.1]} rotation={[0.3, 0.1, 0.6]}>
        <coneGeometry args={[0.08, 0.52, 4]} />
        <meshStandardMaterial color="white" transparent opacity={0.82} />
      </mesh>
      <mesh position={[-0.5, 1.22, -0.08]} rotation={[0.1, -0.2, -0.6]}>
        <coneGeometry args={[0.08, 0.48, 4]} />
        <meshStandardMaterial color="white" transparent opacity={0.82} />
      </mesh>
    </group>
  );
}

function CyberHalo() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.z = elapsed * 0.22;
    groupRef.current.rotation.x = mouse.y * 0.18;
    groupRef.current.rotation.y = mouse.x * 0.18;
  });

  return (
    <group ref={groupRef} position={[0.3, 0, -1.1]}>
      {[0, 0.42, 0.84].map((offset, index) => (
        <mesh key={offset} rotation={[Math.PI / 2, offset, 0]}>
          <torusGeometry args={[1.15 + index * 0.22, 0.03 + index * 0.01, 24, 120]} />
          <meshStandardMaterial color="white" transparent opacity={0.48 - index * 0.1} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.26} />
      </mesh>
    </group>
  );
}

function ShardBurst() {
  const groupRef = useRef<THREE.Group>(null);
  const shards = useMemo(
    () => Array.from({ length: 14 }, (_, index) => ({
      position: [
        Math.cos((index / 14) * Math.PI * 2) * (0.7 + (index % 3) * 0.34),
        Math.sin((index / 14) * Math.PI * 2) * (0.48 + (index % 4) * 0.16),
        -0.8 - (index % 3) * 0.12,
      ],
      rotation: [index * 0.3, index * 0.22, index * 0.17],
      scale: 0.18 + (index % 4) * 0.05,
    })),
    [],
  );

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.z = elapsed * 0.1;
    groupRef.current.rotation.y = elapsed * 0.16 + mouse.x * 0.22;
  });

  return (
    <group ref={groupRef} position={[0.5, 0.1, -0.6]}>
      {shards.map((shard, index) => (
        <mesh
          key={index}
          position={shard.position as [number, number, number]}
          rotation={shard.rotation as [number, number, number]}
          scale={shard.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="white" transparent opacity={0.2 + (index % 4) * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function ChromeSpine() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(elapsed * 0.8) * 0.22 + mouse.x * 0.2;
    groupRef.current.rotation.x = mouse.y * 0.12;
  });

  return (
    <group ref={groupRef} position={[0.5, -0.1, -1.1]}>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={index}
          position={[0, -0.9 + index * 0.28, 0]}
          rotation={[index * 0.22, index * 0.18, index * 0.08]}
        >
          <torusGeometry args={[0.22 + index * 0.03, 0.03, 14, 42]} />
          <meshStandardMaterial color="white" transparent opacity={0.18 + index * 0.06} />
        </mesh>
      ))}
    </group>
  );
}

function NeonPortal() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.22 + mouse.x * 0.14;
    groupRef.current.position.y = mouse.y * 0.1;
  });

  return (
    <group ref={groupRef} position={[0.6, 0, -1.2]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.08, 24, 120]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.36} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.5, 0]}>
        <torusGeometry args={[0.84, 0.03, 20, 100]} />
        <meshStandardMaterial color="white" transparent opacity={0.62} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color="white" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function GlitchTotem() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.18 + mouse.x * 0.2;
    groupRef.current.position.x = mouse.x * 0.1;
  });

  return (
    <group ref={groupRef} position={[0.65, -0.1, -1]}>
      {[
        [-0.08, -0.9, 0, 0.34, 0.24, 0.34],
        [0.1, -0.48, 0.06, 0.5, 0.18, 0.42],
        [-0.12, -0.04, -0.04, 0.28, 0.44, 0.28],
        [0.08, 0.5, 0.03, 0.56, 0.16, 0.38],
        [-0.04, 0.92, 0, 0.24, 0.32, 0.24],
      ].map(([x, y, z, sx, sy, sz], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial color="white" transparent opacity={0.14 + index * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function SkeletonRig() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: FrameState) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.22 + mouse.x * 0.3;
    groupRef.current.rotation.x = mouse.y * 0.14;
    groupRef.current.position.y = Math.sin(elapsed) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0.75, -0.2, -1]}>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.36, 20, 20]} />
        <meshStandardMaterial color="white" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh position={[-0.12, 1.24, 0.24]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="white" transparent opacity={0.94} />
      </mesh>
      <mesh position={[0.12, 1.24, 0.24]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="white" transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="white" transparent opacity={0.78} />
      </mesh>
      {[-0.3, -0.15, 0, 0.15, 0.3].map((x, index) => (
        <mesh key={x} position={[x, 0.34 - Math.abs(x) * 0.18, 0]}>
          <torusGeometry args={[0.18 + index * 0.01, 0.018, 12, 32, Math.PI]} />
          <meshStandardMaterial color="white" transparent opacity={0.58} />
        </mesh>
      ))}
      <mesh position={[0, -0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.7, 4, 12]} />
        <meshStandardMaterial color="white" transparent opacity={0.54} />
      </mesh>
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.76, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
          <capsuleGeometry args={[0.07, 0.7, 4, 10]} />
          <meshStandardMaterial color="white" transparent opacity={0.52} />
        </mesh>
      ))}
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, -0.84, 0]} rotation={[0, 0, x > 0 ? -0.12 : 0.12]}>
          <capsuleGeometry args={[0.08, 0.9, 4, 10]} />
          <meshStandardMaterial color="white" transparent opacity={0.52} />
        </mesh>
      ))}
    </group>
  );
}

const sceneComponents = {
  particleOrbit: FloatingOrbs,
  wireSwarm: WireSwarm,
  monolithField: MonolithField,
  punkSkull: PunkSkull,
  cyberHalo: CyberHalo,
  shardBurst: ShardBurst,
  chromeSpine: ChromeSpine,
  neonPortal: NeonPortal,
  glitchTotem: GlitchTotem,
  skeletonRig: SkeletonRig,
};

interface HeroSceneProps {
  scenePreset?: string;
}

export default function HeroScene({ scenePreset = "particleOrbit" }: HeroSceneProps) {
  const SceneComponent = sceneComponents[scenePreset as keyof typeof sceneComponents] || FloatingOrbs;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <SceneComponent />
      </Canvas>
    </div>
  );
}
