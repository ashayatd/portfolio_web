"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneControls } from "./CameraRig";
import { ScrollProgressBar, useScrollController } from "./ScrollController";

import { BuildingA } from "./BuildingA";
import { BuildingB } from "./BuildingB";
import { BuildingC } from "./BuildingC";
import { Church } from "./Church";
import { Road } from "./Road";
import { CityBus } from "./Bus";
import { Car } from "./Car";
import { Windmill } from "./Windmill";

/* ========================= */
/* CLOUDS */
/* ========================= */

function Cloud({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[1.5, 6, 6]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>

      <mesh position={[1.4, 0.2, 0]} castShadow>
        <sphereGeometry args={[1.2, 6, 6]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>

      <mesh position={[-1.3, 0.1, 0]} castShadow>
        <sphereGeometry args={[1.1, 6, 6]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>

      <mesh position={[0.2, 0.6, 0]} castShadow>
        <sphereGeometry args={[1.0, 6, 6]} />
        <meshLambertMaterial color="#fafafa" />
      </mesh>
    </group>
  );
}

function Clouds() {
  return (
    <group>
      <Cloud position={[-30, 35, -20]} scale={2.2} />
      <Cloud position={[5, 38, -15]} scale={2.2} />
      <Cloud position={[45, 32, -20]} scale={1.7} />
    </group>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.15, 0.6]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* Back */}
      <mesh position={[0, 0.9, -0.25]} castShadow>
        <boxGeometry args={[2, 0.8, 0.1]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* Left Support */}
      <mesh position={[-0.95, 0.7, 0]}>
        <boxGeometry args={[0.12, 0.8, 0.7]} />
        <meshLambertMaterial color="#444444" />
      </mesh>

      {/* Right Support */}
      <mesh position={[0.95, 0.7, 0]}>
        <boxGeometry args={[0.12, 0.8, 0.7]} />
        <meshLambertMaterial color="#444444" />
      </mesh>

      {/* Legs */}
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshLambertMaterial color="#555555" />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
        <meshLambertMaterial color="#6a6a6a" />
      </mesh>

      {/* Bottom Layer */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[1.4, 2.2, 8]} />
        <meshLambertMaterial color="#d6d6d6" />
      </mesh>

      {/* Middle Layer */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[1.1, 2, 8]} />
        <meshLambertMaterial color="#c4c4c4" />
      </mesh>

      {/* Top Layer */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[0.8, 1.6, 8]} />
        <meshLambertMaterial color="#b5b5b5" />
      </mesh>
    </group>
  );
}

function Lightning() {
  const flashRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const strikeTimer = useRef(0);

  useFrame((_, delta) => {
    if (!flashRef.current || !ambientRef.current) return;

    strikeTimer.current -= delta;

    if (strikeTimer.current <= 0 && Math.random() > 0.95) {
      flashRef.current.intensity = 150;
      ambientRef.current.intensity = 1.5;

      setTimeout(() => {
        if (flashRef.current) flashRef.current.intensity = 100;
      }, 100);

      strikeTimer.current = 2 + Math.random() * 4;
    }

    flashRef.current.intensity = THREE.MathUtils.lerp(
      flashRef.current.intensity,
      0,
      0.15,
    );
    ambientRef.current.intensity = THREE.MathUtils.lerp(
      ambientRef.current.intensity,
      0.15,
      0.15,
    );
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} color="#e8f1ff" />
      <pointLight
        ref={flashRef}
        position={[0, 50, 0]}
        color="#e8f1ff"
        distance={250}
        intensity={0}
      />
    </>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Arm */}
      <mesh position={[0.4, 4.7, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Lamp Head */}
      <mesh position={[0.8, 4.6, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#fff8cc" />
      </mesh>

      {/* Actual Light */}
      <pointLight
        position={[0.8, 4.5, 0]}
        intensity={8.6}
        distance={7}
        color="#fff8cc"
      />
    </group>
  );
}

/* ========================= */
/* RAIN */
/* ========================= */

function Rain() {
  const rainRef = useRef<THREE.Group>(null);

  const drops = useMemo(
    () =>
      Array.from({ length: 150 }).map(() => ({
        x: (Math.random() - 0.5) * 70,
        z: (Math.random() - 0.5) * 70,
        speed: 50 + Math.random() * 8,
        offset: Math.random() * 40,
      })),
    [],
  );

  const HEIGHT = 40;

  useFrame(({ clock }) => {
    if (!rainRef.current) return;

    const t = clock.elapsedTime;

    rainRef.current.children.forEach((drop, i) => {
      const d = drops[i];
      drop.position.y = HEIGHT - ((d.offset + t * d.speed) % HEIGHT);
    });
  });

  return (
    <group ref={rainRef}>
      {drops.map((drop, i) => (
        <mesh key={i} position={[drop.x, 0, drop.z]}>
          <boxGeometry args={[0.04, 0.6, 0.04]} />
          <meshBasicMaterial color="#b5cbf5" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ========================= */
/* MAIN CITY */
/* ========================= */

export function CityScene() {
  return (
    <>
      {/* Lighting */}
      <directionalLight
        position={[30, 40, 20]}
        intensity={0.15}
        castShadow
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Ground */}
      <mesh position={[0, -0.2, 0]} scale={[1.6, 1, 1.1]} receiveShadow>
        <cylinderGeometry args={[35, 35, 0.2, 64]} />
        <meshStandardMaterial color="#5f5f5f" />
      </mesh>

      {/* ===================================== */}
      {/* CENTRAL CROSS ROAD                    */}
      {/* ===================================== */}

      {/* Vertical Road */}
      {/* <Road position={[0, 0.02, 0]} width={10} length={120} /> */}

      {/* Horizontal Road */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Road position={[0, 0.02, 5]} width={10} length={75} />
      </group>

      {/* ===================================== */}
      {/* BUILDINGS (4 QUADRANTS)               */}
      {/* ===================================== */}

      {/* Top Left */}
      <BuildingA position={[0, 0, -20.55]} />

      {/* Top Right */}
      <BuildingB position={[25, 0, -26]} />

      {/* Bottom Left */}
      <BuildingC position={[-18, 0, -16.9]} />

      {/* Bottom Right */}
      <Church position={[25, 0, 16]} rotation={[0, 4.71, 0]} />

      <Windmill position={[-10, 0, 20]} />

      {/* ===================================== */}
      {/* VEHICLES                              */}
      {/* ===================================== */}

      {/* Bus travelling east */}
      <CityBus position={[25, 0, 2]} rotation={[0, Math.PI, 0]} />

      <Lightning />

      {/* <Moon position={[50, 45, -70]} /> */}
      {/* Second car */}
      <Car position={[10, 0, 2]} rotation={[0, Math.PI, 0]} />

      {/* ===================================== */}
      {/* HELICOPTER                            */}
      {/* ===================================== */}

      {/* <Helicopter position={[20, 15, -20]} /> */}

      {/* ===================================== */}
      {/* WEATHER                               */}
      {/* ===================================== */}

      <Clouds />
      <Rain />

      <StreetLamp position={[-30, 0, -6]} />
      <StreetLamp position={[-15, 0, -6]} />
      <StreetLamp position={[0, 0, -6]} />
      <StreetLamp position={[15, 0, -6]} />
      <StreetLamp position={[30, 0, -6]} />

      <StreetLamp position={[-30, 0, 6]} />
      <StreetLamp position={[-15, 0, 6]} />
      <StreetLamp position={[0, 0, 6]} />
      <StreetLamp position={[15, 0, 6]} />
      <StreetLamp position={[30, 0, 6]} />

      <Tree position={[-6, 0, -31]} />
      <Tree position={[6, 0, -31]} />
      <Tree position={[-6, 0, -11]} />
      <Tree position={[6, 0, -11]} />
      <Tree position={[-28, 0, -8]} />

      {/* ===================================== */}
      {/* CAMERA CONTROLS                       */}
      {/* ===================================== */}

      <Tree position={[15, 0, 28]} />
      <Tree position={[35, 0, 28]} />

      <Tree position={[15, 0, 8]} />
      <Tree position={[35, 0, 8]} />

      <Bench position={[4, 0, -6]} />

      <Bench position={[-4, 0, -6]} />

      <Bench position={[-13, 0, -6]} />

      <Bench position={[-20, 0, -6]} />
    </>
  );
}

export default function MiniCityScene() {
  const progressRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isManualRef = useRef(false);

  useScrollController({
    progressRef,
    isDraggingRef,
    isManualRef,
    scrollSensitivity: 0.0002,
    lerpFactor: 0.08,
  });

  return (
    <div className="relative h-screen w-full bg-black">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [0, 55, 55],
          fov: 50,
        }}
        style={{ touchAction: "none" }}
      >
        <CityScene />
        <SceneControls
          progressRef={progressRef}
          isDraggingRef={isDraggingRef}
          isManualRef={isManualRef}
          positionLerp={0.12}
          targetLerp={0.12}
        />
      </Canvas>

      <ScrollProgressBar progressRef={progressRef} />
    </div>
  );
}
