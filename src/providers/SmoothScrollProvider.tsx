"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

interface SmoothScrollContextValue {
  /** Smoothly scroll to an element (selector or id) or a pixel offset. */
  scrollTo: (target: string | number) => void;
  /** Freeze/unfreeze page scrolling (used by fullscreen overlays). */
  setScrollLock: (locked: boolean) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  setScrollLock: () => {},
});

/** Access the Lenis-powered smooth scroll (e.g. for nav links). */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Lenis with smooth, cinematic settings
    const lenis = new Lenis({
      duration: 4.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Animation loop
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
    };
  }, []);

  // Snappier than the cinematic wheel duration, and offset for the fixed navbar.
  const scrollTo = useCallback((target: string | number) => {
    lenisRef.current?.scrollTo(target, { offset: -80, duration: 1.2 });
  }, []);

  // While the city overlay is open the page must not move underneath it —
  // stop Lenis *and* native scrolling (wheel/keys still reach the window).
  const setScrollLock = useCallback((locked: boolean) => {
    if (locked) {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    }
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, setScrollLock }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
