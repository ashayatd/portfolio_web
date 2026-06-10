"use client";

import { useEffect, useState } from "react";
import type { MotionValue } from "framer-motion";

type TimelineDebugProps = {
  progress: MotionValue<number>;
  label?: string;
};

export function TimelineDebug({
  progress,
  label = "progress",
}: TimelineDebugProps) {
  const [value, setValue] = useState(progress.get());

  useEffect(() => {
    return progress.on("change", setValue);
  }, [progress]);

  return (
    <div className="fixed right-10 top-10 z-[9999] rounded bg-white px-4 py-2 text-black">
      {label}: {value.toFixed(3)}
    </div>
  );
}
