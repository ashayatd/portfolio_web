"use client";

interface CityBusProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function CityBus({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: CityBusProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Body */}
      <mesh
        position={[0, 1.2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[8, 2.4, 3]} />
        <meshLambertMaterial color="#d9d9d9" />
      </mesh>

      {/* Roof */}
      <mesh
        position={[0, 2.6, 0]}
        castShadow
      >
        <boxGeometry args={[7.5, 0.3, 2.8]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>

      {/* Front Windshield */}
      <mesh position={[4.01, 1.6, 0]}>
        <planeGeometry args={[2, 1.4]} />
        <meshBasicMaterial color="#4a4a4a" />
      </mesh>

      {/* Side Windows */}
      {[-2.5, -1, 0.5, 2].map((x, i) => (
        <mesh
          key={i}
          position={[x, 1.7, 1.51]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#555555" />
        </mesh>
      ))}

      {[-2.5, -1, 0.5, 2].map((x, i) => (
        <mesh
          key={`r-${i}`}
          position={[x, 1.7, -1.51]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#555555" />
        </mesh>
      ))}

      {/* Door */}
      <mesh
        position={[2.8, 1, 1.52]}
      >
        <planeGeometry args={[1, 1.8]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Wheels */}
      {[
        [-2.5, 0.5, 1.4],
        [2.5, 0.5, 1.4],
        [-2.5, 0.5, -1.4],
        [2.5, 0.5, -1.4],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.5, 0.5, 0.4, 12]} />
          <meshLambertMaterial color="#222222" />
        </mesh>
      ))}

      {/* Headlights */}
      <mesh position={[4.05, 0.8, 0.8]}>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color="#fff4d6" emissive="#fff4d6" emissiveIntensity={5} />
      </mesh>
      <mesh position={[4.05, 0.8, -0.8]}>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color="#fff4d6" emissive="#fff4d6" emissiveIntensity={5} />
      </mesh>

      {/* Headlight point lights */}
      <pointLight position={[4.5, 0.8, 0.8]} color="#fff4d6" intensity={1.5} distance={8} />
      <pointLight position={[4.5, 0.8, -0.8]} color="#fff4d6" intensity={1.5} distance={8} />

      {/* Headlight beam */}
      <mesh position={[7, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5, 1.8]} />
        <meshBasicMaterial color="#fff4d6" transparent opacity={0.08} side={2} />
      </mesh>
    </group>
  );
}