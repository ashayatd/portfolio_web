// ============================================================
// Timeline.ts — User-Designed Camera Path (from debug logs)
// ============================================================
// PATH DIRECTION: Left side of road (north side, z ≈ -2 to -3)
// The camera travels west-to-east along the building side, then
// turns to face the factory facade at the end.
//
// SCENE REFERENCE:
//   Road:      along world X, centered at z ≈ 5  (x: -37 → +37)
//   BuildingB: [25, 0, -26]  ← HERO factory with facade text
//   BuildingC: [-18, 0, -16.9]
//   BuildingA: [0, 0, -20.55]
//   Church:    [25, 0, 16]
//
// USER LOGS (mapped to keypoints):
//   1. overview_high    [-32.88, 38.76, 41.79]  → overview
//   2. descend_road      [-29.12, 14.82, 16.42]  → angled descent
//   3. road_visible      [-33.76, 3.44, 2.11]   → road first visible
//   4. traveller_start   [-35.21, 1.82, -2.31]  → start traveling (left side)
//   5. traveling_mid1    [-4.78, 1.82, -2.39]   → mid road
//   6. traveling_mid2    [12.94, 1.82, -2.75]   → approaching hero
//   7. road_end          [23.3, 1.82, -2.62]   → end of road travel
//   8. glance_factory    [23.3, 1.82, -2.62]   → turn to look at factory
//   9. face_factory      [25.16, 7.37, -3.42]  → facing facade text
//   10. final_hold       [25.08, 7.37, -5.13]  → final resting position
// ============================================================

export type Vector3Tuple = [number, number, number];

export interface CameraPoint {
  name: string;
  stage: number;
  /** Global timeline position 0–1 (maps to scroll progress) */
  t: number;
  position: Vector3Tuple;
  target: Vector3Tuple;
  /** Optional: field of view for dramatic zooms (default 50) */
  fov?: number;
}

export interface CameraSample {
  index: number;
  nextIndex: number;
  t: number;
  segmentName: string;
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
}

// ── HERO BUILDING REFERENCE ───────────────────────────────────────────────
// BuildingB is the factory with "BUILDING SCALABLE SYSTEMS" text.
// The facade faces +Z (toward the road).
export const HERO_BUILDING_POS: Vector3Tuple = [25, 0, -26];
export const HERO_TARGET: Vector3Tuple = [25, 8, -12];  // Text center in world space
export const HERO_FACADE_Z = -12;

// ── CAMERA PATH (built from user debug logs) ─────────────────────────────
// The camera stays on the LEFT (north) side of the road throughout.
// z ≈ -2 to -3 keeps buildings on the north side in frame.
//
// STAGE BREAKDOWN:
//   Stage 1 (0.00-0.15): Overview — high angled shot
//   Stage 2 (0.15-0.25): Descent — drop toward road level
//   Stage 3 (0.25-0.35): Entry — road becomes visible
//   Stage 4 (0.35-0.75): Traveling — glide along left side of road
//   Stage 5 (0.75-0.85): Turn — pivot to face factory facade
//   Stage 6 (0.85-1.00): Hero Hold — frame the text

export const CAMERA_POINTS: CameraPoint[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 1: OVERVIEW (0.00 → 0.15)
  // From user log: "default position"
  // High, wide, angled view of the entire city
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "overview_high",
    stage: 1,
    t: 0.00,
    position: [-32.88, 38.76, 41.79],
    target: [-27.7, 34.33, 34.48],
    fov: 60,
  },
  {
    name: "overview_angled",
    stage: 1,
    t: 0.10,
    position: [-30.5, 28.0, 30.0],
    target: [-25.0, 20.0, 20.0],
    fov: 55,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 2: DESCENT (0.15 → 0.25)
  // From user log: "after scrolled camera towards, road"
  // Camera drops down, road comes into view
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "descent_start",
    stage: 2,
    t: 0.15,
    position: [-29.12, 14.82, 16.42],
    target: [-28.95, 9.79, 7.77],
    fov: 50,
  },
  {
    name: "descent_end",
    stage: 2,
    t: 0.25,
    position: [-31.5, 6.0, 5.0],
    target: [-30.0, 2.0, -2.0],
    fov: 50,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 3: ROAD ENTRY (0.25 → 0.35)
  // From user log: "road visible"
  // Camera reaches road level, road is now clearly visible
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "road_entry",
    stage: 3,
    t: 0.30,
    position: [-33.76, 3.44, 2.11],
    target: [-31.35, -2.41, -5.63],
    fov: 50,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 4: TRAVELING (0.35 → 0.75)
  // From user logs: "traveller view", "traveling", "reached but still on road"
  // Camera glides along the LEFT side of the road (z ≈ -2 to -3).
  // This keeps the buildings on the north side in view.
  // Target looks slightly ahead to create forward momentum.
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "travel_start",
    stage: 4,
    t: 0.35,
    position: [-35.21, 1.82, -2.31],
    target: [-25.32, 2.33, -3.71],
    fov: 50,
  },
  {
    name: "travel_west",
    stage: 4,
    t: 0.42,
    position: [-25.0, 1.82, -2.35],
    target: [-15.0, 1.5, -2.5],
    fov: 50,
  },
  {
    name: "travel_mid1",
    stage: 4,
    t: 0.50,
    position: [-4.78, 1.82, -2.39],
    target: [5.17, 0.81, -2.39],
    fov: 50,
  },
  {
    name: "travel_mid2",
    stage: 4,
    t: 0.60,
    position: [12.94, 1.82, -2.75],
    target: [22.9, 0.97, -2.28],
    fov: 50,
  },
  {
    name: "travel_east",
    stage: 4,
    t: 0.70,
    position: [20.0, 1.82, -2.65],
    target: [30.0, 0.5, -2.8],
    fov: 50,
  },
  {
    name: "travel_end",
    stage: 4,
    t: 0.75,
    position: [23.3, 1.82, -2.62],
    target: [33.17, 0.27, -2.85],
    fov: 50,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 5: TURN TO FACTORY (0.75 → 0.85)
  // From user logs: "watching building c means target factory",
  // "watching the factory heading means name"
  // Camera pivots from looking east to looking at the factory facade.
  // Position stays roughly same, target swings to face the building.
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "turn_start",
    stage: 5,
    t: 0.78,
    position: [23.3, 1.82, -2.62],
    target: [24.77, 6.16, -11.51],
    fov: 48,
  },
  {
    name: "turn_face",
    stage: 5,
    t: 0.85,
    position: [25.16, 7.37, -3.42],
    target: [25.14, 7.56, -13.42],
    fov: 45,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 6: HERO HOLD (0.85 → 1.00)
  // From user log: "final where shot end"
  // Camera settles into final position facing the facade text.
  // Minimal movement, stable framing for readability.
  // ═══════════════════════════════════════════════════════════════════════
  {
    name: "hero_approach",
    stage: 6,
    t: 0.90,
    position: [25.12, 7.37, -4.0],
    target: [25.16, 7.5, -14.0],
    fov: 42,
  },
  {
    name: "hero_final",
    stage: 6,
    t: 1.00,
    position: [25.08, 7.37, -5.13],
    target: [25.18, 7.46, -15.12],
    fov: 40,
  },
];

// ── UTILITY FUNCTIONS ─────────────────────────────────────────────────────

/** Clamp value between 0 and 1 */
function clampProgress(p: number): number {
  return Math.max(0, Math.min(1, p));
}

/** Linear interpolation between two numbers */
function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth ease-in-out for natural acceleration/deceleration */
export function easeInOut(t: number): number {
  // Cubic ease-in-out: smooth start, smooth stop
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Find which segment the current progress falls into */
function findSegmentIndex(points: CameraPoint[], progress: number): number {
  const p = clampProgress(progress);

  if (p <= points[0].t) return 0;

  for (let i = 0; i < points.length - 1; i++) {
    if (p >= points[i].t && p <= points[i + 1].t) return i;
  }

  return points.length - 2;
}

// ── MAIN SAMPLING FUNCTION ────────────────────────────────────────────────
/**
 * Get interpolated camera state at a given progress (0-1).
 * Called every frame during scroll animation.
 */
export function getCameraSample(
  points: CameraPoint[],
  progress: number,
): CameraSample {
  const fallback: CameraPoint = {
    name: "fallback",
    stage: 0,
    t: 0,
    position: [-32.88, 38.76, 41.79],
    target: [-27.7, 34.33, 34.48],
    fov: 60,
  };

  if (points.length <= 1) {
    const p = points[0] ?? fallback;
    return {
      index: 0,
      nextIndex: 0,
      t: 0,
      segmentName: p.name,
      position: [...p.position] as Vector3Tuple,
      target: [...p.target] as Vector3Tuple,
      fov: p.fov ?? 50,
    };
  }

  const index = findSegmentIndex(points, progress);
  const next = index + 1;
  const cur = points[index];
  const nxt = points[next];

  // Calculate local progress within this segment (0-1)
  const span = nxt.t - cur.t;
  const rawT = span <= 0 ? 0 : (clampProgress(progress) - cur.t) / span;

  // Apply easing for smooth acceleration through the segment
  const t = easeInOut(rawT);

  return {
    index,
    nextIndex: next,
    t,
    segmentName: `${cur.name} → ${nxt.name}`,
    position: [
      lerpNum(cur.position[0], nxt.position[0], t),
      lerpNum(cur.position[1], nxt.position[1], t),
      lerpNum(cur.position[2], nxt.position[2], t),
    ],
    target: [
      lerpNum(cur.target[0], nxt.target[0], t),
      lerpNum(cur.target[1], nxt.target[1], t),
      lerpNum(cur.target[2], nxt.target[2], t),
    ],
    fov: lerpNum(cur.fov ?? 50, nxt.fov ?? 50, t),
  };
}

// ── DEBUG HELPERS ─────────────────────────────────────────────────────────

/** Generate line segments for visualizing the camera path in 3D */
export function getCameraPathPositions(
  points: CameraPoint[] = CAMERA_POINTS,
): Float32Array {
  const out = new Float32Array((points.length - 1) * 6);
  let o = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i].position;
    const b = points[i + 1].position;
    out[o++] = a[0];
    out[o++] = a[1];
    out[o++] = a[2];
    out[o++] = b[0];
    out[o++] = b[1];
    out[o++] = b[2];
  }

  return out;
}

// ── STAGE RANGES FOR UI/PROGRESS INDICATORS ───────────────────────────────

export const STAGE_RANGES: Record<number, [number, number]> = {
  1: [0.00, 0.15],  // Overview
  2: [0.15, 0.25],  // Descent
  3: [0.25, 0.35],  // Road Entry
  4: [0.35, 0.75],  // Traveling (left side)
  5: [0.75, 0.85],  // Turn to Factory
  6: [0.85, 1.00],  // Hero Hold
};

export function getStage(progress: number): number {
  for (const [stage, [start, end]] of Object.entries(STAGE_RANGES)) {
    if (progress >= start && progress < end) return Number(stage);
  }
  return 6; // Default to final stage
}