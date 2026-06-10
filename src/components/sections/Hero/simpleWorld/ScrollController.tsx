"use client";

import { useEffect, useRef, type RefObject } from "react";

interface ScrollControllerProps {
  progressRef: RefObject<number>;
  isDraggingRef: RefObject<boolean>;
  isManualRef: RefObject<boolean>;
  scrollSensitivity?: number;
  lerpFactor?: number;
  onStageChange?: (stage: number) => void;
}

export function useScrollController({
  progressRef,
  isDraggingRef,
  isManualRef,
  scrollSensitivity = 0.0005,
  lerpFactor = 0.1,
  onStageChange,
}: ScrollControllerProps) {
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastStageRef = useRef(0);

  useEffect(() => {
    let rafId: number;

    const onWheel = (e: WheelEvent) => {
      if (isDraggingRef.current) return;

      e.preventDefault();
      isManualRef.current = false;

      const delta = e.deltaY * scrollSensitivity;
      targetProgressRef.current = Math.max(
        0,
        Math.min(1, targetProgressRef.current + delta),
      );
    };

    const tick = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * lerpFactor;
      progressRef.current = currentProgressRef.current;

      if (onStageChange) {
        const stage = Math.min(6, Math.floor(currentProgressRef.current * 6) + 1);
        if (stage !== lastStageRef.current) {
          lastStageRef.current = stage;
          onStageChange(stage);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, [
    progressRef,
    isDraggingRef,
    isManualRef,
    scrollSensitivity,
    lerpFactor,
    onStageChange,
  ]);

  const reset = () => {
    targetProgressRef.current = 0;
    currentProgressRef.current = 0;
    progressRef.current = 0;
  };

  const jumpTo = (progress: number) => {
    targetProgressRef.current = Math.max(0, Math.min(1, progress));
  };

  return { reset, jumpTo };
}

interface ScrollProgressBarProps {
  progressRef: RefObject<number>;
}

export function ScrollProgressBar({ progressRef }: ScrollProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      if (barRef.current) {
        const p = Math.max(0, Math.min(1, progressRef.current ?? 0));
        barRef.current.style.width = `${p * 100}%`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progressRef]);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[100] h-1 bg-white/10">
      <div ref={barRef} className="h-full bg-blue-500" style={{ width: "0%" }} />
    </div>
  );
}
