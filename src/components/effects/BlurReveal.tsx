"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { REVEAL_TRANSITION } from "@/timeline/transitions";

type BlurRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function BlurReveal({
  delay = 0,
  children,
  ...props
}: BlurRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...REVEAL_TRANSITION, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
