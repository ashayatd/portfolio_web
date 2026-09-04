"use client";

import { useEffect, useState } from "react";

/**
 * True only on desktop-sized viewports (Tailwind `lg` and up).
 *
 * The 3D city walk-around needs a keyboard (WASD) and a pointer that can be
 * locked, so phones and tablets never get the entry point. Starts `false` so
 * server markup and the first client paint agree (no hydration mismatch).
 */
export function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minWidth]);

  return isDesktop;
}
