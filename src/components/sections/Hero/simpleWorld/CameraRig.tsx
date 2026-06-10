"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CAMERA_POINTS, getCameraSample, type CameraSample } from "./Timeline";

// ============================================================
// SceneControls — Scroll-Driven Cinematic Camera
// ============================================================
// PAIR WITH: ScrollController.ts (handles wheel → progress mapping)
//
// SPEED IS CONTROLLED BY ScrollController, NOT this file.
// This file just reads progressRef and smoothly interpolates camera.
//
// LERP TUNING (how fast camera catches up to path):
//   • positionLerp: 0.08 = heavy/cinematic, 0.15 = responsive
//   • targetLerp:   should match positionLerp for consistency
//   • returnLerp:   0.06 = slow return after orbit, 0.12 = fast
// ============================================================

interface SceneControlsProps {
  progressRef: RefObject<number>;
  isDraggingRef: RefObject<boolean>;
  isManualRef: RefObject<boolean>;
  sampleRef?: RefObject<CameraSample | null>;
  /** How fast camera catches up to path position (default: 0.12) */
  positionLerp?: number;
  /** How fast look target catches up (default: 0.12) */
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
  const wasManualRef = useRef(false);

  // ── Pointer Events ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isManualRef.current = true;
      isDraggingRef.current = true;
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
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

    if (isManualRef.current) {
      wasManualRef.current = true;
      controls.enabled = true;

      // Still update goals so we can resume smoothly
      const progress = progressRef.current ?? 0;
      const sample = getCameraSample(CAMERA_POINTS, progress);
      goalPosRef.current.set(...sample.position);
      goalTgtRef.current.set(...sample.target);
      if (sampleRef) sampleRef.current = sample;

      return;
    }

    if (wasManualRef.current) {
      wasManualRef.current = false;
    }

    controls.enabled = false;

    const progress = progressRef.current ?? 0;
    const sample = getCameraSample(CAMERA_POINTS, progress);

    if (sampleRef) {
      sampleRef.current = sample;
    }

    goalPosRef.current.set(...sample.position);
    goalTgtRef.current.set(...sample.target);

    // Smooth interpolation toward path
    camera.position.lerp(goalPosRef.current, positionLerp);
    targetRef.current.lerp(goalTgtRef.current, targetLerp);
    camera.lookAt(targetRef.current);

    controls.target.copy(targetRef.current);

    // FOV transitions
    if (sample.fov && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, sample.fov, 0.05);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enableDamping={false}
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