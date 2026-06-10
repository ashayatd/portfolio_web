"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export function useScrambleText(text: string, trigger: boolean, speed = 30) {
  const [display, setDisplay] = useState(text);
  const hasScrambled = useRef(false);

  useEffect(() => {
    // If already scrambled once, never do it again
    if (hasScrambled.current) return;

    if (!trigger) {
      // Reset immediately when trigger is false, but only if we haven't scrambled yet
      const resetId = window.setTimeout(() => setDisplay(text), 0);
      return () => clearTimeout(resetId);
    }

    // Mark as scrambled immediately so no future trigger can restart it
    hasScrambled.current = true;

    let iteration = 0;
    const totalIterations = text.length * 3;

    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      iteration += 1;

      if (iteration >= totalIterations) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed]);

  return display;
}