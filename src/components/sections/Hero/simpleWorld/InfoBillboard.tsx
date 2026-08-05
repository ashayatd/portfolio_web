"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";

interface InfoBillboardProps {
  /** World position of the billboard (placed beside its building). */
  position: [number, number, number];
  /** Uppercase heading, e.g. "Projects". */
  title: string;
  /** Tag items shown in a 2-column grid, e.g. ["React", "Node", "MongoDB"]. */
  items?: string[];
  /** Single description line (used when `items` is not provided). */
  subtitle?: string;
  /** Accent colour for the status dot (matches the building). */
  accent?: string;
  /** Base plane width in world units (height follows the card aspect ratio). */
  width?: number;
  /** Controlled hover state — driven by the building, not the card itself. */
  hovered?: boolean;
}

// Card pixel dimensions (drives both the canvas and the plane aspect ratio).
const CARD_W = 1200;
const CARD_H = 720;
const CARD_ASPECT = CARD_H / CARD_W;

/* Rounded-rect path helper. */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* Parse a #hex colour into [r, g, b]. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* Build a premium "info card" texture: tinted card, glow dot, chip tags. */
function useInfoTexture(
  title: string,
  items: string[] | undefined,
  subtitle: string | undefined,
  accent: string,
) {
  return useMemo(() => {
    const W = CARD_W;
    const H = CARD_H;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const [r, g, b] = hexToRgb(accent);
    const tint = (a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;
    // A darker shade of the accent for readable chip text.
    const ink = `rgb(${Math.round(r * 0.5)}, ${Math.round(g * 0.5)}, ${Math.round(
      b * 0.5,
    )})`;

    const m = 46; // outer margin leaves room for the shadow
    const cardW = W - m * 2;
    const cardH = H - m * 2;
    const radius = 60;

    // Card body — white→accent-tint gradient with a soft drop shadow.
    ctx.save();
    ctx.shadowColor = "rgba(30, 41, 59, 0.25)";
    ctx.shadowBlur = 44;
    ctx.shadowOffsetY = 18;
    const bg = ctx.createLinearGradient(0, m, 0, H - m);
    bg.addColorStop(0, "rgba(255,255,255,0.98)");
    bg.addColorStop(1, tint(0.1));
    roundRect(ctx, m, m, cardW, cardH, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.restore();

    // Accent border.
    roundRect(ctx, m, m, cardW, cardH, radius);
    ctx.lineWidth = 3;
    ctx.strokeStyle = tint(0.35);
    ctx.stroke();

    // Accent top bar (rounded), clipped to the card for a clean header strip.
    ctx.save();
    roundRect(ctx, m, m, cardW, cardH, radius);
    ctx.clip();
    const bar = ctx.createLinearGradient(m, 0, W - m, 0);
    bar.addColorStop(0, tint(0.95));
    bar.addColorStop(1, tint(0.55));
    ctx.fillStyle = bar;
    ctx.fillRect(m, m, cardW, 14);
    ctx.restore();

    const padX = m + 70;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    // ── Header: glowing status dot + uppercase title ──
    const headerY = m + 110;
    const dotR = 24;
    ctx.beginPath();
    ctx.arc(padX + dotR, headerY, dotR + 14, 0, Math.PI * 2);
    ctx.fillStyle = tint(0.2); // soft glow halo
    ctx.fill();
    ctx.beginPath();
    ctx.arc(padX + dotR, headerY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();

    ctx.font = "800 92px Arial, sans-serif";
    ctx.fillStyle = "#161c26";
    ctx.letterSpacing = "2px";
    ctx.fillText(title.toUpperCase(), padX + dotR * 2 + 34, headerY + 2);
    ctx.letterSpacing = "0px";

    // Accent underline divider.
    const divY = headerY + 78;
    const div = ctx.createLinearGradient(padX, 0, W - m - 90, 0);
    div.addColorStop(0, tint(0.55));
    div.addColorStop(1, tint(0));
    roundRect(ctx, padX, divY, cardW - 160, 6, 3);
    ctx.fillStyle = div;
    ctx.fill();

    // ── Body ──
    if (items && items.length) {
      // Tag chips that wrap across rows.
      ctx.font = "700 56px Arial, sans-serif";
      const padPill = 34;
      const ph = 76; // chip height
      const gap = 22;
      const maxX = W - m - 60;
      let x = padX;
      let y = divY + 90;

      items.forEach((item) => {
        const tw = ctx.measureText(item).width;
        const pw = tw + padPill * 2;
        if (x + pw > maxX) {
          x = padX;
          y += ph + gap;
        }
        roundRect(ctx, x, y, pw, ph, ph / 2);
        ctx.fillStyle = tint(0.16);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = tint(0.3);
        ctx.stroke();

        ctx.fillStyle = ink;
        ctx.textBaseline = "middle";
        ctx.fillText(item, x + padPill, y + ph / 2 + 2);
        x += pw + gap;
      });
    } else if (subtitle) {
      ctx.font = "800 78px Arial, sans-serif";
      ctx.fillStyle = "#39424f";
      ctx.fillText(subtitle, padX, divY + 120);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 1;
    tex.needsUpdate = true;
    return tex;
  }, [title, items, subtitle, accent]);
}

export function InfoBillboard({
  position,
  title,
  items,
  subtitle,
  accent = "#6ea8d8",
  width = 12,
  hovered = false,
}: InfoBillboardProps) {
  const texture = useInfoTexture(title, items, subtitle, accent);
  const meshRef = useRef<THREE.Mesh>(null);

  const height = width * CARD_ASPECT; // keep the card from stretching

  // Smoothly grow ~1.3x while its building is hovered, mirroring the fountain.
  // Skip the work entirely once the scale has settled so idle cards are free.
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const target = hovered ? 1.3 : 1;
    if (Math.abs(mesh.scale.x - target) < 0.001) {
      if (mesh.scale.x !== target) mesh.scale.set(target, target, 1);
      return;
    }
    mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, target, 0.15);
    mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, target, 0.15);
  });

  return (
    <Billboard position={position}>
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
}

/**
 * Wraps a building together with its info card so hovering the *building*
 * (anywhere in the group) enlarges the card — same interaction as the fountain.
 */
export function BuildingBillboard({
  children,
  targetId,
  onNavigate,
  interactive = true,
  ...billboard
}: InfoBillboardProps & {
  children: ReactNode;
  /** Section id this building links to, e.g. "projects". */
  targetId?: string;
  onNavigate?: (id: string) => void;
  /**
   * Attach pointer handlers. Off at street level: pointer lock emits mousemove
   * at the mouse's polling rate and R3F raycasts the scene on every one, so an
   * empty interaction list is the difference between a raycast per event and
   * none at all.
   */
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const handlers = interactive
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        },
        onPointerOut: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (targetId) onNavigate?.(targetId);
        },
      }
    : {};

  return (
    <group {...handlers}>
      {children}
      <InfoBillboard {...billboard} hovered={hovered && interactive} />
    </group>
  );
}
