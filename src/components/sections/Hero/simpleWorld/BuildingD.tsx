"use client";

import * as THREE from "three";
import { useMemo } from "react";

interface BuildingDProps {
  position?: [number, number, number];
}

const COLOR = {
  wall: "#f4a261",
  dark: "#e09b5f",
  opening: "#969996",
  roofLip: "#e09b5f",
  smokestack: "#f4a261",
  accent: "#d97b3c", // richer band trim
  metal: "#bfc2bf", // pipes / legs
  glass: "#bcdfe8", // clerestory glazing
  tank: "#cf9b6f", // water tank
};

/* ------------------------------------------------------------------ */
/*  LARGE VERTICAL OPENING (factory door / slit)                       */
/* ------------------------------------------------------------------ */
function VerticalOpening({
  width,
  height,
  depth = 0.15,
}: {
  width: number;
  height: number;
  depth?: number;
}) {
  return (
    <mesh position={[0, 0, depth / 2]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={COLOR.opening} roughness={0.9} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOF LIP — thick raised border around entire roof                  */
/* ------------------------------------------------------------------ */
function RoofLip({
  width,
  depth,
  y,
}: {
  width: number;
  depth: number;
  y: number;
}) {
  const thickness = 0.15;
  const height = 0.2;
  const overhang = 0.12;

  const w = width / 2 + overhang;
  const d = depth / 2 + overhang;

  return (
    <group position={[0, y, 0]}>
      {/* Front */}
      <mesh position={[0, 0, d - thickness / 2]}>
        <boxGeometry args={[width + overhang * 2, height, thickness]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -(d - thickness / 2)]}>
        <boxGeometry args={[width + overhang * 2, height, thickness]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
      {/* Left */}
      <mesh position={[-(w - thickness / 2), 0, 0]}>
        <boxGeometry args={[thickness, height, depth + overhang * 2]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
      {/* Right */}
      <mesh position={[w - thickness / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, depth + overhang * 2]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  SIDE SLIT WINDOWS — vertical recessed lines                         */
/* ------------------------------------------------------------------ */
function SideSlits({
  count,
  spacing,
  width,
  height,
  side,
}: {
  count: number;
  spacing: number;
  width: number;
  height: number;
  side: "left" | "right" | "front" | "back";
}) {
  const positions = useMemo(() => {
    const arr: number[] = [];
    const start = -((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
      arr.push(start + i * spacing);
    }
    return arr;
  }, [count, spacing]);

  const getTransform = (pos: number) => {
    switch (side) {
      case "front":
        return { pos: [pos, 0, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number] };
      case "back":
        return { pos: [pos, 0, 0] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] };
      case "left":
        return { pos: [0, 0, pos] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] };
      case "right":
        return { pos: [0, 0, pos] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] };
    }
  };

  return (
    <group>
      {positions.map((p, i) => {
        const t = getTransform(p);
        return (
          <group key={i} position={t.pos} rotation={t.rot}>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[width, height, 0.12]} />
              <meshStandardMaterial color={COLOR.opening} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  SMOKESTACK — thick, tall factory chimney                           */
/* ------------------------------------------------------------------ */
function Smokestack({
  x,
  z,
  height,
  radius = 0.55,
}: {
  x: number;
  z: number;
  height: number;
  radius?: number;
}) {
  return (
    <group position={[x, height / 2, z]}>
      {/* Main cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius + 0.12, height, 20]} />
        <meshStandardMaterial color={COLOR.smokestack} roughness={0.7} />
      </mesh>
      {/* Mid band ring */}
      <mesh position={[0, height * 0.12, 0]}>
        <cylinderGeometry args={[radius + 0.05, radius + 0.05, 0.16, 20]} />
        <meshStandardMaterial color={COLOR.accent} roughness={0.8} />
      </mesh>
      {/* Top rim */}
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <cylinderGeometry args={[radius + 0.05, radius, 0.1, 20]} />
        <meshStandardMaterial color={COLOR.dark} roughness={0.8} />
      </mesh>
      {/* Inner dark hole */}
      <mesh position={[0, height / 2 + 0.06, 0]}>
        <cylinderGeometry args={[radius - 0.08, radius - 0.04, 0.08, 20]} />
        <meshStandardMaterial color={COLOR.opening} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOFTOP MONITOR — raised clerestory skylight (classic factory)     */
/* ------------------------------------------------------------------ */
function RooftopMonitor({
  width,
  depth,
  y,
}: {
  width: number;
  depth: number;
  y: number;
}) {
  const mw = width * 0.34;
  const md = depth * 0.4;
  const mh = 0.7;
  return (
    <group position={[0, y, 0]}>
      {/* Clerestory body */}
      <mesh castShadow>
        <boxGeometry args={[mw, mh, md]} />
        <meshStandardMaterial color={COLOR.dark} roughness={0.7} />
      </mesh>
      {/* Glazed strips on both long sides */}
      {([1, -1] as const).map((s, i) => (
        <mesh key={i} position={[s * (mw / 2 + 0.015), 0.04, 0]}>
          <boxGeometry args={[0.05, mh * 0.5, md * 0.88]} />
          <meshStandardMaterial
            color={COLOR.glass}
            roughness={0.2}
            metalness={0.3}
            emissive="#6fa8b8"
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
      {/* Cap */}
      <mesh position={[0, mh / 2 + 0.06, 0]} castShadow>
        <boxGeometry args={[mw + 0.18, 0.12, md + 0.18]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  WATER TANK — elevated cylindrical tank on legs                     */
/* ------------------------------------------------------------------ */
function WaterTank({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Legs */}
      {(
        [
          [-0.24, -0.24],
          [0.24, -0.24],
          [-0.24, 0.24],
          [0.24, 0.24],
        ] as [number, number][]
      ).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.28, lz]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.56, 6]} />
          <meshStandardMaterial color={COLOR.metal} roughness={0.6} />
        </mesh>
      ))}
      {/* Tank body */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.56, 18]} />
        <meshStandardMaterial color={COLOR.tank} roughness={0.6} />
      </mesh>
      {/* Domed top */}
      <mesh position={[0, 1.06, 0]} castShadow>
        <sphereGeometry args={[0.42, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLOR.tank} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOF PIPES — pair of horizontal ducts                              */
/* ------------------------------------------------------------------ */
function RoofPipes({
  position,
  length = 1.8,
}: {
  position: [number, number, number];
  length?: number;
}) {
  return (
    <group position={position}>
      {[0, 0.26].map((zoff, i) => (
        <mesh
          key={i}
          position={[0, 0.1, zoff]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, length, 12]} />
          <meshStandardMaterial color={COLOR.metal} roughness={0.5} />
        </mesh>
      ))}
      {/* Support saddles */}
      {[-length / 2 + 0.2, length / 2 - 0.2].map((sx, i) => (
        <mesh key={`s${i}`} position={[sx, 0.04, 0.13]} castShadow>
          <boxGeometry args={[0.1, 0.12, 0.44]} />
          <meshStandardMaterial color={COLOR.dark} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  LOADING CANOPY — projecting awning over the front doors            */
/* ------------------------------------------------------------------ */
function LoadingCanopy({
  width,
  y,
  z,
}: {
  width: number;
  y: number;
  z: number;
}) {
  return (
    <group position={[0, y, z]}>
      {/* Slab */}
      <mesh castShadow>
        <boxGeometry args={[width, 0.12, 0.95]} />
        <meshStandardMaterial color={COLOR.accent} roughness={0.7} />
      </mesh>
      {/* Diagonal support struts */}
      {([-width / 2 + 0.3, width / 2 - 0.3] as const).map((sx, i) => (
        <mesh
          key={i}
          position={[sx, -0.42, -0.34]}
          rotation={[-0.6, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.045, 0.045, 1.05, 8]} />
          <meshStandardMaterial color={COLOR.metal} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN BLOCK — large factory building with tall front doors          */
/* ------------------------------------------------------------------ */
function MainBlock() {
  const width = 5.6;
  const height = 3.4;
  const depth = 4.4;

  return (
    <group>
      {/* Main wall */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={COLOR.wall} roughness={0.7} />
      </mesh>

      {/* Parapet accent band near the top — wraps the whole block */}
      <mesh position={[0, height / 2 - 0.45, 0]}>
        <boxGeometry args={[width + 0.06, 0.24, depth + 0.06]} />
        <meshStandardMaterial color={COLOR.accent} roughness={0.7} />
      </mesh>

      {/* Front: two large vertical door openings */}
      <group position={[-0.9, -0.3, depth / 2 - 0.02]}>
        <VerticalOpening width={1.1} height={2.0} />
      </group>
      <group position={[0.9, -0.3, depth / 2 - 0.02]}>
        <VerticalOpening width={1.1} height={2.0} />
      </group>

      {/* Loading canopy over the front doors */}
      <LoadingCanopy width={3.4} y={0.85} z={depth / 2 + 0.32} />

      {/* Right side: vertical slit windows */}
      <group position={[width / 2 - 0.02, 0, 0]}>
        <SideSlits count={3} spacing={0.9} width={0.35} height={1.6} side="right" />
      </group>

      {/* Back side: vertical slit windows */}
      <group position={[0, 0, -depth / 2 + 0.02]}>
        <SideSlits count={2} spacing={1.4} width={0.4} height={1.4} side="back" />
      </group>

      {/* Roof lip */}
      <RoofLip width={width} depth={depth} y={height / 2 + 0.1} />

      {/* ===== ROOFTOP EQUIPMENT ===== */}
      {/* Clerestory monitor skylight, centered */}
      <RooftopMonitor width={width} depth={depth} y={height / 2 + 0.45} />

      {/* Water tank — back-right corner */}
      <WaterTank
        position={[width / 2 - 0.95, height / 2, -depth / 2 + 0.95]}
      />

      {/* Roof pipes — front edge, running along width */}
      <RoofPipes position={[0.4, height / 2, depth / 2 - 0.5]} length={1.6} />

      {/* Smokestacks — shorter, spread wide for a horizontal industrial profile */}
      <Smokestack x={-1.7} z={-0.5} height={2.8} radius={0.55} />
      <Smokestack x={-0.6} z={-1.1} height={2.2} radius={0.45} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  WING — smaller attached block with slits                           */
/* ------------------------------------------------------------------ */
function Wing() {
  const width = 2.8;
  const height = 2.4;
  const depth = 3.2;

  return (
    <group>
      {/* Wall */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={COLOR.wall} roughness={0.7} />
      </mesh>

      {/* Front: vertical slits */}
      <group position={[0, 0, depth / 2 - 0.02]}>
        <SideSlits count={2} spacing={1.0} width={0.4} height={1.4} side="front" />
      </group>

      {/* Right side: vertical slits */}
      <group position={[width / 2 - 0.02, 0, 0]}>
        <SideSlits count={3} spacing={0.8} width={0.35} height={1.2} side="right" />
      </group>

      {/* Roof lip */}
      <RoofLip width={width} depth={depth} y={height / 2 + 0.1} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CONNECTING BRIDGE — corridor between main and wing                 */
/* ------------------------------------------------------------------ */
function Bridge() {
  return (
    <group position={[0, 0.2, 0]}>
      {/* Main corridor */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 1.2, 1.6]} />
        <meshStandardMaterial color={COLOR.wall} roughness={0.7} />
      </mesh>
      {/* Roof lip on bridge */}
      <group position={[0, 0.6 + 0.1, 0]}>
        <mesh position={[0, 0, 0.82]}>
          <boxGeometry args={[1.5, 0.18, 0.15]} />
          <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, -0.82]}>
          <boxGeometry args={[1.5, 0.18, 0.15]} />
          <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
        </mesh>
        <mesh position={[-0.68, 0, 0]}>
          <boxGeometry args={[0.15, 0.18, 1.8]} />
          <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
        </mesh>
        <mesh position={[0.68, 0, 0]}>
          <boxGeometry args={[0.15, 0.18, 1.8]} />
          <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  BUILDING D — factory assembly                                       */
/* ------------------------------------------------------------------ */
export function BuildingD({ position = [0, 0, 0] }: BuildingDProps) {
  return (
    // Non-uniform scale: wide & deep footprint, compressed height → squat,
    // horizontal factory massing that reads as infrastructure, not a tower.
    <group position={position} scale={[2, 1.85, 2.4]}>
      {/* Main block */}
      <MainBlock />

      {/* Wing — pushed further out to widen the overall footprint */}
      <group position={[4.4, -0.2, 0.9]}>
        <Wing />
      </group>

      {/* Bridge connecting them */}
      <group position={[2.2, 0.1, 0.5]}>
        <Bridge />
      </group>
    </group>
  );
}