"use client";

import React, { useState, useEffect, useRef } from "react";

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

// ─── Animated Number Component ───
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(value);
  const targetRef = useRef(value);
  const frameRef = useRef<number>(null);

  useEffect(() => {
    targetRef.current = value;
    const start = display;
    const diff = value - start;
    if (diff === 0) return;

    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return <span style={{ color, transition: "color 0.3s" }}>{display}</span>;
}

export default function RealtimeBlock() {
  const [sliderVal, setSliderVal] = useState(0); // target value
  const [animatedSliderVal, setAnimatedSliderVal] = useState(0); // animated display value
  const targetSliderRef = useRef(0);
  const frameRef = useRef<number>(null);

  const [inventory, setInventory] = useState({
    burger: 24,
    buns: 12,
    lettuce: 8,
    cheese: 6,
  });
  const [displayedInventory, setDisplayedInventory] = useState({
    burger: 24,
    buns: 12,
    lettuce: 8,
    cheese: 6,
  });

  const [tempdisplayedInventory, setTempdisplayedInventory] = useState({
    burger: 24,
    buns: 12,
    lettuce: 8,
    cheese: 6,
  });
  const [counter, setCounter] = useState(0);
  const [displayedCounter, setDisplayedCounter] = useState(0);
  const [lastReload, setLastReload] = useState("Never");

  // Smooth slider animation
  useEffect(() => {
    targetSliderRef.current = sliderVal;
    const duration = 600; // 600ms smooth ease
    const startTime = performance.now();
    const startValue = animatedSliderVal;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetSliderRef.current - startValue) * eased;
      setAnimatedSliderVal(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [sliderVal]);

  const isRealtime = animatedSliderVal >= 0.8;

  // Simulate order - decreases inventory (backend update)
  const handleOrder = () => {
    setCounter((c) => c + 1);
    setDisplayedCounter((c) => c + 1);
    setTempdisplayedInventory((inv) => ({
      burger: Math.max(0, inv.burger - 1),
      buns: Math.max(0, inv.buns - 1),
      lettuce: Math.max(0, inv.lettuce - (Math.random() > 0.5 ? 1 : 0)),
      cheese: Math.max(0, inv.cheese - (Math.random() > 0.7 ? 1 : 0)),
    }));
    // setInventory((inv) => ({
    //   burger: Math.max(0, inv.burger - 1),
    //   buns: Math.max(0, inv.buns - 1),
    //   lettuce: Math.max(0, inv.lettuce - (Math.random() > 0.5 ? 1 : 0)),
    //   cheese: Math.max(0, inv.cheese - (Math.random() > 0.7 ? 1 : 0)),
    // }));
    // Only update display immediately if realtime is active
    if (isRealtime) {
      setDisplayedCounter((c) => c + 1);
      setDisplayedInventory((inv) => ({
        burger: Math.max(0, inv.burger - 1),
        buns: Math.max(0, inv.buns - 1),
        lettuce: Math.max(0, inv.lettuce - (Math.random() > 0.5 ? 1 : 0)),
        cheese: Math.max(0, inv.cheese - (Math.random() > 0.7 ? 1 : 0)),
      }));
    }
  };

  // Reload button - syncs displayed data with actual data
  const handleReload = () => {
    setDisplayedInventory({ ...tempdisplayedInventory });
    setLastReload(new Date().toLocaleTimeString());
  };

  return (
    <div style={{ display: "flex", gap: 16, padding: "0 0 20px 0" }}>
      {/* ─── LEFT: Context & Steps ─── */}
      <div
        style={{
          width: "28%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
          Realtime Coordination
        </h2>
        <p style={{ fontSize: 12, color: C.text2, margin: 0, lineHeight: 1.5 }}>
          Client was frustrated with manual reloads. Asked: "Can it be realtime
          like messages?"
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
              Polling every 5s caused stale data and server overload. Staff kept
              reloading.
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
              Evolved to WebSocket, then Redis Pub/Sub with optimistic UI.
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
              12+ devices synced in real-time with sub-100ms propagation.
            </p>
          </div>
        </div>
      </div>

      {/* ─── MID: Slider ─── */}
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
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            minHeight: 200,
          }}
        >
          {/* ─── JUMBO SLIDE TO PAY STYLE TOGGLE ─── */}
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              position: "relative",
              height: 64,
              borderRadius: 32,
              background: C.bg,
              border: `2px solid ${C.border}`,
              overflow: "hidden",
              userSelect: "none",
            }}
            onMouseUp={() => {
              if (sliderVal > 0.5) setSliderVal(1);
              else setSliderVal(0);
            }}
            onTouchEnd={() => {
              if (sliderVal > 0.5) setSliderVal(1);
              else setSliderVal(0);
            }}
          >
            {/* Background labels */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: animatedSliderVal < 0.3 ? C.danger : C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "color 0.3s",
                }}
              >
                Polling
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: animatedSliderVal > 0.7 ? C.glow : C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "color 0.3s",
                }}
              >
                Realtime
              </span>
            </div>

            {/* Active fill from left */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${animatedSliderVal * 100}%`,
                background:
                  animatedSliderVal > 0.5
                    ? `linear-gradient(90deg, ${C.accent}15, ${C.glow}15)`
                    : `linear-gradient(90deg, ${C.danger}15, transparent)`,
                transition: "background 0.3s",
              }}
            />

            {/* The track line */}
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 36,
                top: "50%",
                transform: "translateY(-50%)",
                height: 3,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${C.danger}33, ${C.accent}33, ${C.glow}33)`,
              }}
            />

            {/* Draggable ball - TRANSPARENT & GLOWING */}
            <div
              style={{
                position: "absolute",
                left: `calc(${animatedSliderVal * 100}% - ${animatedSliderVal * 44}px + ${(1 - animatedSliderVal) * 0}px)`,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "transparent",
                border: `2px solid ${animatedSliderVal > 0.8 ? C.glow : animatedSliderVal > 0.3 ? C.accent : C.danger}`,
                boxShadow:
                  animatedSliderVal > 0.8
                    ? `0 0 24px ${C.glow}, 0 0 48px ${C.glow}44, inset 0 0 12px ${C.glow}33`
                    : animatedSliderVal > 0.3
                      ? `0 0 18px ${C.accent}, 0 0 36px ${C.accent}44, inset 0 0 8px ${C.accent}33`
                      : `0 0 18px ${C.danger}, 0 0 36px ${C.danger}44, inset 0 0 8px ${C.danger}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Inner glow dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    animatedSliderVal > 0.8
                      ? C.glow
                      : animatedSliderVal > 0.3
                        ? C.accent
                        : C.danger,
                  boxShadow: `0 0 8px ${animatedSliderVal > 0.8 ? C.glow : animatedSliderVal > 0.3 ? C.accent : C.danger}`,
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              />
            </div>

            {/* Invisible range input for drag functionality */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
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

          {/* Status below slider */}
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: isRealtime ? C.glow : C.danger,
                transition: "color 0.3s",
                letterSpacing: "0.5px",
              }}
            >
              {isRealtime
                ? "SOCKET.IO LIVE — 87ms latency"
                : animatedSliderVal > 0.3
                  ? "Upgrading protocol..."
                  : "HTTP Polling — 5s delay"}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {[
            {
              label: "Update Delay",
              from: "5s",
              to: "100ms",
              active: animatedSliderVal,
            },
            { label: "Devices", from: "1", to: "12+", active: animatedSliderVal },
            {
              label: "Consistency",
              from: "Low",
              to: "High",
              active: animatedSliderVal,
            },
          ].map((m, i) => (
            <div
              key={i}
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
                  fontSize: 9,
                  color: C.muted,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: C.muted,
                  textDecoration: "line-through",
                }}
              >
                {m.from}
              </p>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: 16,
                  fontWeight: 700,
                  color: `rgba(46,182,125,${m.active})`,
                }}
              >
                {m.to}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Status below slider */}
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: isRealtime ? C.glow : C.danger,
            transition: "color 0.3s",
          }}
        ></span>
      </div>

      {/* ─── RIGHT: Canteen Counter ─── */}
      <div
        style={{
          width: "28%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            background: C.surface,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          {/* ── Orders Counter Section ── */}
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.text,
              margin: 0,
              padding: "16px 20px",
            }}
          >
            Canteen Monitor
          </h3>
          <div
            style={{
              padding: "20px 16px",
              textAlign: "center",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: 10,
                color: C.muted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Orders Served
            </p>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: 40,
                fontWeight: 800,
                color: C.text,
              }}
            >
              <AnimatedNumber value={displayedCounter} color={C.text} />
            </p>
            <button
              onClick={handleOrder}
              style={{
                padding: "8px 16px",
                background: C.accent,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
              }}
            >
              + New Order
            </button>
          </div>

          {/* ── Inventory Section ── */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
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
              Raw Materials
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(displayedInventory).map(([name, qty]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: C.text2,
                      textTransform: "capitalize",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      transition: "color 0.3s",
                    }}
                  >
                    <AnimatedNumber
                      value={qty}
                      color={qty < 5 ? C.danger : qty < 10 ? C.accent : C.glow}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Reload / Status Section ── */}
          <div style={{ padding: "14px 16px" }}>
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
              {isRealtime ? "Status" : "Sync"}
            </p>
            {isRealtime ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: C.glow,
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: 14 }}>●</span>
                <span>Live Updates Active</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: C.text2 }}>Last reload</span>
                  <span style={{ color: C.muted, fontWeight: 700 }}>
                    {lastReload}
                  </span>
                </div>
                <button
                  onClick={handleReload}
                  style={{
                    padding: "8px 16px",
                    background: C.elevated,
                    color: C.text2,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Reload Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
