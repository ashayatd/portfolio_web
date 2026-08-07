"use client";

// InfoBoard.tsx — zoo-style interpretation signs.
//
// A park sign works because you read it standing in front of the thing it
// describes. That only happens at street level, so these render in explore
// mode only — from the docked camera they'd be a smudge a few pixels tall.
//
// Text is baked into a canvas texture rather than drawn with <Text>: one
// draw call per board instead of one per glyph.

import { useMemo } from "react";
import * as THREE from "three";
import { SOLID } from "./Obstacles";

interface BoardContent {
  title: string;
  /** The italic line, like a species name under the common name. */
  subtitle: string;
  body: string[];
  accent: string;
}

const BOARD_W = 1024;
const BOARD_H = 640;
/** Plane size in world units. Matches the canvas aspect so text isn't stretched. */
const PLANE_W = 2.6;
const PLANE_H = PLANE_W * (BOARD_H / BOARD_W);

/** Raised plot surface — every board stands on one. */
const PLOT_Y = 0.13;
/** Height of the board's lower edge: roughly chest height on a 1.83 model. */
const BOARD_BOTTOM = 1.05;
/** Signs lean back slightly, like the real thing. */
const TILT = -0.12;

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

function useBoardTexture(content: BoardContent) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = BOARD_W;
    canvas.height = BOARD_H;
    const ctx = canvas.getContext("2d")!;

    // Dark board, so it reads as signage against a bright white city.
    roundRect(ctx, 0, 0, BOARD_W, BOARD_H, 26);
    ctx.fillStyle = "#1f2937";
    ctx.fill();

    roundRect(ctx, 10, 10, BOARD_W - 20, BOARD_H - 20, 18);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.stroke();

    // Accent header strip, matching the building it stands in front of.
    roundRect(ctx, 10, 10, BOARD_W - 20, 74, 18);
    ctx.fillStyle = content.accent;
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.font = "800 44px Arial, sans-serif";
    ctx.fillStyle = "#0b1220";
    ctx.letterSpacing = "3px";
    ctx.fillText(content.title.toUpperCase(), 44, 48);
    ctx.letterSpacing = "0px";

    ctx.font = "italic 600 34px Georgia, serif";
    ctx.fillStyle = content.accent;
    ctx.fillText(content.subtitle, 44, 146);

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(44, 186);
    ctx.lineTo(BOARD_W - 44, 186);
    ctx.stroke();

    ctx.font = "400 33px Arial, sans-serif";
    ctx.fillStyle = "#d7dce4";
    content.body.forEach((line, i) => {
      ctx.fillText(line, 44, 238 + i * 50);
    });

    // Footer hint, mirroring the on-screen prompt.
    ctx.font = "700 27px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("PRESS  E  TO OPEN", 44, BOARD_H - 52);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [content]);
}

function Board({
  position,
  rotation,
  content,
}: {
  position: [number, number, number];
  rotation: number;
  content: BoardContent;
}) {
  const texture = useBoardTexture(content);
  const postH = BOARD_BOTTOM + PLANE_H * 0.55;

  return (
    <group position={position} rotation={[0, rotation, 0]} {...SOLID}>
      {[-PLANE_W * 0.34, PLANE_W * 0.34].map((x) => (
        <mesh key={x} position={[x, postH / 2, 0]}>
          <cylinderGeometry args={[0.055, 0.065, postH, 8]} />
          <meshLambertMaterial color="#4b5563" />
        </mesh>
      ))}

      <group
        position={[0, BOARD_BOTTOM + PLANE_H / 2, 0.06]}
        rotation={[TILT, 0, 0]}
      >
        {/* Backing panel, so the sign has thickness from an angle. */}
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[PLANE_W + 0.08, PLANE_H + 0.08, 0.06]} />
          <meshLambertMaterial color="#374151" />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[PLANE_W, PLANE_H]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * One board per building, set on the plot between the plaza and the building
 * and turned to face the plaza — you meet it head-on walking up the road.
 */
const BOARDS: {
  position: [number, number, number];
  content: BoardContent;
}[] = [
  {
    position: [0, PLOT_Y, -14],
    content: {
      title: "Experience",
      subtitle: "Full-stack engineering, 2023 — present",
      body: [
        "Two years building and shipping production",
        "systems on the MERN stack — REST APIs,",
        "backend services and the interfaces on top.",
      ],
      accent: "#8B5CF6",
    },
  },
  {
    position: [0, PLOT_Y, 14],
    content: {
      title: "Technology",
      subtitle: "The tools behind the work",
      body: [
        "Frontend, backend and DevOps — React and",
        "Next.js through Node, MongoDB and Docker,",
        "deployed and maintained end to end.",
      ],
      accent: "#5A8A5A",
    },
  },
  {
    position: [-14, PLOT_Y, 0],
    content: {
      title: "Projects",
      subtitle: "Seven shipped, and counting",
      body: [
        "Production web applications built full-stack,",
        "from first schema to live deployment —",
        "each one running for real users.",
      ],
      accent: "#69b9fa",
    },
  },
  {
    position: [14, PLOT_Y, 0],
    content: {
      title: "Skills",
      subtitle: "What I reach for first",
      body: [
        "React · Next.js · Node.js · Express",
        "MongoDB · Redis · Docker · AWS",
        "TypeScript across the whole stack.",
      ],
      accent: "#f4a261",
    },
  },
];

export function InfoBoards() {
  return (
    <group>
      {BOARDS.map((b, i) => (
        <Board
          key={i}
          position={b.position}
          // Turn each board to face the plaza at the origin.
          rotation={Math.atan2(-b.position[0], -b.position[2])}
          content={b.content}
        />
      ))}
    </group>
  );
}
