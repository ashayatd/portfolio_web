"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";

interface FountainProps {
  position?: [number, number, number];
  /** Section id this monument links to (e.g. "about"). */
  targetId?: string;
  onNavigate?: (id: string) => void;
  /** Attach pointer handlers — off at street level, see BuildingBillboard. */
  interactive?: boolean;
}

const COLOR = {
  pedestal: "#dcdcdc",
  pedestalDark: "#cfcfcf",
  shaft: "#f3f3f3",
  panel: "#fbfbfb",
  trim: "#b7c4d4",
  accent: "#6ea8d8",
  cornice: "#e4e7ec",
  finial: "#5b9bd5",
};

/* ------------------------------------------------------------------ */
/* Name plaque texture — stacked monogram + ASHAY / TAMRAKAR hero     */
/* ------------------------------------------------------------------ */
function useNameTexture() {
  return useMemo(() => {
    const W = 900;
    const H = 2048;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Subtle vertical gradient background (clean, premium)
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#f4f6f9");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cx = W / 2;
    const maxTextW = W * 0.84;

    // --- Monogram medallion at the top ---
    const medY = 360;
    const medR = 175;
    ctx.beginPath();
    ctx.arc(cx, medY, medR, 0, Math.PI * 2);
    ctx.fillStyle = "#eef3f9";
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#6ea8d8";
    ctx.stroke();
    // inner ring
    ctx.beginPath();
    ctx.arc(cx, medY, medR - 30, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#b7c4d4";
    ctx.stroke();
    // "AT" monogram
    ctx.fillStyle = "#3f6f9c";
    ctx.font = "900 190px Georgia, 'Times New Roman', serif";
    ctx.fillText("AT", cx, medY + 8);

    // helper: largest font that fits a word into maxWidth
    const fitFont = (word: string, weight: number, cap: number) => {
      let size = cap;
      ctx.font = `${weight} ${size}px Arial, sans-serif`;
      while (ctx.measureText(word).width > maxTextW && size > 10) {
        size -= 4;
        ctx.font = `${weight} ${size}px Arial, sans-serif`;
      }
      return size;
    };

    // Use the wider of the two words to lock a shared hero size
    const nameSize = Math.min(
      fitFont("TAMRAKAR", 900, 230),
      fitFont("ASHAY", 900, 230),
    );

    // --- ASHAY ---
    ctx.font = `900 ${nameSize}px Arial, sans-serif`;
    ctx.fillStyle = "#161a1f";
    ctx.fillText("ASHAY", cx, 920);

    // --- TAMRAKAR ---
    ctx.fillText("TAMRAKAR", cx, 920 + nameSize + 50);

    // --- accent divider ---
    const divY = 920 + nameSize + 50 + nameSize / 2 + 110;
    ctx.fillStyle = "#6ea8d8";
    ctx.fillRect(cx - 230, divY, 460, 10);

    // --- subtitle (small, secondary) ---
    // Stacked: the plaque is a tall 900px-wide canvas, and the title on one
    // line overran it — the ends were being cut off ("ULL STACK DEVELOPE").
    ctx.fillStyle = "#5a6573";
    ctx.font = "600 86px Arial, sans-serif";
    ["FULL STACK", "DEVELOPER"].forEach((line, i) => {
      ctx.fillText(line, cx, divY + 110 + i * 104);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* ------------------------------------------------------------------ */
/* Bird's-eye banner texture — big name on a clean card, camera-facing */
/* ------------------------------------------------------------------ */
function useNameBannerTexture() {
  return useMemo(() => {
    const W = 2048;
    const H = 700;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Accent palette (matches the monument's blue) + tint helpers.
    const accent = COLOR.finial; // #5b9bd5
    const hex = accent.replace("#", "");
    const rr0 = parseInt(hex.slice(0, 2), 16);
    const gg0 = parseInt(hex.slice(2, 4), 16);
    const bb0 = parseInt(hex.slice(4, 6), 16);
    const tint = (a: number) => `rgba(${rr0}, ${gg0}, ${bb0}, ${a})`;
    const ink = `rgb(${(rr0 * 0.5) | 0}, ${(gg0 * 0.5) | 0}, ${(bb0 * 0.5) | 0})`;

    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const m = 26;
    const cardW = W - m * 2;
    const cardH = H - m * 2;
    const radius = 80;
    const cx = W / 2;

    // Card body — white→accent tint with a soft drop shadow.
    ctx.save();
    ctx.shadowColor = "rgba(30, 41, 59, 0.28)";
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 20;
    const bg = ctx.createLinearGradient(0, m, 0, H - m);
    bg.addColorStop(0, "rgba(255,255,255,0.98)");
    bg.addColorStop(1, tint(0.1));
    roundRect(m, m, cardW, cardH, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.restore();

    // Accent border.
    roundRect(m, m, cardW, cardH, radius);
    ctx.lineWidth = 4;
    ctx.strokeStyle = tint(0.35);
    ctx.stroke();

    // Accent top bar, clipped to the rounded top.
    ctx.save();
    roundRect(m, m, cardW, cardH, radius);
    ctx.clip();
    const bar = ctx.createLinearGradient(m, 0, W - m, 0);
    bar.addColorStop(0, tint(0.95));
    bar.addColorStop(1, tint(0.5));
    ctx.fillStyle = bar;
    ctx.fillRect(m, m, cardW, 16);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ── Eyebrow pill: dot + PORTFOLIO ──
    ctx.font = "700 52px Arial, sans-serif";
    const eLabel = "PORTFOLIO";
    const eTextW = ctx.measureText(eLabel).width;
    const eDot = 16;
    const ePadX = 40;
    const eGap = 22;
    const ePillW = ePadX * 2 + eDot * 2 + eGap + eTextW;
    const eH = 80;
    const eX = cx - ePillW / 2;
    const eY = 130;
    roundRect(eX, eY - eH / 2, ePillW, eH, eH / 2);
    ctx.fillStyle = tint(0.14);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = tint(0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(eX + ePadX + eDot, eY, eDot, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    ctx.fillText(eLabel, eX + ePadX + eDot * 2 + eGap, eY + 2);

    // ── Name ──
    ctx.textAlign = "center";
    const maxTextW = W * 0.86;
    const fitFont = (word: string, weight: number, cap: number) => {
      let size = cap;
      ctx.font = `${weight} ${size}px Arial, sans-serif`;
      while (ctx.measureText(word).width > maxTextW && size > 10) {
        size -= 4;
        ctx.font = `${weight} ${size}px Arial, sans-serif`;
      }
      return size;
    };
    const nameSize = fitFont("ASHAY TAMRAKAR", 900, 250);
    ctx.font = `900 ${nameSize}px Arial, sans-serif`;
    ctx.fillStyle = "#161a1f";
    ctx.fillText("ASHAY TAMRAKAR", cx, 370);

    // ── Accent underline ──
    roundRect(cx - 200, 480, 400, 8, 4);
    ctx.fillStyle = tint(0.7);
    ctx.fill();

    // ── Subtitle ──
    ctx.fillStyle = "#5a6573";
    ctx.font = "700 88px Arial, sans-serif";
    ctx.fillText("FULL STACK DEVELOPER", cx, 565);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 1;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* ------------------------------------------------------------------ */
/* The directional stele: shaft + inset plaque + cornice + finial     */
/* ------------------------------------------------------------------ */
function Stele({ texture }: { texture: THREE.Texture }) {
  const slabW = 3.4;
  const slabH = 7.5;
  const slabD = 0.85;
  const slabBottom = 1.95;
  const slabCenter = slabBottom + slabH / 2; // 5.7
  const slabTop = slabBottom + slabH; // 9.45

  return (
    <group rotation={[0, 1, 0]}>
      {/* Plinth — transition block from pedestal to shaft */}
      <mesh position={[0, slabBottom - 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.6, 1.3]} />
        <meshStandardMaterial color={COLOR.pedestalDark} roughness={0.7} />
      </mesh>

      {/* Main shaft (stele) */}
      <mesh position={[0, slabCenter, 0]} castShadow receiveShadow>
        <boxGeometry args={[slabW, slabH, slabD]} />
        <meshStandardMaterial
          color={COLOR.shaft}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* Side pilasters — architectural verticals */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * (slabW / 2 - 0.02), slabCenter, 0]}
          castShadow
        >
          <boxGeometry args={[0.22, slabH + 0.1, slabD + 0.18]} />
          <meshStandardMaterial color={COLOR.trim} roughness={0.55} />
        </mesh>
      ))}

      {/* Inset plaque + text — front and back */}
      {[1, -1].map((face) => (
        <group key={face}>
          {/* recessed panel */}
          <mesh position={[0, slabCenter, face * (slabD / 2 + 0.015)]}>
            <boxGeometry args={[slabW - 0.55, slabH - 0.5, 0.05]} />
            <meshStandardMaterial color={COLOR.panel} roughness={0.4} />
          </mesh>
          {/* text */}
          <mesh
            position={[0, slabCenter, face * (slabD / 2 + 0.05)]}
            rotation={[0, face === 1 ? 0 : Math.PI, 0]}
          >
            <planeGeometry args={[slabW - 0.7, slabH - 0.65]} />
            <meshBasicMaterial map={texture} transparent />
          </mesh>
        </group>
      ))}

      {/* Stepped cornice (distinct cap silhouette) */}
      <mesh position={[0, slabTop + 0.175, 0]} castShadow>
        <boxGeometry args={[slabW + 0.4, 0.35, slabD + 0.3]} />
        <meshStandardMaterial color={COLOR.cornice} roughness={0.5} />
      </mesh>
      <mesh position={[0, slabTop + 0.5, 0]} castShadow>
        <boxGeometry args={[slabW - 0.6, 0.3, slabD - 0.05]} />
        <meshStandardMaterial color={COLOR.cornice} roughness={0.5} />
      </mesh>

      {/* Finial post */}
      <mesh position={[0, slabTop + 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.2, 0.8, 16]} />
        <meshStandardMaterial
          color={COLOR.trim}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Glowing faceted finial — tech crystal beacon */}
      <mesh position={[0, slabTop + 2.0, 0]} castShadow>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={COLOR.finial}
          emissive={COLOR.accent}
          emissiveIntensity={0.9}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>
      <pointLight
        position={[0, slabTop + 2.0, 0]}
        color={COLOR.accent}
        intensity={6}
        distance={9}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Public component — kept named `Fountain` to preserve imports        */
/* ------------------------------------------------------------------ */
// Base banner size and the enlarged size shown on hover.
const BANNER_W = 12;
const BANNER_H = 4.1;
const HOVER_SCALE_X = 16 / BANNER_W; // -> 16 wide
const HOVER_SCALE_Y = 6.1 / BANNER_H; // -> 6.1 tall

export function Fountain({
  position = [0, 1.0, 0],
  targetId,
  onNavigate,
  interactive = true,
}: FountainProps) {
  const texture = useNameTexture();
  const banner = useNameBannerTexture();

  const [hovered, setHovered] = useState(false);
  const bannerRef = useRef<THREE.Mesh>(null);

  // Smoothly ease the banner toward its target size each frame. Skip the work
  // entirely once it has settled, so an idle monument costs nothing.
  useFrame(() => {
    const mesh = bannerRef.current;
    if (!mesh) return;
    const tx = hovered ? HOVER_SCALE_X : 1;
    const ty = hovered ? HOVER_SCALE_Y : 1;
    if (Math.abs(mesh.scale.x - tx) < 0.001) {
      if (mesh.scale.x !== tx) mesh.scale.set(tx, ty, 1);
      return;
    }
    mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, tx, 0.15);
    mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, ty, 0.15);
  });

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
    <group position={position} {...handlers}>
      {/* Camera-facing name banner — readable from the bird's-eye view */}
      <Billboard position={[0, 13.5, 0]}>
        <mesh ref={bannerRef}>
          <planeGeometry args={[BANNER_W, BANNER_H]} />
          <meshBasicMaterial
            map={banner}
            transparent
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      {/* Round layered pedestal — civic base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.3, 0.5, 48]} />
        <meshStandardMaterial color={COLOR.pedestal} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.725, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.85, 1.9, 0.45, 48]} />
        <meshStandardMaterial color={COLOR.pedestalDark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.5, 0.4, 48]} />
        <meshStandardMaterial color={COLOR.pedestal} roughness={0.6} />
      </mesh>

      {/* Subtle accent ring on the pedestal */}
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 48]} />
        <meshStandardMaterial
          color={COLOR.accent}
          emissive={COLOR.accent}
          emissiveIntensity={0.25}
          roughness={0.4}
        />
      </mesh>

      {/* Directional monument */}
      <Stele texture={texture} />
    </group>
  );
}
