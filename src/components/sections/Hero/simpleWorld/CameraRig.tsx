"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CAMERA_POINTS, getCameraSample, type CameraSample } from "./Timeline";

interface SceneControlsProps {
  progressRef: RefObject<number>;
  isDraggingRef: RefObject<boolean>;
  isManualRef: RefObject<boolean>;
  sampleRef?: RefObject<CameraSample | null>;
  positionLerp?: number;
  targetLerp?: number;
}

export function SceneControls({
  progressRef,
  isDraggingRef,
  isManualRef,
  sampleRef,
  positionLerp = 0.12,
  targetLerp = 0.12,
}: SceneControlsProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetRef = useRef(new THREE.Vector3());
  const goalPosRef = useRef(new THREE.Vector3());
  const goalTgtRef = useRef(new THREE.Vector3());

  // ── Pointer Events ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isManualRef.current = true;
      isDraggingRef.current = true;
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      // Keep manual mode active so orbit stays free
    };

    el.addEventListener("pointerdown", onPointerDown, { capture: true });
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown, { capture: true });
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [gl, isDraggingRef, isManualRef]);

  // ── Frame Loop ─────────────────────────────────────────────────────────
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const progress = progressRef.current ?? 0;
    const sample = getCameraSample(CAMERA_POINTS, progress);
    if (sampleRef) sampleRef.current = sample;

    if (isManualRef.current) {
      // ORBIT MODE: let user control camera freely
      controls.enabled = true;
      controls.update(); // REQUIRED for damping to work

      // Keep goals synced so we can resume path smoothly later
      goalPosRef.current.set(...sample.position);
      goalTgtRef.current.set(...sample.target);
      return;
    }

    // CINEMATIC MODE: scroll-driven path
    controls.enabled = false;

    goalPosRef.current.set(...sample.position);
    goalTgtRef.current.set(...sample.target);

    camera.position.lerp(goalPosRef.current, positionLerp);
    targetRef.current.lerp(goalTgtRef.current, targetLerp);
    camera.lookAt(targetRef.current);
    controls.target.copy(targetRef.current);

    if (sample.fov && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, sample.fov, 0.05);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.05}
      enablePan={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={120}
      maxPolarAngle={Math.PI / 2.1}
      target={[0, 0, 5]}
    />
  );
}

/** @deprecated Use SceneControls */
export const CameraRig = SceneControls;