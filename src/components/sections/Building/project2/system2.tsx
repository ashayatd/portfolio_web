"use client";

import { useState, useCallback, FC, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Handle,
  Position,
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ═══════════════════════════════════════════════════════════════
// COLOR SYSTEM (Preserved exactly)
// ═══════════════════════════════════════════════════════════════
export const COLORS = {
  // Backgrounds
  bgPrimary: "#0B0D0E",
  bgSecondary: "#111415",
  bgTertiary: "#15191A",
  bgElevated: "#1A1F20",

  // Glass / overlays
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.06)",

  // Accent
  accent: "#3FA675",
  accentSoft: "rgba(63,166,117,0.12)",
  accentGlow: "rgba(63,166,117,0.35)",

  // Typography
  textPrimary: "#F3F5F4",
  textSecondary: "#B2BAB7",
  textMuted: "#707A77",

  // Borders
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.12)",

  // Shadows
  shadowDark: "rgba(0,0,0,0.45)",
};

// Domain colors from the diagram legend
export const DOMAIN_COLORS = {
  client: {
    bg: "rgba(85,130,255,0.10)",
    border: "rgba(85,130,255,0.22)",
    glow: "rgba(85,130,255,0.18)",
  },

  socket: {
    bg: "rgba(63,166,117,0.10)",
    border: "rgba(63,166,117,0.22)",
    glow: "rgba(63,166,117,0.18)",
  },

  agora: {
    bg: "rgba(255,153,102,0.10)",
    border: "rgba(255,153,102,0.22)",
    glow: "rgba(255,153,102,0.18)",
  },

  payment: {
    bg: "rgba(176,120,255,0.10)",
    border: "rgba(176,120,255,0.22)",
    glow: "rgba(176,120,255,0.18)",
  },

  state: {
    bg: "rgba(255,204,102,0.10)",
    border: "rgba(255,204,102,0.22)",
    glow: "rgba(255,204,102,0.18)",
  },

  redis: {
    bg: "rgba(70,190,170,0.10)",
    border: "rgba(70,190,170,0.22)",
    glow: "rgba(70,190,170,0.18)",
  },

  db: {
    bg: "rgba(180,180,180,0.08)",
    border: "rgba(180,180,180,0.18)",
    glow: "rgba(180,180,180,0.14)",
  },

  auth: {
    bg: "rgba(220,120,120,0.10)",
    border: "rgba(220,120,120,0.20)",
    glow: "rgba(220,120,120,0.16)",
  },
};

// ═══════════════════════════════════════════════════════════════
// CUSTOM NODE COMPONENT
// ═══════════════════════════════════════════════════════════════
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  subtitle?: string;
  domain?: keyof typeof DOMAIN_COLORS;
  isGroup?: boolean;
  isLabel?: boolean;
}

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  const domain = data.domain ? DOMAIN_COLORS[data.domain] : null;

  if (data.isLabel) {
    return (
      <div className="px-2 py-1">
        <span
          className="text-[11px] uppercase tracking-widest font-medium"
          style={{
            color: COLORS.textMuted,
            fontFamily: "Inter, system-ui, sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          {data.label}
        </span>
      </div>
    );
  }

  const baseStyle = domain
    ? {
        backgroundColor: domain.bg,
        border: `1px solid ${domain.border}`,
        boxShadow: `0 0 20px ${domain.glow}20, 0 4px 24px rgba(0, 0, 0, 0.5)`,
      }
    : {
        backgroundColor: COLORS.bgElevated,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
      };

  return (
    <div
      className="rounded-lg px-4 py-2.5 min-w-[140px] relative"
      style={baseStyle}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          backgroundColor: domain ? domain.glow : COLORS.accent,
          border: `2px solid ${domain ? domain.bg : COLORS.bgElevated}`,
          width: 8,
          height: 8,
        }}
      />

      <div className="flex flex-col gap-0.5 items-center text-center">
        <span
          className="font-semibold text-[13px] tracking-tight leading-tight"
          style={{
            color: COLORS.textPrimary,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {data.label}
        </span>
        {data.subtitle && (
          <span
            className="text-[11px] leading-tight"
            style={{
              color: COLORS.textMuted,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {data.subtitle}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          backgroundColor: domain ? domain.glow : COLORS.accent,
          border: `2px solid ${domain ? domain.bg : COLORS.bgElevated}`,
          width: 8,
          height: 8,
        }}
      />

      {/* Side handles for horizontal connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          backgroundColor: domain ? domain.glow : COLORS.accent,
          border: `2px solid ${domain ? domain.bg : COLORS.bgElevated}`,
          width: 6,
          height: 6,
          left: -3,
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{
          backgroundColor: domain ? domain.glow : COLORS.accent,
          border: `2px solid ${domain ? domain.bg : COLORS.bgElevated}`,
          width: 6,
          height: 6,
          left: -3,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          backgroundColor: domain ? domain.glow : COLORS.accent,
          border: `2px solid ${domain ? domain.bg : COLORS.bgElevated}`,
          width: 6,
          height: 6,
          right: -3,
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{
          backgroundColor: domain ? domain.glow : COLORS.accent,
          border: `2px solid ${domain ? domain.bg : COLORS.bgElevated}`,
          width: 6,
          height: 6,
          right: -3,
        }}
      />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

// ═══════════════════════════════════════════════════════════════
// ANIMATED EDGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const ACTIVE_EDGES = new Set([
  "e-auth-lb",
  "e-lb-node1",
  "e-live-timer",
  "e-decision-webhook",
  "e-agora-video",
]);

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps & { data?: { color?: string } }) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  const isAnimated = ACTIVE_EDGES.has(id);

  const strokeColor = data?.color || COLORS.accent;
  const glowColor = data?.color || COLORS.accentGlow;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: isAnimated ? 2.5 : 1.5,
          strokeOpacity: isAnimated ? 0.8 : 0.35,
        }}
      />
      {isAnimated && (
        <path
          d={edgePath}
          fill="none"
          stroke={glowColor}
          strokeWidth={2.2}
          strokeLinecap="round"
          className={`animated-edge-${id.replace(/[^a-zA-Z0-9]/g, "")}`}
          style={{
            strokeDasharray: "6 10",
            animation: `flowAnimation 1.2s linear infinite`,
            filter: `drop-shadow(0 0 3px ${glowColor})`,
          }}
        />
      )}
    </>
  );
};

const edgeTypes = { animated: AnimatedEdge };

// ═══════════════════════════════════════════════════════════════
// AUTO-PAN CONTROLLER WITH USER INTERACTION DETECTION
// ═══════════════════════════════════════════════════════════════
interface AutoPanControllerProps {
  isUserActive: boolean;
}

const AutoPanController: FC<AutoPanControllerProps> = ({ isUserActive }) => {
  const { setViewport } = useReactFlow();

  const CENTER_X = 0;
  const CENTER_Y = 630;
  const CANVAS_W = typeof window !== "undefined" ? window.innerWidth : 200;
  const CANVAS_H = typeof window !== "undefined" ? window.innerHeight : 800;
  const BASE_ZOOM = 0.6;

  const baseX = CANVAS_W / 4 - CENTER_X * BASE_ZOOM;
  const baseY = CANVAS_H / 5 - CENTER_Y * BASE_ZOOM;

  useEffect(() => {
    if (isUserActive) return;

    let frame: number;
    const start = performance.now();

    setViewport({ x: baseX, y: baseY, zoom: BASE_ZOOM }, { duration: 600 });

    const animate = (time: number) => {
      const t = (time - start) * 0.0002;
      const dx = Math.sin(t * 1.5) * 60;
      const dy = Math.cos(t * 1.5) * 80;
      const zoom = BASE_ZOOM + Math.sin(t) * 0.015;

      setViewport({ x: baseX + dx, y: baseY + dy, zoom });
      frame = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 650);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [isUserActive, setViewport, baseX, baseY]);

  return null;
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Create edge with domain color
// ═══════════════════════════════════════════════════════════════
const createEdge = (
  id: string,
  source: string,
  target: string,
  domain?: keyof typeof DOMAIN_COLORS,
  options?: Partial<Edge>,
): Edge => {
  const domainColor = domain ? DOMAIN_COLORS[domain] : null;
  return {
    id,
    source,
    target,
    type: "animated",
    animated: true,
    style: { stroke: domainColor?.glow || COLORS.accent },
    data: { color: domainColor?.glow || COLORS.accentGlow },
    ...options,
  };
};

// ═══════════════════════════════════════════════════════════════
// ALL NODES - Video Call Teaching Platform Architecture
// ═══════════════════════════════════════════════════════════════

const initialNodes: Node[] = [
  // ═══ TITLE ═══
  {
    id: "title",
    type: "custom",
    position: { x: 0, y: -60 },
    data: {
      label: "VideoCallTestDashboard — System Architecture",
      isLabel: true,
    },
  },
  {
    id: "subtitle",
    type: "custom",
    position: { x: 0, y: -30 },
    data: {
      label:
        "Dual-user video teaching platform with real-time sync, payments & Agora",
      isLabel: true,
    },
  },

  // ═══ CLIENTS (y=40) ═══
  {
    id: "label-clients",
    type: "custom",
    position: { x: -500, y: 10 },
    data: { label: "CLIENTS", isLabel: true },
  },
  {
    id: "client-contractor",
    type: "custom",
    position: { x: -350, y: 40 },
    data: {
      label: "Contractor",
      subtitle: "Content Provider / Teacher",
      domain: "client",
    },
  },
  {
    id: "client-seeker",
    type: "custom",
    position: { x: 350, y: 40 },
    data: {
      label: "Seeker",
      subtitle: "Content Seeker / Student",
      domain: "client",
    },
  },

  // ═══ AUTH & JWT (y=140) ═══
  {
    id: "label-auth",
    type: "custom",
    position: { x: -500, y: 110 },
    data: { label: "AUTH & JWT", isLabel: true },
  },
  {
    id: "auth-jwt",
    type: "custom",
    position: { x: 0, y: 140 },
    data: {
      label: "JWT Auth Engine",
      subtitle: "Validate userId on every socket event · Rate limiting",
      domain: "auth",
    },
  },

  // ═══ SOCKET.IO LAYER (y=260) ═══
  {
    id: "label-socket",
    type: "custom",
    position: { x: -500, y: 230 },
    data: { label: "SOCKET.IO LAYER", isLabel: true },
  },
  {
    id: "socket-node1",
    type: "custom",
    position: { x: -200, y: 260 },
    data: {
      label: "Socket.IO Node #1",
      subtitle: "cRef + sRef dual instances",
      domain: "socket",
    },
  },
  {
    id: "socket-node2",
    type: "custom",
    position: { x: 200, y: 260 },
    data: {
      label: "Socket.IO Node #2",
      subtitle: "Horizontal scaling via Redis adapter",
      domain: "socket",
    },
  },

  // ═══ LOAD BALANCER (y=340) ═══
  {
    id: "label-lb",
    type: "custom",
    position: { x: -500, y: 310 },
    data: { label: "LOAD BALANCER", isLabel: true },
  },
  {
    id: "lb-nginx",
    type: "custom",
    position: { x: 0, y: 340 },
    data: {
      label: "NGINX / HAProxy",
      subtitle: "Sticky sessions (cookie / IP hash)",
      domain: "socket",
    },
  },

  // ═══ CALL STATE MANAGEMENT (y=460) ═══
  {
    id: "label-state",
    type: "custom",
    position: { x: -500, y: 430 },
    data: { label: "CALL STATE MANAGEMENT", isLabel: true },
  },
  {
    id: "state-idle",
    type: "custom",
    position: { x: -400, y: 460 },
    data: {
      label: "idle",
      subtitle: "Waiting for connection",
      domain: "state",
    },
  },
  {
    id: "state-waiting",
    type: "custom",
    position: { x: -200, y: 460 },
    data: {
      label: "waiting",
      subtitle: "Room joined, pending start",
      domain: "state",
    },
  },
  {
    id: "state-live",
    type: "custom",
    position: { x: 0, y: 460 },
    data: {
      label: "live",
      subtitle: "Active call with timer sync",
      domain: "state",
    },
  },
  {
    id: "state-paused",
    type: "custom",
    position: { x: 200, y: 460 },
    data: {
      label: "paused",
      subtitle: "Call paused, timer frozen",
      domain: "state",
    },
  },
  {
    id: "state-ended",
    type: "custom",
    position: { x: 400, y: 460 },
    data: { label: "ended", subtitle: "Cleanup & reset", domain: "state" },
  },

  // ═══ TIMER & SYNC (y=560) ═══
  {
    id: "label-timer",
    type: "custom",
    position: { x: -500, y: 530 },
    data: { label: "TIMER & SYNC", isLabel: true },
  },
  {
    id: "timer-server",
    type: "custom",
    position: { x: -200, y: 560 },
    data: {
      label: "Server Timer",
      subtitle: "Source of truth · remainingSeconds",
      domain: "socket",
    },
  },
  {
    id: "timer-sync",
    type: "custom",
    position: { x: 200, y: 560 },
    data: {
      label: "syncTimer()",
      subtitle: "Frontend reconciliation · call_status polling",
      domain: "socket",
    },
  },

  // ═══ EXTENSION & PAYMENT (y=680) ═══
  {
    id: "label-payment",
    type: "custom",
    position: { x: -500, y: 650 },
    data: { label: "EXTENSION & PAYMENT FLOW", isLabel: true },
  },
  {
    id: "pay-request",
    type: "custom",
    position: { x: -400, y: 680 },
    data: {
      label: "extension_requested",
      subtitle: "Seeker initiates · 120s expiry",
      domain: "payment",
    },
  },
  {
    id: "pay-review",
    type: "custom",
    position: { x: -200, y: 680 },
    data: {
      label: "extension_request_received",
      subtitle: "Creator review card",
      domain: "payment",
    },
  },
  {
    id: "pay-decision",
    type: "custom",
    position: { x: 25, y: 680 },
    data: {
      label: "Accept / Reject",
      subtitle: "extension_accepted / rejected",
      domain: "payment",
    },
  },
  {
    id: "pay-webhook",
    type: "custom",
    position: { x: 250, y: 680 },
    data: {
      label: "payment_success + webhook",
      subtitle: "Async confirmation",
      domain: "payment",
    },
  },
  {
    id: "pay-extend",
    type: "custom",
    position: { x: 500, y: 680 },
    data: {
      label: "call_extended",
      subtitle: "New remainingSeconds synced",
      domain: "payment",
    },
  },

  // ═══ AGORA VIDEO (y=800) ═══
  {
    id: "label-agora",
    type: "custom",
    position: { x: -500, y: 770 },
    data: { label: "AGORA VIDEO INTEGRATION", isLabel: true },
  },
  {
    id: "agora-token",
    type: "custom",
    position: { x: -300, y: 800 },
    data: {
      label: "Token Generator",
      subtitle: "Short-lived server-side tokens",
      domain: "agora",
    },
  },
  {
    id: "agora-channel",
    type: "custom",
    position: { x: 0, y: 800 },
    data: {
      label: "Channel Naming",
      subtitle: "jobId_userId pattern isolation",
      domain: "agora",
    },
  },
  {
    id: "agora-forceleave",
    type: "custom",
    position: { x: 300, y: 800 },
    data: {
      label: "agora_channel_force_leave",
      subtitle: "Cleanup video state immediately",
      domain: "agora",
    },
  },

  // ═══ REDIS CLUSTER (y=920) ═══
  {
    id: "label-redis",
    type: "custom",
    position: { x: -500, y: 890 },
    data: { label: "REDIS CLUSTER", isLabel: true },
  },
  {
    id: "redis-pubsub",
    type: "custom",
    position: { x: -300, y: 920 },
    data: {
      label: "Pub/Sub Adapter",
      subtitle: "Event broadcasting across nodes",
      domain: "redis",
    },
  },
  {
    id: "redis-presence",
    type: "custom",
    position: { x: 0, y: 920 },
    data: {
      label: "Sorted Sets (ZADD/ZRANGE)",
      subtitle: "Real-time presence · O(logN) queries",
      domain: "redis",
    },
  },
  {
    id: "redis-ttl",
    type: "custom",
    position: { x: 300, y: 920 },
    data: {
      label: "TTL Session Cleanup",
      subtitle: "Ephemeral call data expiry",
      domain: "redis",
    },
  },

  // ═══ DATABASE LAYER (y=1040) ═══
  {
    id: "label-db",
    type: "custom",
    position: { x: -500, y: 1010 },
    data: { label: "DATABASE LAYER", isLabel: true },
  },
  {
    id: "db-postgres",
    type: "custom",
    position: { x: -200, y: 1040 },
    data: {
      label: "PostgreSQL",
      subtitle: "Call metadata · ACID payments · Row-level locking",
      domain: "db",
    },
  },
  {
    id: "db-kafka",
    type: "custom",
    position: { x: 200, y: 1040 },
    data: {
      label: "Kafka / Redis Streams",
      subtitle: "Event audit log · Durable replayable events",
      domain: "db",
    },
  },

  // ═══ RESILIENCE & DEBUG (y=1160) ═══
  {
    id: "label-resilience",
    type: "custom",
    position: { x: -500, y: 1130 },
    data: { label: "RESILIENCE & DEBUG", isLabel: true },
  },
  {
    id: "res-reconnect",
    type: "custom",
    position: { x: -400, y: 1160 },
    data: {
      label: "Auto-reconnect",
      subtitle: "call_status state restoration",
      domain: "socket",
    },
  },
  {
    id: "res-logging",
    type: "custom",
    position: { x: -200, y: 1160 },
    data: {
      label: "Event Logging",
      subtitle: "Color-coded arrows ←server →client",
      domain: "socket",
    },
  },
  {
    id: "res-metrics",
    type: "custom",
    position: { x: 100, y: 1160 },
    data: {
      label: "Prometheus Metrics",
      subtitle: "socket_connections · active_calls · extension_requests",
      domain: "socket",
    },
  },
  {
    id: "res-degrade",
    type: "custom",
    position: { x: 450, y: 1160 },
    data: {
      label: "Graceful Degradation",
      subtitle: "WebRTC fallback · Exponential backoff",
      domain: "socket",
    },
  },
  {
    id: "res-warnings",
    type: "custom",
    position: { x: 750, y: 1160 },
    data: {
      label: "Visual Warnings",
      subtitle: "5-min & 1-min remaining thresholds",
      domain: "socket",
    },
  },

  // ═══ OUTPUTS (y=1280) ═══
  {
    id: "label-output",
    type: "custom",
    position: { x: -500, y: 1250 },
    data: { label: "OUTPUTS", isLabel: true },
  },
  {
    id: "out-video",
    type: "custom",
    position: { x: -300, y: 1280 },
    data: {
      label: "Agora Video Stream",
      subtitle: "SD-RTN™ global low-latency",
      domain: "agora",
    },
  },
  {
    id: "out-dashboard",
    type: "custom",
    position: { x: 0, y: 1280 },
    data: {
      label: "Test Dashboard UI",
      subtitle: "Dual-user simulation · Config drawer · Event log",
      domain: "client",
    },
  },
  {
    id: "out-monitoring",
    type: "custom",
    position: { x: 300, y: 1280 },
    data: {
      label: "Monitoring & Alerts",
      subtitle: "Auto-scale at 25k connections/node",
      domain: "socket",
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// ALL EDGES - Video Call Platform connections
// ═══════════════════════════════════════════════════════════════
const initialEdges: Edge[] = [
  // Clients → Auth (top-down)
  createEdge("e-contractor-auth", "client-contractor", "auth-jwt", "auth"),
  createEdge("e-seeker-auth", "client-seeker", "auth-jwt", "auth"),

  // Auth → Load Balancer (top-down)
  createEdge("e-auth-lb", "auth-jwt", "lb-nginx", "auth"),

  // Load Balancer → Socket.IO Nodes (top-down)
  createEdge("e-lb-node1", "lb-nginx", "socket-node1", "socket"),
  createEdge("e-lb-node2", "lb-nginx", "socket-node2", "socket"),

  // Socket Nodes → Call States (top-down)
  createEdge("e-socket-idle", "socket-node1", "state-idle", "state"),
  createEdge("e-socket-waiting", "socket-node1", "state-waiting", "state"),
  createEdge("e-socket-live", "socket-node1", "state-live", "state"),
  createEdge("e-socket-paused", "socket-node2", "state-paused", "state"),
  createEdge("e-socket-ended", "socket-node2", "state-ended", "state"),

  // Call States → Timer (top-down)
  createEdge("e-live-timer", "state-live", "timer-server", "socket"),
  createEdge("e-timer-sync", "timer-server", "timer-sync", "socket"),

  // Timer sync → Dashboard output (top-down)
  createEdge("e-sync-dashboard", "timer-sync", "out-dashboard", "client"),

  // Live State → Extension Flow (top-down)
  createEdge("e-live-request", "state-live", "pay-request", "payment"),
  createEdge("e-request-review", "pay-request", "pay-review", "payment"),
  createEdge("e-review-decision", "pay-review", "pay-decision", "payment"),
  createEdge("e-decision-webhook", "pay-decision", "pay-webhook", "payment"),
  createEdge("e-webhook-extend", "pay-webhook", "pay-extend", "payment"),

  // Extension result → Dashboard (top-down)
  createEdge("e-extend-dashboard", "pay-extend", "out-dashboard", "payment"),

  // Live State → Agora (top-down)
  createEdge("e-live-agora", "state-live", "agora-token", "agora"),
  createEdge("e-token-channel", "agora-token", "agora-channel", "agora"),

  // Ended state → Agora cleanup (top-down)
  createEdge("e-ended-forceleave", "state-ended", "agora-forceleave", "agora"),

  // Agora → Outputs (top-down)
  createEdge("e-agora-video", "agora-channel", "out-video", "agora"),
  createEdge("e-forceleave-video", "agora-forceleave", "out-video", "agora"),

  // Socket Nodes ↔ Redis (horizontal — side handles)
  createEdge("e-node1-redis", "socket-node1", "redis-pubsub", "redis", {
    sourceHandle: "right",
    targetHandle: "left",
  }),
  createEdge("e-node2-redis", "socket-node2", "redis-pubsub", "redis", {
    sourceHandle: "right",
    targetHandle: "left",
  }),

  // Redis → Database (top-down)
  createEdge("e-redis-postgres", "redis-ttl", "db-postgres", "db"),
  createEdge("e-redis-kafka", "redis-pubsub", "db-kafka", "db"),

  // Payment → Database (top-down)
  createEdge("e-payment-postgres", "pay-webhook", "db-postgres", "db"),

  // Resilience → Outputs (top-down)
  createEdge("e-metrics-monitor", "res-metrics", "out-monitoring", "socket"),
  createEdge("e-warnings-dashboard", "res-warnings", "out-dashboard", "socket"),

  // Monitoring feedback to LB (horizontal — side handles)
  createEdge("e-monitor-lb", "out-monitoring", "lb-nginx", "socket", {
    sourceHandle: "left",
    targetHandle: "right",
  }),
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const SystemArchitecture2: FC<{ setShowGraph: (show: boolean) => void }> = ({
  setShowGraph,
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isUserActive, setIsUserActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    console.log("User interaction detected, pausing auto-pan...");
    setIsUserActive(true);
    setShowGraph(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    console.log("User left, resuming auto-pan...");
    setIsUserActive(false);
    setShowGraph(false);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) =>
        addEdge({ ...params, type: "animated", animated: true }, edgesSnapshot),
      ),
    [],
  );

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: COLORS.bgPrimary }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `linear-gradient(${COLORS.textPrimary} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.textPrimary} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        fitView={false}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "animated",
          style: { stroke: COLORS.accent },
        }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        edgesFocusable={false}
        nodesFocusable={false}
      >
        <AutoPanController isUserActive={isUserActive} />

        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: COLORS.bgPrimary }}
        />
      </ReactFlow>

      {/* Global animation styles */}
      <style>{`
        @keyframes flowAnimation {
          from { stroke-dashoffset: 16; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default SystemArchitecture2;
