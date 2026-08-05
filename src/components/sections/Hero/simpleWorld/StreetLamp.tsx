"use client";

interface StreetLampProps {
  position?: [number, number, number];
  /**
   * Whether the lamp contributes a real point light. There are 16 of these and
   * every one of them is evaluated in every meshStandardMaterial fragment, so
   * street level turns them off — the emissive bulb still reads as "lit".
   */
  lit?: boolean;
}

const COLOR = {
  pole: "#A0A0B0",
  lamp: "#FFF8E8",
};

export function StreetLamp({
  position = [0, 0, 0],
  lit = true,
}: StreetLampProps) {
  return (
    <group position={position} scale={[1.5, 1.5, 1.5]}>
      {/* Pole — thin and tall */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 8]} />
        <meshStandardMaterial color={COLOR.pole} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Curved arm */}
      <mesh position={[0.35, 4.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
        <meshStandardMaterial color={COLOR.pole} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Lamp housing — rounded capsule shape */}
      <mesh position={[0.7, 4.15, 0]} castShadow>
        <capsuleGeometry args={[0.14, 0.22, 8, 16]} />
        <meshStandardMaterial color={COLOR.pole} roughness={0.6} />
      </mesh>

      {/* Glowing bulb inside */}
      <mesh position={[0.7, 4.05, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color={COLOR.lamp}
          emissive={COLOR.lamp}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Subtle point light — not overpowering */}
      {lit && (
        <pointLight
          position={[0.7, 3.8, 0]}
          intensity={1.2}
          distance={5}
          color={COLOR.lamp}
        />
      )}
    </group>
  );
}