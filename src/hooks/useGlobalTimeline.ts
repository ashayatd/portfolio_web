"use client";

import { useContext } from "react";
import { useScroll } from "framer-motion";
import { TimelineContext } from "@/providers/TimelineProvider";

export function useGlobalTimeline() {
  const context = useContext(TimelineContext);
  const { scrollYProgress } = useScroll();

  return context ?? { progress: scrollYProgress };
}
