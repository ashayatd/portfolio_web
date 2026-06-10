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
// COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════
export const COLORS = {
  bgPrimary: "#0B0D0E",
  bgSecondary: "#111415",
  bgTertiary: "#15191A",
  bgElevated: "#1A1F20",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.06)",
  accent: "#3FA675",
  accentSoft: "rgba(63,166,117,0.12)",
  accentGlow: "rgba(63,166,117,0.35)",
  textPrimary: "#F3F5F4",
  textSecondary: "#B2BAB7",
  textMuted: "#707A77",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.12)",
  shadowDark: "rgba(0,0,0,0.45)",
};

// Domain colors for SuperApp
export const DOMAIN_COLORS = {
  user: {
    bg: "rgba(85,130,255,0.10)",
    border: "rgba(85,130,255,0.22)",
    glow: "rgba(85,130,255,0.18)",
  },
  auth: {
    bg: "rgba(220,120,120,0.10)",
    border: "rgba(220,120,120,0.20)",
    glow: "rgba(220,120,120,0.16)",
  },
  gateway: {
    bg: "rgba(255,204,102,0.10)",
    border: "rgba(255,204,102,0.22)",
    glow: "rgba(255,204,102,0.18)",
  },
  service: {
    bg: "rgba(63,166,117,0.10)",
    border: "rgba(63,166,117,0.22)",
    glow: "rgba(63,166,117,0.18)",
  },
  booking: {
    bg: "rgba(255,153,102,0.10)",
    border: "rgba(255,153,102,0.22)",
    glow: "rgba(255,153,102,0.18)",
  },
  payment: {
    bg: "rgba(176,120,255,0.10)",
    border: "rgba(176,120,255,0.22)",
    glow: "rgba(176,120,255,0.18)",
  },
  notification: {
    bg: "rgba(70,190,170,0.10)",
    border: "rgba(70,190,170,0.22)",
    glow: "rgba(70,190,170,0.18)",
  },
  analytics: {
    bg: "rgba(180,180,180,0.08)",
    border: "rgba(180,180,180,0.18)",
    glow: "rgba(180,180,180,0.14)",
  },
  data: {
    bg: "rgba(120,160,255,0.10)",
    border: "rgba(120,160,255,0.22)",
    glow: "rgba(120,160,255,0.18)",
  },
  iot: {
    bg: "rgba(255,100,100,0.10)",
    border: "rgba(255,100,100,0.20)",
    glow: "rgba(255,100,100,0.16)",
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
  "e-auth-gateway",
  "e-gateway-hotel",
  "e-gateway-bus",
  "e-gateway-food",
  "e-gateway-restaurant",
  "e-gateway-parcel",
  "e-gateway-vendor",
  "e-booking-payment",
  "e-payment-notification",
  "e-data-analytics",
  "e-analytics-ui",
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
// AUTO-PAN CONTROLLER
// ═══════════════════════════════════════════════════════════════
interface AutoPanControllerProps {
  isUserActive: boolean;
  setShowGraph: (show: boolean) => void;
}

const AutoPanController: FC<AutoPanControllerProps> = ({ isUserActive, setShowGraph }) => {
  const { setViewport } = useReactFlow();

  const CENTER_X = 0;
  const CENTER_Y = 700;
  const CANVAS_W = typeof window !== "undefined" ? window.innerWidth : 200;
  const CANVAS_H = typeof window !== "undefined" ? window.innerHeight : 800;
  const BASE_ZOOM = 0.55;

  const baseX = CANVAS_W / 4 - CENTER_X * BASE_ZOOM;
  const baseY = CANVAS_H / 5 - CENTER_Y * BASE_ZOOM;

  useEffect(() => {
    setShowGraph(isUserActive);
    
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
// ALL NODES - SuperApp Platform Architecture
// ═══════════════════════════════════════════════════════════════

const initialNodes: Node[] = [
  // ═══ TITLE ═══
  {
    id: "title",
    type: "custom",
    position: { x: 0, y: -60 },
    data: { label: "SuperApp Platform — Microservices Architecture", isLabel: true },
  },
  {
    id: "subtitle",
    type: "custom",
    position: { x: 0, y: -30 },
    data: {
      label: "Travel, Hospitality & Commerce Ecosystem",
      isLabel: true,
    },
  },

  // ═══ ACTORS / USER LAYER (y=40) ═══
  {
    id: "label-actors",
    type: "custom",
    position: { x: -500, y: 10 },
    data: { label: "USER LAYER", isLabel: true },
  },
  {
    id: "actor-customer",
    type: "custom",
    position: { x: -400, y: 40 },
    data: {
      label: "Customer",
      subtitle: "End user · Booking · Ordering",
      domain: "user",
    },
  },
  {
    id: "actor-vendor",
    type: "custom",
    position: { x: -150, y: 40 },
    data: {
      label: "Vendor",
      subtitle: "Hotel · Restaurant · Bus operator",
      domain: "user",
    },
  },
  {
    id: "actor-delivery",
    type: "custom",
    position: { x: 100, y: 40 },
    data: {
      label: "Delivery Partner",
      subtitle: "Logistics · Fleet · Courier",
      domain: "user",
    },
  },
  {
    id: "actor-admin",
    type: "custom",
    position: { x: 350, y: 40 },
    data: {
      label: "Admin",
      subtitle: "Platform ops · RBAC · Analytics",
      domain: "user",
    },
  },

  // ═══ AUTH & IDENTITY (y=160) ═══
  {
    id: "label-auth",
    type: "custom",
    position: { x: -500, y: 130 },
    data: { label: "AUTH & IDENTITY", isLabel: true },
  },
  {
    id: "auth-sso",
    type: "custom",
    position: { x: -200, y: 160 },
    data: {
      label: "SSO & Identity",
      subtitle: "JWT · OAuth2 · Session mgmt",
      domain: "auth",
    },
  },
  {
    id: "auth-rbac",
    type: "custom",
    position: { x: 150, y: 160 },
    data: {
      label: "RBAC Engine",
      subtitle: "Roles · Permissions · Policies",
      domain: "auth",
    },
  },

  // ═══ API GATEWAY (y=280) ═══
  {
    id: "label-gateway",
    type: "custom",
    position: { x: -500, y: 250 },
    data: { label: "API GATEWAY & ROUTING", isLabel: true },
  },
  {
    id: "gateway",
    type: "custom",
    position: { x: -25, y: 280 },
    data: {
      label: "API Gateway",
      subtitle: "Rate limiting · Load balancing · Routing",
      domain: "gateway",
    },
  },

  // ═══ CORE SERVICES (y=400) ═══
  {
    id: "label-services",
    type: "custom",
    position: { x: -500, y: 370 },
    data: { label: "CORE SERVICES", isLabel: true },
  },
  {
    id: "svc-hotel",
    type: "custom",
    position: { x: -450, y: 400 },
    data: {
      label: "Hotel Service",
      subtitle: "Search · Availability · Booking",
      domain: "booking",
    },
  },
  {
    id: "svc-bus",
    type: "custom",
    position: { x: -270, y: 400 },
    data: {
      label: "Bus Service",
      subtitle: "Routes · Seats · Reservations",
      domain: "booking",
    },
  },
  {
    id: "svc-food",
    type: "custom",
    position: { x: -90, y: 400 },
    data: {
      label: "Food Delivery",
      subtitle: "Menu · Cart · Real-time tracking",
      domain: "service",
    },
  },
  {
    id: "svc-restaurant",
    type: "custom",
    position: { x: 90, y: 400 },
    data: {
      label: "Restaurant Reservations",
      subtitle: "Table booking · Time slots",
      domain: "booking",
    },
  },
  {
    id: "svc-parcel",
    type: "custom",
    position: { x: 270, y: 400 },
    data: {
      label: "Parcel & Logistics",
      subtitle: "Pickup · Route · Delivery",
      domain: "service",
    },
  },
  {
    id: "svc-vendor",
    type: "custom",
    position: { x: 450, y: 400 },
    data: {
      label: "Vendor Management",
      subtitle: "Onboarding · Catalog · Ops",
      domain: "service",
    },
  },

  // ═══ BOOKING & ORDER LIFECYCLE (y=520) ═══
  {
    id: "label-lifecycle",
    type: "custom",
    position: { x: -500, y: 490 },
    data: { label: "BOOKING & ORDER LIFECYCLE", isLabel: true },
  },
  {
    id: "lifecycle-cart",
    type: "custom",
    position: { x: -350, y: 520 },
    data: {
      label: "Cart & Checkout",
      subtitle: "Item selection · Pricing",
      domain: "booking",
    },
  },
  {
    id: "lifecycle-pricing",
    type: "custom",
    position: { x: -150, y: 520 },
    data: {
      label: "Dynamic Pricing",
      subtitle: "Offers · Coupons · Surge",
      domain: "booking",
    },
  },
  {
    id: "lifecycle-inventory",
    type: "custom",
    position: { x: 50, y: 520 },
    data: {
      label: "Inventory & Availability",
      subtitle: "Real-time stock · Slots",
      domain: "service",
    },
  },
  {
    id: "lifecycle-allocation",
    type: "custom",
    position: { x: 250, y: 520 },
    data: {
      label: "Order Allocation",
      subtitle: "Driver · Vendor · Auto-assign",
      domain: "service",
    },
  },
  {
    id: "lifecycle-tracking",
    type: "custom",
    position: { x: 450, y: 520 },
    data: {
      label: "Status Tracking",
      subtitle: "Real-time updates · ETA",
      domain: "service",
    },
  },

  // ═══ PAYMENT ENGINE (y=640) ═══
  {
    id: "label-payment",
    type: "custom",
    position: { x: -500, y: 610 },
    data: { label: "PAYMENT ENGINE", isLabel: true },
  },
  {
    id: "pay-gateway",
    type: "custom",
    position: { x: -300, y: 640 },
    data: {
      label: "Payment Gateway",
      subtitle: "UPI · Cards · Wallets · BNPL",
      domain: "payment",
    },
  },
  {
    id: "pay-transaction",
    type: "custom",
    position: { x: -50, y: 640 },
    data: {
      label: "Transaction Mgmt",
      subtitle: "Ledger · Refunds · Reconciliation",
      domain: "payment",
    },
  },
  {
    id: "pay-wallet",
    type: "custom",
    position: { x: 200, y: 640 },
    data: {
      label: "Digital Wallet",
      subtitle: "Balance · Rewards · Cashback",
      domain: "payment",
    },
  },
  {
    id: "pay-fraud",
    type: "custom",
    position: { x: 400, y: 640 },
    data: {
      label: "Fraud & Risk",
      subtitle: "Detection · Rules · Limits",
      domain: "payment",
    },
  },

  // ═══ NOTIFICATION & ENGAGEMENT (y=760) ═══
  {
    id: "label-notification",
    type: "custom",
    position: { x: -500, y: 730 },
    data: { label: "NOTIFICATION & ENGAGEMENT", isLabel: true },
  },
  {
    id: "notif-email",
    type: "custom",
    position: { x: -300, y: 760 },
    data: {
      label: "Email Service",
      subtitle: "Transactional · Marketing",
      domain: "notification",
    },
  },
  {
    id: "notif-sms",
    type: "custom",
    position: { x: -100, y: 760 },
    data: {
      label: "SMS Gateway",
      subtitle: "OTP · Alerts · Promotions",
      domain: "notification",
    },
  },
  {
    id: "notif-push",
    type: "custom",
    position: { x: 100, y: 760 },
    data: {
      label: "Push Notifications",
      subtitle: "FCM · APNS · In-app",
      domain: "notification",
    },
  },
  {
    id: "notif-websocket",
    type: "custom",
    position: { x: 300, y: 760 },
    data: {
      label: "Real-Time Events",
      subtitle: "WebSocket · SSE · Pub/Sub",
      domain: "notification",
    },
  },

  // ═══ ANALYTICS & REPORTING (y=880) ═══
  {
    id: "label-analytics",
    type: "custom",
    position: { x: -500, y: 850 },
    data: { label: "ANALYTICS & REPORTING", isLabel: true },
  },
  {
    id: "analytics-events",
    type: "custom",
    position: { x: -350, y: 880 },
    data: {
      label: "Event Pipeline",
      subtitle: "Kafka · Clickstream · ETL",
      domain: "analytics",
    },
  },
  {
    id: "analytics-warehouse",
    type: "custom",
    position: { x: -150, y: 880 },
    data: {
      label: "Data Warehouse",
      subtitle: "BigQuery · Snowflake · Redshift",
      domain: "analytics",
    },
  },
  {
    id: "analytics-dashboard",
    type: "custom",
    position: { x: 50, y: 880 },
    data: {
      label: "Operational Dashboards",
      subtitle: "Admin · Vendor · Real-time",
      domain: "analytics",
    },
  },
  {
    id: "analytics-ml",
    type: "custom",
    position: { x: 250, y: 880 },
    data: {
      label: "ML & Recommendations",
      subtitle: "Personalization · Forecasting",
      domain: "analytics",
    },
  },
  {
    id: "analytics-reports",
    type: "custom",
    position: { x: 450, y: 880 },
    data: {
      label: "Reports Engine",
      subtitle: "P&L · Revenue · Compliance",
      domain: "analytics",
    },
  },

  // ═══ DATA & EVENT LAYER (y=1000) ═══
  {
    id: "label-data",
    type: "custom",
    position: { x: -500, y: 970 },
    data: { label: "DATA & EVENT LAYER", isLabel: true },
  },
  {
    id: "data-postgres",
    type: "custom",
    position: { x: -300, y: 1000 },
    data: {
      label: "PostgreSQL Cluster",
      subtitle: "Transactional · ACID · Sharded",
      domain: "data",
    },
  },
  {
    id: "data-redis",
    type: "custom",
    position: { x: -100, y: 1000 },
    data: {
      label: "Redis Cluster",
      subtitle: "Cache · Sessions · Pub/Sub",
      domain: "data",
    },
  },
  {
    id: "data-mongo",
    type: "custom",
    position: { x: 100, y: 1000 },
    data: {
      label: "MongoDB",
      subtitle: "Catalog · Logs · Flexible schema",
      domain: "data",
    },
  },
  {
    id: "data-s3",
    type: "custom",
    position: { x: 300, y: 1000 },
    data: {
      label: "Object Storage",
      subtitle: "S3 · Images · Documents · Backups",
      domain: "data",
    },
  },

  // ═══ OUTPUTS / FRONTEND LAYER (y=1120) ═══
  {
    id: "label-output",
    type: "custom",
    position: { x: -500, y: 1090 },
    data: { label: "FRONTEND & OUTPUTS", isLabel: true },
  },
  {
    id: "out-customer",
    type: "custom",
    position: { x: -350, y: 1120 },
    data: {
      label: "Customer App",
      subtitle: "iOS · Android · Web · PWA",
      domain: "user",
    },
  },
  {
    id: "out-vendor",
    type: "custom",
    position: { x: -100, y: 1120 },
    data: {
      label: "Vendor Portal",
      subtitle: "Orders · Inventory · Earnings",
      domain: "user",
    },
  },
  {
    id: "out-delivery",
    type: "custom",
    position: { x: 150, y: 1120 },
    data: {
      label: "Delivery App",
      subtitle: "Route · Earnings · Status",
      domain: "user",
    },
  },
  {
    id: "out-admin",
    type: "custom",
    position: { x: 400, y: 1120 },
    data: {
      label: "Admin Panel",
      subtitle: "RBAC · Analytics · Operations",
      domain: "user",
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// ALL EDGES - SuperApp connections
// ═══════════════════════════════════════════════════════════════
const initialEdges: Edge[] = [
  // Actors → Auth
  createEdge("e-customer-auth", "actor-customer", "auth-sso", "auth"),
  createEdge("e-vendor-auth", "actor-vendor", "auth-sso", "auth"),
  createEdge("e-delivery-auth", "actor-delivery", "auth-sso", "auth"),
  createEdge("e-admin-auth", "actor-admin", "auth-rbac", "auth"),

  // Auth → Gateway
  createEdge("e-auth-gateway", "auth-sso", "gateway", "auth"),
  createEdge("e-rbac-gateway", "auth-rbac", "gateway", "auth"),

  // Gateway → Core Services (top-down)
  createEdge("e-gateway-hotel", "gateway", "svc-hotel", "gateway"),
  createEdge("e-gateway-bus", "gateway", "svc-bus", "gateway"),
  createEdge("e-gateway-food", "gateway", "svc-food", "gateway"),
  createEdge("e-gateway-restaurant", "gateway", "svc-restaurant", "gateway"),
  createEdge("e-gateway-parcel", "gateway", "svc-parcel", "gateway"),
  createEdge("e-gateway-vendor", "gateway", "svc-vendor", "gateway"),

  // Services → Lifecycle (top-down)
  createEdge("e-hotel-cart", "svc-hotel", "lifecycle-cart", "booking"),
  createEdge("e-bus-cart", "svc-bus", "lifecycle-cart", "booking"),
  createEdge("e-food-cart", "svc-food", "lifecycle-cart", "service"),
  createEdge("e-restaurant-cart", "svc-restaurant", "lifecycle-cart", "booking"),
  createEdge("e-parcel-cart", "svc-parcel", "lifecycle-cart", "service"),
  createEdge("e-vendor-cart", "svc-vendor", "lifecycle-cart", "service"),

  // Lifecycle internal flow (left to right)
  createEdge("e-cart-pricing", "lifecycle-cart", "lifecycle-pricing", "booking"),
  createEdge("e-pricing-inventory", "lifecycle-pricing", "lifecycle-inventory", "service"),
  createEdge("e-inventory-allocation", "lifecycle-inventory", "lifecycle-allocation", "service"),
  createEdge("e-allocation-tracking", "lifecycle-allocation", "lifecycle-tracking", "service"),

  // Lifecycle → Payment (top-down)
  createEdge("e-cart-payment", "lifecycle-cart", "pay-gateway", "payment"),
  createEdge("e-pricing-payment", "lifecycle-pricing", "pay-gateway", "payment"),
  createEdge("e-tracking-payment", "lifecycle-tracking", "pay-transaction", "payment"),

  // Payment internal flow
  createEdge("e-gateway-transaction", "pay-gateway", "pay-transaction", "payment"),
  createEdge("e-transaction-wallet", "pay-transaction", "pay-wallet", "payment"),
  createEdge("e-transaction-fraud", "pay-transaction", "pay-fraud", "payment"),

  // Payment → Notification (top-down)
  createEdge("e-payment-email", "pay-transaction", "notif-email", "notification"),
  createEdge("e-payment-sms", "pay-transaction", "notif-sms", "notification"),
  createEdge("e-payment-push", "pay-transaction", "notif-push", "notification"),

  // Tracking → Notification (top-down)
  createEdge("e-tracking-push", "lifecycle-tracking", "notif-push", "notification"),
  createEdge("e-tracking-websocket", "lifecycle-tracking", "notif-websocket", "notification"),

  // Allocation → Notification (top-down)
  createEdge("e-allocation-sms", "lifecycle-allocation", "notif-sms", "notification"),

  // Services → Notification (top-down)
  createEdge("e-hotel-email", "svc-hotel", "notif-email", "notification"),
  createEdge("e-bus-sms", "svc-bus", "notif-sms", "notification"),
  createEdge("e-food-push", "svc-food", "notif-push", "notification"),

  // Notification → Outputs (top-down)
  createEdge("e-email-customer", "notif-email", "out-customer", "notification"),
  createEdge("e-sms-customer", "notif-sms", "out-customer", "notification"),
  createEdge("e-push-customer", "notif-push", "out-customer", "notification"),
  createEdge("e-websocket-customer", "notif-websocket", "out-customer", "notification"),

  // Services → Data (top-down)
  createEdge("e-hotel-data", "svc-hotel", "data-postgres", "data"),
  createEdge("e-bus-data", "svc-bus", "data-postgres", "data"),
  createEdge("e-food-data", "svc-food", "data-mongo", "data"),
  createEdge("e-parcel-data", "svc-parcel", "data-postgres", "data"),
  createEdge("e-vendor-data", "svc-vendor", "data-mongo", "data"),

  // Payment → Data (top-down)
  createEdge("e-payment-postgres", "pay-transaction", "data-postgres", "data"),
  createEdge("e-wallet-redis", "pay-wallet", "data-redis", "data"),

  // Lifecycle → Data (top-down)
  createEdge("e-tracking-data", "lifecycle-tracking", "data-postgres", "data"),
  createEdge("e-inventory-redis", "lifecycle-inventory", "data-redis", "data"),

  // Data → Analytics (top-down)
  createEdge("e-data-events", "data-postgres", "analytics-events", "analytics"),
  createEdge("e-redis-events", "data-redis", "analytics-events", "analytics"),
  createEdge("e-mongo-events", "data-mongo", "analytics-events", "analytics"),

  // Analytics internal flow
  createEdge("e-events-warehouse", "analytics-events", "analytics-warehouse", "analytics"),
  createEdge("e-warehouse-dashboard", "analytics-warehouse", "analytics-dashboard", "analytics"),
  createEdge("e-warehouse-ml", "analytics-warehouse", "analytics-ml", "analytics"),
  createEdge("e-warehouse-reports", "analytics-warehouse", "analytics-reports", "analytics"),

  // Analytics → Outputs (top-down)
  createEdge("e-dashboard-admin", "analytics-dashboard", "out-admin", "analytics"),
  createEdge("e-dashboard-vendor", "analytics-dashboard", "out-vendor", "analytics"),
  createEdge("e-ml-customer", "analytics-ml", "out-customer", "analytics"),
  createEdge("e-reports-admin", "analytics-reports", "out-admin", "analytics"),

  // Gateway → Outputs (top-down for direct API calls)
  createEdge("e-gateway-customer", "gateway", "out-customer", "gateway"),
  createEdge("e-gateway-vendor-out", "gateway", "out-vendor", "gateway"),
  createEdge("e-gateway-delivery", "gateway", "out-delivery", "gateway"),
  createEdge("e-gateway-admin", "gateway", "out-admin", "gateway"),
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const SystemArchitecture3: FC<{ setShowGraph: (show: boolean) => void }> = ({ setShowGraph }) => {
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
  }, [setShowGraph]);

  const handleMouseLeave = useCallback(() => {
    console.log("User left, resuming auto-pan...");
    setIsUserActive(false);
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.55 }}
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
        <AutoPanController isUserActive={isUserActive} setShowGraph={setShowGraph} />

        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: COLORS.bgPrimary }}
        />
      </ReactFlow>

      <style>{`
        @keyframes flowAnimation {
          from { stroke-dashoffset: 16; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default SystemArchitecture3;