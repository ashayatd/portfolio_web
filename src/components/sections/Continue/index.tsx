"use client";

import { motion, type MotionValue } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import BottomBar from "@/components/ui/BottomBar";
import { useContinueAnimations } from "./hooks";
import type { RefObject } from "react";

type Props = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  scrollProgress: MotionValue<number>;
};

export default function MagicPage({ scrollContainerRef, scrollProgress: storyProgress }: Props) {
  const { continueOpacity, continueScale, continueBlur, bottomBarOpacity } =
    useContinueAnimations(storyProgress);
  return (
    <section id="continue" className="relative h-[666.66vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <Navbar />

        {/* TITLES */}
        <motion.div
          style={{
            opacity: continueOpacity,
            scale: continueScale,
            filter: `blur(${continueBlur}px)`,
          }}
          className="absolute inset-0 z-40"
        >
          <div className="text-center">
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black uppercase">
              aBuilding
            </h1>

            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black uppercase">
              Scalable
            </h1>

            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black uppercase">
              Solutions
            </h1>
          </div>
        </motion.div>

        {/* HORIZONTAL STORY */}
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <motion.div
            style={{
              opacity: continueOpacity,
              scale: continueScale,
              filter: `blur(${continueBlur}px)`,
            }}
            className="absolute inset-0 z-40"
          >
            <div className="h-[520px] w-[520px] rounded-3xl bg-white/5" />
            <div className="h-[520px] w-[520px] rounded-3xl bg-white/5" />
            <div className="h-[520px] w-[520px] rounded-3xl bg-white/5" />
          </motion.div>
        </div>

        <BottomBar
          currentPageOpacity={bottomBarOpacity}
          heroScrollProgress={storyProgress}
        />
      </div>
    </section>
  );
}
