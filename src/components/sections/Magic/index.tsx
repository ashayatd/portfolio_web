"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SlotText } from "@/components/effects/SlotText";
import BottomBar from "@/components/ui/BottomBar";
import Navbar from "@/components/ui/Navbar";
import { magicAnimationRanges } from "./animations";
import { MAGIC_SCRAMBLE, MAGIC_TITLE_WORDS } from "./constants";
import { useMagicTitleScramble } from "./hooks";

import type { RefObject } from "react";

type Props = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  globalProgress: MotionValue<number>;
};

const TORCH_COLOR = "#00bc7d";

export default function MagicPage({ scrollContainerRef }: Props) {
  const storyProgress = useMotionValue(0); // Keep at 0 to maintain bottomBar opacity
  const internalScrollProgress = useMotionValue(0);

  // ── Canvas Binary Torch Effect ──
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const bitsRef = useRef<{ x: number; y: number; text: string; opacity: number; width: number }[]>([]);
  const rafRef = useRef<number>(0);
  const lastFlipRef = useRef<number>(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const BIT_SIZE = 14;
  const TORCH_RADIUS = 140;
  const FLIP_INTERVAL = 150;

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);

    if (w === 0 || h === 0) return false;

    dimsRef.current = { w, h, dpr };

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    // Measure text widths to prevent overlap
    ctx.font = "bold 11px 'Courier New', monospace";
    const singleWidth = ctx.measureText("0").width;
    const longWidth = ctx.measureText("010101").width;

    const cols = Math.ceil(w / BIT_SIZE);
    const rows = Math.ceil(h / BIT_SIZE);
    const bits: { x: number; y: number; text: string; opacity: number; width: number }[] = [];

    for (let r = 0; r < rows; r++) {
      let c = 0;
      while (c < cols) {
        const isLong = Math.random() > 0.97; // Reduced frequency (was 0.96)
        const text = isLong ? "010101" : Math.random() > 0.5 ? "1" : "0";
        const width = isLong ? longWidth : singleWidth;
        const span = isLong ? Math.ceil(longWidth / BIT_SIZE) + 1 : 1;

        bits.push({
          x: c * BIT_SIZE + 2,
          y: r * BIT_SIZE + 11,
          text,
          opacity: 0,
          width,
        });

        c += span; // Skip columns to prevent overlap
      }
    }

    bitsRef.current = bits;
    return true;
  }, []);

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const { w, h } = dimsRef.current;
    const mouse = mouseRef.current;

    if (!ctx || w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    // Random bit flipping
    const now = performance.now();
    if (now - lastFlipRef.current > FLIP_INTERVAL) {
      const bits = bitsRef.current;
      for (let i = 0; i < 30; i++) {
        const idx = Math.floor(Math.random() * bits.length);
        const bit = bits[idx];
        // Only flip single digits, not long sequences
        if (bit.text.length === 1) {
          bit.text = Math.random() > 0.5 ? "1" : "0";
        }
      }
      lastFlipRef.current = now;
    }

    // Draw bits
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.textBaseline = "alphabetic";

    bitsRef.current.forEach((bit) => {
      const dx = mouse.x - (bit.x + bit.width / 2);
      const dy = mouse.y - bit.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetOpacity = 0;
      if (mouse.active && dist < TORCH_RADIUS) {
        targetOpacity = Math.max(0.2, 1 - dist / TORCH_RADIUS);
      }

      // Smooth lerp
      bit.opacity += (targetOpacity - bit.opacity) * 0.2;

      if (bit.opacity > 0.005) {
        const alpha = bit.opacity;
        ctx.fillStyle = hexToRgba(TORCH_COLOR, alpha);
        ctx.shadowColor = hexToRgba(TORCH_COLOR, alpha * 0.5);
        ctx.shadowBlur = 6;
        ctx.fillText(bit.text, bit.x, bit.y);
      }
    });

    ctx.shadowBlur = 0;
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only update if position actually changed (avoid scroll-triggered events)
    if (mouseRef.current.x !== x || mouseRef.current.y !== y) {
      mouseRef.current = { x, y, active: true };
      setCursorPos({ x, y });
      setIsHovering(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    setIsHovering(false);
  }, []);

  useEffect(() => {
    const setup = () => {
      if (initCanvas()) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        setTimeout(setup, 50);
      }
    };

    const timer = setTimeout(setup, 200);

    const handleResize = () => {
      initCanvas();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, draw]);
  // ── End Canvas Binary Torch ──

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollable = container.scrollHeight - container.clientHeight;
      const progress = scrollable <= 0 ? 0 : container.scrollTop / scrollable;
      // Update internal scroll progress, NOT storyProgress (which drives bottomBar opacity)
      internalScrollProgress.set(Math.max(0, Math.min(1, progress)));
      
      // Deactivate hover during scroll to prevent artifacts
      mouseRef.current.active = false;
      setIsHovering(false);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef, internalScrollProgress]);

  const { scrambleBuilding, scrambleScalable, scrambleSolutions } =
    useMagicTitleScramble();

  // Bottom bar stays visible during internal Magic scroll (opacity = 1)
  // It only fades based on Hero section transitions, not internal scroll
  const bottomBarOpacity = 1;

  return (
    <section id="magic" className="relative h-[700vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="h-full overflow-hidden bg-black">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.12),transparent_38%),linear-gradient(180deg,#050607_0%,#0D0F10_58%,#050607_100%)]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                backgroundSize: "90px 90px",
              }}
            />

            <Navbar />

            {/* ═══════════════════════════════════════════ */}
            {/*  FULL-WIDTH/HIGH CANVAS BINARY TORCH BG     */}
            {/* ═══════════════════════════════════════════ */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="absolute inset-0 w-full h-full pointer-events-auto"
              // style={{ cursor: "none" }}
            >
              {/* Canvas Layer */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />

              {/* Soft cursor glow — thin ring */}
              <div
                className="absolute pointer-events-none z-20 transition-opacity duration-300"
                style={{
                  left: cursorPos.x,
                  top: cursorPos.y,
                  transform: "translate(-50%, -50%)",
                  opacity: isHovering ? 1 : 0,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: `1px solid ${TORCH_COLOR}40`,
                  boxShadow: `0 0 20px ${TORCH_COLOR}30, inset 0 0 10px ${TORCH_COLOR}20`,
                  background: "transparent",
                  mixBlendMode: "screen",
                }}
              />

              {/* Inner subtle dot */}
              <div
                className="absolute pointer-events-none z-20 transition-opacity duration-300"
                style={{
                  left: cursorPos.x,
                  top: cursorPos.y,
                  transform: "translate(-50%, -50%)",
                  opacity: isHovering ? 0.6 : 0,
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: TORCH_COLOR,
                  boxShadow: `0 0 8px ${TORCH_COLOR}`,
                }}
              />

              {/* Edge Fade Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                  background: `radial-gradient(
                    ellipse at center,
                    transparent 0%,
                    transparent 50%,
                    rgba(5, 5, 5, 0.4) 80%,
                    rgba(5, 5, 5, 0.85) 100%
                  )`,
                }}
              />

              {/* Text Content Layer */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
                <div className="w-full max-w-7xl">
                  <div className="origin-center text-center text-[clamp(3.4rem,10vw,8.5rem)] font-black uppercase leading-[0.85] tracking-tight text-white">
                    <SlotText
                      text={MAGIC_TITLE_WORDS.building}
                      trigger={scrambleBuilding}
                      speed={MAGIC_SCRAMBLE.buildingSpeed}
                      stagger={MAGIC_SCRAMBLE.stagger}
                      className="inline-block"
                    />
                  </div>

                  <div className="text-center text-[clamp(3.4rem,10vw,8.5rem)] font-black uppercase leading-[0.85] tracking-tight text-white">
                    <SlotText
                      text={MAGIC_TITLE_WORDS.scalable}
                      trigger={scrambleScalable}
                      speed={MAGIC_SCRAMBLE.scalableSpeed}
                      stagger={MAGIC_SCRAMBLE.stagger}
                      className="inline-block"
                    />
                  </div>

                  <div className="text-center text-[clamp(3.4rem,10vw,8.5rem)] font-black uppercase leading-[0.85] tracking-tight text-white">
                    <SlotText
                      text={MAGIC_TITLE_WORDS.solutions}
                      trigger={scrambleSolutions}
                      speed={MAGIC_SCRAMBLE.solutionsSpeed}
                      stagger={MAGIC_SCRAMBLE.stagger}
                      className="inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* ═══════════════════════════════════════════ */}

            {/* COLLAPSED: 3 words → 1 horizontal line */}
            <div className="">
              <BottomBar
                currentPageOpacity={bottomBarOpacity}
                heroScrollProgress={storyProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}