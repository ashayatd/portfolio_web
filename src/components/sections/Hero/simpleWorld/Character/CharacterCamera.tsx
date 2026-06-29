// CharacterCamera.tsx — third-person follow camera (GTA-style)
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CharacterCameraProps {
  /** The character's THREE.Group (may live inside a rotated parent group). */
  targetRef: React.RefObject<THREE.Group | null>;
  /** Shared camera azimuth (radians), driven by the mouse-look. */
  yawRef: React.RefObject<number>;
  /** Only drive the camera while exploring. */
  isActive: boolean;
  distance?: number;
  height?: number;
}

const SMOOTH = 7;

export function CharacterCamera({
  targetRef,
  yawRef,
  isActive,
  distance = 8,
  height = 4.5,
}: CharacterCameraProps) {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const snapped = useRef(false);

  // Scratch vectors (avoid per-frame allocation).
  const localCam = useRef(new THREE.Vector3());
  const localLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const t = targetRef.current;
    if (!isActive || !t) {
      snapped.current = false;
      return;
    }

    const yaw = yawRef.current;
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const parent = t.parent;

    // Desired camera spot: behind the character (opposite its facing) + up.
    localCam.current.set(
      t.position.x - fx * distance,
      t.position.y + height,
      t.position.z - fz * distance,
    );
    localLook.current.set(t.position.x, t.position.y + 1.6, t.position.z);

    // Convert from the character's (possibly rotated) parent space → world.
    const worldCam = parent
      ? parent.localToWorld(localCam.current.clone())
      : localCam.current.clone();
    const worldLook = parent
      ? parent.localToWorld(localLook.current.clone())
      : localLook.current.clone();

    if (!snapped.current) {
      pos.current.copy(worldCam);
      look.current.copy(worldLook);
      snapped.current = true;
    } else {
      const a = 1 - Math.exp(-SMOOTH * delta);
      pos.current.lerp(worldCam, a);
      look.current.lerp(worldLook, a);
    }

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}
