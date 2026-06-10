"use client";

import { motion, type MotionValue } from "framer-motion";
import { SlotText } from "@/components/effects/SlotText";
import { MAGIC_SCRAMBLE, MAGIC_TITLE_WORDS } from "./constants";

type ScalableTitleProps = {
  trigger?: boolean;
  opacity?: MotionValue<number>;
  y?: MotionValue<number>;
  scale?: MotionValue<number>;
  color?: MotionValue<string>;
};

export default function ScalableTitle({
  trigger = false,
  opacity,
  y,
  scale,
  color,
}: ScalableTitleProps) {
  return (
    <motion.span
      style={{ opacity, y, scale }}
      className="block will-change-transform"
    >
      <motion.div style={{ color }}>
        <SlotText
          text={MAGIC_TITLE_WORDS.scalable}
          trigger={trigger}
          speed={MAGIC_SCRAMBLE.scalableSpeed}
          stagger={MAGIC_SCRAMBLE.stagger}
          className="inline-block"
        />
      </motion.div>
    </motion.span>
  );
}
