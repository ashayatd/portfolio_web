"use client";
import { useThree } from "@react-three/fiber";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import { ScrollProgressBar, useScrollController } from "./ScrollController";

import { BuildingA } from "./BuildingA";
import { BuildingB } from "./BuildingB";
import { BuildingC } from "./BuildingC";
import { BuildingD } from "./BuildingD";

import { Road } from "./Road";
import { CityBus } from "./Bus";
import { Car } from "./Car";
import { Windmill } from "./Windmill";
import { Fountain } from "./CenterFountain";
import { Tree } from "./Tree";
import { Bench } from "./Bench";
import { StreetLamp } from "./StreetLamp";
import { RoundedBox } from "@react-three/drei";
import { GrassSprites } from "./Grass";
import { RoadNetwork } from "./RoadBox";
import { Foundation } from "./Foundations";
import { Garden } from "./GardenRect";
import { BuildingBillboard } from "./InfoBillboard";
import { Character } from "./Character/Character";
import { CharacterCamera } from "./Character/CharacterCamera";

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
      <hemisphereLight color="#ffffff" groundColor="#cdd6e4" intensity={0.7} />
      <directionalLight
        position={[30, 45, 25]}
        intensity={1.15}
        color="#fff6ea"
      />
      <directionalLight
        position={[-28, 22, -18]}
        intensity={0.35}
        color="#dce8ff"
      />

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

function Sunlight() {
  return (
    <>
      {/* Reduced — just for subtle sky/ground tint */}
      <hemisphereLight groundColor="#E8F0E0" intensity={0.35} />

      {/* KEY — upper-left, low and raking for long shadows into gaps */}
      <directionalLight
        position={[-40, 14, -40]}
        intensity={2.8}
        castShadow
        color="#FFF5E8"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.002}
      />

      {/* FILL — opposite side, softens shadows so they aren't pitch black */}
      <directionalLight
        position={[10, 20, 40]}
        intensity={0.5}
        color="#ffffff"
      />

      {/* RIM — from behind/below, separates edges from background */}
      <directionalLight
        position={[0, 8, -50]}
        intensity={0.35}
        color="#FFF0E0"
      />
    </>
  );
}

// function 2ZebraCrossing() {
//   const x = -7;
//   const y = -0.5; // slightly above road
//   const z = -6.8;

//   return (
//     <group
//       position={[x, y, z]}
//       rotation={[0, 0.8, 0]} // change to Math.PI / 2 if road is horizontal
//     >
//       {Array.from({ length: 3 }).map((_, i) => (
//         <mesh key={i} position={[0, 0, i * 0.8 - 1]}>
//           <boxGeometry args={[4.5, 0.2, 0.4]} />
//           <meshStandardMaterial color="#ffffff" toneMapped={false} />
//         </mesh>
//       ))}
//     </group>
//   );
// }

function ZebraCrossing({
  position,
  rotation = 0,
  stripes = 3,
}: {
  position: [number, number, number];
  rotation?: number;
  stripes?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: stripes }).map((_, i) => (
        <mesh key={i} position={[0, 0, i * 0.8 - 1]}>
          <boxGeometry args={[4.5, 0.2, 0.4]} />
          <meshStandardMaterial color="#fff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RoadLine({
  position,
  rotation = 0,
  segments = 5,
  segmentLength = 3.5,
  gap = 0.4,
  offSetValue = 5,
  width = 0.45,
  color = "#ffffff",
}: {
  position: [number, number, number];
  rotation?: number;
  segments?: number;
  offSetValue?: number;
  segmentLength?: number;
  gap?: number;
  width?: number;
  color?: string;
}) {
  const totalStep = segmentLength + gap;
  const offset = ((segments - 1) * totalStep) / 1;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh key={i} position={[0, 0, i * totalStep - offset - offSetValue]}>
          <boxGeometry args={[width, 0.02, segmentLength]} />
          <meshStandardMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function CornerFoundation({
  plotWidth,
  plotDepth,
  y = -2.5,
  height = 0.15,
  color = "#dad3d3",
  cornerRadius = 0.35,
}: {
  plotWidth: number;
  plotDepth: number;
  y?: number;
  height?: number;
  color?: string;
  cornerRadius?: number;
}) {
  const geometry = useMemo(() => {
    const halfBase = plotWidth / 2;

    // Triangle: base at top (y=0), apex at bottom (y=-plotDepth)
    const bLeft = new THREE.Vector2(-halfBase, 0);
    const bRight = new THREE.Vector2(halfBase, 0);
    const apex = new THREE.Vector2(0, -plotDepth);

    const points = [bLeft, bRight, apex];

    const shape = new THREE.Shape();

    for (let i = 0; i < points.length; i++) {
      const prev = points[(i - 1 + points.length) % points.length];
      const curr = points[i];
      const next = points[(i + 1) % points.length];

      const v1 = new THREE.Vector2().subVectors(curr, prev).normalize();
      const v2 = new THREE.Vector2().subVectors(next, curr).normalize();

      const p1 = curr.clone().sub(v1.multiplyScalar(cornerRadius));
      const p2 = curr.clone().add(v2.multiplyScalar(cornerRadius));

      if (i === 0) {
        shape.moveTo(p1.x, p1.y);
      } else {
        shape.lineTo(p1.x, p1.y);
      }

      shape.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
    }

    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.03,
      bevelSegments: 3,
    });
  }, [plotWidth, plotDepth, cornerRadius, height]);

  return (
    <mesh
      geometry={geometry}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, y, 0]}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

const CORNER = 27;
const INSET = 7;

// Tree CLUSTERS kept in the 4 corner triangles only (each <Tree> = 3 trees).
// 4 clusters per corner -> ~48 individual trees for a lusher campus look.
const cornerConfigs = [
  // Top-Right
  { count: 4, baseX: CORNER, baseZ: -CORNER, seed: 1 },
  // Top-Left
  { count: 4, baseX: -CORNER, baseZ: -CORNER, seed: 2 },
  // Bottom-Right
  { count: 4, baseX: CORNER, baseZ: CORNER, seed: 3 },
  // Bottom-Left
  { count: 4, baseX: -CORNER, baseZ: CORNER, seed: 4 },
];

// Simple seeded random
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const trees = cornerConfigs.flatMap((config) => {
  const items = [];
  for (let i = 0; i < config.count; i++) {
    const rand1 = seededRandom(config.seed + i * 1.7);
    const rand2 = seededRandom(config.seed + i * 2.3 + 10);

    // Random offset within inset range, biased toward the corner
    const offsetX = (rand1 - 0.5) * INSET * 2;
    const offsetZ = (rand2 - 0.5) * INSET * 2;

    // Keep them in the corner quadrant (don't cross center)
    const x =
      config.baseX +
      (config.baseX > 0 ? -Math.abs(offsetX) : Math.abs(offsetX));
    const z =
      config.baseZ +
      (config.baseZ > 0 ? -Math.abs(offsetZ) : Math.abs(offsetZ));

    items.push({
      position: [x, rand1 > 0.5 ? -0.1 : 0, z] as [number, number, number],
    });
  }
  return items;
});

// Trees flanking each building — placed to the SIDES (and set back) so they
// frame the architecture rather than cover its front face.
const buildingTrees: { position: [number, number, number]; scale: number }[] = [
  // BuildingA — top, flank in X
  { position: [-8, 0, -25], scale: 0.85 },
  { position: [8.5, 0, -24.5], scale: 0.75 },
  // BuildingB — bottom, flank in X
  { position: [-8.5, 0, 25], scale: 0.8 },
  { position: [8, 0, 24.5], scale: 0.85 },
  // BuildingC — left, flank in Z
  { position: [-25, 0, -8], scale: 0.85 },
  { position: [-24.5, 0, 8.5], scale: 0.75 },
  // BuildingD — right, flank in Z
  { position: [25, 0, -11], scale: 0.8 },
  { position: [24.5, 0, 5.5], scale: 0.85 },
];

/* ========================= */
/* STREET LAMPS + BENCHES (symmetric, road-aligned) */
/* ========================= */

// The 4 roads enter the roundabout along the diagonals. Each entry gets a
// flanking PAIR of lamps -> 8 total, arms pointing in toward the road/center.
const GROUND_Y = -0.5;
const diagDirs: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];

const LAMP_RADII = [10, 24]; // inner + outer pairs along each diagonal road
const LAMP_FLANK = 4; // perpendicular offset to flank the road

const streetLamps = diagDirs.flatMap(([dx, dz]) => {
  const len = Math.hypot(dx, dz);
  const ux = dx / len;
  const uz = dz / len;
  const px = -uz; // perpendicular to the road direction
  const pz = ux;
  return LAMP_RADII.flatMap((r) => {
    const cx = ux * r;
    const cz = uz * r;
    return [1, -1].map((s) => {
      const x = cx + s * px * LAMP_FLANK;
      const z = cz + s * pz * LAMP_FLANK;
      // orient so the lamp arm overhangs the road toward the center
      const rotation = Math.atan2(z, -x);
      return {
        position: [x, GROUND_Y, z] as [number, number, number],
        rotation,
      };
    });
  });
});

const BUILDING_BOUNDS: {
  min: [number, number, number];
  max: [number, number, number];
}[] = [
  // BuildingA — top (Experience)
  { min: [-3, 0, -28], max: [3, 15, -18] },
  // BuildingB — bottom (Technology)
  { min: [-3, 0, 18], max: [3, 15, 28] },
  // BuildingC — left (Projects)
  { min: [-28, 0, -3], max: [-18, 15, 3] },
  // BuildingD — right (Skills)
  { min: [18, 0, -6], max: [28, 15, 2] },
  // Fountain (circular, approximated as box)
  { min: [-3, 0, -3], max: [3, 5, 3] },
];

// 4 benches: one beside each building (on its foundation plot, off the
// diagonal roads), turned to face the center monument.
const BENCH_Y = 0; // sits on the raised foundation, not the road
const benchSpots: [number, number][] = [
  [4, -17], // beside BuildingA (top)
  [-4, 17], // beside BuildingB (bottom)
  [-17, 4], // beside BuildingC (left)
  [17, 1.5], // beside BuildingD (right)
];
const benches = benchSpots.map(([x, z]) => ({
  // bench faces +Z by default; turn it to look back at the center monument
  position: [x, BENCH_Y, z] as [number, number, number],
  rotation: Math.atan2(-x, -z),
}));

/* ========================= */
/* BASE PLATFORM (like the image) */
/* ========================= */

function BasePlatform() {
  const PLATFORM_SIZE = 65;
  const FOUNDATION_WIDTH = 8;
  const FOUNDATION_DEPTH = 17;
  const OFFSET = 20;

  const CORNER_WIDTH = 22;
  const CORNER_DEPTH = 11;
  const CORNER_OFFSET = 21;

  const foundations = [
    {
      position: [-OFFSET, 0.1, 0] as [number, number, number],
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
    },
    {
      position: [OFFSET, 0.1, 0] as [number, number, number],
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    },
    {
      position: [0, 0.1, OFFSET] as [number, number, number],
      rotation: [0, Math.PI, 0] as [number, number, number],
    },
    {
      position: [0, 0.1, -OFFSET] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
  ];

  const corners = [
    {
      position: [-CORNER_OFFSET, 0.1, -CORNER_OFFSET] as [
        number,
        number,
        number,
      ],
      rotation: [0, Math.PI / 4, 0] as [number, number, number],
    },
    {
      position: [CORNER_OFFSET, 0.1, -CORNER_OFFSET] as [
        number,
        number,
        number,
      ],
      rotation: [0, -Math.PI / 4, 0] as [number, number, number],
    },
    {
      position: [CORNER_OFFSET, 0.1, CORNER_OFFSET] as [number, number, number],
      rotation: [0, -Math.PI * 0.75, 0] as [number, number, number],
    },
    {
      position: [-CORNER_OFFSET, 0.1, CORNER_OFFSET] as [
        number,
        number,
        number,
      ],
      rotation: [0, Math.PI * 0.75, 0] as [number, number, number],
    },
  ];

  return (
    <group>
      {/* Edge foundations */}
      {foundations.map((f, i) => (
        <group key={`edge-${i}`} position={f.position} rotation={f.rotation}>
          <Foundation
            plotWidth={FOUNDATION_WIDTH}
            plotDepth={FOUNDATION_DEPTH}
            y={0}
            height={2}
            inset={1}
            midWidth={31}
            cornerRadius={1}
          />
        </group>
      ))}

      {/* Corner foundations */}
      {corners.map((c, i) => (
        <group key={`corner-${i}`} position={c.position} rotation={c.rotation}>
          <CornerFoundation
            plotWidth={CORNER_WIDTH}
            plotDepth={CORNER_DEPTH}
            y={0}
            height={2}
            cornerRadius={0.5}
          />
        </group>
      ))}

      <RoundedBox
        position={[0, -2, 0]}
        args={[PLATFORM_SIZE, 3, PLATFORM_SIZE]}
        radius={1.5}
        smoothness={4}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </RoundedBox>
    </group>
  );
}

/* ========================= */
/* ROAD NETWORK (cross roads) */
/* ========================= */

/* ========================= */
/* MAIN CITY */
/* ========================= */

export function CityScene({
  exploreMode = false,
  onNavigate,
}: {
  exploreMode?: boolean;
  onNavigate?: (id: string) => void;
}) {
  const characterRef = useRef<THREE.Group>(null);
  const yawRef = useRef(0); // camera azimuth, driven by mouse-look
  const { gl } = useThree();

  // Mouse-look: horizontal mouse movement orbits the camera (and WASD follows).
  useEffect(() => {
    if (!exploreMode) return;
    const el = gl.domElement;
    const onMove = (e: MouseEvent) => {
      // Only turn while dragging OR pointer-locked feels heavy; use raw move.
      yawRef.current -= e.movementX * 0.0035;
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [exploreMode, gl]);

  return (
    <>
      {/* Lightweight light rig — replaces the HDR <Environment> so standard
          materials don't pay for per-pixel env-map sampling. Kept in world
          space (outside the rotating group) so shading stays stable. */}
      <ambientLight intensity={0.65} />
      <hemisphereLight color="#ffffff" groundColor="#cdd6e4" intensity={0.7} />
      <directionalLight
        position={[30, 45, 25]}
        intensity={1.15}
        color="#fff6ea"
      />
      <directionalLight
        position={[-28, 22, -18]}
        intensity={0.35}
        color="#dce8ff"
      />

      <group rotation={[0, -0.62, 0]} position={[0, 0, 0]}>
        {/* Lighting */}
        {/* Base Platform */}
        <BasePlatform />
        <ZebraCrossing position={[-7, -0.5, -6.8]} rotation={0.8} />
        <ZebraCrossing position={[-8, -0.5, 8]} rotation={-0.8} />
        <ZebraCrossing position={[8, -0.5, 8]} rotation={-2.35} />
        <ZebraCrossing position={[8, -0.5, -8]} rotation={2.35} />
        <RoadLine
          position={[-7, -0.5, -6.8]}
          offSetValue={4.5}
          rotation={0.8}
          segments={3}
        />
        <RoadLine
          position={[18, -0.5, 18]}
          offSetValue={2}
          rotation={0.8}
          segments={3}
        />
        <RoadLine
          position={[-8, -0.5, 8]}
          offSetValue={4}
          rotation={2.35}
          segments={3}
        />
        <RoadLine
          position={[8, -0.5, -8]}
          offSetValue={-12}
          rotation={2.35}
          segments={3}
        />

        <RoadLine
          position={[-21, -0.5, -18]}
          offSetValue={-12}
          rotation={2.35}
          segments={6}
        />

        <RoadLine
          position={[21, -0.5, -18]}
          offSetValue={-12}
          rotation={-2.35}
          segments={6}
        />

        <RoadLine
          position={[18, -0.5, 21]}
          offSetValue={-12}
          rotation={2.35}
          segments={6}
        />

        <RoadLine
          position={[-18, -0.5, 21]}
          offSetValue={-12}
          rotation={-2.35}
          segments={6}
        />

        <Garden
          position={[-10, 0.6, 0]}
          rotation={[0, Math.PI / 1, 0]}
          width={1.2}
          length={6}
        />

        <Garden
          position={[10, 0.6, 0]}
          rotation={[0, Math.PI / 1, 0]}
          width={1.2}
          length={6}
        />

        <Garden
          position={[0, 0.6, -10]}
          rotation={[0, Math.PI / 2, 0]}
          width={1.2}
          length={6}
        />

        <Garden
          position={[0, 0.6, 10]}
          rotation={[0, Math.PI / 2, 0]}
          width={1.2}
          length={6}
        />

        {exploreMode && (
          <>
            <CharacterCamera
              targetRef={characterRef}
              yawRef={yawRef}
              isActive={exploreMode}
            />
            <Character
              ref={characterRef}
              position={[0, 0, 12]}
              isActive={exploreMode}
              yawRef={yawRef}
              buildingBounds={BUILDING_BOUNDS}
            />
          </>
        )}

        {/* Road Network */}
        {/* ===================================== */}
        {/* BUILDINGS (4 QUADRANTS)               */}
        {/* ===================================== */}
        {/* Each building is paired with its info card; hovering the building
            (anywhere in the group) enlarges the card — same as the fountain. */}
        {/* Top Left (-x, -z) — EXPERIENCE (purple tower) */}
        <BuildingBillboard
          position={[0, 6, -34]}
          title="Experience"
          items={["2+ Years", "MERN Stack", "Backend", "REST APIs"]}
          accent="#8B5CF6"
          targetId="experience"
          onNavigate={onNavigate}
        >
          <group position={[0, 0, -21]}>
            <BuildingA width={5.2} height={11} depth={5.2} floors={4} />
          </group>
        </BuildingBillboard>

        {/* Top Right (+x, +z) — TECHNOLOGY (green building) */}
        <BuildingBillboard
          position={[0, 6, 34]}
          title="Technology"
          items={["Frontend", "Backend", "DevOps"]}
          accent="#5A8A5A"
          targetId="tech"
          onNavigate={onNavigate}
        >
          <group position={[0, 5.1, 21]}>
            <BuildingB />
          </group>
        </BuildingBillboard>

        {/* Bottom Left (-x) — PROJECTS (blue tower) */}
        <BuildingBillboard
          position={[-34, 6, 0]}
          title="Projects"
          items={["7+ Shipped", "Production", "Full-Stack", "Web Apps"]}
          accent="#69b9fa"
          targetId="projects"
          onNavigate={onNavigate}
        >
          <group position={[-21, 1.6, 0]}>
            <BuildingC />
          </group>
        </BuildingBillboard>

        {/* Bottom Right (+x) — SKILLS (orange factory) */}
        <BuildingBillboard
          position={[34, 6, 0]}
          title="Skills"
          items={[
            "React",
            "Node.js",
            "MongoDB",
            "Express",
            "Next.js",
            "Docker",
          ]}
          accent="#f4a261"
          targetId="skills"
          onNavigate={onNavigate}
        >
          <group position={[21, 3, -2.5]} rotation={[0, 4.7, 0]}>
            <BuildingD />
          </group>
        </BuildingBillboard>

        <group position={[0, -1.5, 0]}>
          <Fountain targetId="about" onNavigate={onNavigate} />
        </group>
        {/* <hemisphereLight
        color="#ffffff"
        groundColor="#ffffff"
        intensity={0.2}
      /> */}
        {/* ===================================== */}
        {/* VEHICLES                              */}
        {/* ===================================== */}
        {/* Bus on horizontal road */}
        {/* <CityBus position={[25, 0, 2]} rotation={[0, Math.PI, 0]} /> */}
        {/* Car on horizontal road */}
        {/* <Car position={[10, 0, 2]} rotation={[0, Math.PI, 0]} /> */}
        {/* ===================================== */}
        {/* LIGHTING                              */}
        {/* ===================================== */}
        {/* ===================================== */}
        {/* STREET LAMPS — 8, flanking the 4 road entries */}
        {/* ===================================== */}
        {streetLamps.map((l, i) => (
          <group
            key={`lamp-${i}`}
            position={l.position}
            rotation={[0, l.rotation, 0]}
          >
            <StreetLamp />
          </group>
        ))}
        {/* ===================================== */}
        {/* TREES — clusters confined to the 4 corner triangles */}
        {/* ===================================== */}
        {trees.map((t, i) => (
          <Tree key={i} position={t.position} />
        ))}
        {buildingTrees.map((t, i) => (
          <Tree key={`btree-${i}`} position={t.position} scale={t.scale} />
        ))}
        {/* ===================================== */}
        {/* BENCHES — 4, set back from the plaza, facing the monument */}
        {/* ===================================== */}
        {benches.map((b, i) => (
          <Bench
            key={`bench-${i}`}
            position={b.position}
            rotation={[0, b.rotation, 0]}
          />
        ))}
        {/* ===================================== */}
        {/* CAMERA CONTROLS                       */}
        {/* ===================================== */}
      </group>
    </>
  );
}
