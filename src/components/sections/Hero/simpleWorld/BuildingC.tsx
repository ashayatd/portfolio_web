"use client";

interface BuildingCProps {
  position?: [number, number, number];
}

export function BuildingC({
  position = [0, 0, 0],
}: BuildingCProps) {
  const floors = 8;

  return (
    <group position={position}>
      {/* ===================== */}
      {/* FOUNDATION */}
      {/* ===================== */}

      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[16, 0.2, 16]} />
        <meshLambertMaterial color="#9a9a9a" />
      </mesh>

      {/* Foundation Boundary Light */}

      {/* Front */}
      <mesh position={[0, 0.22, 8]}>
        <boxGeometry args={[16, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Back */}
      <mesh position={[0, 0.22, -8]}>
        <boxGeometry args={[16, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Left */}
      <mesh position={[-8, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.04, 16]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Right */}
      <mesh position={[8, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.04, 16]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* PODIUM */}
      {/* ===================== */}

      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 6, 12]} />
        <meshLambertMaterial color="#c2c2c2" />
      </mesh>

      {/* Podium Base Light */}

      <mesh position={[0, 0.15, 6.05]}>
        <boxGeometry args={[12, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, 0.15, -6.05]}>
        <boxGeometry args={[12, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-6.05, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.08, 12]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[6.05, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.08, 12]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* TOWER FLOORS */}
      {/* ===================== */}

      {Array.from({ length: floors }).map((_, i) => {
        const floorY = 7 + i * 2.5;
        const accentY = floorY + 0.18;

        return (
          <group key={i}>
            {/* Floor Slab */}
            <mesh position={[0, floorY, 0]} castShadow>
              <boxGeometry args={[10, 0.3, 10]} />
              <meshLambertMaterial color="#d8d8d8" />
            </mesh>

            {/* Floor Accent Lights */}

            {/* Front */}
            <mesh position={[0, accentY, 5.05]}>
              <boxGeometry args={[10.1, 0.05, 0.08]} />
              <meshStandardMaterial
                color="#ffd36b"
                emissive="#ffd36b"
                emissiveIntensity={4}
              />
            </mesh>

            {/* Back */}
            <mesh position={[0, accentY, -5.05]}>
              <boxGeometry args={[10.1, 0.05, 0.08]} />
              <meshStandardMaterial
                color="#ffd36b"
                emissive="#ffd36b"
                emissiveIntensity={4}
              />
            </mesh>

            {/* Left */}
            <mesh position={[-5.05, accentY, 0]}>
              <boxGeometry args={[0.08, 0.05, 10.1]} />
              <meshStandardMaterial
                color="#ffd36b"
                emissive="#ffd36b"
                emissiveIntensity={4}
              />
            </mesh>

            {/* Right */}
            <mesh position={[5.05, accentY, 0]}>
              <boxGeometry args={[0.08, 0.05, 10.1]} />
              <meshStandardMaterial
                color="#ffd36b"
                emissive="#ffd36b"
                emissiveIntensity={4}
              />
            </mesh>

            {/* Glass Section */}
            <mesh position={[0, 6 + i * 2.41, 0]}>
              <boxGeometry args={[9, 2, 9]} />
              <meshLambertMaterial color="#5c6873" />
            </mesh>
          </group>
        );
      })}

      {/* ===================== */}
      {/* ROOFTOP CROWN */}
      {/* ===================== */}

      <mesh position={[0, 26, 0]} castShadow>
        <boxGeometry args={[11, 0.4, 11]} />
        <meshLambertMaterial color="#e0e0e0" />
      </mesh>

      {/* Crown Accent Light */}

      <mesh position={[0, 26.25, 5.55]}>
        <boxGeometry args={[11.1, 0.05, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, 26.25, -5.55]}>
        <boxGeometry args={[11.1, 0.05, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-5.55, 26.25, 0]}>
        <boxGeometry args={[0.08, 0.05, 11.1]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[5.55, 26.25, 0]}>
        <boxGeometry args={[0.08, 0.05, 11.1]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Rooftop AC */}
      <mesh position={[2, 26.7, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshLambertMaterial color="#7f7f7f" />
      </mesh>

      {/* ===================== */}
      {/* GLASS STRIPS */}
      {/* ===================== */}

      <mesh position={[0, 16, 4.55]}>
        <planeGeometry args={[8.5, 18]} />
        <meshBasicMaterial color="#4a4a4a" />
      </mesh>

      <mesh
        position={[0, 16, -4.55]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[8.5, 18]} />
        <meshBasicMaterial color="#4a4a4a" />
      </mesh>

      <mesh
        position={[-4.55, 16, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[8.5, 18]} />
        <meshBasicMaterial color="#4a4a4a" />
      </mesh>

      <mesh
        position={[4.55, 16, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[8.5, 18]} />
        <meshBasicMaterial color="#4a4a4a" />
      </mesh>
    </group>
  );
}