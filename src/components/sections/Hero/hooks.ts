"use client";

import { useEffect, useRef, useState } from "react";
import { useTransform } from "framer-motion";
import { useComponentScroll } from "@/hooks/useComponentScroll";
import { heroAnimationRanges } from "./animations";
import type { CameraSample } from "./simpleWorld/Timeline";

export function useHeroScene() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFullyMerged, setIsFullyMerged] = useState(false);
  const [magicScrollUnlocked, setMagicScrollUnlocked] = useState(false);

  const heroScrollProgress = useComponentScroll(heroRef);

  // 3D camera refs — read by SceneControls in Hero/index.tsx
  const progressRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isManualRef = useRef(false);
  const sampleRef = useRef<CameraSample | null>(null);

  const videoOpacity = useTransform(
    heroScrollProgress,
    heroAnimationRanges.videoOpacity.input,
    heroAnimationRanges.videoOpacity.output,
  );
  const videoScale = useTransform(
    heroScrollProgress,
    heroAnimationRanges.videoScale.input,
    heroAnimationRanges.videoScale.output,
  );
  const indicatorOpacity = useTransform(
    heroScrollProgress,
    heroAnimationRanges.indicatorOpacity.input,
    heroAnimationRanges.indicatorOpacity.output,
  );
  const canvasOpacity = useTransform(
    heroScrollProgress,
    heroAnimationRanges.canvasOpacity.input,
    heroAnimationRanges.canvasOpacity.output,
  );
  const magicPageOpacity = useTransform(
    heroScrollProgress,
    heroAnimationRanges.magicPageOpacity.input,
    heroAnimationRanges.magicPageOpacity.output,
  );
  const magicPageScale = useTransform(
    heroScrollProgress,
    heroAnimationRanges.magicPageScale.input,
    heroAnimationRanges.magicPageScale.output,
  );
  const continuePageScale = useTransform(
    heroScrollProgress,
    heroAnimationRanges.magicPageScale.input,
    heroAnimationRanges.magicPageScale.output,
  );

  // Sync 3D timeline progress with hero section scroll (0–1 over 400vh)
  useEffect(() => {
    return heroScrollProgress.on("change", (value) => {
      if (isDraggingRef.current) return;
      isManualRef.current = false;
      progressRef.current = value;
    });
  }, [heroScrollProgress]);

  return {
    heroRef,
    videoRef,
    scrollContainerRef,
    progressRef,
    isDraggingRef,
    isManualRef,
    sampleRef,
    motionValues: {
      videoOpacity,
      videoScale,
      indicatorOpacity,
      canvasOpacity,
      magicPageOpacity,
      magicPageScale,
      continuePageScale,
    },
    state: {
      isFullyMerged,
      magicScrollUnlocked,
    },
  };
}
