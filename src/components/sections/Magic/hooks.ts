"use client";

import { useEffect, useState } from "react";
import type { MotionValue } from "framer-motion";
import { SCROLL_UNLOCK_DELAY_MS } from "@/timeline/timings";
import { MAGIC_SCRAMBLE } from "./constants";

export function useMagicTitleScramble() {
  const [scrambleBuilding, setScrambleBuilding] = useState(false);
  const [scrambleScalable, setScrambleScalable] = useState(false);
  const [scrambleSolutions, setScrambleSolutions] = useState(false);
  const [collapseTitles, setCollapseTitles] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (!sceneRef.current) return;

  //     const rect = sceneRef.current.getBoundingClientRect();
  //     const viewportHeight = window.innerHeight;
  //     const progress = 1 - rect.bottom / (viewportHeight + rect.height);

  //     if (
  //       progress > 0.45 &&
  //       !scrambleBuilding &&
  //       !scrambleScalable &&
  //       !scrambleSolutions
  //     ) {
  //       window.setTimeout(
  //         () => setScrambleBuilding(true),
  //         Math.random() * MAGIC_SCRAMBLE.initialMaxDelayMs,
  //       );
  //       window.setTimeout(
  //         () => setScrambleScalable(true),
  //         Math.random() * MAGIC_SCRAMBLE.initialMaxDelayMs,
  //       );
  //       window.setTimeout(
  //         () => setScrambleSolutions(true),
  //         Math.random() * MAGIC_SCRAMBLE.initialMaxDelayMs,
  //       );
  //     }

  //     setCollapseTitles(progress > 0.58);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   handleScroll();

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [sceneRef, scrambleBuilding, scrambleScalable, scrambleSolutions]);

  useEffect(() => {
    const triggerScramble = () => {
      window.setTimeout(
        () => setScrambleBuilding(true),
        Math.random() * MAGIC_SCRAMBLE.initialMaxDelayMs,
      );
      window.setTimeout(
        () => setScrambleScalable(true),
        Math.random() * MAGIC_SCRAMBLE.initialMaxDelayMs,
      );
      window.setTimeout(
        () => setScrambleSolutions(true),
        Math.random() * MAGIC_SCRAMBLE.initialMaxDelayMs,
      );
    };

    triggerScramble();

    const intervalId = window.setInterval(() => {
      triggerScramble();

      window.setTimeout(() => {
        setScrambleBuilding(false);
        setScrambleScalable(false);
        setScrambleSolutions(false);
      }, MAGIC_SCRAMBLE.resetDelayMs);
    }, MAGIC_SCRAMBLE.intervalMs);

    return () => clearInterval(intervalId);
  }, []);

  return {
    collapseTitles,
    scrambleBuilding,
    scrambleScalable,
    scrambleSolutions,
  };
}

export function useMagicScrollHandoff(progress: MotionValue<number>) {
  const [isFullyMerged, setIsFullyMerged] = useState(false);
  const [magicScrollUnlocked, setMagicScrollUnlocked] = useState(false);

  useEffect(() => {
    const unsubscribe = progress.on("change", (value) => {
      setIsFullyMerged(value >= 0.995);
      console.log("MagicPage scroll progress:", value);

      // if (value < 0.95) {
      //   setMagicScrollUnlocked(false);
      // }
    });

    console.log("Subscribed to MagicPage scroll progress", unsubscribe);

    return () => unsubscribe();
  }, [progress]);

  // useEffect(() => {
  //   if (!isFullyMerged) return;

  //   const timer = window.setTimeout(
  //     () => setMagicScrollUnlocked(true),
  //     SCROLL_UNLOCK_DELAY_MS,
  //   );

  //   return () => clearTimeout(timer);
  // }, [isFullyMerged]);

  return {
    isFullyMerged,
    magicScrollUnlocked,
  };
}
