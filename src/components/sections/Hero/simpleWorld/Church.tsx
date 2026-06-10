"use client";

interface ChurchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Church({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ChurchProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* ===================== */}
      {/* FOUNDATION */}
      {/* ===================== */}

      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[20, 0.2, 16]} />
        <meshLambertMaterial color="#9a9a9a" />
      </mesh>

      {/* Foundation Boundary Light */}

      <mesh position={[0, 0.22, 8]}>
        <boxGeometry args={[20, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, 0.22, -8]}>
        <boxGeometry args={[20, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-10, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.04, 16]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[10, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.04, 16]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* MAIN HALL */}
      {/* ===================== */}

      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 8, 14]} />
        <meshLambertMaterial color="#c8c0b0" />
      </mesh>

      {/* Main Hall Base Light */}

      <mesh position={[0, 0.08, 7.05]}>
        <boxGeometry args={[12, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, 0.08, -7.05]}>
        <boxGeometry args={[12, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-6.05, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.08, 14]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[6.05, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.08, 14]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* MAIN ROOF */}
      {/* ===================== */}

      <mesh
        position={[0, 10, 3]}
        rotation={[0, 0.1, 0]}
        castShadow
      >
        <coneGeometry args={[4, 4, 4]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      {/* ===================== */}
      {/* LEFT WING */}
      {/* ===================== */}

      <mesh position={[-8, 3, 0]} castShadow>
        <boxGeometry args={[4, 6, 10]} />
        <meshLambertMaterial color="#c8c0b0" />
      </mesh>

      {/* Left Wing Base Light */}

      <mesh position={[-8, 0.08, 5.05]}>
        <boxGeometry args={[4, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-8, 0.08, -5.05]}>
        <boxGeometry args={[4, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* RIGHT WING */}
      {/* ===================== */}

      <mesh position={[8, 3, 0]} castShadow>
        <boxGeometry args={[4, 6, 10]} />
        <meshLambertMaterial color="#c8c0b0" />
      </mesh>

      {/* Right Wing Base Light */}

      <mesh position={[8, 0.08, 5.05]}>
        <boxGeometry args={[4, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[8, 0.08, -5.05]}>
        <boxGeometry args={[4, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* CENTRAL TOWER */}
      {/* ===================== */}

      <mesh position={[0, 12, -2]} castShadow>
        <boxGeometry args={[4, 16, 4]} />
        <meshLambertMaterial color="#c8c0b0" />
      </mesh>

      {/* Tower Accent Light */}

      <mesh position={[0, 4.1, 0.05]}>
        <boxGeometry args={[4.1, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* TOWER SPIRE */}
      {/* ===================== */}

      <mesh position={[0, 24, -2]} castShadow>
        <coneGeometry args={[2, 14, 4]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      {/* ===================== */}
      {/* WINDOWS */}
      {/* ===================== */}

      {/* Main Front Window */}
      <mesh position={[0, 5.5, 7.05]}>
        <planeGeometry args={[2.5, 4]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Side Windows */}

      <mesh position={[-4, 4.5, 7.05]}>
        <planeGeometry args={[1.5, 3]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={3}
        />
      </mesh>

      <mesh position={[4, 4.5, 7.05]}>
        <planeGeometry args={[1.5, 3]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={3}
        />
      </mesh>

      {/* ===================== */}
      {/* ENTRANCE */}
      {/* ===================== */}

      <mesh position={[0, 1.8, 7.1]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial color="#3a2a1a" />
      </mesh>

      {/* Entrance Light */}

      <pointLight
        position={[0, 4.5, 7]}
        color="#fff4d6"
        intensity={2}
        distance={10}
      />

      {/* ===================== */}
      {/* FRONT STAIRS */}
      {/* ===================== */}

      <mesh position={[0, 0.5, 8.5]}>
        <boxGeometry args={[5, 1, 2]} />
        <meshLambertMaterial color="#a0a0a0" />
      </mesh>
    </group>
  );
}