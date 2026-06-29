"use client";

import { RoundedBox, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Interpolate two hex colors by t ∈ [0,1]
function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = [1, 3, 5].map((o) => parseInt(a.slice(o, o + 2), 16));
  const [br, bg, bb] = [1, 3, 5].map((o) => parseInt(b.slice(o, o + 2), 16));
  return (
    "#" +
    [
      Math.round(ar + (br - ar) * t),
      Math.round(ag + (bg - ag) * t),
      Math.round(ab + (bb - ab) * t),
    ]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

interface BuildingAProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  floors?: number;
  badge?: string;
  badgeColor?: string;
  lightsOn?: boolean; // Toggle all lights
}

export function BuildingA({
  position = [0, 0, 0],
  width = 3.2,
  height = 14,
  depth = 3.2,
  floors = 7,
  badge = "TS",
  badgeColor = "#7C3AED",
  lightsOn = false,
}: BuildingAProps) {
  const floorHeight = height / floors;
  const bandH = 0.22;
  const bandOut = 0.1;
  const podiumH = 1.6;
  const podiumW = width + 1.8;
  const podiumD = depth + 1.8;

  const mullionsX = [-width * 0.37, 0, width * 0.37] as const;
  const winCX = width * 0.19;
  const winW = width * 0.33;
  const mullionsZ = [-depth * 0.37, 0, depth * 0.37] as const;
  const winCZ = depth * 0.19;
  const winWZ = depth * 0.33;

  // Refs for flickering lights
  const windowLightsRef = useRef<THREE.Group>(null);
  const flickerTimer = useRef(0);

  // Subtle window flicker effect
  useFrame((_, delta) => {
    if (!lightsOn || !windowLightsRef.current) return;
    flickerTimer.current += delta;

    if (flickerTimer.current > 0.1) {
      flickerTimer.current = 0;
      windowLightsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial;
          // Random slight intensity variation
          const baseEmissive = i % 3 === 0 ? 0.6 : 0.4;
          mat.emissiveIntensity = baseEmissive + Math.random() * 0.15;
        }
      });
    }
  });

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
    midWidth,
    rotationZ = 0,
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
    midWidth?: number;
    rotationZ?: number;
  }) {
    const geometry = useMemo(() => {
      const halfD = plotDepth / 1.5;

      const bottomWidth = plotWidth + bottomExtend * 2;
      const topWidth = plotWidth - inset * 2 + topExtend * 2;
      const mWidth = midWidth ?? (bottomWidth + topWidth) / 2;

      // Symmetric ordering: bottom-right -> mid-right -> top-right -> top-left -> mid-left -> bottom-left
      const bRight = new THREE.Vector2(bottomWidth / 2, halfD);
      const mRight = new THREE.Vector2(mWidth / 2, 0);
      const tRight = new THREE.Vector2(topWidth / 2, -halfD);
      const tLeft = new THREE.Vector2(-topWidth / 2, -halfD);
      const mLeft = new THREE.Vector2(-mWidth / 2, 0);
      const bLeft = new THREE.Vector2(-bottomWidth / 2, halfD);

      const points = [bRight, mRight, tRight, tLeft, mLeft, bLeft];

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
      midWidth,
    ]);

    return (
      <mesh
        geometry={geometry}
        rotation={[Math.PI / 2, 0, rotationZ]}
        position={[0, y, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
    );
  }

  // Window glow colors
  const windowGlowColor = "#F3E8FF"; // Warm white-purple
  const windowGlowColorSide = "#E9D5FF"; // Slightly cooler

  return (
    <group position={position}>
      {/* <Foundation
        plotWidth={32}
        plotDepth={15}
        y={-0.1}
        height={1}
        inset={12}
        midWidth={31} // bulges wider than the bottom in the middle
        cornerRadius={1}
        rotationZ={3.15}
      /> */}

      {/* ================================================================ */}
      {/* AMBIENT LIGHT — soft purple glow around building                  */}
      {/* ================================================================ */}
      {lightsOn && (
        <>
          <ambientLight intensity={0.3} color="#C4B5FD" />
          <pointLight
            position={[0, height / 2, depth / 2 + 2]}
            color="#A78BFA"
            intensity={2}
            distance={20}
            decay={2}
          />
          <pointLight
            position={[0, height * 0.3, -depth / 2 - 2]}
            color="#7C3AED"
            intensity={1}
            distance={15}
            decay={2}
          />
        </>
      )}

      {/* ================================================================ */}
      {/* TOWER BODY — soft lavender, quiet surface                        */}
      {/* ================================================================ */}
      <RoundedBox
        args={[width, height, depth]}
        radius={0.16}
        smoothness={6}
        position={[0, podiumH + height / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#A78BFA"
          roughness={0.42}
          metalness={0}
          emissive={lightsOn ? "#4C1D95" : "#000000"}
          emissiveIntensity={lightsOn ? 0.15 : 0}
        />
      </RoundedBox>

      {/* Face shading */}
      <mesh position={[0, podiumH + height / 2, depth / 2 + 0.004]}>
        <planeGeometry args={[width * 0.9, height * 0.97]} />
        <meshStandardMaterial
          color="#4C1D95"
          transparent
          opacity={0.12}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* ================================================================ */}
      {/* FLOOR BANDS — with emissive glow when lights on                  */}
      {/* ================================================================ */}
      {Array.from({ length: floors - 1 }).map((_, i) => {
        const t = floors > 2 ? i / (floors - 2) : 0;
        const y = podiumH + (i + 1) * floorHeight;
        return (
          <RoundedBox
            key={i}
            args={[width + bandOut * 2, bandH, depth + bandOut * 2]}
            radius={0.05}
            smoothness={4}
            position={[0, y, 0]}
            castShadow
          >
            <meshStandardMaterial
              color={lerpHex("#7C3AED", "#A78BFA", t)}
              roughness={0.46}
              metalness={0}
              emissive={lightsOn ? lerpHex("#5B21B6", "#7C3AED", t) : "#000000"}
              emissiveIntensity={lightsOn ? 0.3 : 0}
            />
          </RoundedBox>
        );
      })}

      {/* ================================================================ */}
      {/* VERTICAL FACADE MULLIONS                                          */}
      {/* ================================================================ */}
      {mullionsX.map((x, i) => (
        <mesh key={i} position={[x, podiumH + height / 2, depth / 2 + 0.018]}>
          <boxGeometry args={[0.058, height * 0.97, 0.024]} />
          <meshStandardMaterial
            color="#8B5CF6"
            roughness={0.5}
            metalness={0}
            emissive={lightsOn ? "#6D28D9" : "#000000"}
            emissiveIntensity={lightsOn ? 0.2 : 0}
          />
        </mesh>
      ))}

      {mullionsZ.map((z, i) => (
        <mesh key={i} position={[width / 2 + 0.018, podiumH + height / 2, z]}>
          <boxGeometry args={[0.024, height * 0.97, 0.058]} />
          <meshStandardMaterial
            color="#7C3AED"
            roughness={0.5}
            metalness={0}
            emissive={lightsOn ? "#5B21B6" : "#000000"}
            emissiveIntensity={lightsOn ? 0.2 : 0}
          />
        </mesh>
      ))}

      {/* ================================================================ */}
      {/* GLOWING WINDOW PANELS — emissive glass effect                    */}
      {/* ================================================================ */}
      <group ref={windowLightsRef}>
        {Array.from({ length: floors }).map((_, i) => {
          const panelY = podiumH + i * floorHeight + floorHeight / 2;
          const panelH = floorHeight - bandH - 0.06;
          const isLit = lightsOn && (i % 2 === 0 || i === floors - 1); // Some windows lit, some dark

          return (
            <group key={i}>
              {/* Front (+z) — two panes per floor */}
              {([-winCX, winCX] as const).map((x, j) => (
                <mesh key={j} position={[x, panelY, depth / 2 + 0.013]}>
                  <planeGeometry args={[winW, panelH]} />
                  <meshStandardMaterial
                    color={isLit ? windowGlowColor : "#4C1D95"}
                    roughness={0.08}
                    metalness={0.36}
                    transparent
                    opacity={isLit ? 0.9 : 0.3}
                    emissive={isLit ? windowGlowColor : "#000000"}
                    emissiveIntensity={isLit ? 0.6 : 0}
                  />
                </mesh>
              ))}
              {/* Right (+x) */}
              {([-winCZ, winCZ] as const).map((z, j) => (
                <mesh
                  key={j}
                  position={[width / 2 + 0.013, panelY, z]}
                  rotation={[0, Math.PI / 2, 0]}
                >
                  <planeGeometry args={[winWZ, panelH]} />
                  <meshStandardMaterial
                    color={isLit ? windowGlowColorSide : "#3B0764"}
                    roughness={0.08}
                    metalness={0.36}
                    transparent
                    opacity={isLit ? 0.85 : 0.25}
                    emissive={isLit ? windowGlowColorSide : "#000000"}
                    emissiveIntensity={isLit ? 0.5 : 0}
                  />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>

      {/* ================================================================ */}
      {/* INTERIOR LIGHTING — point lights inside building                 */}
      {/* ================================================================ */}
      {lightsOn &&
        Array.from({ length: floors }).map((_, i) => {
          if (i % 2 !== 0) return null; // Every other floor
          const y = podiumH + i * floorHeight + floorHeight / 2;
          return (
            <pointLight
              key={i}
              position={[0, y, 0]}
              color="#F3E8FF"
              intensity={0.8}
              distance={8}
              decay={2}
            />
          );
        })}

      {/* ================================================================ */}
      {/* TECH BADGE — with glow                                           */}
      {/* ================================================================ */}
      <group position={[width / 2 + 0.16, podiumH + height * 0.58, 0]}>
        <RoundedBox
          args={[0.32, 2.85, 2.4]}
          radius={0.17}
          smoothness={5}
          castShadow
        >
          <meshStandardMaterial
            color="#2E1065"
            roughness={0.3}
            metalness={0.1}
            emissive={lightsOn ? badgeColor : "#000000"}
            emissiveIntensity={lightsOn ? 0.4 : 0}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.22, 2.6, 2.16]}
          radius={0.14}
          smoothness={4}
          position={[0.07, 0, 0]}
        >
          <meshStandardMaterial
            color={badgeColor}
            roughness={0.2}
            metalness={0.14}
            emissive={lightsOn ? badgeColor : "#000000"}
            emissiveIntensity={lightsOn ? 0.6 : 0}
          />
        </RoundedBox>
        <Text
          position={[0.19, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.9}
          fontWeight={700}
          color={lightsOn ? "#ffffff" : "#C4B5FD"}
          anchorX="center"
          anchorY="middle"
        >
          {badge}
        </Text>
      </group>

      {/* ================================================================ */}
      {/* PODIUM — with entrance lighting                                  */}
      {/* ================================================================ */}
      <RoundedBox
        args={[podiumW, podiumH, podiumD]}
        radius={0.14}
        smoothness={5}
        position={[0, podiumH / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#6D28D9"
          roughness={0.56}
          metalness={0}
          emissive={lightsOn ? "#4C1D95" : "#000000"}
          emissiveIntensity={lightsOn ? 0.1 : 0}
        />
      </RoundedBox>

      <RoundedBox
        args={[podiumW + 0.08, 0.12, podiumD + 0.08]}
        radius={0.05}
        smoothness={4}
        position={[0, podiumH + 0.06, 0]}
      >
        <meshStandardMaterial
          color="#8B5CF6"
          roughness={0.42}
          metalness={0}
          emissive={lightsOn ? "#7C3AED" : "#000000"}
          emissiveIntensity={lightsOn ? 0.3 : 0}
        />
      </RoundedBox>

      {/* ================================================================ */}
      {/* ENTRANCE — with warm glow                                        */}
      {/* ================================================================ */}
      <RoundedBox
        args={[width * 0.82, 0.16, 1.55]}
        radius={0.06}
        smoothness={4}
        position={[0, podiumH * 0.87, podiumD / 2 + 0.78]}
        castShadow
      >
        <meshStandardMaterial
          color="#7C3AED"
          roughness={0.42}
          metalness={0}
          emissive={lightsOn ? "#A78BFA" : "#000000"}
          emissiveIntensity={lightsOn ? 0.3 : 0}
        />
      </RoundedBox>

      <mesh position={[0, podiumH * 0.87 - 0.09, podiumD / 2 + 0.78]}>
        <boxGeometry args={[width * 0.76, 0.02, 1.42]} />
        <meshStandardMaterial color="#3B0764" roughness={0.75} metalness={0} />
      </mesh>

      {/* Entrance light — warm glow at door */}
      {lightsOn && (
        <pointLight
          position={[0, podiumH * 0.6, podiumD / 2 + 1]}
          color="#F3E8FF"
          intensity={3}
          distance={6}
          decay={2}
        />
      )}

      {([-width * 0.3, width * 0.3] as const).map((x, i) => (
        <mesh
          key={i}
          position={[x, podiumH * 0.43, podiumD / 2 + 1.1]}
          castShadow
        >
          <cylinderGeometry args={[0.075, 0.075, podiumH * 0.87, 8]} />
          <meshStandardMaterial
            color="#5B21B6"
            roughness={0.52}
            metalness={0}
          />
        </mesh>
      ))}

      <mesh position={[0, podiumH * 0.48, podiumD / 2 + 0.09]}>
        <boxGeometry args={[width * 0.58, podiumH * 0.82, 0.06]} />
        <meshStandardMaterial
          color="#4C1D95"
          roughness={0.58}
          metalness={0}
          emissive={lightsOn ? "#5B21B6" : "#000000"}
          emissiveIntensity={lightsOn ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, podiumH * 0.48, podiumD / 2 + 0.12]}>
        <boxGeometry args={[width * 0.54, podiumH * 0.78, 0.06]} />
        <meshStandardMaterial
          color={lightsOn ? "#F3E8FF" : "#C4B5FD"}
          roughness={0.05}
          metalness={0.34}
          transparent
          opacity={lightsOn ? 0.8 : 0.6}
          emissive={lightsOn ? "#F3E8FF" : "#000000"}
          emissiveIntensity={lightsOn ? 0.5 : 0}
        />
      </mesh>

      {/* Steps */}
      {([0, 1, 2] as const).map((i) => (
        <RoundedBox
          key={i}
          args={[width * 0.6 - i * 0.14, 0.1, 0.32]}
          radius={0.03}
          smoothness={3}
          position={[0, i * 0.1 + 0.05, podiumD / 2 + 0.62 + i * 0.32]}
          receiveShadow
        >
          <meshStandardMaterial
            color="#6D28D9"
            roughness={0.58}
            metalness={0}
            emissive={lightsOn ? "#7C3AED" : "#000000"}
            emissiveIntensity={lightsOn ? 0.15 : 0}
          />
        </RoundedBox>
      ))}

      {/* Corner columns */}
      {(
        [
          [-podiumW / 2 + 0.22, podiumD / 2 - 0.22],
          [podiumW / 2 - 0.22, podiumD / 2 - 0.22],
          [-podiumW / 2 + 0.22, -podiumD / 2 + 0.22],
          [podiumW / 2 - 0.22, -podiumD / 2 + 0.22],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <RoundedBox
          key={i}
          args={[0.34, podiumH + 0.1, 0.34]}
          radius={0.07}
          smoothness={4}
          position={[x, podiumH / 2, z]}
          castShadow
        >
          <meshStandardMaterial
            color="#4C1D95"
            roughness={0.54}
            metalness={0}
            emissive={lightsOn ? "#5B21B6" : "#000000"}
            emissiveIntensity={lightsOn ? 0.15 : 0}
          />
        </RoundedBox>
      ))}

      {/* ================================================================ */}
      {/* ROOF — with glow                                                 */}
      {/* ================================================================ */}
      <group position={[0, podiumH + height, 0]}>
        <RoundedBox
          args={[width + 0.38, 0.3, depth + 0.38]}
          radius={0.08}
          smoothness={4}
          position={[0, 0.15, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#C4B5FD"
            roughness={0.4}
            metalness={0}
            emissive={lightsOn ? "#A78BFA" : "#000000"}
            emissiveIntensity={lightsOn ? 0.2 : 0}
          />
        </RoundedBox>

        <RoundedBox
          args={[width - 0.22, 0.18, depth - 0.22]}
          radius={0.06}
          smoothness={4}
          position={[0, 0.09, 0]}
        >
          <meshStandardMaterial
            color="#E9D5FF"
            roughness={0.24}
            metalness={0.04}
            emissive={lightsOn ? "#F3E8FF" : "#000000"}
            emissiveIntensity={lightsOn ? 0.3 : 0}
          />
        </RoundedBox>

        <mesh position={[0, 0.085, 0]}>
          <boxGeometry args={[width - 0.02, 0.018, depth - 0.02]} />
          <meshStandardMaterial
            color="#7C3AED"
            transparent
            opacity={0.28}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        <RoundedBox
          args={[width * 0.44, 0.16, depth * 0.44]}
          radius={0.06}
          smoothness={4}
          position={[0, 0.35, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#F3E8FF"
            roughness={0.2}
            metalness={0.04}
            emissive={lightsOn ? "#ffffff" : "#000000"}
            emissiveIntensity={lightsOn ? 0.4 : 0}
          />
        </RoundedBox>

        {(
          [
            [-width * 0.35, depth * 0.35],
            [width * 0.35, depth * 0.35],
            [-width * 0.35, -depth * 0.35],
            [width * 0.35, -depth * 0.35],
          ] as [number, number][]
        ).map(([x, z], i) => (
          <RoundedBox
            key={i}
            args={[0.17, 0.35, 0.17]}
            radius={0.04}
            smoothness={4}
            position={[x, 0.47, z]}
            castShadow
          >
            <meshStandardMaterial
              color="#DDD6FE"
              roughness={0.34}
              metalness={0}
              emissive={lightsOn ? "#E9D5FF" : "#000000"}
              emissiveIntensity={lightsOn ? 0.2 : 0}
            />
          </RoundedBox>
        ))}

        {/* Roof beacon light */}
        {lightsOn && (
          <pointLight
            position={[0, 0.8, 0]}
            color="#F3E8FF"
            intensity={2}
            distance={10}
            decay={2}
          />
        )}
      </group>

      {/* ================================================================ */}
      {/* ASYMMETRIC ANNEX — shorter offset mass → stepped studio campus   */}
      {/* ================================================================ */}
      {(() => {
        const annexW = width * 0.72;
        const annexD = depth * 0.78;
        const annexH = (podiumH + height) * 0.52;
        const annexX = -(width / 2 + annexW / 2 + 0.05);
        const annexZ = depth * 0.12;
        return (
          <group position={[annexX, 0, annexZ]}>
            {/* Annex body */}
            <RoundedBox
              args={[annexW, annexH, annexD]}
              radius={0.14}
              smoothness={5}
              position={[0, annexH / 2, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#8B5CF6" roughness={0.45} metalness={0} />
            </RoundedBox>

            {/* Floor bands for scale rhythm */}
            {Array.from({ length: 3 }).map((_, i) => (
              <RoundedBox
                key={i}
                args={[annexW + 0.12, 0.16, annexD + 0.12]}
                radius={0.05}
                smoothness={4}
                position={[0, (annexH / 4) * (i + 1), 0]}
                castShadow
              >
                <meshStandardMaterial color="#7C3AED" roughness={0.5} metalness={0} />
              </RoundedBox>
            ))}

            {/* Annex roof cap */}
            <RoundedBox
              args={[annexW + 0.22, 0.26, annexD + 0.22]}
              radius={0.07}
              smoothness={4}
              position={[0, annexH + 0.13, 0]}
              castShadow
            >
              <meshStandardMaterial color="#C4B5FD" roughness={0.4} metalness={0} />
            </RoundedBox>
          </group>
        );
      })()}

      {/* Contact shadow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[podiumW + 0.8, podiumD + 0.8]} />
        <meshStandardMaterial
          color="#2E1065"
          transparent
          opacity={0.16}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
