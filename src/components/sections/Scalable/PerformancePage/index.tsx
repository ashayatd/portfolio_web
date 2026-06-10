"use client";

import React, { useState } from "react";
import {
  ChallengePanel,
  MetricsPanel,
  MetricRow,
  SimPanel,
  styles,
} from "../shared";

// Simple theme constants
const C = {
  bg: "#0D0F10",
  surface: "#151819",
  elevated: "#1B1F20",
  accent: "#1F8F5F",
  glow: "#2EB67D",
  text: "#F5F7F7",
  text2: "#A5B0AD",
  muted: "#6B7472",
  border: "rgba(255,255,255,0.06)",
  danger: "#E74C3C",
};

type PerfStep = 0 | 1 | 2 | 3;

// Individual slider component
function StepSlider({
  index,
  label,
  isUnlocked,
  onUnlock,
  onLock,
  before,
  after,
}: {
  index: number;
  label: string;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  before: string;
  after: string;
}) {
  const [dragVal, setDragVal] = useState(isUnlocked ? 1 : 0);
  const [animatedDragVal, setAnimatedDragVal] = useState(isUnlocked ? 1 : 0);
  const targetDragRef = React.useRef(isUnlocked ? 1 : 0);
  const frameRef = React.useRef<number>(null);

  // Smooth animation for drag value
  React.useEffect(() => {
    targetDragRef.current = dragVal;
    const duration = 600; // 600ms smooth ease
    const startTime = performance.now();
    const startValue = animatedDragVal;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetDragRef.current - startValue) * eased;
      setAnimatedDragVal(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [dragVal]);

  // Sync dragVal when isUnlocked changes externally
  React.useEffect(() => {
    setDragVal(isUnlocked ? 1 : 0);
  }, [isUnlocked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDragVal(val);

    // Unlock when dragged past 80% to the right
    if (val >= 0.8 && !isUnlocked) {
      onUnlock();
    }
    // Lock when dragged back past 20% to the left
    if (val <= 0.2 && isUnlocked) {
      onLock();
    }
  };

  const handleRelease = () => {
    if (dragVal >= 0.5) {
      setDragVal(1);
      if (!isUnlocked) onUnlock();
    } else {
      setDragVal(0);
      if (isUnlocked) onLock();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Step label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: isUnlocked ? C.glow : C.text2,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            transition: "color 0.3s",
          }}
        >
          {index + 1}. {label}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isUnlocked ? C.glow : C.muted,
            transition: "color 0.3s",
          }}
        >
          {isUnlocked ? after : before}
        </span>
      </div>

      {/* Slider track */}
      <div
        style={{
          position: "relative",
          height: 48,
          borderRadius: 24,
          background: C.bg,
          border: `2px solid ${isUnlocked ? C.accent : C.border}`,
          overflow: "hidden",
          userSelect: "none",
          transition: "border-color 0.3s",
        }}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
      >
        {/* Labels inside track */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: animatedDragVal < 0.3 ? C.danger : C.muted,
              textTransform: "uppercase",
              transition: "color 0.3s",
            }}
          >
            {before}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: animatedDragVal > 0.7 ? C.glow : C.muted,
              textTransform: "uppercase",
              transition: "color 0.3s",
            }}
          >
            {after}
          </span>
        </div>

        {/* Active fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${animatedDragVal * 100}%`,
            background: isUnlocked
              ? `linear-gradient(90deg, ${C.accent}15, ${C.glow}15)`
              : `linear-gradient(90deg, ${C.danger}15, transparent)`,
            transition: "background 0.3s",
          }}
        />

        {/* Track line */}
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            top: "50%",
            transform: "translateY(-50%)",
            height: 2,
            borderRadius: 1,
            background: `linear-gradient(90deg, ${C.danger}33, ${C.accent}33, ${C.glow}33)`,
          }}
        />

        {/* Ball with smooth animation */}
        {(() => {
          // Smooth interpolation for glow color and size
          let glowColor = C.danger;
          let innerColor = C.danger;
          let glowSize = 12;
          let outerGlowSize = 24;

          if (animatedDragVal > 0.3) {
            glowColor = animatedDragVal > 0.7 ? C.glow : C.accent;
            innerColor = animatedDragVal > 0.7 ? C.glow : C.accent;
            glowSize = 12 + (animatedDragVal > 0.7 ? 4 : 0);
            outerGlowSize = 24 + (animatedDragVal > 0.7 ? 8 : 0);
          }

          return (
            <div
              style={{
                position: "absolute",
                left: `calc(${animatedDragVal * 100}% - ${animatedDragVal * 36}px)`,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "transparent",
                border: `2px solid ${glowColor}`,
                boxShadow: `0 0 ${glowSize}px ${glowColor}, 0 0 ${outerGlowSize}px ${glowColor}44, inset 0 0 ${Math.max(glowSize - 4, 2)}px ${glowColor}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: innerColor,
                  boxShadow: `0 0 6px ${innerColor}`,
                }}
              />
            </div>
          );
        })()}

        {/* Invisible input */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={dragVal}
          onChange={handleChange}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "grab",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}

export default function PerformanceBlock() {
  const [step, setStep] = useState<PerfStep>(0);

  const steps = [
    {
      label: "Nested Queries",
      before: "N+1 Problem",
      after: "Eager Load",
      desc: "Eliminated N+1 by eager loading associations",
    },
    {
      label: "Full Table Scans",
      before: "No Pagination",
      after: "Paginated",
      desc: "Added limit/offset with cursor-based pagination",
    },
    {
      label: "Over-fetching",
      before: "All Fields",
      after: "Selective",
      desc: "Selective field retrieval with GraphQL-like queries",
    },
    {
      label: "Query Optimization",
      before: "90s Load",
      after: "300ms",
      desc: "Composite indexes, query plan analysis, caching layer",
    },
  ];

  const times = ["90s", "10s", "1s", "300ms"];
  const reads = ["100%", "80%", "50%", "20%"];
  const efficiency = ["baseline", "+50%", "+150%", "+300%"];

  const handleUnlock = (index: number) => {
    if (index + 1 > step) {
      setStep((index + 1) as PerfStep);
    }
  };

  const handleLock = (index: number) => {
    // Only lock if this is the currently highest unlocked step
    if (step === index + 1) {
      setStep(index as PerfStep);
    }
  };

  return (
    <div style={{ display: "flex", gap: 16, padding: "0 0 20px 0" }}>
      {/* ─── LEFT: Context ─── */}
      <div
        style={{
          width: "28%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
          Performance Engineering
        </h2>
        <p style={{ fontSize: 12, color: C.text2, margin: 0, lineHeight: 1.5 }}>
          Reports took 90 seconds to load. Progressive optimization to 300ms.
        </p>

        {/* Challenge / Decision / Outcome */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 8,
          }}
        >
          <div
            style={{
              padding: 12,
              background: C.surface,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: 10,
                color: C.danger,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Challenge
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: C.text2,
                lineHeight: 1.4,
              }}
            >
              Reports took <strong style={{ color: C.text }}>90 seconds</strong>{" "}
              to load. Nested queries, no pagination, full table scans.
            </p>
          </div>
          <div
            style={{
              padding: 12,
              background: C.surface,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: 10,
                color: C.accent,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Decision
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: C.text2,
                lineHeight: 1.4,
              }}
            >
              Progressive optimization: associations → pagination → selective
              retrieval.
            </p>
          </div>
          <div
            style={{
              padding: 12,
              background: C.surface,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: 10,
                color: C.glow,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Outcome
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: C.text2,
                lineHeight: 1.4,
              }}
            >
              <strong style={{ color: C.text }}>300ms response time</strong>.
              80% reduction in database reads.
            </p>
          </div>
        </div>
      </div>

      {/* ─── MID: 4 Sliders ─── */}
      <div
        style={{
          width: "44%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            flex: 1,
            background: C.surface,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: C.muted,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            Slide to implement optimizations
          </p>

          {steps.map((s, i) => (
            <StepSlider
              key={i}
              index={i}
              label={s.label}
              before={s.before}
              after={s.after}
              isUnlocked={step > i}
              onUnlock={() => handleUnlock(i)}
              onLock={() => handleLock(i)}
            />
          ))}
        </div>
      </div>

      {/* ─── RIGHT: Impact ─── */}
      <div
        style={{
          width: "28%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.text,
            margin: 0,
          }}
        >
          Optimization Stack
        </h3>

        <div
          style={{
            background: C.surface,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          {/* Progress */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: 10,
                color: C.muted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Progress
            </p>
            <div
              style={{
                height: 6,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(step / 3) * 100}%`,
                  background: `linear-gradient(90deg, ${C.accent}, ${C.glow})`,
                  borderRadius: 3,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 12,
                color: C.glow,
                fontWeight: 700,
              }}
            >
              {step}/4 optimizations applied
            </p>
          </div>

          {/* Active optimizations list */}
          <div style={{ padding: "14px 20px" }}>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: 10,
                color: C.muted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Applied
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: step > i ? C.glow : C.muted,
                    fontWeight: step > i ? 600 : 400,
                    transition: "color 0.3s",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{step > i ? "✅" : "○"}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complexity Score */}
        <div
          style={{
            padding: 14,
            background: "rgba(31,143,95,0.08)",
            borderRadius: 12,
            border: `1px solid rgba(31,143,95,0.2)`,
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: 11,
              fontWeight: 700,
              color: C.glow,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Complexity Score
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                flex: 1,
                height: 6,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "75%",
                  background: `linear-gradient(90deg, ${C.accent}, ${C.glow})`,
                  borderRadius: 3,
                }}
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.glow }}>
              7.5/10
            </span>
          </div>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 11,
              color: C.text2,
              lineHeight: 1.4,
            }}
          >
            Query plan analysis, index optimization, cursor pagination, field
            selection
          </p>
        </div>
      </div>
    </div>
  );
}
