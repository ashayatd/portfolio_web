"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
  type NodeProps,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

const COLORS = {
  bg: "#0a0a0a",
  surface: "#111111",
  card: "#111111",
  panel: "#161616",
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

type StyleObject = {
  [key: string]: React.CSSProperties;
};

type FunctionStyles = {
  panelTitle: (color: string) => React.CSSProperties;
  storyLabel: (color: string) => React.CSSProperties;
  toggleLabel: (active: boolean) => React.CSSProperties;
  toggleKnob: (isMicro: boolean) => React.CSSProperties;
  metricTo: (color: string) => React.CSSProperties;
  statusBadge: (isMicro: boolean) => React.CSSProperties;
  serviceItem: (isMicro: boolean) => React.CSSProperties;
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
    gridTemplateColumns: "0.6fr 1.4fr",
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
  toggleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  toggleSwitch: {
    width: "56px",
    height: "28px",
    background: COLORS.border,
    borderRadius: "14px",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.3s ease",
    border: `1px solid ${COLORS.border}`,
  },
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
  flowContainer: {
    height: "320px",
    borderRadius: "12px",
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
  },
  serviceList: {
    display: "grid",
    gap: "8px",
  },
  serviceIcon: {
    fontSize: "14px",
  },
  deployLabel: {
    fontSize: "11px",
    color: COLORS.muted,
    marginTop: "12px",
    textAlign: "center",
    fontStyle: "italic",
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
  toggleLabel: (active: boolean): React.CSSProperties => ({
    fontSize: "13px",
    fontWeight: 600,
    color: active ? COLORS.white : COLORS.muted,
    transition: "color 0.3s ease",
  }),
  toggleKnob: (isMicro: boolean): React.CSSProperties => ({
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: isMicro ? COLORS.green : COLORS.red,
    position: "absolute",
    top: "1px",
    left: isMicro ? "29px" : "1px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `0 0 12px ${isMicro ? COLORS.green : COLORS.red}40`,
  }),
  metricTo: (color: string): React.CSSProperties => ({
    fontSize: "20px",
    fontWeight: 700,
    color: color,
  }),
  statusBadge: (isMicro: boolean): React.CSSProperties => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    background: isMicro ? `${COLORS.green}15` : `${COLORS.red}15`,
    color: isMicro ? COLORS.green : COLORS.red,
    border: `1px solid ${isMicro ? `${COLORS.green}30` : `${COLORS.red}30`}`,
    marginBottom: "16px",
  }),
  serviceItem: (isMicro: boolean): React.CSSProperties => ({
    padding: "10px 14px",
    borderRadius: "8px",
    background: isMicro ? `${COLORS.green}08` : `${COLORS.red}08`,
    border: `1px solid ${isMicro ? `${COLORS.green}20` : `${COLORS.red}20`}`,
    fontSize: "13px",
    fontWeight: 600,
    color: isMicro ? COLORS.green : COLORS.red,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),
};

const styles: AllStyles = { ...baseStyles, ...functionStyles } as AllStyles;

// Animation wrapper for React Flow nodes
function AnimatedNode({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
        transition: `opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Monolithic Node
function MonolithNode({ data }: NodeProps<{ label: string; delay?: number }>) {
  return (
    <AnimatedNode delay={data.delay || 0}>
      <div
        style={{
          width: 140,
          height: 80,
          background: `linear-gradient(135deg, ${COLORS.red}10, ${COLORS.red}05)`,
          border: `1.5px solid ${COLORS.red}`,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          position: "relative",
          boxShadow: `0 4px 16px ${COLORS.red}08, inset 0 1px 1px ${COLORS.red}15`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0 }}
        />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            background: `${COLORS.red}20`,
            border: `1px solid ${COLORS.red}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 700,
            color: COLORS.red,
          }}
        >
          1
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.red }}>
          {data.label}
        </span>
      </div>
    </AnimatedNode>
  );
}

// Service Node (Microservices)
function ServiceNode({
  data,
}: NodeProps<{ label: string; color: string; icon: string; delay?: number }>) {
  const iconMap: Record<string, string> = {
    "👤": "U",
    "📦": "O",
    "💳": "P",
    "📋": "I",
  };
  const displayIcon = iconMap[data.icon] || data.icon;

  return (
    <AnimatedNode delay={data.delay || 0}>
      <div
        style={{
          width: 110,
          height: 60,
          background: `linear-gradient(135deg, ${data.color}10, ${data.color}05)`,
          border: `1.5px solid ${data.color}`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          position: "relative",
          boxShadow: `0 4px 12px ${data.color}08, inset 0 1px 1px ${data.color}15`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0 }}
        />
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "4px",
            background: `${data.color}20`,
            border: `1px solid ${data.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: data.color,
          }}
        >
          {displayIcon}
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: data.color }}>
          {data.label}
        </span>
      </div>
    </AnimatedNode>
  );
}

// Gateway Node
function GatewayNode({ data }: NodeProps<{ label: string; delay?: number }>) {
  return (
    <AnimatedNode delay={data.delay || 0}>
      <div
        style={{
          width: 120,
          height: 50,
          background: `linear-gradient(135deg, ${COLORS.blue}10, ${COLORS.blue}05)`,
          border: `1.5px solid ${COLORS.blue}`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: `0 4px 12px ${COLORS.blue}08, inset 0 1px 1px ${COLORS.blue}15`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ opacity: 0 }}
        />
        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.blue }}>
          {data.label}
        </span>
      </div>
    </AnimatedNode>
  );
}

// Database Node
function DatabaseNode({ data }: NodeProps<{ label: string; delay?: number }>) {
  return (
    <AnimatedNode delay={data.delay || 0}>
      <div
        style={{
          width: 100,
          height: 50,
          background: `linear-gradient(135deg, ${COLORS.purple}10, ${COLORS.purple}05)`,
          border: `1.5px solid ${COLORS.purple}`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: `0 4px 12px ${COLORS.purple}08, inset 0 1px 1px ${COLORS.purple}15`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.purple }}>
          {data.label}
        </span>
      </div>
    </AnimatedNode>
  );
}

// Client Node (default type but animated)
function ClientNode({ data }: NodeProps<{ label: string; delay?: number }>) {
  return (
    <AnimatedNode delay={data.delay || 0}>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.blue}10, ${COLORS.blue}05)`,
          border: `1.5px solid ${COLORS.blue}`,
          borderRadius: 10,
          width: 80,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.blue,
          boxShadow: `0 4px 12px ${COLORS.blue}08, inset 0 1px 1px ${COLORS.blue}15`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0 }}
        />
        {data.label}
      </div>
    </AnimatedNode>
  );
}

const nodeTypes = {
  monolith: MonolithNode,
  service: ServiceNode,
  gateway: GatewayNode,
  database: DatabaseNode,
  client: ClientNode,
};

const monolithNodes: Node[] = [
  {
    id: "client",
    type: "client",
    position: { x: 250, y: 20 },
    data: { label: "Client", delay: 0 },
  },
  {
    id: "monolith",
    type: "monolith",
    position: { x: 190, y: 100 },
    data: { label: "MONOLITH", delay: 100 },
  },
  {
    id: "db",
    type: "database",
    position: { x: 210, y: 220 },
    data: { label: "Database", delay: 200 },
  },
];

const microserviceNodes: Node[] = [
  {
    id: "client",
    type: "client",
    position: { x: 250, y: 20 },
    data: { label: "Client", delay: 0 },
  },
  {
    id: "gateway",
    type: "gateway",
    position: { x: 200, y: 90 },
    data: { label: "API Gateway", delay: 80 },
  },
  {
    id: "user",
    type: "service",
    position: { x: 50, y: 180 },
    data: { label: "User Svc", color: COLORS.green, icon: "👤", delay: 160 },
  },
  {
    id: "order",
    type: "service",
    position: { x: 170, y: 180 },
    data: { label: "Order Svc", color: COLORS.amber, icon: "📦", delay: 240 },
  },
  {
    id: "payment",
    type: "service",
    position: { x: 290, y: 180 },
    data: { label: "Payment Svc", color: COLORS.green, icon: "💳", delay: 320 },
  },
  {
    id: "inventory",
    type: "service",
    position: { x: 410, y: 180 },
    data: {
      label: "Inventory Svc",
      color: COLORS.amber,
      icon: "📋",
      delay: 400,
    },
  },
  {
    id: "db",
    type: "database",
    position: { x: 210, y: 270 },
    data: { label: "Database", delay: 480 },
  },
];

function buildEdges(nodes: Node[]): Edge[] {
  const delays: Record<string, number> = {};
  nodes.forEach((n) => {
    delays[n.id] = (n.data?.delay as number) || 0;
  });

  const edgeDelay = (sourceId: string, targetId: string) =>
    Math.max(delays[sourceId] || 0, delays[targetId] || 0) + 100;

  return [
    // Monolith edges
    {
      id: "client-mono",
      source: "client",
      target: "monolith",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.red, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.red },
      data: { delay: edgeDelay("client", "monolith") },
    },
    {
      id: "mono-db",
      source: "monolith",
      target: "db",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.purple, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.purple },
      data: { delay: edgeDelay("monolith", "db") },
    },
    // Microservice edges
    {
      id: "client-gw",
      source: "client",
      target: "gateway",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.blue, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.blue },
      data: { delay: edgeDelay("client", "gateway") },
    },
    {
      id: "gw-user",
      source: "gateway",
      target: "user",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.green, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.green },
      data: { delay: edgeDelay("gateway", "user") },
    },
    {
      id: "gw-order",
      source: "gateway",
      target: "order",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.amber, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.amber },
      data: { delay: edgeDelay("gateway", "order") },
    },
    {
      id: "gw-payment",
      source: "gateway",
      target: "payment",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.green, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.green },
      data: { delay: edgeDelay("gateway", "payment") },
    },
    {
      id: "gw-inventory",
      source: "gateway",
      target: "inventory",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.amber, strokeWidth: 1.5, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.amber },
      data: { delay: edgeDelay("gateway", "inventory") },
    },
    {
      id: "user-db",
      source: "user",
      target: "db",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.purple, strokeWidth: 1, opacity: 0.4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.purple },
      data: { delay: edgeDelay("user", "db") },
    },
    {
      id: "order-db",
      source: "order",
      target: "db",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.purple, strokeWidth: 1, opacity: 0.4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.purple },
      data: { delay: edgeDelay("order", "db") },
    },
    {
      id: "payment-db",
      source: "payment",
      target: "db",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.purple, strokeWidth: 1, opacity: 0.4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.purple },
      data: { delay: edgeDelay("payment", "db") },
    },
    {
      id: "inventory-db",
      source: "inventory",
      target: "db",
      type: "straight",
      animated: true,
      style: { stroke: COLORS.purple, strokeWidth: 1, opacity: 0.4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.purple },
      data: { delay: edgeDelay("inventory", "db") },
    },
  ];
}

const SERVICES = [
  { name: "User Service", icon: "👤", color: COLORS.green },
  { name: "Order Service", icon: "📦", color: COLORS.amber },
  { name: "Payment Service", icon: "💳", color: COLORS.green },
  { name: "Inventory Service", icon: "📋", color: COLORS.amber },
];

export default function ArchitectureBlock() {
  const [isMicroservices, setIsMicroservices] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(monolithNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildEdges(monolithNodes),
  );
  const [key, setKey] = useState(0);

  useEffect(() => {
    const newNodes = isMicroservices ? microserviceNodes : monolithNodes;
    setNodes(newNodes);
    setEdges(buildEdges(newNodes));
    setKey((k) => k + 1);
  }, [isMicroservices, setNodes, setEdges]);

  const deployability = isMicroservices ? "High" : "Low";
  const failureIsolation = isMicroservices ? "High" : "Low";
  const scalability = isMicroservices ? "Flexible" : "Limited";

  return (
    <section style={styles.block}>
      <style>{`
        .react-flow__controls,
        .react-flow__attribution {
          display: none !important;
        }
        .react-flow__edge-path {
          stroke-dasharray: 6 4;
          animation: flowDash 1.5s linear infinite;
          strokeLinecap: round;
          strokeLinejoin: round;
        }
        @keyframes flowDash {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .react-flow__edge {
          opacity: 0;
          animation: fadeInEdge 0.6s ease forwards;
        }
        @keyframes fadeInEdge {
          0% {
            opacity: 0;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          100% {
            opacity: 1;
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
        .react-flow__edge:nth-child(1) { animation-delay: 600ms; }
        .react-flow__edge:nth-child(2) { animation-delay: 700ms; }
        .react-flow__edge:nth-child(3) { animation-delay: 800ms; }
        .react-flow__edge:nth-child(4) { animation-delay: 900ms; }
        .react-flow__edge:nth-child(5) { animation-delay: 1000ms; }
        .react-flow__edge:nth-child(6) { animation-delay: 1100ms; }
        .react-flow__edge:nth-child(7) { animation-delay: 1200ms; }
        .react-flow__edge:nth-child(8) { animation-delay: 1300ms; }
        .react-flow__edge:nth-child(9) { animation-delay: 1400ms; }
        .react-flow__edge:nth-child(10) { animation-delay: 1500ms; }
      `}</style>

      <div style={styles.blockHeader}>
        <h2 style={styles.blockTitle}>Architecture Evolution</h2>
        <div style={styles.blockBasedOn}>
          Transformation:{" "}
          <span style={styles.tag}>Monolithic → Microservices</span>
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
                Single deploy for all features. <strong>One failure</strong>{" "}
                took down everything. Scaling meant bigger servers.
              </p>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.storySection}>
              <span style={styles.storyLabel(COLORS.green)}>Decision</span>
              <p style={styles.storyText}>
                Progressive decomposition: modular monolith → API gateway →
                service split.
              </p>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.storySection}>
              <span style={styles.storyLabel(COLORS.blue)}>Outcome</span>
              <p style={styles.storyText}>
                Independent deploys. <strong>Failure isolation</strong>. Scale
                services individually.
              </p>
            </div>
          </div>

          {/* MIDDLE: React Flow Diagram */}
          <div style={styles.panel}>
            {/* Toggle */}
            <div style={styles.toggleContainer}>
              <span style={styles.toggleLabel(!isMicroservices)}>
                Monolithic
              </span>
              <div
                style={styles.toggleSwitch}
                onClick={() => setIsMicroservices(!isMicroservices)}
              >
                <div style={styles.toggleKnob(isMicroservices)} />
              </div>
              <span style={styles.toggleLabel(isMicroservices)}>
                Microservices
              </span>
            </div>

            <div style={styles.flowContainer}>
              <ReactFlow
                key={key}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-left"
                nodesDraggable={false}
                nodesConnectable={false}
                edgesFocusable={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnScroll={false}
                panOnDrag={false}
                preventScrolling={false}
                edgeUpdaterRadius={0}
              >
                <Background color={COLORS.textMuted} gap={20} size={1} />
              </ReactFlow>
            </div>
          </div>

          {/* RIGHT: Status Panel */}
          {/* <div style={styles.panel}>
            <div style={styles.panelTitle(COLORS.blue)}>
              {isMicroservices ? "After State" : "Before State"}
            </div>

            <div style={styles.statusBadge(isMicroservices)}>
              {isMicroservices ? "✅ Microservices" : "❌ Monolithic"}
            </div>

            <div style={styles.serviceList}>
              {SERVICES.map((svc) => (
                <div
                  key={svc.name}
                  style={styles.serviceItem(isMicroservices)}
                >
                  <span style={styles.serviceIcon}>{svc.icon}</span>
                  <span>{svc.name}</span>
                </div>
              ))}
            </div>

            <div style={styles.deployLabel}>
              {isMicroservices
                ? "Independent deploys per service"
                : "One deploy for entire application"}
            </div>
          </div> */}
        </div>

        {/* Bottom Metrics */}
        {/* <div style={styles.metricsRow}>
          <div style={styles.metricBox}>
            <div style={styles.metricLabel}>Deployability</div>
            <div style={styles.metricValues}>
              <span style={styles.metricFrom}>Low</span>
              <span style={styles.metricArrow}>→</span>
              <span
                style={styles.metricTo(
                  isMicroservices ? COLORS.green : COLORS.red,
                )}
              >
                {deployability}
              </span>
            </div>
          </div>
          <div style={styles.metricBox}>
            <div style={styles.metricLabel}>Failure Isolation</div>
            <div style={styles.metricValues}>
              <span style={styles.metricFrom}>Low</span>
              <span style={styles.metricArrow}>→</span>
              <span
                style={styles.metricTo(
                  isMicroservices ? COLORS.green : COLORS.red,
                )}
              >
                {failureIsolation}
              </span>
            </div>
          </div>
          <div style={styles.metricBox}>
            <div style={styles.metricLabel}>Scalability</div>
            <div style={styles.metricValues}>
              <span style={styles.metricFrom}>Limited</span>
              <span style={styles.metricArrow}>→</span>
              <span
                style={styles.metricTo(
                  isMicroservices ? COLORS.green : COLORS.red,
                )}
              >
                {scalability}
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
