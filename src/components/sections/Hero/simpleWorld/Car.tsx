"use client";

interface CarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Car({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: CarProps) {
  return (
    <group position={position} rotation={rotation}>

      {/* ── CHASSIS / LOWER BODY ── */}
      {/* Wide flat slab that forms the floor + door panels */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.84, 2.0]} />
        <meshLambertMaterial color="#d8d8d8" />
      </mesh>

      {/* Front bumper overhang — lower and wider than cabin */}
      <mesh position={[2.1, 0.32, 0]} castShadow>
        <boxGeometry args={[0.3, 0.44, 1.8]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>

      {/* Rear bumper overhang */}
      <mesh position={[-2.1, 0.32, 0]} castShadow>
        <boxGeometry args={[0.3, 0.44, 1.8]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>

      {/* ── HOOD (front sloped section) ── */}
      {/* Slightly raised flat hood between windshield and front bumper */}
      <mesh position={[1.2, 0.9, 0]} castShadow>
        <boxGeometry args={[1.6, 0.18, 1.9]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* Hood slope wedge — rises from bumper to windshield base */}
      <mesh position={[1.55, 0.72, 0]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[0.8, 0.18, 1.88]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* ── TRUNK (rear sloped section) ── */}
      <mesh position={[-1.2, 0.9, 0]} castShadow>
        <boxGeometry args={[1.4, 0.18, 1.9]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* Trunk slope wedge */}
      <mesh position={[-1.55, 0.72, 0]} rotation={[0, 0, 0.22]} castShadow>
        <boxGeometry args={[0.7, 0.18, 1.88]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* ── CABIN (greenhouse / passenger cell) ── */}
      {/* Main cabin box — sits above door line */}
      <mesh position={[0.1, 1.44, 0]} castShadow>
        <boxGeometry args={[2.4, 0.82, 1.82]} />
        <meshLambertMaterial color="#c5c5c5" />
      </mesh>

      {/* Windshield rake — angled slab bridging hood top to cabin front */}
      <mesh position={[1.26, 1.18, 0]} rotation={[0, 0, -0.52]} castShadow>
        <boxGeometry args={[0.72, 0.12, 1.78]} />
        <meshLambertMaterial color="#c5c5c5" />
      </mesh>

      {/* Rear window rake */}
      <mesh position={[-1.04, 1.18, 0]} rotation={[0, 0, 0.42]} castShadow>
        <boxGeometry args={[0.6, 0.12, 1.78]} />
        <meshLambertMaterial color="#c5c5c5" />
      </mesh>

      {/* Roof — slightly narrower than cabin for shoulder taper */}
      <mesh position={[0.1, 1.88, 0]} castShadow>
        <boxGeometry args={[2.1, 0.14, 1.6]} />
        <meshLambertMaterial color="#bebebe" />
      </mesh>

      {/* ── WINDOWS (dark inset planes) ── */}

      {/* Windshield */}
      <mesh position={[1.18, 1.42, 0]} rotation={[0, 0, -0.52]}>
        <planeGeometry args={[0.85, 1.6]} />
        <meshBasicMaterial color="#333333" side={2} />
      </mesh>

      {/* Rear window */}
      <mesh position={[-0.98, 1.4, 0]} rotation={[0, Math.PI, 0.42]}>
        <planeGeometry args={[0.72, 1.58]} />
        <meshBasicMaterial color="#333333" side={2} />
      </mesh>

      {/* Left side windows — front + rear quarter */}
      <mesh position={[0.42, 1.44, 0.92]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 0.62]} />
        <meshBasicMaterial color="#444444" side={2} />
      </mesh>
      <mesh position={[-0.52, 1.44, 0.92]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.72, 0.58]} />
        <meshBasicMaterial color="#444444" side={2} />
      </mesh>

      {/* Right side windows */}
      <mesh position={[0.42, 1.44, -0.92]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 0.62]} />
        <meshBasicMaterial color="#444444" side={2} />
      </mesh>
      <mesh position={[-0.52, 1.44, -0.92]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.72, 0.58]} />
        <meshBasicMaterial color="#444444" side={2} />
      </mesh>

      {/* ── WHEELS ── */}
      {/* Tyre cylinders + hub discs */}
      {([
        [-1.3, 0.38, 1.05],
        [1.3, 0.38, 1.05],
        [-1.3, 0.38, -1.05],
        [1.3, 0.38, -1.05],
      ] as [number, number, number][]).map((p, i) => (
        <group key={i} position={p} rotation={[0, 0, Math.PI / 2]}>
          {/* Tyre */}
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.36, 14]} />
            <meshLambertMaterial color="#222222" />
          </mesh>
          {/* Rim (hub) */}
          <mesh position={[0, p[2] > 0 ? 0.19 : -0.19, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 10]} />
            <meshLambertMaterial color="#aaaaaa" />
          </mesh>
        </group>
      ))}

      {/* Wheel arch cut-in — dark recesses to visually separate tyres from body */}
      {([
        [-1.3, 0.55, 1.02],
        [1.3, 0.55, 1.02],
        [-1.3, 0.55, -1.02],
        [1.3, 0.55, -1.02],
      ] as [number, number, number][]).map((p, i) => (
        <mesh key={`arch-${i}`} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.06, 14, 1, false, 0, Math.PI]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* ── HEADLIGHTS ── */}
      <mesh position={[2.12, 0.7, 0.62]}>
        <boxGeometry args={[0.08, 0.22, 0.36]} />
        <meshStandardMaterial color="#fff4d6" emissive="#fff4d6" emissiveIntensity={5} />
      </mesh>
      <mesh position={[2.12, 0.7, -0.62]}>
        <boxGeometry args={[0.08, 0.22, 0.36]} />
        <meshStandardMaterial color="#fff4d6" emissive="#fff4d6" emissiveIntensity={5} />
      </mesh>

      {/* Headlight point lights */}
      <pointLight position={[2.5, 0.7, 0.62]} color="#fff4d6" intensity={1.5} distance={8} />
      <pointLight position={[2.5, 0.7, -0.62]} color="#fff4d6" intensity={1.5} distance={8} />

      {/* Headlight beam */}
      <mesh position={[4.5, 0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 1.5]} />
        <meshBasicMaterial color="#fff4d6" transparent opacity={0.08} side={2} />
      </mesh>

      {/* ── TAILLIGHTS ── */}
      <mesh position={[-2.12, 0.7, 0.62]}>
        <boxGeometry args={[0.08, 0.22, 0.36]} />
        <meshLambertMaterial color="#888888" />
      </mesh>
      <mesh position={[-2.12, 0.7, -0.62]}>
        <boxGeometry args={[0.08, 0.22, 0.36]} />
        <meshLambertMaterial color="#888888" />
      </mesh>

      {/* ── SIDE MIRRORS ── */}
      <mesh position={[0.9, 1.12, 1.08]}>
        <boxGeometry args={[0.24, 0.14, 0.08]} />
        <meshLambertMaterial color="#c0c0c0" />
      </mesh>
      <mesh position={[0.9, 1.12, -1.08]}>
        <boxGeometry args={[0.24, 0.14, 0.08]} />
        <meshLambertMaterial color="#c0c0c0" />
      </mesh>

      {/* ── DOOR LINES (thin dark strips for realism) ── */}
      <mesh position={[0.22, 0.72, 1.01]}>
        <boxGeometry args={[0.04, 0.62, 0.02]} />
        <meshBasicMaterial color="#aaaaaa" />
      </mesh>
      <mesh position={[0.22, 0.72, -1.01]}>
        <boxGeometry args={[0.04, 0.62, 0.02]} />
        <meshBasicMaterial color="#aaaaaa" />
      </mesh>

    </group>
  );
}