"use client";

interface PondProps {
  position?: [number, number, number];
}

export function Pond({
  position = [0, 0, 0],
}: PondProps) {
  return (
    <group
      position={position}
      scale={[0.5, 0.5, 0.5]} // 50% of original size
    >
      {/* Pond Basin */}
      <mesh
        position={[0, -0.15, 0]}
        scale={[1.5, 1, 1]}
        receiveShadow
      >
        <cylinderGeometry args={[4, 4, 0.4, 32]} />
        <meshLambertMaterial color="#bdbdbd" />
      </mesh>

      {/* Water */}
      <mesh
        position={[0, 0.02, 0]}
        scale={[1.5, 1, 1]}
        receiveShadow
      >
        <cylinderGeometry args={[3.75, 3.75, 0.08, 32]} />
        <meshLambertMaterial color="#5fa8ff" />
      </mesh>

      {/* Thin Border */}
      <mesh
        position={[0, 0.05, 0]}
        scale={[1.5, 1, 1]}
        receiveShadow
      >
        <torusGeometry args={[3.9, 0.12, 8, 32]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>
    </group>
  );
}