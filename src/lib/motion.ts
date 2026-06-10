import type { MotionValue } from "framer-motion";

export type NumericMotionValue = MotionValue<number>;

export const motionRanges = {
  fadeIn: [0, 1],
  fadeOut: [1, 0],
  holdVisible: [1, 1],
} as const;
