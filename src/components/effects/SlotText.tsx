"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { getSlotScrambleCharacter } from "./scrambleSpark";

type SlotLetterProps = {
  targetChar: string;
  trigger: boolean;
  delay: number;
  duration: number;
  charSize: number;
  hasScrambledRef: React.MutableRefObject<boolean>;
};

const SlotLetter: FC<SlotLetterProps> = ({
  targetChar,
  trigger,
  delay,
  duration,
  charSize,
  hasScrambledRef,
}) => {
  const reelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    startTime: 0,
    isRunning: false,
  });

  const chars = useMemo(() => {
    const strip = [];

    for (let i = 0; i < 20; i += 1) {
      strip.push(getSlotScrambleCharacter(targetChar.charCodeAt(0) * 31 + i * 101));
    }

    strip.push(targetChar, targetChar);
    return strip;
  }, [targetChar]);

  const charHeight = charSize;
  const totalStripHeight = chars.length * charHeight;
  const targetIndex = chars.length - 2;

  const easeOutExpo = (time: number) =>
    time === 1 ? 1 : 1 - Math.pow(2, -10 * time);

  const springSettle = (time: number) => {
    const c4 = (2 * Math.PI) / 3;

    return time === 0
      ? 0
      : time === 1
        ? 1
        : Math.pow(2, -10 * time) * Math.sin((time * 10 - 0.75) * c4) + 1;
  };

  useEffect(() => {
    // Prevent re-scrambling if already done once
    if (hasScrambledRef.current) return;

    const animate = () => {
      const state = stateRef.current;
      if (!state.isRunning || !reelRef.current) return;

      const elapsed = performance.now() - state.startTime;
      const progress = Math.min(elapsed / duration, 1);
      let currentPosition: number;

      if (progress < 0.6) {
        const spinProgress = progress / 0.6;
        currentPosition = spinProgress * totalStripHeight * 3;
        currentPosition +=
          Math.sin(spinProgress * Math.PI * 8) * charHeight * 0.15;
      } else if (progress < 0.85) {
        const decelProgress = (progress - 0.6) / 0.25;
        const targetPosition = targetIndex * charHeight;
        const spinDistance = totalStripHeight * 3;

        currentPosition =
          spinDistance +
          (targetPosition - spinDistance) * easeOutExpo(decelProgress);
      } else {
        const settleProgress = (progress - 0.85) / 0.15;
        const targetPosition = targetIndex * charHeight;
        const preSettlePosition =
          totalStripHeight * 3 +
          (targetPosition - totalStripHeight * 3) * easeOutExpo(1);
        const overshoot = charHeight * 0.3 * Math.sin(settleProgress * Math.PI);

        currentPosition =
          preSettlePosition +
          (targetPosition - preSettlePosition + overshoot) *
            springSettle(settleProgress);
      }

      reelRef.current.style.transform = `translateY(${-currentPosition}px)`;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Mark as scrambled when animation completes
      hasScrambledRef.current = true;
      reelRef.current.style.transform = `translateY(${-targetIndex * charHeight}px)`;
    };

    if (!trigger) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stateRef.current = { startTime: 0, isRunning: false };

      if (reelRef.current) {
        reelRef.current.style.transform = "translateY(0px)";
      }

      return;
    }

    const timeoutId = window.setTimeout(() => {
      stateRef.current.isRunning = true;
      stateRef.current.startTime = performance.now();
      animate();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    trigger,
    delay,
    duration,
    totalStripHeight,
    charHeight,
    targetIndex,
    hasScrambledRef,
  ]);

  if (targetChar === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <span
      className="relative inline-flex items-center"
      style={{ height: charSize, lineHeight: `${charSize}px` }}
    >
      <span
        className="block overflow-hidden"
        style={{ height: charSize, lineHeight: `${charSize}px` }}
      >
        <span
          ref={reelRef}
          className="block will-change-transform"
          style={{ transform: "translateY(0px)" }}
        >
          {chars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="block select-none font-black"
              style={{
                height: charSize,
                fontSize: charSize * 0.85,
                lineHeight: `${charSize}px`,
                color: index === targetIndex ? "inherit" : "rgba(255,255,255,0.15)",
                opacity: index === targetIndex ? 1 : 0.3,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
};

type SlotTextProps = {
  text: string;
  trigger: boolean;
  speed?: number;
  stagger?: number;
  className?: string;
};

export const SlotText: FC<SlotTextProps> = ({
  text,
  trigger,
  speed = 2200,
  stagger = 80,
  className = "",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [charSize, setCharSize] = useState(64);
  // Shared ref across all letters - once ANY letter finishes, all are locked
  // Or use per-letter refs if you want independent behavior
  const hasScrambledRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const fontSize = parseFloat(
      window.getComputedStyle(containerRef.current).fontSize,
    );

    setCharSize(fontSize);
  }, [text]);

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <span className="relative z-10 flex select-none flex-wrap justify-center leading-none tracking-[-0.1em]">
        {text.split("").map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={`inline-flex items-center justify-center p-0 ${
              char === " " ? "mx-2 w-[0.3em]" : "mx-[-3px]"
            }`}
          >
            <SlotLetter
              targetChar={char}
              trigger={trigger}
              delay={index * stagger}
              duration={speed + index * stagger * 0.5}
              charSize={charSize}
              hasScrambledRef={hasScrambledRef}
            />
          </span>
        ))}
      </span>
    </span>
  );
};