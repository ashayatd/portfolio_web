"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

interface SceneControlsProps {
  progressRef?: React.MutableRefObject<number>;
}

const FAR = new THREE.Vector3(100, 100, 100);
const CLOSE = new THREE.Vector3(25, 30, 25);

export function SceneControls({ progressRef }: SceneControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const currentPos = useRef(FAR.clone());
  const targetPos = useRef(FAR.clone());

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    camera.position.copy(FAR);
    controls.target.set(0, 0, 0);
    controls.update();
  }, [camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !progressRef) return;

    const progress = progressRef.current;

    targetPos.current.lerpVectors(FAR, CLOSE, progress);

    // Smooth camera movement
    currentPos.current.lerp(targetPos.current, 1 - Math.exp(-4 * delta));

    controls.object.position.copy(currentPos.current);

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={true}
      enableDamping
      dampingFactor={0.08}
      target={[0, 0, 0]}
      minDistance={8}
      maxDistance={300}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.2}
    />
  );
}

export const CameraRig = SceneControls;

export function RotatingCity({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current || !enabled) return;

    ref.current.rotation.y -= delta * 0.08; // slow rotation
  });

  return <group ref={ref}>{children}</group>;
}


export function RotatingModal({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;

    ref.current.rotation.y -= delta * 0.8; // slow rotation
  });

  return <group ref={ref}>{children}</group>;
}