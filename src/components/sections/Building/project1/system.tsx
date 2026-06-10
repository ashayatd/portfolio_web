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
  game: {
    bg: "rgba(85,130,255,0.10)",
    border: "rgba(85,130,255,0.22)",
    glow: "rgba(85,130,255,0.18)",
  },

  player: {
    bg: "rgba(63,166,117,0.10)",
    border: "rgba(63,166,117,0.22)",
    glow: "rgba(63,166,117,0.18)",
  },

  canteen: {
    bg: "rgba(255,153,102,0.10)",
    border: "rgba(255,153,102,0.22)",
    glow: "rgba(255,153,102,0.18)",
  },

  billing: {
    bg: "rgba(176,120,255,0.10)",
    border: "rgba(176,120,255,0.22)",
    glow: "rgba(176,120,255,0.18)",
  },

  admin: {
    bg: "rgba(255,204,102,0.10)",
    border: "rgba(255,204,102,0.22)",
    glow: "rgba(255,204,102,0.18)",
  },

  iot: {
    bg: "rgba(70,190,170,0.10)",
    border: "rgba(70,190,170,0.22)",
    glow: "rgba(70,190,170,0.18)",
  },

  stats: {
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
  "e-auth-router",
  "e-router-game",
  "e-assembly-review",
  "e-review-payment",
  "e-data-rt",
  "e-rt-ui",
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

  const strokeColor = data?.color || COLORS.accent;
  const glowColor = data?.color || COLORS.accentGlow;

  const isAnimated = ACTIVE_EDGES.has(id);

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
          style={{
            strokeDasharray: "6 10",
            animation: "flowAnimation 2.5s linear infinite",
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

  // Center of the node graph (approximate midpoint of all nodes)
  // nodes span roughly x: -500 to 500, y: -60 to 1320
  const CENTER_X = 0;
  const CENTER_Y = 630;
  const CANVAS_W = typeof window !== "undefined" ? window.innerWidth : 200;
  const CANVAS_H = typeof window !== "undefined" ? window.innerHeight : 800;
  const BASE_ZOOM = 0.6;

  // The viewport x/y that puts the graph center in the middle of the canvas
  const baseX = CANVAS_W / 4 - CENTER_X * BASE_ZOOM;
  const baseY = CANVAS_H / 5 - CENTER_Y * BASE_ZOOM;

  useEffect(() => {
    if (isUserActive) return; // ← stop animation during user interaction

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

    // Wait for the reset animation to finish before orbiting
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
// ALL NODES - Complete HotPocket System Architecture
// ═══════════════════════════════════════════════════════════════

// Row spacing: y = 0, 100, 220, 340, 460, 580, 700, 820, 940, 1060
// Column centers: x = -400, -200, 0, 200, 400

const initialNodes: Node[] = [
  // ═══ TITLE ═══
  {
    id: "title",
    type: "custom",
    position: { x: 0, y: -60 },
    data: { label: "HotPocket — High-Level System Flow", isLabel: true },
  },
  {
    id: "subtitle",
    type: "custom",
    position: { x: 0, y: -30 },
    data: {
      label: "End-to-end system flow across all 14 feature domains",
      isLabel: true,
    },
  },

  // ═══ ACTORS (y=40) ═══
  {
    id: "label-actors",
    type: "custom",
    position: { x: -500, y: 10 },
    data: { label: "ACTORS", isLabel: true },
  },
  {
    id: "actor-admin",
    type: "custom",
    position: { x: -350, y: 40 },
    data: { label: "Admin", subtitle: "Full access", domain: "admin" },
  },
  {
    id: "actor-staff",
    type: "custom",
    position: { x: 0, y: 40 },
    data: { label: "Staff", subtitle: "Permission-scoped", domain: "admin" },
  },
  {
    id: "actor-player",
    type: "custom",
    position: { x: 350, y: 40 },
    data: {
      label: "Player",
      subtitle: "Unique ID validated",
      domain: "player",
    },
  },

  // ═══ AUTH & RBAC (y=140) ═══
  {
    id: "label-auth",
    type: "custom",
    position: { x: -500, y: 110 },
    data: { label: "AUTH & RBAC", isLabel: true },
  },
  {
    id: "auth-rbac",
    type: "custom",
    position: { x: 0, y: 140 },
    data: {
      label: "Roles & Permissions Engine",
      subtitle:
        "25-30 fine-grained permissions · View / Edit / Delete / Billing / Stats access",
      domain: "auth",
    },
  },

  // ═══ CORE ROUTING (y=260) ═══
  {
    id: "label-routing",
    type: "custom",
    position: { x: -500, y: 230 },
    data: { label: "CORE ROUTING", isLabel: true },
  },
  {
    id: "router",
    type: "custom",
    position: { x: 0, y: 260 },
    data: {
      label: "Request Router",
      subtitle: "Routes to permitted module only",
      domain: "stats",
    },
  },

  // ═══ CORE MODULES (y=380) ═══
  {
    id: "label-modules",
    type: "custom",
    position: { x: -500, y: 350 },
    data: { label: "CORE MODULES", isLabel: true },
  },
  {
    id: "mod-game",
    type: "custom",
    position: { x: -400, y: 380 },
    data: {
      label: "Game Engine",
      subtitle: "Start/Stop/Cancel",
      domain: "game",
    },
  },
  {
    id: "mod-player",
    type: "custom",
    position: { x: -200, y: 380 },
    data: {
      label: "Player Mgmt",
      subtitle: "CRUD + history",
      domain: "player",
    },
  },
  {
    id: "mod-canteen",
    type: "custom",
    position: { x: 0, y: 380 },
    data: {
      label: "Canteen",
      subtitle: "Raw material + menu",
      domain: "canteen",
    },
  },
  {
    id: "mod-billing",
    type: "custom",
    position: { x: 200, y: 380 },
    data: {
      label: "Billing Engine",
      subtitle: "Player-oriented bills",
      domain: "billing",
    },
  },
  {
    id: "mod-employee",
    type: "custom",
    position: { x: 400, y: 380 },
    data: {
      label: "Employee Mgmt",
      subtitle: "CRUD + activity log",
      domain: "admin",
    },
  },

  // ═══ GAME ENGINE DETAIL (y=500) ═══
  {
    id: "label-game-detail",
    type: "custom",
    position: { x: -500, y: 470 },
    data: { label: "GAME ENGINE DETAIL", isLabel: true },
  },
  {
    id: "game-timer",
    type: "custom",
    position: { x: -400, y: 500 },
    data: {
      label: "Timer Start",
      subtitle: "Real-time tracking",
      domain: "game",
    },
  },
  {
    id: "game-rule",
    type: "custom",
    position: { x: -200, y: 500 },
    data: {
      label: "2.5 min Rule",
      subtitle: "Auto round-off billing",
      domain: "game",
    },
  },
  {
    id: "game-addremove",
    type: "custom",
    position: { x: 0, y: 500 },
    data: {
      label: "Add/Remove Player",
      subtitle: "Billing adjustment",
      domain: "game",
    },
  },
  {
    id: "game-partial",
    type: "custom",
    position: { x: 200, y: 500 },
    data: {
      label: "Partial Close",
      subtitle: "Split cost by player",
      domain: "game",
    },
  },

  // ═══ IoT TRIGGER (y=600) ═══
  {
    id: "label-iot",
    type: "custom",
    position: { x: -500, y: 570 },
    data: { label: "IoT TRIGGER ⚡", isLabel: true },
  },
  {
    id: "iot-trigger",
    type: "custom",
    position: { x: -200, y: 600 },
    data: {
      label: "IoT Trigger ⚡",
      subtitle: "Light ON/OFF auto sync",
      domain: "iot",
    },
  },

  // ═══ BILLING ENGINE (y=720) ═══
  {
    id: "label-billing",
    type: "custom",
    position: { x: -500, y: 690 },
    data: { label: "BILLING ENGINE", isLabel: true },
  },
  {
    id: "bill-assembly",
    type: "custom",
    position: { x: -300, y: 720 },
    data: {
      label: "Bill Assembly",
      subtitle: "Game + canteen + extras",
      domain: "billing",
    },
  },
  {
    id: "bill-review",
    type: "custom",
    position: { x: 0, y: 720 },
    data: {
      label: "Admin Review",
      subtitle: "Modify & approve before pay",
      domain: "admin",
    },
  },
  {
    id: "bill-payment",
    type: "custom",
    position: { x: 300, y: 720 },
    data: {
      label: "Payment System",
      subtitle: "Online / Offline / Credit",
      domain: "billing",
    },
  },

  // ═══ PAYMENT DETAIL (y=840) ═══
  {
    id: "label-payment",
    type: "custom",
    position: { x: -500, y: 810 },
    data: { label: "PAYMENT DETAIL", isLabel: true },
  },
  {
    id: "pay-full",
    type: "custom",
    position: { x: -300, y: 840 },
    data: { label: "Paid (full)", domain: "billing" },
  },
  {
    id: "pay-partial",
    type: "custom",
    position: { x: -100, y: 840 },
    data: { label: "Partial pay", domain: "billing" },
  },
  {
    id: "pay-credit",
    type: "custom",
    position: { x: 100, y: 840 },
    data: { label: "Credit issued", domain: "billing" },
  },
  {
    id: "pay-return",
    type: "custom",
    position: { x: 300, y: 840 },
    data: { label: "Return/recovery", domain: "billing" },
  },

  // ═══ ANALYTICS & REPORTING (y=960) ═══
  {
    id: "label-analytics",
    type: "custom",
    position: { x: -500, y: 930 },
    data: { label: "ANALYTICS & REPORTING", isLabel: true },
  },
  {
    id: "report-table",
    type: "custom",
    position: { x: -400, y: 960 },
    data: { label: "Table Revenue", subtitle: "Game earnings", domain: "game" },
  },
  {
    id: "report-canteen",
    type: "custom",
    position: { x: -200, y: 960 },
    data: {
      label: "Canteen Revenue",
      subtitle: "Menu sales",
      domain: "canteen",
    },
  },
  {
    id: "report-pnl",
    type: "custom",
    position: { x: 0, y: 960 },
    data: {
      label: "P&L Report",
      subtitle: "Combined profit/loss",
      domain: "stats",
    },
  },
  {
    id: "report-credit",
    type: "custom",
    position: { x: 200, y: 960 },
    data: {
      label: "Credit Report",
      subtitle: "Unpaid balance",
      domain: "billing",
    },
  },
  {
    id: "report-ops",
    type: "custom",
    position: { x: 400, y: 960 },
    data: {
      label: "Ops Report",
      subtitle: "Stock · employee · table",
      domain: "stats",
    },
  },

  // ═══ DATA & LOG LAYER (y=1080) ═══
  {
    id: "label-data",
    type: "custom",
    position: { x: -500, y: 1050 },
    data: { label: "DATA & LOG LAYER", isLabel: true },
  },
  {
    id: "data-store",
    type: "custom",
    position: { x: 0, y: 1080 },
    data: {
      label: "Persistent Data Store + Audit Logs",
      subtitle: "Game · billing · credit · canteen · employee · CUD history",
      domain: "stats",
    },
  },

  // ═══ REAL-TIME ENGINE (y=1200) ═══
  {
    id: "label-rt",
    type: "custom",
    position: { x: -500, y: 1170 },
    data: { label: "REAL-TIME ENGINE ★ KEY DIFFERENTIATOR", isLabel: true },
  },
  {
    id: "rt-engine",
    type: "custom",
    position: { x: 0, y: 1200 },
    data: {
      label: "Real-Time Broadcast Engine",
      subtitle: "Table status · cost · credit · stock · menu availability",
      domain: "iot",
    },
  },

  // ═══ OUTPUTS (y=1320) ═══
  {
    id: "label-output",
    type: "custom",
    position: { x: -500, y: 1290 },
    data: { label: "OUTPUTS", isLabel: true },
  },
  {
    id: "out-iot",
    type: "custom",
    position: { x: -200, y: 1320 },
    data: {
      label: "IoT Hardware Layer",
      subtitle: "Light sync with table state",
      domain: "iot",
    },
  },
  {
    id: "out-ui",
    type: "custom",
    position: { x: 200, y: 1320 },
    data: {
      label: "Staff / Admin UI",
      subtitle: "Permission-rendered views",
      domain: "stats",
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// ALL EDGES - Complete connections from diagram
// ═══════════════════════════════════════════════════════════════
const initialEdges: Edge[] = [
  // Actors → Auth
  createEdge("e-admin-auth", "actor-admin", "auth-rbac", "auth"),
  createEdge("e-staff-auth", "actor-staff", "auth-rbac", "auth"),
  createEdge("e-player-auth", "actor-player", "auth-rbac", "auth"),

  // Auth → Router
  createEdge("e-auth-router", "auth-rbac", "router", "auth"),

  // Router → Core Modules
  createEdge("e-router-game", "router", "mod-game", "game"),
  createEdge("e-router-player", "router", "mod-player", "player"),
  createEdge("e-router-canteen", "router", "mod-canteen", "canteen"),
  createEdge("e-router-billing", "router", "mod-billing", "billing"),
  createEdge("e-router-employee", "router", "mod-employee", "admin"),

  // Game Engine → Game Detail
  createEdge("e-game-timer", "mod-game", "game-timer", "game"),
  createEdge("e-game-rule", "mod-game", "game-rule", "game"),
  createEdge("e-game-addremove", "mod-game", "game-addremove", "game"),
  createEdge("e-game-partial", "mod-game", "game-partial", "game"),

  // Game Timer → IoT Trigger
  createEdge("e-timer-iot", "game-timer", "iot-trigger", "iot"),

  // Game AddRemove → Billing Assembly
  createEdge(
    "e-addremove-assembly",
    "game-addremove",
    "bill-assembly",
    "billing",
  ),

  // Game Partial → Billing Assembly
  createEdge("e-partial-assembly", "game-partial", "bill-assembly", "billing"),

  // Canteen → Billing Assembly
  createEdge("e-canteen-assembly", "mod-canteen", "bill-assembly", "canteen"),

  // Billing Assembly → Admin Review
  createEdge("e-assembly-review", "bill-assembly", "bill-review", "admin"),

  // Admin Review → Payment System
  createEdge("e-review-payment", "bill-review", "bill-payment", "billing"),

  // Payment System → Payment Details
  createEdge("e-payment-full", "bill-payment", "pay-full", "billing"),
  createEdge("e-payment-partial", "bill-payment", "pay-partial", "billing"),
  createEdge("e-payment-credit", "bill-payment", "pay-credit", "billing"),
  createEdge("e-payment-return", "bill-payment", "pay-return", "billing"),

  // Payment Details → Analytics
  createEdge("e-full-table", "pay-full", "report-table", "game"),
  createEdge("e-full-canteen", "pay-full", "report-canteen", "canteen"),
  createEdge("e-partial-pnl", "pay-partial", "report-pnl", "stats"),
  createEdge("e-credit-credit", "pay-credit", "report-credit", "billing"),
  createEdge("e-return-ops", "pay-return", "report-ops", "stats"),

  // Also connect all payments to data store
  createEdge("e-pay-data", "pay-full", "data-store", "stats"),
  createEdge("e-partial-data", "pay-partial", "data-store", "stats"),
  createEdge("e-credit-data", "pay-credit", "data-store", "stats"),
  createEdge("e-return-data", "pay-return", "data-store", "stats"),

  // Analytics → Data Store
  createEdge("e-table-data", "report-table", "data-store", "stats"),
  createEdge("e-canteen-data", "report-canteen", "data-store", "stats"),
  createEdge("e-pnl-data", "report-pnl", "data-store", "stats"),
  createEdge("e-creditreport-data", "report-credit", "data-store", "stats"),
  createEdge("e-ops-data", "report-ops", "data-store", "stats"),

  // Data Store → Real-Time Engine
  createEdge("e-data-rt", "data-store", "rt-engine", "iot"),

  // Real-Time Engine → Outputs
  createEdge("e-rt-iot", "rt-engine", "out-iot", "iot"),
  createEdge("e-rt-ui", "rt-engine", "out-ui", "stats"),
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const SystemArchitecture: FC<{ setShowGraph: (show: boolean) => void }> = ({setShowGraph,}) => {
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

export default SystemArchitecture;
