"use client";

import React from "react";

/* ── Types ────────────────────────────────────────────────────── */

export type ColorScheme = {
  bg: string;
  surface: string;
  card: string;
  accent: string;
  glow: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  red: string;
  blue: string;
  amber: string;
  purple: string;
};

/* ── Constants ────────────────────────────────────────────────── */

export const COLORS: ColorScheme = {
  bg: "#0D0F10",
  surface: "#151819",
  card: "#1B1F20",
  accent: "#1F8F5F",
  glow: "#2EB67D",
  text: "#F5F7F7",
  textSecondary: "#A5B0AD",
  textMuted: "#6B7472",
  border: "rgba(255,255,255,0.06)",
  red: "#EF4444",
  blue: "#3B82F6",
  amber: "#F59E0B",
  purple: "#8B5CF6",
};

/* ── Shared UI ────────────────────────────────────────────────── */

export const PanelLabel: React.FC<{
  variant: "challenge" | "decision" | "outcome";
  children: React.ReactNode;
}> = ({ variant, children }) => (
  <div
    style={{
      ...styles.panelLabel,
      color:
        variant === "challenge"
          ? COLORS.red
          : variant === "decision"
            ? COLORS.glow
            : COLORS.blue,
    }}
  >
    {children}
  </div>
);

export const ChallengePanel: React.FC<{
  challenge: React.ReactNode;
  decision: React.ReactNode;
  outcome: React.ReactNode;
}> = ({ challenge, decision, outcome }) => (
  <div style={styles.challengePanel}>
    <PanelLabel variant="challenge">Challenge</PanelLabel>
    <p style={styles.panelText}>{challenge}</p>
    <div style={{ marginTop: 20 }}>
      <PanelLabel variant="decision">Decision</PanelLabel>
      <p style={styles.panelText}>{decision}</p>
    </div>
    <div style={{ marginTop: 20 }}>
      <PanelLabel variant="outcome">Outcome</PanelLabel>
      <p style={styles.panelText}>{outcome}</p>
    </div>
  </div>
);

export const MetricsPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div style={styles.metricsPanel}>
    <PanelLabel variant="outcome">Live Metrics</PanelLabel>
    {children}
  </div>
);

export const MetricRow: React.FC<{
  name: string;
  from: string;
  to: string;
}> = ({ name, from, to }) => (
  <div style={styles.metricRow}>
    <span style={styles.metricName}>{name}</span>
    <div style={styles.metricChange}>
      <span style={styles.metricFrom}>{from}</span>
      <span style={styles.metricTo}>{to}</span>
    </div>
  </div>
);

export const SimPanel: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div style={styles.simPanel}>
    <div style={styles.simTitle}>{title}</div>
    {children}
  </div>
);

/* ── Styles ─────────────────────────────────────────────────── */

export const styles: Record<string, React.CSSProperties> = {
  block: { maxWidth: 1200, margin: "0 auto 48px", padding: "0 24px" },
  blockHeader: { marginBottom: 24 },
  blockTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: 8,
  },
  blockBasedOn: { fontSize: 13, color: COLORS.textMuted },
  tag: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 4,
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    marginRight: 6,
    marginBottom: 4,
  },
  blockContent: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "1fr",
    gap: 24,
  },

  challengePanel: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 24,
  },
  panelLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  panelText: { fontSize: 14, lineHeight: 1.7, color: COLORS.textSecondary },

  simPanel: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 24,
    minHeight: 320,
  },
  simTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: COLORS.textMuted,
    marginBottom: 20,
    textAlign: "center",
  },

  metricsPanel: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 24,
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  metricName: { fontSize: 13, color: COLORS.textSecondary },
  metricChange: { display: "flex", alignItems: "center", gap: 8 },
  metricFrom: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecoration: "line-through",
  },
  metricTo: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'SF Mono', monospace",
    color: COLORS.glow,
  },

  toggleGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 24,
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    borderRadius: 10,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.card,
    color: COLORS.textSecondary,
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: 14,
    fontFamily: "inherit",
  },
  toggleBtnActive: {
    background: "rgba(31,143,95,0.1)",
    borderColor: COLORS.accent,
    color: COLORS.glow,
  },
  toggleArrow: { marginLeft: "auto", color: COLORS.textMuted, fontSize: 12 },

  diagramArea: {
    background: COLORS.bg,
    borderRadius: 12,
    padding: 24,
    minHeight: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${COLORS.border}`,
  },
  diagramNodes: { display: "flex", alignItems: "center", gap: 16 },
  dNode: {
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    transition: "all 0.3s ease",
  },
  dNodeActive: {
    background: "rgba(31,143,95,0.15)",
    borderColor: COLORS.accent,
    color: COLORS.glow,
    animation: "pulse 2s ease-in-out infinite",
  },
  dConnector: {
    width: 40,
    height: 2,
    background: COLORS.border,
    position: "relative",
  },

  perfSteps: { display: "flex", flexDirection: "column", gap: 12 },
  perfStep: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 10,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.card,
    opacity: 0.5,
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  perfStepActive: {
    opacity: 1,
    borderColor: COLORS.accent,
    background: "rgba(31,143,95,0.08)",
  },
  perfStepNum: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    background: COLORS.surface,
    color: COLORS.textMuted,
    flexShrink: 0,
  },
  perfStepNumActive: { background: COLORS.accent, color: COLORS.text },
  perfStepText: { fontSize: 14, color: COLORS.textSecondary },
  perfStepTextActive: { color: COLORS.text },

  dragHint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    padding: 32,
  },
  dragNode: {
    padding: "16px 24px",
    borderRadius: 12,
    textAlign: "center",
    cursor: "grab",
    transition: "transform 0.2s ease",
    fontSize: 14,
    fontWeight: 500,
  },
  dragNodeClient: {
    background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.3)",
    color: COLORS.blue,
  },
  dragNodeRedis: {
    background: "rgba(31,143,95,0.15)",
    border: "2px dashed rgba(31,143,95,0.5)",
    color: COLORS.glow,
    fontWeight: 600,
  },
  dragNodeDb: {
    background: "rgba(139,92,246,0.1)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: COLORS.purple,
  },
  dragArrow: { color: COLORS.textMuted, fontSize: 20 },

  roleBuilder: { display: "flex", flexDirection: "column", gap: 12 },
  roleTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    width: "fit-content",
    animation: "tag-in 0.3s ease",
  },
  roleTagAdded: {
    background: "rgba(31,143,95,0.1)",
    borderColor: COLORS.accent,
    color: COLORS.glow,
  },
  addBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px dashed ${COLORS.border}`,
    background: "transparent",
    color: COLORS.textMuted,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "fit-content",
    fontFamily: "inherit",
  },

  archTimeline: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    position: "relative",
  },
  archStep: {
    display: "flex",
    alignItems: "flex-start",
    gap: 20,
    padding: 20,
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  archDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: COLORS.card,
    border: `2px solid ${COLORS.border}`,
    flexShrink: 0,
    marginTop: 4,
    position: "relative",
    zIndex: 1,
    transition: "all 0.3s ease",
  },
  archDotActive: {
    background: COLORS.accent,
    borderColor: COLORS.glow,
    boxShadow: "0 0 10px rgba(46,182,125,0.3)",
  },
  archStepContent: { flex: 1 },
  archStepTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: COLORS.text,
    marginBottom: 4,
  },
  archStepDesc: { fontSize: 13, color: COLORS.textMuted },
};
