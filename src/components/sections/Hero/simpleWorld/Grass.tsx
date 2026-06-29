"use client";

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function GrassSprites() {
  const count = 4000;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { positions, phases } = useMemo(() => {
    const pos = [];
    const ph = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 38;
      const z = (Math.random() - 0.5) * 38;
      if (Math.abs(x) < 3.5 || Math.abs(z) < 3.5) continue;
      pos.push([x, -0.2, z]);
      ph.push(Math.random() * Math.PI * 2);
    }
    return { positions: pos, phases: ph };
  }, []);

  // Create grass blade shape using a simple plane with alpha
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.3, 0.8);
    geo.translate(0, 0.4, 0); // Bottom at origin
    return geo;
  }, []);

  const material = useMemo(() => {
    // Create a grass blade texture programmatically
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    // Gradient from dark green bottom to light green top
    const grad = ctx.createLinearGradient(0, 128, 0, 0);
    grad.addColorStop(0, "#14532d");
    grad.addColorStop(0.5, "#22c55e");
    grad.addColorStop(1, "#86efac");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 128);

    // Add blade shape (tapered top)
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.quadraticCurveTo(50, 60, 32, 128);
    ctx.quadraticCurveTo(14, 60, 32, 0);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

    return new THREE.MeshStandardMaterial({
      map: texture,
      alphaTest: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const time = state.clock.elapsedTime;

    positions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.scale.setScalar(0.8 + Math.sin(phases[i]) * 0.3);
      // Sway
      dummy.rotation.z = Math.sin(time * 2 + phases[i]) * 0.15;
      dummy.rotation.y = Math.sin(time * 0.5 + phases[i]) * 0.2;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, positions.length]}
      castShadow
    />
  );
}
