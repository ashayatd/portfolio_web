// Character.tsx — camera-relative third-person controller (WASD + mouse-look)
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

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
}

export const Character = forwardRef<THREE.Group, CharacterProps>(
  function Character(
    { position = [0, -1.5, 12], isActive = false, yawRef, buildingBounds = [] },
    ref,
  ) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/assets/CharcterAssets/Soldier.glb");
    const { actions, mixer } = useAnimations(animations, groupRef);

    // Expose the group so the follow camera can read world position.
    useImperativeHandle(ref, () => groupRef.current as THREE.Group, []);

    const ctrl = useRef({
      // [forwardInput, rightInput, runFlag]
      key: [0, 0, 0] as [number, number, number],
      position: new THREE.Vector3(...position),
      current: "Idle",
      fadeDuration: 0.3,
      runVelocity: 8,
      walkVelocity: 3.2,
      turnSpeed: 0.18,
    });

    // ---- Keyboard ----
    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        const k = ctrl.current.key;
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
      window.addEventListener("keydown", down);
      window.addEventListener("keyup", up);
      return () => {
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
      };
    }, []);

    const blocked = (p: THREE.Vector3): boolean => {
      const r = 1.2;
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

    // Scratch
    const dir = useRef(new THREE.Vector3());
    const targetQuat = useRef(new THREE.Quaternion());
    const up = useRef(new THREE.Vector3(0, 1, 0));

    useFrame((_, delta) => {
      const g = groupRef.current;
      if (!g || !mixer) return;

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
        // forward = (fx,0,fz), right = (fz,0,-fx)
        dir.current
          .set(fx * k[0] + fz * k[1], 0, fz * k[0] - fx * k[1])
          .normalize();

        // Face movement direction (smooth).
        const angle = Math.atan2(dir.current.x, dir.current.z);
        targetQuat.current.setFromAxisAngle(up.current, angle);
        g.quaternion.slerp(targetQuat.current, c.turnSpeed);

        const speed = (k[2] ? c.runVelocity : c.walkVelocity) * delta;
        const next = c.position.clone().addScaledVector(dir.current, speed);
        if (!blocked(next)) {
          c.position.copy(next);
          g.position.copy(c.position);
        }
      }

      mixer.update(delta);
    });

    return (
      <group ref={groupRef} position={position}>
        <primitive object={scene} castShadow />
      </group>
    );
  },
);

useGLTF.preload("/assets/CharcterAssets/Soldier.glb");
