"use client";

import { Canvas } from "@react-three/fiber";
import { BuildingC } from "../Hero/simpleWorld/BuildingC";
import { RotatingModal } from "../Hero/simpleWorld/CameraRig";
import { useState, useEffect, useRef } from "react";

export default function SceneWithGlassFrame() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouseX(x);
      setMouseY(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const translateX = -mouseX * 40;
  const translateY = -mouseY * 20;
  const rotateY = mouseX * 8;
  const rotateX = -mouseY * 6;

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 5, 60], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <group position={[0, -10, 0]}>
            <RotatingModal>
              <BuildingC />
            </RotatingModal>
          </group>
        </Canvas>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-auto">
        <div
          className="relative w-full h-full mt-16 rounded-2xl border border-black/10 bg-white/40 backdrop-blur-sm shadow-2xl"
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
            transform: `translate(${translateX}px, ${translateY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            transformStyle: "preserve-3d",
            perspective: "1000px",
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-2xl" />

          <div className="p-8 text-black">
            <h1 className="text-3xl font-bold mb-4">Welcome</h1>
            <p className="text-black/70 mb-6 leading-relaxed">
              This is the main content area inside the glass frame. The 3D scene
              renders in the background while this panel sits on top with a
              frosted glass effect.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5 border border-black/10">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-lg">
                  🏢
                </div>
                <div>
                  <p className="font-medium">Building C</p>
                  <p className="text-sm text-black/50">Position: [0, 0, 0]</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5 border border-black/10">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-lg">
                  🌙
                </div>
                <div>
                  <p className="font-medium">Moonlight Scene</p>
                  <p className="text-sm text-black/50">
                    Gentle ambient lighting
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-5 py-2 rounded-lg bg-black/10 hover:bg-black/20 border border-black/10 transition-colors text-sm font-medium">
                Action One
              </button>
              <button className="px-5 py-2 rounded-lg bg-black/10 hover:bg-black/20 border border-black/10 transition-colors text-sm font-medium">
                Action Two
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}