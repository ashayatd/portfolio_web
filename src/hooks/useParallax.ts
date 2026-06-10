"use client";

import { useTransform, type MotionValue } from "framer-motion";

export function useParallax(
  progress: MotionValue<number>,
  distance: number,
  input: [number, number] = [0, 1],
) {
  return useTransform(progress, input, [-distance, distance]);
}
