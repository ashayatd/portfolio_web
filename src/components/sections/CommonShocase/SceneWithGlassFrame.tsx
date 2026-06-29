"use client";

import { Canvas } from "@react-three/fiber";
import { RotatingModal } from "../Hero/simpleWorld/CameraRig";
import { useEffect, useRef, useState, ReactNode } from "react";

// ── Feel knobs ──────────────────────────────────────────────────────────
// EASE: how fast the modal catches up to the cursor (lower = smoother/laggier,
//       a slow "lean"; higher = snappier). MOVE/TILT: how far it travels/leans.
const EASE = 0.06;
const MOVE_X = 130; // px of horizontal drift
const MOVE_Y = 110; // px of vertical drift (higher travel)
const TILT_Y = 24; // deg of left/right lean
const TILT_X = 16; // deg of up/down lean

interface SceneWithGlassFrameProps {
  /** The 3D model/component to render inside the rotating canvas */
  buildingModel: ReactNode;
  /** The 2D React component to display inside the frosted glass frame */
  foregroundContent: ReactNode;
}

export default function SceneWithGlassFrame({
  buildingModel,
  foregroundContent,
}: SceneWithGlassFrameProps) {
  // Refs only — no React state, so the cursor never triggers a re-render.
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  // `mounted`: create the WebGL canvas a bit *before* it scrolls in, so the
  // context-init cost is paid off the transition frame (no mid-scroll hitch).
  // `visible`: only run the render loop while actually on screen.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Preload ~800px early, then keep mounted (no teardown jank).
    const preload = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          preload.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    preload.observe(el);

    // Render only while in view.
    const inView = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "0px" },
    );
    inView.observe(el);

    return () => {
      preload.disconnect();
      inView.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let raf = 0;
    const animate = () => {
      const cur = current.current;
      const tgt = target.current;

      // Exponential easing toward the cursor → smooth, leaning motion.
      cur.x += (tgt.x - cur.x) * EASE;
      cur.y += (tgt.y - cur.y) * EASE;

      // Mouse left -> modal goes right, mouse right -> modal goes left
      const translateX = -cur.x * MOVE_X;
      const translateY = -cur.y * MOVE_Y;
      const rotateY = cur.x * TILT_Y;
      const rotateX = -cur.y * TILT_X;

      if (sceneRef.current) {
        sceneRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // No fixed height: the foreground content (in normal flow) determines the
    // height, and the canvas is an absolute layer that stretches to fill it.
    <div ref={wrapRef} className="relative w-full overflow-hidden bg-white">
      {/* Background Canvas - absolutely fills whatever height the content makes */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={sceneRef}
          style={{
            willChange: "transform",
            width: "100%",
            height: "100%",
          }}
        >
          {mounted && (
            <Canvas
              frameloop={visible ? "always" : "never"}
              dpr={1}
              gl={{ powerPreference: "high-performance" }}
              camera={{ position: [0, 5, 60], fov: 45 }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <group position={[0, -10, 0]}>
                {/* <RotatingModal>
                {buildingModel}
              </RotatingModal> */}
              </group>
            </Canvas>
          )}
        </div>
      </div>

      {/* Foreground Glass Frame - in normal flow, so it drives the parent height */}
      <div className="relative z-10 flex items-center justify-center p-8">
        <div
          className="relative w-full rounded-2xl border border-black/10 bg-white/40 backdrop-blur-xs shadow-2xl"
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Glass shine */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-2xl" />

          {/* Dynamically injected UI component */}
          {foregroundContent}
        </div>
      </div>
    </div>
  );
}
