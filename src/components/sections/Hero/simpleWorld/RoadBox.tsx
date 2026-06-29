"use client";

import { RoundedBox } from "@react-three/drei";

/* ========================= */
/* ROAD SEGMENT */
/* ========================= */

interface RoadProps {
  position?: [number, number, number];
  width?: number;
  length?: number;
  rotation?: [number, number, number];
}

function RoadSegment({
  position = [0, 0, 0],
  width = 1.5,
  length = 39,
  rotation = [0, 0, 0],
}: RoadProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main asphalt road */}
      <RoundedBox
        args={[width, 0.15, length]}
        radius={0.05}
        smoothness={3}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#2A2A2A" roughness={0.9} />
      </RoundedBox>

      {/* Center dashed line — continuous across intersections */}
      {Array.from({ length: Math.floor(length / 2.2) }).map((_, i) => {
        const zPos = -length / 2 + 1 + i * 2.2;
        return (
          <mesh key={i} position={[0, 0.09, zPos]} receiveShadow>
            <boxGeometry args={[0.25, 0.03, 1.1]} />
            <meshStandardMaterial
              color="#FFFF00"
              roughness={0.4}
              emissive="#FFFF00"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}

      {/* Side curbs */}
      <RoundedBox
        args={[0.15, 0.2, length]}
        radius={0.03}
        smoothness={3}
        position={[-width / 2 - 0.08, 0.04, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#4A4A4A" roughness={0.85} />
      </RoundedBox>

      <RoundedBox
        args={[0.15, 0.2, length]}
        radius={0.03}
        smoothness={3}
        position={[width / 2 + 0.08, 0.04, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#4A4A4A" roughness={0.85} />
      </RoundedBox>
    </group>
  );
}

/* ========================= */
/* CROSSWALK */
/* ========================= */

function Crosswalk({
  position,
  rotation = 0,
  size = 2,
}: {
  position: [number, number, number];
  rotation?: number;
  size?: number;
}) {
  const stripCount = 4;
  const stripWidth = 0.25;
  const spacing = size / stripCount;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: stripCount }).map((_, i) => (
        <mesh
          key={i}
          position={[-size / 2 + i * spacing + spacing / 2, 0.03, 0]}
          receiveShadow
        >
          <boxGeometry args={[stripWidth, 0.02, size]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ========================= */
/* SIDEWALK */
/* ========================= */

function Sidewalk({
  position,
  width = 1,
  length = 39,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  width?: number;
  length?: number;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[width, 0.18, length]}
        radius={0.06}
        smoothness={4}
        position={[0, 0.09, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#C8C4BF" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

/* ========================= */
/* MAIN ROAD NETWORK — # GRID */
/* ========================= */

export function RoadNetwork() {
  const roadWidth = 1.5;
  const roadLength = 39; // FULL length — roads go all the way!
  const roadSpacing = 17;
  const sidewalkWidth = 1;
  const halfRoad = roadWidth / 2; // 0.75
  const halfSidewalk = sidewalkWidth / 2; // 0.5
  const gap = 0.2;

  // Distance from road center to sidewalk center
  const offset = halfRoad + gap + halfSidewalk; // 1.45
  const halfSpacing = roadSpacing / 2; // 8.5

  return (
    <group>
      {/* ===================================== */}
      {/* FOUR FULL ROADS — they pass through!    */}
      {/* ===================================== */}

      {/* Left Vertical Road (x = -8.5) — FULL LENGTH */}
      <RoadSegment
        position={[-halfSpacing, 0, 0]}
        width={roadWidth}
        length={roadLength}
      />

      {/* Right Vertical Road (x = 8.5) — FULL LENGTH */}
      <RoadSegment
        position={[halfSpacing, 0, 0]}
        width={roadWidth}
        length={roadLength}
      />

      {/* Bottom Horizontal Road (z = -8.5) — FULL LENGTH */}
      <RoadSegment
        position={[0, 0, -halfSpacing]}
        width={roadWidth}
        length={roadLength}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Top Horizontal Road (z = 8.5) — FULL LENGTH */}
      <RoadSegment
        position={[0, 0, halfSpacing]}
        width={roadWidth}
        length={roadLength}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* ===================================== */}
      {/* SIDEWALKS — FULL LENGTH along roads     */}
      {/* ===================================== */}

      {/* Left vertical road sidewalks */}
      <Sidewalk
        position={[-halfSpacing + offset, 0, 0]}
        width={sidewalkWidth}
        length={roadLength}
      />
      <Sidewalk
        position={[-halfSpacing - offset, 0, 0]}
        width={sidewalkWidth}
        length={roadLength}
      />

      {/* Right vertical road sidewalks */}
      <Sidewalk
        position={[halfSpacing - offset, 0, 0]}
        width={sidewalkWidth}
        length={roadLength}
      />
      <Sidewalk
        position={[halfSpacing + offset, 0, 0]}
        width={sidewalkWidth}
        length={roadLength}
      />

      {/* Bottom horizontal road sidewalks */}
      <Sidewalk
        position={[0, 0, -halfSpacing + offset]}
        width={sidewalkWidth}
        length={roadLength}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Sidewalk
        position={[0, 0, -halfSpacing - offset]}
        width={sidewalkWidth}
        length={roadLength}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Top horizontal road sidewalks */}
      <Sidewalk
        position={[0, 0, halfSpacing - offset]}
        width={sidewalkWidth}
        length={roadLength}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Sidewalk
        position={[0, 0, halfSpacing + offset]}
        width={sidewalkWidth}
        length={roadLength}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* ===================================== */}
      {/* INTERSECTION COVER BOXES               */}
      {/* ===================================== */}
      {(
        [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ] as [number, number][]
      ).map(([sx, sz], i) => (
        <mesh
          key={`intersection-${i}`}
          position={[sx * halfSpacing, 0.012, sz * halfSpacing]}
          receiveShadow
        >
          <boxGeometry args={[roadWidth + 0.2, 0.01, roadWidth + 0.2]} />
          <meshStandardMaterial color="#2A2A2A" roughness={0.9} />
        </mesh>
      ))}

      {/* ===================================== */}
      {/* SIDEWALK CORNERS — 4 outer pieces       */}
      {/* ===================================== */}
      {(
        [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ] as [number, number][]
      ).map(([sx, sz], i) => (
        <RoundedBox
          key={`corner-${i}`}
          args={[sidewalkWidth, 0.18, sidewalkWidth]}
          radius={0.06}
          smoothness={4}
          position={[
            sx * (halfSpacing + (sx > 0 ? offset : -offset)),
            0.09,
            sz * (halfSpacing + (sz > 0 ? offset : -offset)),
          ]}
          receiveShadow
        >
          <meshStandardMaterial color="#C8C4BF" roughness={0.9} />
        </RoundedBox>
      ))}

      {/* ===================================== */}
      {/* ZEBRA CROSSINGS — at 4 main intersections */}
      {/* ===================================== */}

      {/* Bottom-left intersection (-8.5, -8.5) */}
      <Crosswalk
        position={[-halfSpacing, 0, -halfSpacing - 1.5]}
        rotation={Math.PI / 2}
        size={2}
      />
      <Crosswalk position={[-halfSpacing - 1.5, 0.1, -halfSpacing]} size={2} />

      {/* Bottom-right intersection (8.5, -8.5) */}
      <Crosswalk
        position={[halfSpacing, 0, -halfSpacing - 1.5]}
        rotation={Math.PI / 2}
        size={2}
      />
      <Crosswalk position={[halfSpacing + 1.5, 0.1, -halfSpacing]} size={2} />

      {/* Top-left intersection (-8.5, 8.5) */}
      <Crosswalk
        position={[-halfSpacing, 0, halfSpacing + 1.5]}
        rotation={Math.PI / 2}
        size={2}
      />
      <Crosswalk position={[-halfSpacing - 1.5, 0.1, halfSpacing]} size={2} />

      {/* Top-right intersection (8.5, 8.5) */}
      <Crosswalk
        position={[halfSpacing, 0, halfSpacing + 1.5]}
        rotation={Math.PI / 2}
        size={2}
      />
      <Crosswalk position={[halfSpacing + 1.5, 0.1, halfSpacing]} size={2} />

      {/* ===================================== */}
      {/* CROSSWALKS — at outer edges only        */}
      {/* ===================================== */}

      {/* North side crosswalks */}
      <Crosswalk
        position={[-halfSpacing, 0, -roadLength / 2 + 1]}
        rotation={Math.PI / 2}
        size={2}
      />
      <Crosswalk
        position={[halfSpacing, 0, -roadLength / 2 + 1]}
        rotation={Math.PI / 2}
        size={2}
      />

      {/* South side crosswalks */}
      <Crosswalk
        position={[-halfSpacing, 0, roadLength / 2 - 1]}
        rotation={Math.PI / 2}
        size={2}
      />
      <Crosswalk
        position={[halfSpacing, 0, roadLength / 2 - 1]}
        rotation={Math.PI / 2}
        size={2}
      />

      {/* West side crosswalks */}
      <Crosswalk position={[-roadLength / 2 + 1, 0, -halfSpacing]} size={2} />
      <Crosswalk position={[-roadLength / 2 + 1, 0, halfSpacing]} size={2} />

      {/* East side crosswalks */}
      <Crosswalk position={[roadLength / 2 - 1, 0, -halfSpacing]} size={2} />
      <Crosswalk position={[roadLength / 2 - 1, 0, halfSpacing]} size={2} />
    </group>
  );
}
