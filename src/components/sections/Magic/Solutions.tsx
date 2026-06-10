"use client";

import { motion, type MotionValue } from "framer-motion";
import { SlotText } from "@/components/effects/SlotText";
import { MAGIC_SCRAMBLE, MAGIC_TITLE_WORDS } from "./constants";

type SolutionsTitleProps = {
  trigger?: boolean;
  opacity?: MotionValue<number>;
  y?: MotionValue<number>;
  scale?: MotionValue<number>;
  color?: MotionValue<string>;
};

export default function SolutionsTitle({
  trigger = false,
  opacity,
  y,
  scale,
  color,
}: SolutionsTitleProps) {
  return (
    <motion.span
      style={{ opacity, y, scale }}
      className="block will-change-transform"
    >
      <motion.div style={{ color }}>
        <SlotText
          text={MAGIC_TITLE_WORDS.solutions}
          trigger={trigger}
          speed={MAGIC_SCRAMBLE.solutionsSpeed}
          stagger={MAGIC_SCRAMBLE.stagger}
          className="inline-block"
        />
      </motion.div>
    </motion.span>
  );
}
