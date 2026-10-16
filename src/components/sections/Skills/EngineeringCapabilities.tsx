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
  Sparkles,
  Radio,
  GitBranch,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiFastapi,
  SiDjango,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiSqlite,
  SiRedis,
  SiSocketdotio,
  SiAgora,
  SiDocker,
  SiKubernetes,
  SiHelm,
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
  SiLangchain,
  SiLanggraph,
  SiOllama,
  SiMlflow,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
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

// Tools with no brand icon in the set — monogram tile, same fallback as the
// AI Tools row in the Tech Stack section.
const mono = (letters: string) =>
  function Monogram({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) {
    return (
      <span
        className={`${className ?? ""} flex items-center justify-center text-[0.6rem] font-bold leading-none`}
        style={style}
      >
        {letters}
      </span>
    );
  };

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
    id: "genai",
    title: "GenAI & Agentic AI",
    icon: Sparkles,
    caps: ["RAG (Hybrid BM25 + Vector, RRF)", "Agentic Workflows", "Embeddings & Reranking", "Prompt-Injection Guardrails", "QLoRA Fine-Tuning", "RAG Evaluation"],
    tech: [
      { Icon: SiPython, name: "Python", color: "#3776AB", desc: "Primary language for AI and backend services." },
      { Icon: SiLangchain, name: "LangChain", color: "#1C3C3C", desc: "Framework for LLM chains, tools and RAG." },
      { Icon: SiLanggraph, name: "LangGraph", color: "#1C3C3C", desc: "Stateful, graph-based agent workflows." },
      { Icon: mono("Li"), name: "LlamaIndex", color: "#7C3AED", desc: "Data framework for indexing and retrieval." },
      { Icon: mono("C"), name: "Chroma", color: "#F97316", desc: "Open-source vector database." },
      { Icon: mono("F"), name: "FAISS", color: "#0467DF", desc: "Vector similarity search library." },
      { Icon: mono("pg"), name: "pgvector", color: "#336791", desc: "Vector search inside PostgreSQL." },
      { Icon: mono("G"), name: "Groq", color: "#F55036", desc: "Low-latency LLM inference API." },
      { Icon: SiOllama, name: "Ollama", color: "#111827", desc: "Run open LLMs locally and self-hosted." },
      { Icon: mono("R"), name: "RAGAS", color: "#6366F1", desc: "RAG evaluation: faithfulness and relevancy." },
      { Icon: SiMlflow, name: "MLflow", color: "#0194E2", desc: "Experiment tracking and model registry." },
      { Icon: mono("Lf"), name: "Langfuse", color: "#0F172A", desc: "LLM tracing and observability." },
    ],
  },
  {
    id: "frontend",
    title: "Frontend & UI/UX Engineering",
    icon: MonitorSmartphone,
    caps: ["Component Architecture", "State Management", "Responsive UX", "Performance", "Interactive Design", "Motion & Micro-interactions"],
    tech: [
      { Icon: SiReact, name: "React", color: "#61DAFB", desc: "Component-based UI library (React + Vite)." },
      { Icon: SiNextdotjs, name: "Next.js", color: "#111827", desc: "React framework for SSR and routing." },
      { Icon: SiTypescript, name: "TypeScript", color: "#3178C6", desc: "Typed JavaScript for safer code." },
      { Icon: SiRedux, name: "Redux", color: "#764ABC", desc: "Predictable global state management." },
      { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4", desc: "Utility-first CSS framework." },
      { Icon: SiFramer, name: "Framer Motion", color: "#0055FF", desc: "Declarative React animations." },
      { Icon: SiChartdotjs, name: "Chart.js", color: "#FF6384", desc: "Canvas-based charts and graphs." },
      { Icon: SiLottiefiles, name: "Lottie", color: "#00DDB3", desc: "JSON-based vector animations." },
    ],
  },
  {
    id: "backend",
    title: "Backend Engineering",
    icon: Server,
    caps: ["REST APIs", "Microservices", "API Gateway", "Auth (JWT) & RBAC", "Business Logic", "Integrations"],
    tech: [
      { Icon: SiNodedotjs, name: "Node.js", color: "#339933", desc: "JavaScript server runtime." },
      { Icon: SiExpress, name: "Express", color: "#111827", desc: "Minimal Node.js web framework." },
      { Icon: SiPython, name: "Python", color: "#3776AB", desc: "Backend services and AI pipelines." },
      { Icon: SiFastapi, name: "FastAPI", color: "#009688", desc: "Async Python API framework." },
      { Icon: SiDjango, name: "Django", color: "#092E20", desc: "Python web framework, with Django REST Framework." },
      { Icon: SiJsonwebtokens, name: "JWT", color: "#EC4899", desc: "Token-based authentication." },
    ],
  },
  {
    id: "data",
    title: "Data & Persistence",
    icon: Database,
    caps: ["Schema Design", "Data Modelling", "Query Optimization", "Aggregations", "Caching"],
    tech: [
      { Icon: SiMongodb, name: "MongoDB", color: "#47A248", desc: "Document database for flexible schemas." },
      { Icon: SiMysql, name: "MySQL", color: "#4479A1", desc: "Relational SQL database." },
      { Icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1", desc: "Relational SQL database." },
      { Icon: SiSqlite, name: "SQLite", color: "#003B57", desc: "Embedded SQL database." },
      { Icon: Database, name: "SQL Server", color: "#CC2927", desc: "Microsoft relational database." },
      { Icon: SiFirebase, name: "Firestore", color: "#FFA000", desc: "Firebase realtime document store." },
      { Icon: SiRedis, name: "Redis", color: "#DC382D", desc: "In-memory caching and data store." },
      { Icon: BullMqIcon, name: "BullMQ", color: "#E11D48", desc: "Redis-backed job and message queue." },
      { Icon: mono("RQ"), name: "RQ", color: "#DC382D", desc: "Redis Queue for Python background jobs." },
      { Icon: SiFirebase, name: "Firebase Storage", color: "#F59E0B", desc: "Cloud object storage for files." },
    ],
  },
  {
    id: "realtime",
    title: "Realtime Systems",
    icon: Zap,
    caps: ["Sockets", "Event-Driven", "Live Updates", "Multi-User Sync", "Video Calls"],
    tech: [
      { Icon: SiSocketdotio, name: "Socket.IO", color: "#111827", desc: "Realtime bidirectional events." },
      { Icon: Radio, name: "WebSockets", color: "#6366F1", desc: "Persistent two-way connections." },
      { Icon: SiAgora, name: "Agora", color: "#099DFD", desc: "Realtime voice and video SDK." },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: Cloud,
    caps: ["CI/CD", "Containers & Orchestration", "Env Management", "Monitoring", "Production Deploys"],
    tech: [
      { Icon: FaAws, name: "AWS", color: "#FF9900", desc: "EC2, VPC, S3, CloudFront, RDS, DynamoDB, Lambda, SQS, SNS." },
      { Icon: SiDocker, name: "Docker", color: "#2496ED", desc: "Containerized app packaging." },
      { Icon: SiKubernetes, name: "Kubernetes", color: "#326CE5", desc: "Container orchestration." },
      { Icon: SiHelm, name: "Helm", color: "#0F1689", desc: "Kubernetes charts, with HPA and health probes." },
      { Icon: SiGithubactions, name: "GitHub Actions", color: "#2088FF", desc: "CI/CD automation." },
      { Icon: SiGooglecloud, name: "GCP", color: "#4285F4", desc: "Google Cloud Platform services." },
      { Icon: SiDigitalocean, name: "DigitalOcean", color: "#0080FF", desc: "Cloud servers and infrastructure." },
      { Icon: SiVercel, name: "Vercel", color: "#111827", desc: "Frontend hosting and deploys." },
      { Icon: SiNetlify, name: "Netlify", color: "#00C7B7", desc: "Static site hosting and CI." },
      { Icon: SiFirebase, name: "Firebase", color: "#FFA000", desc: "App platform with auth, hosting and data." },
    ],
  },
  {
    id: "system",
    title: "System Design",
    icon: Network,
    caps: ["HLD & LLD", "OOP & SOLID", "Service Decomposition", "Distributed Locking", "Caching", "Load Balancing", "Partitioning", "Replication", "Rate Limiting", "Queues"],
  },
  {
    id: "performance",
    title: "Performance Engineering",
    icon: Gauge,
    caps: ["API Optimization", "Code Splitting", "Lazy Loading", "React Memoization", "Virtualization", "Bundle Optimization"],
  },
  {
    id: "workflow",
    title: "Developer Workflow",
    icon: GitBranch,
    caps: ["Version Control", "Debugging", "Env Config", "Production Fixes", "AI-Assisted Development"],
    tech: [
      { Icon: SiGit, name: "Git", color: "#F05032", desc: "Version control." },
      { Icon: SiGithubactions, name: "GitHub Actions", color: "#2088FF", desc: "CI/CD automation." },
    ],
  },
];

const BUILDS = [
  "Full-Stack Apps",
  "RAG Systems",
  "AI Agents",
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
            Full-Stack AI Engineer — turning requirements into scalable,
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
