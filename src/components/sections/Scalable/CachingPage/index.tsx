"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  COLORS,
  ChallengePanel,
  MetricsPanel,
  MetricRow,
  SimPanel,
  styles,
} from "../shared";

function ClientNode({ data }: NodeProps<{ active: boolean }>) {
  return (
    <div
      style={{
        width: 80,
        height: 60,
        background: COLORS.surface,
        border: `2px solid ${COLORS.accent}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        position: "relative",
      }}
    >
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          width: 12,
          height: 12,
          background: COLORS.glow,
          border: `2px solid ${COLORS.surface}`,
          top: -6,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          width: 12,
          height: 12,
          background: COLORS.accent,
          border: `2px solid ${COLORS.surface}`,
          right: -6,
        }}
      />
      <span style={{ fontSize: 22, lineHeight: 1 }}>💻</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>
        Client
      </span>
    </div>
  );
}

function RedisNode({ data }: NodeProps<{ placed: boolean }>) {
  return (
    <div
      style={{
        width: 88,
        height: 60,
        background: data.placed ? `${COLORS.glow}18` : `${COLORS.glow}06`,
        border: data.placed
          ? `2px solid ${COLORS.glow}`
          : `2px dashed ${COLORS.glow}55`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        position: "relative",
        transition: "all 0.3s ease",
        boxShadow: data.placed ? `0 0 24px ${COLORS.glow}30` : "none",
      }}
    >
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-in"
        style={{
          width: 12,
          height: 12,
          background: COLORS.glow,
          border: `2px solid ${COLORS.surface}`,
          bottom: -6,
          left: "30%",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-out"
        style={{
          width: 12,
          height: 12,
          background: COLORS.glow,
          border: `2px solid ${COLORS.surface}`,
          bottom: -6,
          left: "70%",
        }}
      />
      <span style={{ fontSize: 22, lineHeight: 1 }}>⚡</span>
      <span style={{ fontSize: 11, fontWeight: 800, color: COLORS.glow }}>
        {data.placed ? "Redis" : "+ Redis"}
      </span>
      {data.placed && (
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: 16,
            border: `1px solid ${COLORS.glow}22`,
            pointerEvents: "none",
            animation: "pulseRing 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

function DatabaseNode({ data }: NodeProps<{ active: boolean }>) {
  return (
    <div
      style={{
        width: 80,
        height: 60,
        background: COLORS.surface,
        border: `2px solid ${COLORS.red}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        position: "relative",
        opacity: data.active ? 1 : 0.5,
        transition: "opacity 0.3s",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          width: 12,
          height: 12,
          background: COLORS.red,
          border: `2px solid ${COLORS.surface}`,
          left: -6,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          width: 12,
          height: 12,
          background: COLORS.glow,
          border: `2px solid ${COLORS.surface}`,
          top: -6,
        }}
      />
      <span style={{ fontSize: 22, lineHeight: 1 }}>🗄️</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>
        Database
      </span>
    </div>
  );
}

const nodeTypes = {
  client: ClientNode,
  redis: RedisNode,
  database: DatabaseNode,
};

const initialNodes: Node[] = [
  {
    id: "client",
    type: "client",
    position: { x: 80, y: 130 },
    data: { active: true },
    draggable: false,
  },
  {
    id: "redis",
    type: "redis",
    position: { x: 200, y: 20 },
    data: { placed: false },
    draggable: false,
  },
  {
    id: "database",
    type: "database",
    position: { x: 300, y: 130 },
    data: { active: true },
    draggable: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: "client-db",
    source: "client",
    sourceHandle: "right",
    target: "database",
    targetHandle: "left",
    type: "straight",
    animated: true,
    style: {
      stroke: `${COLORS.red}99`,
      strokeWidth: 2,
      strokeDasharray: "6 4",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: COLORS.red,
      width: 12,
      height: 12,
    },
  },
];

function EdgeParticle({
  edgeId,
  color,
  duration = 1200,
  size = 8,
  reverse = false,
}: {
  edgeId: string;
  color: string;
  duration?: number;
  size?: number;
  reverse?: boolean;
}) {
  const [progress, setProgress] = useState(reverse ? 1 : 0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(reverse ? 1 - eased : eased);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, reverse]);

  const edgeEl = document.querySelector(`[data-edge-id="${edgeId}"] path`);
  if (!edgeEl) return null;
  const path = edgeEl as SVGPathElement;
  const length = path.getTotalLength();
  const point = path.getPointAtLength(length * progress);

  return (
    <div
      style={{
        position: "absolute",
        left: point.x,
        top: point.y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${size * 1.5}px ${color}, 0 0 ${size * 3}px ${color}66`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

function CacheCounter({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ textAlign: "center", minWidth: 80 }}>
      <p style={{ margin: "0 0 4px 0", fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>
        {count}
      </p>
    </div>
  );
}

export default function CachingBlock() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number; edgeId: string; color: string; delay: number; duration: number; reverse: boolean;
  }>>([]);
  const particleIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRedisConnected =
    edges.some((e) => e.source === "client" && e.target === "redis") &&
    edges.some((e) => e.source === "redis" && e.target === "database");

  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === "redis") {
          return { ...node, data: { ...node.data, placed: isRedisConnected } };
        }
        if (node.id === "database") {
          const active =
            edges.some((e) => e.source === "client" && e.target === "database") ||
            edges.some((e) => e.source === "redis" && e.target === "database");
          return { ...node, data: { ...node.data, active } };
        }
        return node;
      })
    );
  }, [edges, isRedisConnected, setNodes]);

  const flatEdge = (): Edge => ({
    id: "client-db",
    source: "client",
    sourceHandle: "right",
    target: "database",
    targetHandle: "left",
    type: "straight",
    animated: true,
    style: { stroke: `${COLORS.red}99`, strokeWidth: 2, strokeDasharray: "6 4" },
    markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.red, width: 12, height: 12 },
  });

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      if (connection.source === connection.target) return;

      let newEdges = [...edges];
      const edgeId = `${connection.source}-${connection.target}`;
      if (newEdges.some((e) => e.id === edgeId)) return;

      const isRedisEdge = connection.source === "redis" || connection.target === "redis";

      newEdges.push({
        id: edgeId,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
        type: "default",
        animated: true,
        style: {
          stroke: isRedisEdge ? `${COLORS.glow}99` : `${COLORS.red}99`,
          strokeWidth: 2,
          strokeDasharray: "6 4",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isRedisEdge ? COLORS.glow : COLORS.red,
          width: 12,
          height: 12,
        },
      });

      const hasClientRedis = newEdges.some((e) => e.source === "client" && e.target === "redis");
      const hasRedisDb = newEdges.some((e) => e.source === "redis" && e.target === "database");
      if (hasClientRedis && hasRedisDb) {
        newEdges = newEdges.filter((e) => e.id !== "client-db");
      }

      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      let newEdges = [...edges];

      for (const edge of deletedEdges) {
        newEdges = newEdges.filter((e) => e.id !== edge.id);

        if (edge.source === "client" && edge.target === "redis") {
          newEdges = newEdges.filter(
            (e) => !(e.source === "redis" && e.target === "database")
          );
          if (!newEdges.some((e) => e.source === "client" && e.target === "database")) {
            newEdges.push(flatEdge());
          }
        }

        if (edge.source === "redis" && edge.target === "database") {
          if (!newEdges.some((e) => e.source === "client" && e.target === "database")) {
            newEdges.push(flatEdge());
          }
        }
      }

      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  const spawnFlow = useCallback(() => {
    const baseId = particleIdRef.current++;
    const newParticles: typeof particles = [];

    if (isRedisConnected) {
      const isHit = Math.random() > 0.3;
      if (isHit) {
        newParticles.push({ id: baseId, edgeId: "client-redis", color: COLORS.glow, delay: 0, duration: 600, reverse: false });
        newParticles.push({ id: baseId + 100, edgeId: "client-redis", color: COLORS.glow, delay: 800, duration: 600, reverse: true });
        setHitCount((c) => c + 1);
      } else {
        newParticles.push({ id: baseId, edgeId: "client-redis", color: COLORS.red, delay: 0, duration: 600, reverse: false });
        newParticles.push({ id: baseId + 100, edgeId: "redis-database", color: COLORS.red, delay: 800, duration: 600, reverse: false });
        newParticles.push({ id: baseId + 200, edgeId: "redis-database", color: COLORS.accent, delay: 1600, duration: 600, reverse: true });
        newParticles.push({ id: baseId + 300, edgeId: "client-redis", color: COLORS.glow, delay: 2400, duration: 600, reverse: true });
        setMissCount((c) => c + 1);
      }
    } else {
      newParticles.push({ id: baseId, edgeId: "client-db", color: COLORS.red, delay: 0, duration: 800, reverse: false });
      newParticles.push({ id: baseId + 100, edgeId: "client-db", color: COLORS.red, delay: 1000, duration: 800, reverse: true });
      setMissCount((c) => c + 1);
    }

    setParticles((prev) => [...prev, ...newParticles]);
  }, [isRedisConnected]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => spawnFlow(), isRedisConnected ? 2500 : 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRedisConnected, spawnFlow]);

  useEffect(() => {
    const cleanup = setInterval(() => setParticles((prev) => prev.slice(-30)), 10000);
    return () => clearInterval(cleanup);
  }, []);

  const hitRate =
    hitCount + missCount > 0
      ? Math.round((hitCount / (hitCount + missCount)) * 100)
      : 0;

  return (
    <section style={styles.block}>
      <style>{`
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 16px ${COLORS.glow}30; }
          50% { box-shadow: 0 0 32px ${COLORS.glow}55; }
        }
        @keyframes slotPulse {
          0%, 100% { border-color: ${COLORS.glow}44; }
          50% { border-color: ${COLORS.glow}99; }
        }
        .react-flow__edge-path {
          stroke-dasharray: 6 4;
          animation: flowDash 1s linear infinite;
        }
        @keyframes flowDash {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .react-flow__handle {
          opacity: 0.85;
          transition: opacity 0.2s, transform 0.2s;
        }
        .react-flow__handle:hover {
          opacity: 1;
          transform: scale(1.5);
          cursor: crosshair;
        }
        .react-flow__controls,
        .react-flow__attribution {
          display: none !important;
        }
        .react-flow__node:hover {
          filter: brightness(1.1);
        }
      `}</style>

      <div style={styles.blockHeader}>
        <h2 style={styles.blockTitle}>Caching Strategy</h2>
        <div style={styles.blockBasedOn}>
          Based on:{" "}
          {["Currency conversion", "Redis cache", "BullMQ"].map((t) => (
            <span key={t} style={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      <div style={styles.blockContent}>
        <ChallengePanel
          challenge={<>Currency rates fetched from API <strong>every request</strong>. 1200ms latency. API quota draining.</>}
          decision={<>Placed <strong>Redis</strong> between client and database. BullMQ for background refresh.</>}
          outcome={<>Cached responses served in <strong>150ms</strong>. Background jobs keep data fresh.</>}
        />

        <SimPanel title="Lift Redis Into the Request Path">
          <div
            style={{
              position: "relative",
              height: 220,
              borderRadius: 12,
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              overflow: "hidden",
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgesDelete={onEdgesDelete}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.28 }}
              attributionPosition="bottom-left"
              nodesDraggable={false}
              nodesConnectable={true}
              edgesFocusable={true}
              edgesUpdatable={true}
              deleteKeyCode={["Backspace", "Delete"]}
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnScroll={false}
              panOnDrag={false}
              preventScrolling={false}
            >
              <Background color={COLORS.textMuted} gap={20} size={1} />
            </ReactFlow>

            {particles.map((p) => (
              <EdgeParticle
                key={p.id}
                edgeId={p.edgeId}
                color={p.color}
                duration={p.duration}
                reverse={p.reverse}
              />
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 6,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <p style={{ margin: 0, fontSize: 11, color: COLORS.textSecondary }}>
              {isRedisConnected
                ? "✅ Redis is in the path. Click any edge + Delete to reset."
                : "🏔️ Step 1: drag Client's top handle → Redis. Step 2: drag Redis → Database."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 24,
              padding: "14px 20px",
              marginTop: 12,
              background: COLORS.surface,
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <CacheCounter label="Cache Hits" count={hitCount} color={COLORS.glow} />
            <div style={{ width: 1, height: 40, background: COLORS.border }} />
            <CacheCounter label="Cache Misses" count={missCount} color={COLORS.red} />
            <div style={{ width: 1, height: 40, background: COLORS.border }} />
            <div style={{ textAlign: "center", minWidth: 80 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase" }}>
                Hit Rate
              </p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.accent, fontVariantNumeric: "tabular-nums" }}>
                {hitRate}%
              </p>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              padding: "10px 16px",
              borderRadius: 8,
              background: isRedisConnected ? `${COLORS.glow}11` : `${COLORS.red}11`,
              border: `1px solid ${isRedisConnected ? `${COLORS.glow}33` : `${COLORS.red}33`}`,
              transition: "all 0.4s ease",
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isRedisConnected ? COLORS.glow : COLORS.red }}>
              {isRedisConnected
                ? "✅ Cache-Aside Active — Client → Redis → Database"
                : "❌ Direct path — Client → Database (no cache)"}
            </p>
          </div>
        </SimPanel>

        <MetricsPanel>
          <MetricRow name="Latency" from="1200ms" to={isRedisConnected ? "150ms" : "1200ms"} />
          <MetricRow name="DB Load" from="100%" to={isRedisConnected ? "20%" : "100%"} />
          <MetricRow name="API Cost" from="100%" to={isRedisConnected ? "35%" : "100%"} />
        </MetricsPanel>
      </div>
    </section>
  );
}
