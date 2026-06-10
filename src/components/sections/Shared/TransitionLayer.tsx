"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function TransitionLayer({
  className = "",
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div className={`absolute inset-0 ${className}`} {...props}>
      {children}
    </motion.div>
  );
}
