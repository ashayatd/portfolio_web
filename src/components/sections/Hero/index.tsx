"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import MagicPage from "@/components/sections/Magic";
import { useHeroScene } from "./hooks";
import { normalizeRange } from "@/timeline/global";
import { SceneControls } from "./simpleWorld/CameraRig";
import { CityScene } from "./simpleWorld/MiniCityScene";
import { useHandTracking } from "./simpleWorld/useHandTracking";

export default function Hero() {
  const {
    heroRef,
    scrollContainerRef,
    motionValues,
    state,
    // NEW: 3D refs from useHeroScene
    progressRef,
    isDraggingRef,
    isManualRef,
    sampleRef,
  } = useHeroScene();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const globalProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const heroProgress = useTransform(globalProgress, (v) =>
    normalizeRange(v, 0, 30),
  );

  const normalizedGlobalProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1],
  );

  const { isTracking, hasPermission } = useHandTracking();

  return (
    <section ref={heroRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 grid h-screen w-full grid-cols-1 grid-rows-1 overflow-hidden">
        {/* 
          REPLACED: motion.canvas (2D PNG frames) 
          WITH: R3F Canvas (3D city flythrough)

          The 3D scene uses the same scroll progress (0-1) from the 400vh section.
          SceneControls reads progressRef and moves the camera along Timeline.ts path.
        */}
        <motion.div
          style={{ opacity: motionValues.canvasOpacity }}
          className="col-start-1 row-start-1 h-full w-full"
        >
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 55, 55], fov: 50 }}
            className="h-full w-full"
            style={{ touchAction: "none" }}
            gl={{ antialias: true, alpha: false }}
          >
            <CityScene />
            <SceneControls
              progressRef={progressRef}
              isDraggingRef={isDraggingRef}
              isManualRef={isManualRef}
              sampleRef={sampleRef}
              positionLerp={0.12}
              targetLerp={0.12}
            />
          </Canvas>
        </motion.div>

        {/* MagicPage overlay — unchanged */}
        <motion.div
          ref={scrollContainerRef}
          style={{
            opacity: motionValues.magicPageOpacity,
            scale: motionValues.magicPageScale,
          }}
          suppressHydrationWarning
          className={`col-start-1 row-start-1 z-20 h-full w-full transition-colors duration-300 ${
            state.isFullyMerged
              ? "pointer-events-auto bg-black"
              : "pointer-events-none bg-transparent"
          } ${
            state.magicScrollUnlocked ? "overflow-y-auto" : "overflow-hidden"
          } cinematic-scrollbar-none`}
        >
          <MagicPage
            scrollContainerRef={scrollContainerRef}
            globalProgress={normalizedGlobalProgress}
          />
        </motion.div>
      </div>
    </section>
  );
}
