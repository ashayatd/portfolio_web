"use client";

import React, { useState } from "react";

const COLORS = {
  bg: "#050505",
  surface: "#0D0F10",
  card: "#0D0F10",
  panel: "#rgb(21, 24, 25)",
  border: "rgba(255,255,255,0.06)",
  text: "#F5F7F7",
  textSecondary: "#A5B0AD",
  textMuted: "#6B7472",
  muted: "#6B7472",
  dim: "#6B7472",
  white: "#ffffff",
  red: "#EF4444",
  green: "#2EB67D",
  blue: "#3B82F6",
  accent: "#1F8F5F",
  glow: "#2EB67D",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  divider: "rgba(255,255,255,0.06)",
};

const VIBGYOR = [
  { key: "V", name: "Violet", bg: "#8b5cf6" },
  { key: "I", name: "Indigo", bg: "#6366f1" },
  { key: "B", name: "Blue", bg: "#3b82f6" },
  { key: "G", name: "Green", bg: "#22c55e" },
  { key: "Y", name: "Yellow", bg: "#eab308" },
  { key: "O", name: "Orange", bg: "#f97316" },
  { key: "R", name: "Red", bg: "#ef4444" },
];

type StyleObject = {
  [key: string]: React.CSSProperties;
};

type FunctionStyles = {
  panelTitle: (color: string) => React.CSSProperties;
  storyLabel: (color: string) => React.CSSProperties;
  colorSegment: (active: boolean, bg: string) => React.CSSProperties;
  tick: (active: boolean) => React.CSSProperties;
};

type AllStyles = StyleObject & FunctionStyles;

const baseStyles: StyleObject = {
  block: {
    background: COLORS.card,
    borderRadius: "16px",
    border: `1px solid ${COLORS.border}`,
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: COLORS.text,
  },
  blockHeader: {
    padding: "28px 32px",
    borderBottom: `1px solid ${COLORS.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blockTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: COLORS.white,
    letterSpacing: "-0.5px",
    margin: 0,
  },
  blockBasedOn: {
    fontSize: "13px",
    color: COLORS.muted,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tag: {
    background: "#1a1a1a",
    border: `1px solid #333333`,
    padding: "4px 12px",
    borderRadius: "6px",
    color: "#888888",
    fontSize: "12px",
  },
  blockContent: {
    padding: "32px",
    display: "grid",
    gap: "24px",
  },
  mainRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr 0.8fr",
    gap: "20px",
  },
  panel: {
    background: COLORS.panel,
    borderRadius: "12px",
    border: `1px solid ${COLORS.border}`,
    padding: "24px",
  },
  storySection: { marginBottom: "24px" },
  storyText: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#aaaaaa",
  },
  divider: {
    height: "1px",
    background: COLORS.divider,
    margin: "20px 0",
  },
  // Admin panel
  adminTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: COLORS.dim,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "20px",
    textAlign: "center",
  },
  permRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 16px",
    background: "#1a1a1a",
    borderRadius: "10px",
    border: `1px solid ${COLORS.border}`,
    marginBottom: "16px",
  },
  permLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#cccccc",
    minWidth: "90px",
  },
  colorBarContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  // Employee views - SMOOTH GRADIENT BAR
  viewCard: {
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  viewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  viewName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#cccccc",
  },
  viewCount: {
    fontSize: "11px",
    color: COLORS.muted,
    background: "#1a1a1a",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  gradientBarWrapper: {
    width: "100%",
    height: "24px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    background: "#1a1a1a",
  },
  viewEmpty: {
    color: "#444444",
    fontSize: "12px",
    fontStyle: "italic",
    padding: "4px 0",
  },
  // Metrics
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  metricBox: {
    background: COLORS.panel,
    borderRadius: "12px",
    border: `1px solid ${COLORS.border}`,
    padding: "20px",
    textAlign: "center",
  },
  metricLabel: {
    fontSize: "11px",
    color: COLORS.dim,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  metricValues: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  metricFrom: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#444444",
    textDecoration: "line-through",
  },
  metricArrow: {
    color: "#333333",
    fontSize: "16px",
  },
  metricTo: {
    fontSize: "20px",
    fontWeight: 700,
    color: COLORS.green,
  },
};

const functionStyles: FunctionStyles = {
  panelTitle: (color: string): React.CSSProperties => ({
    fontSize: "11px",
    fontWeight: 700,
    color: color,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "20px",
  }),
  storyLabel: (color: string): React.CSSProperties => ({
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "10px",
    display: "block",
    color,
  }),
  colorSegment: (active: boolean, bg: string): React.CSSProperties => ({
    flex: 1,
    height: "28px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: active ? bg : "#333333",
    opacity: active ? 1 : 0.15,
    boxShadow: active ? "0 0 12px rgba(255,255,255,0.15)" : "none",
  }),
  tick: (active: boolean): React.CSSProperties => ({
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    fontWeight: 700,
    opacity: active ? 1 : 0,
    transition: "opacity 0.2s",
  }),
};

const styles: AllStyles = { ...baseStyles, ...functionStyles } as AllStyles;

interface Employee {
  id: number;
  name: string;
  perms: string[];
}

// Build gradient with ALL 7 colors always visible
// Active colors are bright, inactive fade to dark background color
function buildSmoothGradient(perms: string[]): string {
  const darkBg = "#1a1a1a"; // matches wrapper background

  const stops = VIBGYOR.map((color, index) => {
    const isActive = perms.includes(color.key);
    const position = (index / (VIBGYOR.length - 1)) * 100;
    // If active: use bright color. If inactive: blend into dark background
    const colorValue = isActive ? color.bg : darkBg;
    return `${colorValue} ${position}%`;
  });

  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

export default function AccessControlBlock() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "Employee 1", perms: ["V", "I", "B", "G"] },
    { id: 2, name: "Employee 2", perms: ["B", "G", "Y", "O"] },
    { id: 3, name: "Employee 3", perms: ["I", "B", "R"] },
    { id: 4, name: "Employee 4", perms: ["V", "Y", "O", "R"] },
  ]);

  const togglePerm = (empId: number, colorKey: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== empId) return emp;
        const hasPerm = emp.perms.includes(colorKey);
        return {
          ...emp,
          perms: hasPerm
            ? emp.perms.filter((p) => p !== colorKey)
            : [...emp.perms, colorKey],
        };
      }),
    );
  };

  return (
    <section style={styles.block}>
      <style>{`
        .gradient-bar {
          height: 100%;
          border-radius: 12px;
          transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: background;
        }
      `}</style>

      <div style={styles.blockHeader}>
        <h2 style={styles.blockTitle}>Access Control at Scale</h2>
        <div style={styles.blockBasedOn}>
          Based on: <span style={styles.tag}>ERP permission system</span>
        </div>
      </div>

      <div style={styles.blockContent}>
        {/* Three Column Layout */}
        <div style={styles.mainRow}>
          {/* LEFT: Story Panel */}
          <div style={styles.panel}>
            <div style={styles.storySection}>
              <span style={styles.storyLabel(COLORS.red)}>Challenge</span>
              <p style={styles.storyText}>
                Hardcoded <strong>2 roles</strong> (Admin/Staff). Adding
                permissions required code changes and deployment.
              </p>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.storySection}>
              <span style={styles.storyLabel(COLORS.green)}>Decision</span>
              <p style={styles.storyText}>
                Placed <strong>RBAC engine</strong> between admin and employees.
                Module-based access control.
              </p>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.storySection}>
              <span style={styles.storyLabel(COLORS.blue)}>Outcome</span>
              <p style={styles.storyText}>
                <strong>100+ roles</strong> created from admin dashboard without
                touching code.
              </p>
            </div>
          </div>

          {/* MIDDLE: Admin Panel */}
          <div style={styles.panel}>
            <div style={styles.adminTitle}>Admin Panel Assign Permissions</div>
            <div className="flex flex-col justify-between gap-2">
              {employees.map((emp) => (
                <div key={emp.id} style={styles.permRow}>
                  <span style={styles.permLabel}>{emp.name}</span>
                  <div style={styles.colorBarContainer}>
                    {VIBGYOR.map((color) => {
                      const active = emp.perms.includes(color.key);
                      return (
                        <div
                          key={color.key}
                          style={styles.colorSegment(active, color.bg)}
                          title={color.name}
                          onClick={() => togglePerm(emp.id, color.key)}
                        >
                          <span style={styles.tick(active)}>✓</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Employee Views */}
          <div style={styles.panel}>
            <div style={styles.panelTitle(COLORS.blue)}>Employee Views</div>
            <div>
              {employees.map((emp, idx) => (
                <div
                  key={emp.id}
                  style={{
                    ...styles.viewCard,
                    ...(idx === employees.length - 1
                      ? {
                          marginBottom: 0,
                          paddingBottom: 0,
                          borderBottom: "none",
                        }
                      : {}),
                  }}
                >
                  <div style={styles.viewHeader}>
                    <span style={styles.viewName}>{emp.name}</span>
                    <span style={styles.viewCount}>
                      {emp.perms.length} modules
                    </span>
                  </div>
                  {emp.perms.length === 0 ? (
                    <div style={styles.viewEmpty}>No access granted</div>
                  ) : (
                    <div style={styles.gradientBarWrapper}>
                      <div
                        className="gradient-bar"
                        style={{
                          background: buildSmoothGradient(emp.perms),
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
