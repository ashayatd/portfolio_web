"use client";

import { motion, type Variants } from "framer-motion";
import {
  Layers,
  MonitorSmartphone,
  Server,
  Database,
  Zap,
  Cloud,
  Network,
  Gauge,
  Wand2,
  GitBranch,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiSocketdotio,
  SiDocker,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiGit,
  SiGithubactions,
  SiFirebase,
  SiGooglecloud,
  SiFramer,
  SiChartdotjs,
  SiLottiefiles,
} from "react-icons/si";
import type { IconType } from "react-icons";

type AnyIcon =
  | LucideIcon
  | IconType
  | ((props: {
      className?: string;
      style?: React.CSSProperties;
    }) => React.JSX.Element);

// BullMQ has no brand icon in the set — render its mark from an image.
const BullMqIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <img
    className={className}
    style={style}
    alt="BullMQ"
    src="https://user-images.githubusercontent.com/95200/143832033-32e868df-f3b0-4251-97fb-c64809a43d36.png"
  />
);

interface Tech {
  Icon: AnyIcon;
  name: string;
  color: string;
  /** Short tooltip blurb shown on hover. */
  desc: string;
}
interface TechGroup {
  label: string;
  tech: Tech[];
}
interface Domain {
  id: string;
  title: string;
  icon: LucideIcon;
  caps: string[];
  tech?: Tech[];
  /** When set, render labelled technology groups instead of a flat row. */
  techGroups?: TechGroup[];
}

const PIPELINE = [
  "Idea",
  "Architecture",
  "Implementation",
  "Deployment",
  "Scaling",
];

const DOMAINS: Domain[] = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    icon: MonitorSmartphone,
    caps: ["Component Architecture", "State Management", "Responsive UX", "Performance"],
    tech: [
      { Icon: SiReact, name: "React", color: "#61DAFB", desc: "Component-based UI library." },
      { Icon: SiNextdotjs, name: "Next.js", color: "#111827", desc: "React framework for SSR and routing." },
      { Icon: SiTypescript, name: "TypeScript", color: "#3178C6", desc: "Typed JavaScript for safer code." },
      { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4", desc: "Utility-first CSS framework." },
    ],
  },
  {
    id: "backend",
    title: "Backend Engineering",
    icon: Server,
    caps: ["REST APIs", "Auth & RBAC", "Business Logic", "Integrations"],
    tech: [
      { Icon: SiNodedotjs, name: "Node.js", color: "#339933", desc: "JavaScript server runtime." },
      { Icon: SiExpress, name: "Express", color: "#111827", desc: "Minimal Node.js web framework." },
    ],
  },
  {
    id: "data",
    title: "Data & Persistence",
    icon: Database,
    caps: ["Schema Design", "Relationships", "Query Optimization", "Aggregations"],
    tech: [
      { Icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1", desc: "Relational SQL database." },
      { Icon: Database, name: "SQL Server", color: "#CC2927", desc: "Microsoft relational database." },
      { Icon: SiMongodb, name: "MongoDB", color: "#47A248", desc: "Document database for flexible schemas." },
      { Icon: SiFirebase, name: "Firestore", color: "#FFA000", desc: "Firebase realtime document store." },
      { Icon: SiRedis, name: "Redis", color: "#DC382D", desc: "In-memory caching and data store." },
      { Icon: BullMqIcon, name: "BullMQ", color: "#E11D48", desc: "Redis-backed job and message queue." },
      { Icon: SiFirebase, name: "Firebase Storage", color: "#F59E0B", desc: "Cloud object storage for files." },
    ],
  },
  {
    id: "realtime",
    title: "Realtime Systems",
    icon: Zap,
    caps: ["Sockets", "Event-Driven", "Live Updates", "Multi-User Sync"],
    tech: [
      { Icon: SiSocketdotio, name: "Socket.IO", color: "#111827", desc: "Realtime bidirectional events." },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Deployment",
    icon: Cloud,
    caps: ["CI/CD", "Env Management", "Monitoring", "Production Deploys"],
    tech: [
      { Icon: SiDocker, name: "Docker", color: "#2496ED", desc: "Containerized app packaging." },
      { Icon: SiVercel, name: "Vercel", color: "#111827", desc: "Frontend hosting and deploys." },
      { Icon: SiNetlify, name: "Netlify", color: "#00C7B7", desc: "Static site hosting and CI." },
      { Icon: SiDigitalocean, name: "DigitalOcean", color: "#0080FF", desc: "Cloud servers and infrastructure." },
      { Icon: SiFirebase, name: "Firebase", color: "#FFA000", desc: "App platform with auth, hosting and data." },
      { Icon: SiGooglecloud, name: "GCP", color: "#4285F4", desc: "Google Cloud Platform services." },
    ],
  },
  {
    id: "system",
    title: "System Design",
    icon: Network,
    caps: ["Caching", "Load Balancing", "Partitioning", "Replication", "Rate Limiting", "Queues"],
  },
  {
    id: "performance",
    title: "Performance Engineering",
    icon: Gauge,
    caps: ["API Optimization", "Code Splitting", "Lazy Loading", "React Memoization", "Virtualization", "Bundle Optimization"],
  },
  {
    id: "uiux",
    title: "UI / UX Engineering",
    icon: Wand2,
    caps: ["Workflow → Interface", "Interactive Design", "Motion", "Micro-interactions", "Responsive Design", "Visual Storytelling"],
    tech: [
      { Icon: SiFramer, name: "Framer Motion", color: "#0055FF", desc: "Declarative React animations." },
      { Icon: SiChartdotjs, name: "Chart.js", color: "#FF6384", desc: "Canvas-based charts and graphs." },
      { Icon: SiLottiefiles, name: "Lottie", color: "#00DDB3", desc: "JSON-based vector animations." },
    ],
  },
  {
    id: "workflow",
    title: "Developer Workflow",
    icon: GitBranch,
    caps: ["Version Control", "Debugging", "Env Config", "Production Fixes"],
    tech: [
      { Icon: SiGit, name: "Git", color: "#F05032", desc: "Version control." },
      { Icon: SiGithubactions, name: "GitHub Actions", color: "#2088FF", desc: "CI/CD automation." },
    ],
  },
];

const BUILDS = [
  "Full-Stack Apps",
  "SaaS Products",
  "Admin Dashboards",
  "Realtime Systems",
  "Business Platforms",
  "Data-Driven Apps",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 22 },
  },
};

function CapChip({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:border-violet-500/15 group-hover:bg-violet-500/[0.06] group-hover:text-violet-700">
      {label}
    </span>
  );
}

function TechBadge({ t }: { t: Tech }) {
  return (
    <span className="group/tech relative">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm">
        <t.Icon className="h-4 w-4" style={{ color: t.color }} />
      </span>
      {/* Hover tooltip — name + short description */}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-44 -translate-x-1/2 rounded-lg border border-slate-100 bg-white px-3 py-2 text-left opacity-0 shadow-lg transition-opacity duration-150 group-hover/tech:opacity-100">
        <span className="block text-xs font-semibold text-slate-800">
          {t.name}
        </span>
        <span className="mt-0.5 block text-[0.7rem] leading-snug text-slate-500">
          {t.desc}
        </span>
      </span>
    </span>
  );
}

function TechRow({ tech }: { tech: Tech[] }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
      {tech.map((t) => (
        <TechBadge key={t.name} t={t} />
      ))}
    </div>
  );
}

export default function EngineeringCapabilities() {
  return (
    <section className="w-full px-4 py-16 sm:py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-6xl"
      >
        {/* ── Header ── */}
        <motion.div variants={item} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Skills &amp; Expertise
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Engineering Capabilities
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-500">
            Full-Stack Product Engineer — turning requirements into scalable,
            production-ready systems.
          </p>
        </motion.div>

        {/* ── Feature card: Product Engineering + pipeline ── */}
        <motion.div
          variants={item}
          className="group mt-10 overflow-hidden rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:border-violet-300/60 hover:shadow-[0_24px_48px_-18px_rgba(99,102,241,0.28)] sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-200">
                  <Layers size={20} />
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Product Engineering
                </h3>
              </div>
              <p className="mt-4 leading-relaxed text-slate-500">
                Not just features — I own products end to end: requirements,
                architecture, services, data, and deployment.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Requirements → Solution", "Feature Planning", "End-to-End Ownership"].map(
                  (c) => (
                    <CapChip key={c} label={c} />
                  ),
                )}
              </div>
            </div>

            {/* Pipeline */}
            <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
              {PIPELINE.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2">
                  <span className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-3.5 py-2 text-sm font-semibold text-slate-700">
                    {stage}
                  </span>
                  {i < PIPELINE.length - 1 && (
                    <ArrowRight
                      size={15}
                      className="text-indigo-300 lg:rotate-90"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Domain grid ── */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.id}
                variants={item}
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-[0_24px_48px_-18px_rgba(99,102,241,0.25)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-base font-bold tracking-tight text-slate-900">
                    {d.title}
                  </h3>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.caps.map((c) => (
                    <CapChip key={c} label={c} />
                  ))}
                </div>

                {d.techGroups && (
                  <div className="mt-auto grid gap-3 pt-4">
                    {d.techGroups.map((g) => (
                      <div key={g.label}>
                        <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                          {g.label}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {g.tech.map((t) => (
                            <TechBadge key={t.name} t={t} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {d.tech && <TechRow tech={d.tech} />}
              </motion.div>
            );
          })}
        </div>

        {/* ── What I build ── */}
        <motion.div variants={item} className="mt-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            What I build
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {BUILDS.map((b) => (
              <span
                key={b}
                className="rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur"
              >
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
