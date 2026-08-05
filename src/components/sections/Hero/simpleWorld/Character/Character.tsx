// Character.tsx — camera-relative third-person controller (WASD + mouse-look)
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/**
 * Name of the group holding the walkable surfaces (base platform + raised
 * foundation plots). The ground probe raycasts against this subtree only.
 */
export const GROUND_NAME = "city-ground";

/** How far above/below the character the ground probe searches. */
const PROBE_UP = 2;
const PROBE_DOWN = 6;

interface CharacterProps {
  position?: [number, number, number];
  /** Active only while exploring — otherwise input/animation is idle. */
  isActive?: boolean;
  /** Shared camera azimuth (radians) so WASD is relative to the camera. */
  yawRef?: React.RefObject<number>;
  buildingBounds?: Array<{
    min: [number, number, number];
    max: [number, number, number];
  }>;
  /** Half-size of the walkable platform — keeps the character from stepping off. */
  platformHalf?: number;
}

export const Character = forwardRef<THREE.Group, CharacterProps>(
  function Character(
    {
      position = [0, -1.5, 12],
      isActive = false,
      yawRef,
      buildingBounds = [],
      platformHalf = 31,
    },
    ref,
  ) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/assets/CharcterAssets/Soldier.glb");
    // NOTE: useAnimations drives the mixer itself (its own useFrame calls
    // mixer.update). Don't advance it again below or every clip — and every
    // crossfade — runs at double speed.
    const { actions } = useAnimations(animations, groupRef);

    // Expose the group so the follow camera can read world position.
    useImperativeHandle(ref, () => groupRef.current as THREE.Group, []);

    const ctrl = useRef({
      // [forwardInput, rightInput, runFlag]
      key: [0, 0, 0] as [number, number, number],
      position: new THREE.Vector3(...position),
      current: "Idle",
      fadeDuration: 0.3,
      // The model is ~1.83 units tall, so a unit reads as roughly a metre and
      // these are the ground speeds the Walk/Run clips were authored against.
      // Raising them makes the feet slide; the old 3.2/8 only looked right
      // because the mixer was running at double speed.
      runVelocity: 5,
      walkVelocity: 2,
      turnSpeed: 0.18,
    });

    // ---- Keyboard ----
    // Bound only while exploring, so the arrow keys keep scrolling the page
    // normally everywhere else.
    useEffect(() => {
      const c = ctrl.current;
      if (!isActive) {
        c.key = [0, 0, 0];
        return;
      }

      // Arrows/Space would scroll the page behind the overlay.
      const SCROLL_KEYS = new Set([
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
      ]);

      const down = (e: KeyboardEvent) => {
        const k = ctrl.current.key;
        if (SCROLL_KEYS.has(e.code)) e.preventDefault();
        switch (e.code) {
          case "ArrowUp": case "KeyW": k[0] = 1; break;
          case "ArrowDown": case "KeyS": k[0] = -1; break;
          case "ArrowLeft": case "KeyA": k[1] = -1; break;
          case "ArrowRight": case "KeyD": k[1] = 1; break;
          case "ShiftLeft": case "ShiftRight": k[2] = 1; break;
        }
      };
      const up = (e: KeyboardEvent) => {
        const k = ctrl.current.key;
        switch (e.code) {
          case "ArrowUp": case "KeyW": if (k[0] > 0) k[0] = 0; break;
          case "ArrowDown": case "KeyS": if (k[0] < 0) k[0] = 0; break;
          case "ArrowLeft": case "KeyA": if (k[1] < 0) k[1] = 0; break;
          case "ArrowRight": case "KeyD": if (k[1] > 0) k[1] = 0; break;
          case "ShiftLeft": case "ShiftRight": k[2] = 0; break;
        }
      };
      window.addEventListener("keydown", down, { passive: false });
      window.addEventListener("keyup", up);
      return () => {
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
        c.key = [0, 0, 0];
      };
    }, [isActive]);

    // Idle has to be playing from the start, otherwise the model sits in its
    // bind pose until the first key press.
    useEffect(() => {
      const idle = actions["Idle"];
      if (idle) idle.reset().play();
    }, [actions]);

    const blocked = (p: THREE.Vector3): boolean => {
      const r = 1.2;
      // Platform edge.
      if (Math.abs(p.x) > platformHalf || Math.abs(p.z) > platformHalf) {
        return true;
      }
      for (const b of buildingBounds) {
        if (
          p.x > b.min[0] - r &&
          p.x < b.max[0] + r &&
          p.z > b.min[2] - r &&
          p.z < b.max[2] + r
        ) {
          return true;
        }
      }
      return false;
    };

    // Scratch — reused every frame so movement allocates nothing.
    const dir = useRef(new THREE.Vector3());
    const nextPos = useRef(new THREE.Vector3());
    const targetQuat = useRef(new THREE.Quaternion());
    const up = useRef(new THREE.Vector3(0, 1, 0));

    // Ground probe scratch.
    const raycaster = useRef(new THREE.Raycaster());
    const groundObj = useRef<THREE.Object3D | null>(null);
    const probeFrom = useRef(new THREE.Vector3());
    const down = useRef(new THREE.Vector3(0, -1, 0));
    const hitPoint = useRef(new THREE.Vector3());
    const hits = useRef<THREE.Intersection[]>([]);

    useFrame((_, delta) => {
      const g = groupRef.current;
      if (!g) return;

      const c = ctrl.current;
      const k = c.key;
      const moving = isActive && (k[0] !== 0 || k[1] !== 0);
      const play = moving ? (k[2] ? "Run" : "Walk") : "Idle";

      // ---- Animation crossfade ----
      if (c.current !== play) {
        const next = actions[play];
        const old = actions[c.current];
        if (next && old) {
          next.reset();
          next.weight = 1;
          next.stopFading();
          old.stopFading();
          if (play !== "Idle") {
            next.time =
              old.time * (next.getClip().duration / old.getClip().duration);
          }
          old._scheduleFading(c.fadeDuration, old.getEffectiveWeight(), 0);
          next._scheduleFading(c.fadeDuration, next.getEffectiveWeight(), 1);
          next.play();
        }
        c.current = play;
      }

      // ---- Movement (camera-relative via shared yaw) ----
      if (moving) {
        const yaw = yawRef?.current ?? 0;
        const fx = Math.sin(yaw);
        const fz = Math.cos(yaw);
        // forward = (fx, 0, fz); right = forward × up = (-fz, 0, fx).
        dir.current
          .set(fx * k[0] - fz * k[1], 0, fz * k[0] + fx * k[1])
          .normalize();

        // Face movement direction (smooth).
        const angle = Math.atan2(dir.current.x, dir.current.z);
        targetQuat.current.setFromAxisAngle(up.current, angle);
        g.quaternion.slerp(targetQuat.current, c.turnSpeed);

        const speed = (k[2] ? c.runVelocity : c.walkVelocity) * delta;
        const next = nextPos.current
          .copy(c.position)
          .addScaledVector(dir.current, speed);
        if (!blocked(next)) {
          c.position.copy(next);
          g.position.copy(c.position);
        }
      }

      // ---- Ground probe ----
      // The city is not flat: roads sit at -0.5 and the raised foundation
      // plots at 0.1. Drop a ray from just above the character and follow
      // whatever surface is actually underfoot, so he neither hovers over the
      // kerbs nor sinks to the shins crossing onto a plot.
      const parent = g.parent;
      if (!parent) return;
      if (!groundObj.current) {
        groundObj.current = parent.getObjectByName(GROUND_NAME) ?? null;
      }
      const ground = groundObj.current;
      if (!ground) return;

      probeFrom.current.set(
        c.position.x,
        c.position.y + PROBE_UP,
        c.position.z,
      );
      parent.localToWorld(probeFrom.current);
      raycaster.current.set(probeFrom.current, down.current);
      raycaster.current.far = PROBE_UP + PROBE_DOWN;

      hits.current.length = 0;
      raycaster.current.intersectObject(ground, true, hits.current);
      if (!hits.current.length) return;

      hitPoint.current.copy(hits.current[0].point);
      parent.worldToLocal(hitPoint.current);

      // Ease onto the surface so a kerb reads as a step up, not a teleport.
      const settle = Math.min(1, delta * 12);
      c.position.y += (hitPoint.current.y - c.position.y) * settle;
      g.position.y = c.position.y;
    });

    return (
      // Spawn facing the same way the camera looks, so the first step forward
      // doesn't start with a 180° spin.
      <group
        ref={groupRef}
        position={position}
        rotation={[0, yawRef?.current ?? 0, 0]}
      >
        {/* The GLB's rest pose looks down -Z, but every turn here aims the
            group's +Z at the movement direction. Spin the model once so its
            front and the group's forward are the same axis. */}
        <group rotation={[0, Math.PI, 0]}>
          <primitive object={scene} castShadow />
        </group>
      </group>
    );
  },
);

useGLTF.preload("/assets/CharcterAssets/Soldier.glb");
