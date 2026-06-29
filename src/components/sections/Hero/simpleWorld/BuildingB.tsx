"use client";

import * as THREE from "three";
import { useMemo } from "react";

interface BuildingBProps {
  position?: [number, number, number];
}

const height = 14;
const depth = 3.2;
const floors = 7;
const badge = "TS";
const badgeColor = "#3178C6";
const width = 3.2;

const floorHeight = height / floors;
const bandH = 0.22;
const bandOut = 0.1;
const podiumH = 1.6;
const podiumW = width + 1.8;
const podiumD = depth + 1.8;

const COLOR = {
  wall: "#C4E8C4",
  window: "#8CB88C",
  roofLip: "#B0D8B0",
  frame: "#A0C8A0",
  sill: "#D0ECD0",
  door: "#5A8A5A",
  doorFrame: "#A0C8A0",
  trim: "#B0D8B0",
  base: "#9EB89E",
  hvac: "#8CB88C",
  paving: "#A8B8A8",
  // Foundation boundary color
  foundation: "#C85A5A",
};

/* ------------------------------------------------------------------ */
/*  RECESSED WINDOW — dark inset rectangle                            */
/* ------------------------------------------------------------------ */
function RecessedWindow({
  width,
  height,
  depth = 0.06,
}: {
  width: number;
  height: number;
  depth?: number;
}) {
  return (
    <mesh position={[0, 0, depth / 2]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={COLOR.window} roughness={0.8} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  WINDOW WITH FRAME & SILL — full window assembly                    */
/* ------------------------------------------------------------------ */
function WindowAssembly({
  winWidth,
  winHeight,
  frameThick = 0.04,
  sillDepth = 0.08,
}: {
  winWidth: number;
  winHeight: number;
  frameThick?: number;
  sillDepth?: number;
}) {
  return (
    <group>
      {/* Recessed window glass */}
      <RecessedWindow width={winWidth} height={winHeight} />

      {/* Top frame */}
      <mesh position={[0, winHeight / 2 + frameThick / 2, sillDepth / 2]}>
        <boxGeometry
          args={[winWidth + frameThick * 2, frameThick, sillDepth]}
        />
        <meshStandardMaterial color={COLOR.frame} roughness={0.7} />
      </mesh>

      {/* Bottom frame / sill */}
      <mesh position={[0, -(winHeight / 2 + frameThick / 2), sillDepth / 2]}>
        <boxGeometry
          args={[winWidth + frameThick * 2, frameThick, sillDepth]}
        />
        <meshStandardMaterial color={COLOR.sill} roughness={0.6} />
      </mesh>

      {/* Left frame */}
      <mesh position={[-(winWidth / 2 + frameThick / 2), 0, sillDepth / 2]}>
        <boxGeometry args={[frameThick, winHeight, sillDepth]} />
        <meshStandardMaterial color={COLOR.frame} roughness={0.7} />
      </mesh>

      {/* Right frame */}
      <mesh position={[winWidth / 2 + frameThick / 2, 0, sillDepth / 2]}>
        <boxGeometry args={[frameThick, winHeight, sillDepth]} />
        <meshStandardMaterial color={COLOR.frame} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  DOOR ASSEMBLY — entrance with frame and steps                     */
/* ------------------------------------------------------------------ */
function DoorAssembly({
  doorWidth = 0.7,
  doorHeight = 1.4,
}: {
  doorWidth?: number;
  doorHeight?: number;
}) {
  const frameThick = 0.06;
  const frameDepth = 0.1;

  return (
    <group>
      {/* Door panel */}
      <mesh position={[0, 0, frameDepth / 2 - 0.02]}>
        <boxGeometry args={[doorWidth, doorHeight, 0.04]} />
        <meshStandardMaterial color={COLOR.door} roughness={0.6} />
      </mesh>

      {/* Door frame — top */}
      <mesh position={[0, doorHeight / 2 + frameThick / 2, frameDepth / 2]}>
        <boxGeometry
          args={[doorWidth + frameThick * 2, frameThick, frameDepth]}
        />
        <meshStandardMaterial color={COLOR.doorFrame} roughness={0.7} />
      </mesh>

      {/* Door frame — left */}
      <mesh position={[-(doorWidth / 2 + frameThick / 2), 0, frameDepth / 2]}>
        <boxGeometry args={[frameThick, doorHeight, frameDepth]} />
        <meshStandardMaterial color={COLOR.doorFrame} roughness={0.7} />
      </mesh>

      {/* Door frame — right */}
      <mesh position={[doorWidth / 2 + frameThick / 2, 0, frameDepth / 2]}>
        <boxGeometry args={[frameThick, doorHeight, frameDepth]} />
        <meshStandardMaterial color={COLOR.doorFrame} roughness={0.7} />
      </mesh>

      {/* Small step at bottom */}
      <mesh position={[0, -(doorHeight / 2 + 0.04), 0.06]}>
        <boxGeometry args={[doorWidth + 0.2, 0.08, 0.15]} />
        <meshStandardMaterial color={COLOR.paving} roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOF LIP — thin raised border around the top edge                 */
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
  const thickness = 0.08;
  const height = 0.12;
  const overhang = 0.1;

  const w = width / 2 + overhang;
  const d = depth / 2 + overhang;

  return (
    <group position={[0, y, 0]}>
      {/* Front lip */}
      <mesh position={[0, 0, d - thickness / 2]}>
        <boxGeometry args={[width + overhang * 2, height, thickness]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
      {/* Back lip */}
      <mesh position={[0, 0, -(d - thickness / 2)]}>
        <boxGeometry args={[width + overhang * 2, height, thickness]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
      {/* Left lip */}
      <mesh position={[-(w - thickness / 2), 0, 0]}>
        <boxGeometry args={[thickness, height, depth + overhang * 2]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
      {/* Right lip */}
      <mesh position={[w - thickness / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, depth + overhang * 2]} />
        <meshStandardMaterial color={COLOR.roofLip} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CORNER TRIM — vertical pilasters at building corners              */
/* ------------------------------------------------------------------ */
function CornerTrim({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  const trimSize = 0.1;
  const trimDepth = 0.06;
  const w = width / 2;
  const d = depth / 2;

  const positions: [number, number, number][] = [
    [w - trimSize / 2, 0, d - trimDepth / 2],
    [-(w - trimSize / 2), 0, d - trimDepth / 2],
    [w - trimSize / 2, 0, -(d - trimDepth / 2)],
    [-(w - trimSize / 2), 0, -(d - trimDepth / 2)],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[trimSize, height, trimDepth]} />
          <meshStandardMaterial color={COLOR.trim} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  BASE TRIM — foundation band at bottom of building                 */
/* ------------------------------------------------------------------ */
function BaseTrim({
  width,
  depth,
  height = 0.15,
}: {
  width: number;
  depth: number;
  height?: number;
}) {
  const overhang = 0.05;
  return (
    <mesh position={[0, -(height / 2), 0]}>
      <boxGeometry
        args={[width + overhang * 2, height, depth + overhang * 2]}
      />
      <meshStandardMaterial color={COLOR.base} roughness={0.8} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  FOUNDATION BOUNDARY — red perimeter line around the plot          */
/* ------------------------------------------------------------------ */

function Foundation({
  plotWidth,
  plotDepth,
  y = -2.5,
  height = 0.15,
  color = "#a8a5a5",
  inset = 1.2,
  bottomExtend = 0,
  topExtend = 0,
  cornerRadius = 0.35,
  midWidth, // NEW: width at the middle (Z=0). If omitted, defaults to average of top/bottom
}: {
  plotWidth: number;
  plotDepth: number;
  y?: number;
  height?: number;
  color?: string;
  inset?: number;
  bottomExtend?: number;
  topExtend?: number;
  cornerRadius?: number;
  midWidth?: number; // NEW
}) {
  const geometry = useMemo(() => {
    const halfD = plotDepth / 1.5;

    const bottomWidth = plotWidth + bottomExtend * 2;
    const topWidth = plotWidth - inset * 2 + topExtend * 2;
    // NEW: middle width — defaults to halfway between bottom and top
    const mWidth = midWidth ?? (bottomWidth + topWidth) / 2;

    // 6 points instead of 4
    const bLeft = new THREE.Vector2(-bottomWidth / 2, halfD);
    const bRight = new THREE.Vector2(bottomWidth / 2, halfD);
    const mRight = new THREE.Vector2(mWidth / 2, 0); // NEW
    const tRight = new THREE.Vector2(topWidth / 2, -halfD);
    const tLeft = new THREE.Vector2(-topWidth / 2, -halfD);
    const mLeft = new THREE.Vector2(-mWidth / 2, 0); // NEW

    const points = [bLeft, bRight, mRight, tRight, tLeft, mLeft];

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
  }, [
    plotWidth,
    plotDepth,
    inset,
    bottomExtend,
    topExtend,
    cornerRadius,
    height,
    midWidth, // add to deps
  ]);

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
/* ------------------------------------------------------------------ */
/*  HVAC UNIT — small rooftop mechanical detail                       */
/* ------------------------------------------------------------------ */
function HvacUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main box */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color={COLOR.hvac} roughness={0.8} />
      </mesh>
      {/* Vent pipe */}
      <mesh position={[0.15, 0.35, 0.15]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color={COLOR.hvac} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  ENTRANCE PAD — small paved area at front door                     */
/* ------------------------------------------------------------------ */
function EntrancePad({
  position,
  size = 1.2,
}: {
  position: [number, number, number];
  size?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={COLOR.paving} roughness={0.95} />
    </mesh>
  );
}


/* ------------------------------------------------------------------ */
/*  MAIN BLOCK — tall section with FULL window detailing              */
/* ------------------------------------------------------------------ */
function MainBlock({ height = 5 }: { height?: number }) {
  const width = 2.8;
  const depth = 2.8;
  const winYPositions = [-0.75, -0.25, 0.25, 0.75];

  return (
    <group>
      {/* Wall */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={COLOR.wall}
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Corner trims */}
      <CornerTrim width={width} height={height} depth={depth} />

      {/* Base trim */}
      <BaseTrim width={width} depth={depth} />

      {/* Front face windows (4 vertical) — with frames */}
      {winYPositions.map((y, i) => (
        <group key={`f-${i}`} position={[0, y, depth / 2 - 0.02]}>
          <WindowAssembly winWidth={1.4} winHeight={0.35} />
        </group>
      ))}

      {/* Right face windows (4 vertical) — with frames */}
      {winYPositions.map((y, i) => (
        <group
          key={`r-${i}`}
          position={[width / 2 - 0.02, y, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <WindowAssembly winWidth={1.4} winHeight={0.35} />
        </group>
      ))}

      {/* Back face windows (4 vertical) */}
      {winYPositions.map((y, i) => (
        <group
          key={`b-${i}`}
          position={[0, y, -(depth / 2 - 0.02)]}
          rotation={[0, Math.PI, 0]}
        >
          <WindowAssembly winWidth={1.4} winHeight={0.35} />
        </group>
      ))}

      {/* Left face windows (4 vertical) */}
      {winYPositions.map((y, i) => (
        <group
          key={`l-${i}`}
          position={[-(width / 2 - 0.02), y, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <WindowAssembly winWidth={1.4} winHeight={0.35} />
        </group>
      ))}

      {/* Entrance door on front face */}
      <group position={[0, -height / 2 + 0.8, depth / 2 - 0.02]}>
        <DoorAssembly doorWidth={0.7} doorHeight={1.4} />
      </group>

      {/* Entrance paving pad */}
      <EntrancePad
        position={[0, -height / 2 - 0.07, depth / 2 + 0.6]}
        size={1.4}
      />

      {/* Roof lip */}
      <RoofLip width={width} depth={depth} y={height / 2 + 0.06} />

      {/* HVAC unit on roof */}
      <HvacUnit position={[0.5, height / 2 + 0.4, 0.5]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  WING — shorter attached block with FULL window detailing            */
/* ------------------------------------------------------------------ */
function Wing({ height = 2.5 }: { height?: number }) {
  const width = 2.0;
  const depth = 2.0;
  const winYPositions = [-0.5, 0, 0.5];

  return (
    <group>
      {/* Wall */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={COLOR.wall}
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Corner trims */}
      <CornerTrim width={width} height={height} depth={depth} />

      {/* Base trim */}
      <BaseTrim width={width} depth={depth} />

      {/* Front face windows (3 small) — with frames */}
      {winYPositions.map((y, i) => (
        <group key={`wf-${i}`} position={[0, y, depth / 2 - 0.02]}>
          <WindowAssembly winWidth={0.9} winHeight={0.28} />
        </group>
      ))}

      {/* Right face window (1 small) — with frames */}
      <group position={[width / 2 - 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <WindowAssembly winWidth={0.9} winHeight={0.28} />
      </group>

      {/* Back face windows (3 small) */}
      {winYPositions.map((y, i) => (
        <group
          key={`wb-${i}`}
          position={[0, y, -(depth / 2 - 0.02)]}
          rotation={[0, Math.PI, 0]}
        >
          <WindowAssembly winWidth={0.9} winHeight={0.28} />
        </group>
      ))}

      {/* Left face windows (3 small) */}
      {winYPositions.map((y, i) => (
        <group
          key={`wl-${i}`}
          position={[-(width / 2 - 0.02), y, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <WindowAssembly winWidth={0.9} winHeight={0.28} />
        </group>
      ))}

      {/* Small side door on front face */}
      <group position={[0, -height / 2 + 0.6, depth / 2 - 0.02]}>
        <DoorAssembly doorWidth={0.5} doorHeight={1.0} />
      </group>

      {/* Roof lip */}
      <RoofLip width={width} depth={depth} y={height / 2 + 0.06} />

      {/* Small HVAC on wing roof */}
      <HvacUnit position={[-0.3, height / 2 + 0.35, -0.3]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  BUILDING B — L-shape assembly with FULL DETAILING + BOUNDARY    */
/* ------------------------------------------------------------------ */
export function BuildingB({ position = [0, 0, 0] }: BuildingBProps) {
  // Plot size for the foundation boundary (covers both main block + wing)
  const plotWidth = 15;
  const plotDepth = 6;

  return (
    <group position={position} scale={[2, 2, 2]}>
      {/* === FOUNDATION BOUNDARY — red perimeter around the plot === */}
      {/* <Foundation
        plotWidth={plotWidth}
        plotDepth={plotDepth}
        y={-2.5}
        height={0.15}
        inset={5}
        midWidth={15} // bulges wider than the bottom in the middle
        cornerRadius={1}
      /> */}

      {/* Main central block */}
      <MainBlock height={5} />

  


      {/* Right wing — flush with front */}
      <group position={[2.4, -1.25, 0.4]}>
        <Wing height={2.5} />
      </group>

      {/* Left wing — mirrored, taller, set slightly back: multiple connected
          volumes give the spread-out "operations center" silhouette */}
      <group position={[-2.6, -0.75, -0.3]}>
        <Wing height={3.5} />
      </group>

      {/* Low rear annex — broad horizontal volume widening the footprint */}
      <group position={[-0.2, -1.75, -2.2]}>
        <Wing height={1.5} />
      </group>
    </group>
  );
}
