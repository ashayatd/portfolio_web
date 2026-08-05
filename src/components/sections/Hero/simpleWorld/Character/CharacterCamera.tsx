// CharacterCamera.tsx — third-person follow camera (GTA-style)
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CharacterCameraProps {
  /** The character's THREE.Group (may live inside a rotated parent group). */
  targetRef: React.RefObject<THREE.Group | null>;
  /** Shared camera azimuth (radians), driven by the mouse-look. */
  yawRef: React.RefObject<number>;
  /**
   * Shared camera elevation (radians). Positive looks down on the character
   * from above, negative drops the camera so the view tilts up the towers.
   */
  pitchRef: React.RefObject<number>;
  /** Only drive the camera while exploring. */
  isActive: boolean;
  distance?: number;
  /** Height of the look point above the character's feet (roughly the head). */
  eyeHeight?: number;
  /** Street-level FOV — the docked preview uses a long lens (25°). */
  fov?: number;
}

const SMOOTH = 7;

export function CharacterCamera({
  targetRef,
  yawRef,
  pitchRef,
  isActive,
  distance = 8.5,
  eyeHeight = 1.6,
  fov = 55,
}: CharacterCameraProps) {
  const { camera } = useThree();
  // Read the camera lazily so the lens tweak below mutates the live scene
  // object rather than a value React treats as frozen.
  const get = useThree((state) => state.get);

  // The scene camera is a 25° "miniature" lens; that reads as extreme zoom
  // from street level. Widen it while exploring and restore it on exit.
  useEffect(() => {
    const cam = get().camera;
    if (!(cam instanceof THREE.PerspectiveCamera)) return;
    const previous = cam.fov;
    cam.fov = fov;
    cam.updateProjectionMatrix();
    return () => {
      cam.fov = previous;
      cam.updateProjectionMatrix();
    };
  }, [get, fov]);
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
    const pitch = pitchRef.current;
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const parent = t.parent;

    // Orbit the head on a sphere: yaw swings the camera around, pitch raises
    // and lowers it. Offset runs from the look point back to the camera.
    const lookY = t.position.y + eyeHeight;
    const flat = Math.cos(pitch) * distance;
    let ox = -fx * flat;
    let oy = Math.sin(pitch) * distance;
    let oz = -fz * flat;

    // Looking up would bury the camera in the road. Shorten the offset instead
    // of clamping its height — same ray, so the upward view angle survives and
    // the camera simply tucks in closer behind the character.
    const minY = t.position.y + 0.6;
    if (lookY + oy < minY) {
      const k = (minY - lookY) / oy;
      ox *= k;
      oy *= k;
      oz *= k;
    }

    localCam.current.set(t.position.x + ox, lookY + oy, t.position.z + oz);
    localLook.current.set(t.position.x, lookY, t.position.z);

    // Convert from the character's (possibly rotated) parent space → world.
    // localToWorld mutates in place, so the scratch vectors carry the result
    // and this runs allocation-free.
    const worldCam = parent
      ? parent.localToWorld(localCam.current)
      : localCam.current;
    const worldLook = parent
      ? parent.localToWorld(localLook.current)
      : localLook.current;

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
