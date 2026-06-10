"use client";

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

export function Clouds() {
  return (
    <group>
      <Cloud position={[-50, 35, -30]} scale={2.5} />
      <Cloud position={[-20, 30, 20]} scale={1.8} />
      <Cloud position={[15, 40, -10]} scale={2.2} />
      <Cloud position={[40, 32, 25]} scale={2.8} />
      <Cloud position={[70, 38, -20]} scale={1.6} />
      <Cloud position={[-70, 28, 10]} scale={2.3} />
    </group>
  );
}