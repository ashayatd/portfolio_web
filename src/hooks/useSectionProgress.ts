"use client";

import { useTransform, type MotionValue } from "framer-motion";
import { normalizeRange } from "@/lib/interpolation";
import type { TimelineRange } from "@/types";
import { useGlobalTimeline } from "./useGlobalTimeline";

export function useSectionProgress(
  range: TimelineRange,
  sourceProgress?: MotionValue<number>,
) {
  const { progress: globalProgress } = useGlobalTimeline();
  const progress = sourceProgress ?? globalProgress;
  const [start, end] = range;

  return useTransform(progress, (latest) => normalizeRange(latest, start, end));
}
