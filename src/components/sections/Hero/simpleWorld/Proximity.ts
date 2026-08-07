"use client";

// Proximity.ts — the landmarks you can walk up to, and what each one says.
//
// Single source of truth for zone geometry AND copy: the physical sign in the
// world and the panel that opens on E were drifting apart when each kept its
// own text.

export interface Zone {
  /** Section id on the page, for the "view full section" jump. */
  id: string;
  label: string;
  /** Centre in city-local space — the same space the character moves in. */
  x: number;
  z: number;
  /** How close you must get. Tuned per landmark, not one global number. */
  radius: number;
  accent: string;
  /** The italic line, like a species name under the common name. */
  subtitle: string;
  /** Sign copy — kept short enough to read at a glance while walking. */
  body: string[];
  /** Chips shown in the panel. */
  tags: string[];
  /** Where its physical board stands, if it has one. */
  boardPos?: [number, number];
}

/**
 * Radii stop well short of the halfway point to the plaza (10.5 units) so no
 * two zones can overlap and flicker as you cross the middle.
 */
export const ZONES: Zone[] = [
  {
    id: "experience",
    label: "Experience",
    x: 0,
    z: -21,
    radius: 9,
    accent: "#8B5CF6",
    subtitle: "Full-stack engineering, 2023 — present",
    body: [
      "Two years building and shipping production",
      "systems on the MERN stack — REST APIs,",
      "backend services and the interfaces on top.",
    ],
    tags: ["2+ Years", "MERN Stack", "Backend", "REST APIs"],
    boardPos: [0, -14],
  },
  {
    id: "tech",
    label: "Technology",
    x: 0,
    z: 21,
    radius: 9,
    accent: "#5A8A5A",
    subtitle: "The tools behind the work",
    body: [
      "Frontend, backend and DevOps — React and",
      "Next.js through Node, MongoDB and Docker,",
      "deployed and maintained end to end.",
    ],
    tags: ["Frontend", "Backend", "DevOps", "Docker"],
    boardPos: [0, 14],
  },
  {
    id: "projects",
    label: "Projects",
    x: -21,
    z: 0,
    radius: 9,
    accent: "#69b9fa",
    subtitle: "Seven shipped, and counting",
    body: [
      "Production web applications built full-stack,",
      "from first schema to live deployment —",
      "each one running for real users.",
    ],
    tags: ["7+ Shipped", "Production", "Full-Stack", "Web Apps"],
    boardPos: [-14, 0],
  },
  {
    id: "skills",
    label: "Skills",
    x: 21,
    z: -2.5,
    radius: 9,
    accent: "#f4a261",
    subtitle: "What I reach for first",
    body: [
      "React · Next.js · Node.js · Express",
      "MongoDB · Redis · Docker · AWS",
      "TypeScript across the whole stack.",
    ],
    tags: ["React", "Next.js", "Node.js", "MongoDB", "Docker", "AWS"],
    boardPos: [14, 0],
  },
  {
    // Tighter radius: the monument sits at the origin, and a wide one would
    // trigger every time you crossed the roundabout.
    id: "about",
    label: "About",
    x: 0,
    z: 0,
    radius: 6,
    accent: "#5b9bd5",
    subtitle: "Ashay Tamrakar — Full Stack Developer",
    body: [
      "The monument at the centre of the campus.",
      "Everything around you is one part of the",
      "same portfolio — start anywhere.",
    ],
    tags: ["Full Stack", "Product-minded", "Always Learning"],
  },
];

/** Closest zone whose radius contains the point, or null. */
export function nearestZone(x: number, z: number): Zone | null {
  let best: Zone | null = null;
  let bestDist = Infinity;
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.x, z - zone.z);
    if (d < zone.radius && d < bestDist) {
      best = zone;
      bestDist = d;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Emitter                                                             */
/* ------------------------------------------------------------------ */
// The character's position changes constantly, so this stays out of React
// state until the zone actually changes — otherwise every step would
// re-render the whole 3D tree.

type Listener = (zone: Zone | null) => void;
let listener: Listener | null = null;
let current: Zone | null = null;

export function subscribeNearby(fn: Listener) {
  listener = fn;
  fn(current);
  return () => {
    if (listener === fn) listener = null;
  };
}

/** Emits only on change of zone. */
export function publishNearby(zone: Zone | null) {
  if (zone?.id === current?.id) return;
  current = zone;
  listener?.(zone);
}

/** Clears state when leaving the city, so a stale prompt can't reappear. */
export function resetNearby() {
  current = null;
  listener?.(null);
}
