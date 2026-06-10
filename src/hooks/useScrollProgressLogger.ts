"use client";

import { useEffect } from "react";

const LOG_MARKER = "445566";
const LOG_INTERVAL_MS = 100;

export type ScrollProgressSnapshot = {
  source: string;
  progress: number;
  scrollTop: number;
  scrollable: number;
};

const clampProgress = (value: number) => Math.max(0, Math.min(1, value));

const getElementLabel = (element: HTMLElement) => {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const classes = element.className
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((className) => `.${className}`)
    .join("");

  return `${tag}${id}${classes}`;
};

export function getScrollProgressSnapshot(
  target: EventTarget | null = null,
): ScrollProgressSnapshot | null {
  if (typeof window === "undefined") return null;

  const documentElement = document.documentElement;
  const body = document.body;
  const isPageScroll =
    target === null ||
    target === window ||
    target === document ||
    target === documentElement ||
    target === body;

  if (isPageScroll) {
    const scrollTop =
      window.scrollY || documentElement.scrollTop || body.scrollTop;
    const scrollHeight = Math.max(
      documentElement.scrollHeight,
      body.scrollHeight,
    );
    const clientHeight = window.innerHeight || documentElement.clientHeight;
    const scrollable = Math.max(0, scrollHeight - clientHeight);

    return {
      source: "window",
      progress: scrollable === 0 ? 0 : clampProgress(scrollTop / scrollable),
      scrollTop,
      scrollable,
    };
  }

  if (target instanceof HTMLElement) {
    const scrollable = Math.max(0, target.scrollHeight - target.clientHeight);

    return {
      source: getElementLabel(target),
      progress:
        scrollable === 0 ? 0 : clampProgress(target.scrollTop / scrollable),
      scrollTop: target.scrollTop,
      scrollable,
    };
  }

  return null;
}

const formatScrollLog = (snapshot: ScrollProgressSnapshot) =>
  `[${LOG_MARKER} UniversalScroll] ${snapshot.source} progress: ${(
    snapshot.progress * 100
  ).toFixed(2)}% | pixels: ${Math.round(snapshot.scrollTop)}px / ${Math.round(
    snapshot.scrollable,
  )}px`;

export function useScrollProgressLogger() {
  useEffect(() => {
    let lastLogTime = 0;
    const logProgress = (target: EventTarget | null, force = false) => {
      const now = Date.now();
      if (!force && now - lastLogTime < LOG_INTERVAL_MS) return;

      const snapshot = getScrollProgressSnapshot(target);
      if (!snapshot) return;

      // console.log(formatScrollLog(snapshot));
      lastLogTime = now;
    };

    const handleScroll = (event: Event) => {
      logProgress(event.target);
    };

    const handleResize = () => {
      logProgress(null, true);
    };

    logProgress(null, true);

    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
