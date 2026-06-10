"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const LAYERS = [
  {
    id: "l1",
    name: "Layer 1",
    color: "#2563eb",
    children: ["Child 1", "Child 2", "Child 3"],
  },
  {
    id: "l2",
    name: "Layer 2",
    color: "#7c3aed",
    children: ["Child 1", "Child 2"],
  },
  {
    id: "l3",
    name: "Layer 3",
    color: "#db2777",
    children: ["Child 1", "Child 2"],
  },
    {
    id: "l4",
    name: "Layer 4",
    color: "#f59e0b ",
    children: ["Child 1", "Child 2"],
  },
];

// Build a flat list of "steps":
// Each child of each layer is one step.
// The crossfade from layer N → layer N+1 happens as the last child of layer N scrolls away.
//
// Total steps = sum of all children counts
// e.g. 3 + 2 + 2 = 7 steps → scroll container = 7 * 100vh tall
//
// scrollYProgress across the whole container drives everything.

const STEPS_PER_LAYER = LAYERS.map((l) => l.children.length);
const TOTAL_STEPS = STEPS_PER_LAYER.reduce((a, b) => a + b, 0);

// For each layer, compute the global step index it starts and ends at
const layerStartStep: number[] = [];
const layerEndStep: number[] = []; // inclusive last child step
let acc = 0;
for (const count of STEPS_PER_LAYER) {
  layerStartStep.push(acc);
  layerEndStep.push(acc + count - 1);
  acc += count;
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });

  // currentStep goes from 0 to TOTAL_STEPS - 1
  const currentStep = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_STEPS - 1]
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        background: "#090909",
        // scrollSnapType: "y mandatory", // optional: snap per step
      }}
    >
      {/* Scroll height driver — just creates the scroll space */}
      <div style={{ height: `${TOTAL_STEPS * 100}vh`, position: "relative" }}>
        {/* Everything is sticky, no vertical movement */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {LAYERS.map((layer, li) => {
            const start = layerStartStep[li];
            const end = layerEndStep[li];
            const childCount = layer.children.length;
            const isLast = li === LAYERS.length - 1;

            // Layer opacity:
            // - fades IN when currentStep crosses into this layer's first child
            // - fades OUT when currentStep crosses into next layer's first child
            // Use 0.5-wide fade window centered on the boundary
            const fadeHalf = 0.4;

            // Opacity input/output pairs
            let opacityInput: number[];
            let opacityOutput: number[];

            if (li === 0) {
              // First layer: always visible from start, fades out at end
              opacityInput = [end + 1 - fadeHalf, end + 1 + fadeHalf];
              opacityOutput = [1, 0];
            } else if (isLast) {
              // Last layer: fades in, never fades out
              opacityInput = [start - fadeHalf, start + fadeHalf];
              opacityOutput = [0, 1];
            } else {
              // Middle layers: fade in, fade out
              opacityInput = [
                start - fadeHalf,
                start + fadeHalf,
                end + 1 - fadeHalf,
                end + 1 + fadeHalf,
              ];
              opacityOutput = [0, 1, 1, 0];
            }

            const layerOpacity = useTransform(currentStep, opacityInput, opacityOutput, {
              clamp: true,
            });

            // Horizontal child offset:
            // currentStep goes from `start` to `end` for this layer
            // childX goes from 0% to -(childCount-1)*100%
            const childX = useTransform(
              currentStep,
              [start, end],
              ["0%", `-${(childCount - 1) * 100}%`],
              { clamp: true }
            );

            return (
              <motion.div
                key={layer.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: layerOpacity,
                  // All layers stacked at z=0, opacity controls visibility
                  zIndex: li,
                  background: layer.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // NO transform, NO translateY
                }}
              >
                {/* Layer label */}
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: "rgba(255,255,255,.55)",
                    fontSize: 13,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                  }}
                >
                  {layer.name}
                </div>

                {/* Horizontal child track */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <motion.div
                    style={{
                      display: "flex",
                      width: `${childCount * 100}vw`,
                      height: "60%",
                      x: childX,
                      flexShrink: 0,
                    }}
                  >
                    {layer.children.map((child, ci) => (
                      <div
                        key={ci}
                        style={{
                          width: "100vw",
                          flexShrink: 0,
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0 40px",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 28,
                            background: "rgba(255,255,255,.28)",
                            backdropFilter: "blur(4px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "3rem",
                            fontWeight: 700,
                            color: "white",
                            letterSpacing: "-.02em",
                          }}
                        >
                          {child}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Step dots */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 40,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  {layer.children.map((_, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.4)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}