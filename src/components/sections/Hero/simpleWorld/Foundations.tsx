import { useMemo } from "react";
import * as THREE from "three";

export function Foundation({
  plotWidth,
  plotDepth,
  y = -2.5,
  height = 0.15,
  color = "#eceaea",
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
