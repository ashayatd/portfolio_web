"use client";

import { useState, Fragment, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Minus, ArrowUpRight, LayoutDashboard } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════════
   EDIT EVERYTHING HERE — pure data, no JSX.
   To highlight a metric inside any text, wrap it in `backticks`, e.g.
   "Cut the API from `~90s` to `~300ms`". Works in points and detail bodies.
   ════════════════════════════════════════════════════════════════════════ */

interface DetailRow {
  label: string;
  body: string;
}
interface ProjectLink {
  label: string;
  href: string;
}
interface AdminPanel {
  label: string;
  features: string[];
}
interface Project {
  badge: string;
  pills: string[];
  title: string;
  desc: string;
  points: string[];
  chips: string[];
  admin?: AdminPanel;
  links?: ProjectLink[];
  details: DetailRow[];
}
interface MiniProject {
  name: string;
  desc: string;
}
interface ProjectsData {
  eyebrow: string;
  title: string;
  note: string;
  featured: Project;
  projects: Project[];
  alsoBuilt: MiniProject[];
}

const DATA: ProjectsData = {
  eyebrow: "Selected work",
  title: "Projects",
  note: "RAG and agentic AI systems, a multi-tenant ERP with a self-hosted LLM, plus production microservices, social feeds at the data layer and live video.",

  // ── Featured: OrbitDesk (RAG + agentic AI) ─────────────────────────────
  featured: {
    badge: "RAG + Agentic AI",
    pills: ["Personal project"],
    title: "OrbitDesk",
    desc: "Enterprise helpdesk copilot: a role-aware RAG copilot with citations and agent actions.",
    points: [
      "Retrieval scores `Recall@5 1.0` and `MRR 0.96`; RAGAS faithfulness `0.91` and answer relevancy `0.86`, at an end-to-end p50 of `~1.5s`.",
      "Retrieval-time RBAC with `0 leaks` across `1,386` adversarial queries per vector store, plus prompt-injection guardrails.",
      "A QLoRA-fine-tuned intent router matches few-shot accuracy (`0.91`) offline at zero API cost.",
    ],
    chips: ["Python", "FastAPI", "LangChain", "LangGraph", "LlamaIndex", "Groq", "Chroma", "FAISS", "pgvector", "Redis", "Docker"],
    links: [],
    details: [
      {
        label: "Retrieval",
        body: "Hybrid BM25 + vector retrieval fused with RRF, then cross-encoder reranking.",
      },
      {
        label: "Evals & ops",
        body: "Semantic cache, with MLflow, Langfuse and RAGAS evals.",
      },
    ],
  },

  projects: [
    // ── Pluto (voice-controlled coding agent) ─────────────────────────────
    {
      badge: "Agentic AI · Voice",
      pills: ["Personal project"],
      title: "Pluto",
      desc: "Voice-controlled agentic coding assistant on Alexa: a Node.js orchestrator and a Python/Flask executor driving VS Code, git/npm, dev servers and Claude CLI.",
      points: [
        "LLM tool-calling loop over a `9-tool registry`, with per-session memory and SSML responses.",
        "Groq → Ollama failover behind a circuit breaker, and a `~50%` cut in token usage.",
        "Sandboxed execution (command allowlist, injection blocking, path confinement, shared-secret service auth), covered by `183 tests`.",
      ],
      chips: ["Node.js", "Express", "Python", "Flask", "Groq", "Ollama", "Alexa Skills Kit", "Claude CLI"],
      details: [
        {
          label: "Alexa's 8s limit",
          body: "Deadline-based async offloading to a background job registry, with cross-session status reporting.",
        },
      ],
    },

    // ── StackJob (multi-tenant ERP + self-hosted LLM) ─────────────────────
    {
      badge: "Backend & DevOps Owner",
      pills: ["CIS", "AI Integration"],
      title: "StackJob",
      desc: "Multi-industry ERP and job-costing SaaS, with a self-hosted LLM integrated through an audited gateway.",
      points: [
        "Built the multi-tenant Django/DRF backend, with tenant-scoped model managers that make unscoped queries impossible.",
        "Integrated a self-hosted LLM through a single audited gateway service, running inference on a dedicated Celery queue so AI calls never block the request path.",
        "Owned the containerised deployment, plus a GitHub Actions pipeline running lint, type and migration checks and tests behind a coverage gate before a rolling deploy.",
      ],
      chips: ["Python", "Django", "Django REST Framework", "PostgreSQL", "Celery", "Redis", "Docker", "Nginx", "Ollama"],
      details: [
        {
          label: "API & auth",
          body: "JWT auth with role-based permission classes, and a versioned REST API with business logic in a service layer rather than in views.",
        },
        {
          label: "LLM gateway",
          body: "Schema-validated responses, with per-request logging of model version and latency.",
        },
        {
          label: "Runtime",
          body: "Nginx, Gunicorn/Uvicorn, Celery workers and beat, PostgreSQL, Redis and the model runtime, all containerised.",
        },
      ],
    },

    // ── Squach (super app) ────────────────────────────────────────────────
    {
      badge: "Full-Stack · Core Modules",
      pills: ["Microservices", "Kubernetes"],
      title: "Squach",
      desc: "Multi-vertical super app for accommodation, bus booking, food ordering, mart and dine-in. I owned the accommodation, ticketing and delivery-partner stack.",
      points: [
        "Cut the hotel search and filter API from `~90s` to `~300ms` by replacing a 10+ table join with field projection and pagination.",
        "Eliminated double bookings using a Redis distributed lock and a 20-minute TTL reservation, auto-releasing on abandoned checkout.",
        "Re-architected a monolith into `6` Dockerized microservices on an AWS EC2 Kubernetes cluster behind an API gateway. A Redis cache cut third-party API calls by `~95%`.",
      ],
      chips: ["Node.js", "Express", "MySQL", "Redis", "BullMQ", "Microservices", "API Gateway"],
      admin: {
        label: "Admin dashboard",
        features: [
          "User analytics",
          "Graphs & charts",
          "Business metrics",
          "Calculated statistics",
          "Notification campaigns",
          "User management",
          "Content moderation",
        ],
      },
      links: [],
      details: [
        {
          label: "Kubernetes",
          body: "Managed rollouts via kubectl, and authored custom Helm charts with HPA and health probes.",
        },
        {
          label: "Booking workflow",
          body: "Seven cross-service steps run a booking: search, hold inventory, payment, confirm, notify over email and SMS, then update the vendor dashboard. A TTL index releases inventory automatically if payment fails.",
        },
        {
          label: "Notification campaigns",
          body: "A BullMQ and Redis queue targets vendors and customers by category across Email, SMS and In-App, with per-recipient success and failure logs surfaced in a dense admin view.",
        },
      ],
    },

    // ── Tambez (social platform) ──────────────────────────────────────────
    {
      badge: "Backend + Admin Lead",
      pills: ["Play Store · 100+ installs"],
      title: "Tambez",
      desc: "Instagram-style social platform for students with posts, reels, reactions, reposts and a social graph.",
      points: [
        "Replaced ~150 N+1 feed queries with a single `8-stage MongoDB aggregation pipeline`, keeping feed latency flat as following-lists grew.",
        "Modelled a `23-collection` document schema with Redis-cached feeds, chosen over relational to absorb frequent schema changes without migrations.",
      ],
      chips: ["Node.js", "MongoDB", "Redis", "React.js"],
      admin: {
        label: "Admin dashboard",
        features: [
          "User analytics",
          "User demographics",
          "Active users",
          "Location insights",
          "Individual profiles",
          "Session duration",
          "Most liked content",
          "Most commented content",
          "Category analytics",
          "Student uploads",
          "Issue ticket management",
          "Ban / unban users",
          "Ban / unban posts",
          "Comment moderation",
          "Achievement approvals",
          "Badge management (Blue Tick)",
        ],
      },
      details: [
        {
          label: "Why aggregation",
          body: "Pushing joins, filtering and sorting into MongoDB's engine keeps feed latency stable as following-lists grow, instead of looping queries in Node.",
        },
        {
          label: "Infinite scroll",
          body: "Fixed duplicates by tracking seen-post IDs and excluding them server-side with `$nin`, so the feed stays stable as new posts arrive mid-scroll.",
        },
      ],
    },

    // ── Eyeshare (live video) ─────────────────────────────────────────────
    {
      badge: "Backend + Admin Owner",
      pills: ["Real-time Video"],
      title: "Eyeshare",
      desc: "Job marketplace with one-on-one video calls: connects job seekers with providers, plus on-demand expert calls for how-to help and consultations.",
      points: [
        "Cut socket payloads by `60–80%` using delta signaling that transmitted only changed fields, directly reducing Agora billing.",
        "Stopped `paid-minute burn` by socket-coordinating call sessions: streams auto-pause on peer-left and the call closes after a 60-second reconnect window.",
        "Added a database heartbeat to survive ECONNRESET drops from low-bandwidth users, preventing full session teardown.",
      ],
      chips: ["Node.js", "MongoDB", "Agora", "Socket.IO", "React+Vite"],
      admin: {
        label: "Admin dashboard",
        features: [
          "User analytics",
          "Active users",
          "Call session logs",
          "Revenue tracking",
          "Job posting analytics",
          "Expert management",
          "User management",
          "Session monitoring",
        ],
      },
      details: [
        {
          label: "Reconnect",
          body: "The server broadcasts peer-left, clients show a waiting-for-peer state, and the call closes at 60s to cap billing.",
        },
        {
          label: "Scope",
          body: "I took over an existing deployed system, extended it, and re-deployed it with automated builds.",
        },
      ],
    },

    // ── Hot Pockets (frontend ownership) ──────────────────────────────────
    {
      badge: "Frontend Owner",
      pills: ["Live", "Real Users", "Real-time"],
      title: "Billiards Studio ERP (Hotpocket)",
      desc: "Operations and billing ERP that fully automated a billiards gaming studio, covering games, canteen inventory and player billing in one system.",
      points: [
        "Built the complete React frontend and UI/UX: a real-time, animated interface for live table management across `12 tables in 2 branches`.",
        "Implemented the billing engine on the frontend: live table billing, canteen billing and player-level billing, including splitting one game across `2 to 4 players` with dynamic payment distribution.",
        "Modelled credit management with live credit reflection while assigning players, across complex operational workflows spanning `25+ production business features`.",
      ],
      chips: ["React", "WebSockets", "Firebase", "Real-time UI", "State Management"],
      links: [
        {
          label: "Live",
          href: "https://hot-pocket-47985.web.app/authentication/sign-in",
        },
        { label: "GitHub", href: "https://github.com/ashayatd/hotPocketFE" },
      ],
      details: [
        {
          label: "My contribution",
          body: "I built the entire frontend: the React UI and UX, the real-time frontend architecture, the billing engine, business logic and state management.",
        },
        {
          label: "Backend",
          body: "The backend was built by another developer using Python and Firestore. I integrated the frontend against it.",
        },
        {
          label: "Frontend scope",
          body: "Real-time table management, canteen and table billing, individual and split player billing for 2 to 4 players, credit management with live reflection on player assignment, and dynamic payment distribution, all in a richly interactive, animated UI.",
        },
      ],
    },
  ],

  alsoBuilt: [
    {
      name: "Messice",
      desc: "Fantasy football betting app. Built backend modules with third-party data and betting calculations, the admin analytics panel, and handled deployment. Real users.",
    },
    {
      name: "Barber Booking",
      desc: "Slot booking with overlap prevention and ratings. Built the backend, a React admin with analytics, and handled deployment.",
    },
    {
      name: "Catch That Truck",
      desc: "Ice-cream delivery locator. Built the React analytics admin panel and handled deployment.",
    },
    {
      name: "Ergzee",
      desc: "IoT fitness-band companion app. Owned the frontend, backend device-data ingestion, admin analytics, and deployment.",
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   Below: presentation only — you shouldn't need to touch this to edit content.
   ════════════════════════════════════════════════════════════════════════ */

/** Render a string, turning `backtick`-wrapped spans into highlighted metrics. */
function renderRich(text: string): ReactNode {
  return text.split(/`([^`]+)`/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-mono font-semibold text-violet-600">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 22 },
  },
};

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-indigo-200 bg-indigo-50/60 px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wide text-indigo-600">
      {children}
    </span>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-violet-500/[0.08] px-3 py-1 text-xs font-medium text-violet-700">
      {children}
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
      {children}
    </span>
  );
}

function AdminBlock({ admin }: { admin: AdminPanel }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 4;
  const visible = expanded ? admin.features : admin.features.slice(0, PREVIEW);
  const extra = admin.features.length - PREVIEW;

  return (
    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        <LayoutDashboard size={14} />
        {admin.label}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {visible.map((f) => (
          <span
            key={f}
            className="rounded-md border border-indigo-100 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            {f}
          </span>
        ))}
      </div>
      {extra > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 font-mono text-[0.7rem] text-indigo-400 transition-colors hover:text-indigo-600"
        >
          {expanded ? (
            <><Minus size={11} /> Show less</>
          ) : (
            <><Plus size={11} /> +{extra} more</>
          )}
        </button>
      )}
    </div>
  );
}

function Links({ links }: { links: ProjectLink[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-violet-600"
        >
          {l.label}
          <ArrowUpRight size={14} />
        </a>
      ))}
    </div>
  );
}

function Points({ points }: { points: string[] }) {
  return (
    <ul className="grid gap-2.5">
      {points.map((p, i) => (
        <li
          key={i}
          className="relative pl-5 text-sm leading-relaxed text-slate-600"
        >
          <span className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-sm bg-gradient-to-br from-indigo-500 to-violet-500" />
          {renderRich(p)}
        </li>
      ))}
    </ul>
  );
}

function More({ details }: { details: DetailRow[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-700"
      >
        {open ? (
          <Minus size={13} className="text-indigo-500" />
        ) : (
          <Plus size={13} className="text-indigo-500" />
        )}
        Details
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid gap-2.5 pt-3">
              {details.map((d) => (
                <p
                  key={d.label}
                  className="text-sm leading-relaxed text-slate-500"
                >
                  <strong className="font-semibold text-slate-800">
                    {d.label}:
                  </strong>{" "}
                  {renderRich(d.body)}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturedCard({ p }: { p: Project }) {
  return (
    <motion.article
      variants={item}
      className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge>{p.badge}</Badge>
        {p.pills.map((pill) => (
          <Pill key={pill}>{pill}</Pill>
        ))}
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-slate-900">
        {p.title}
      </h3>
      <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-slate-500">
        {p.desc}
      </p>
      <div className="mt-5">
        <Points points={p.points} />
      </div>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {p.chips.map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
      {p.admin && <AdminBlock admin={p.admin} />}
      {p.links && p.links.length > 0 && (
        <div className="mt-5">
          <Links links={p.links} />
        </div>
      )}
      <More details={p.details} />
    </motion.article>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.article
      variants={item}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-[0_24px_48px_-18px_rgba(99,102,241,0.25)]"
    >
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <Badge>{p.badge}</Badge>
        {p.pills.map((pill) => (
          <Pill key={pill}>{pill}</Pill>
        ))}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-slate-900">
        {p.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.desc}</p>
      <div className="mt-4">
        <Points points={p.points} />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.chips.map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
      {p.admin && <AdminBlock admin={p.admin} />}
      {p.links && p.links.length > 0 && (
        <div className="mt-4">
          <Links links={p.links} />
        </div>
      )}
      <More details={p.details} />
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="mx-auto max-w-6xl"
      >
        {/* Header — matches the Engineering Capabilities section */}
        <motion.div variants={item} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {DATA.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {DATA.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-500">
            {DATA.note}
          </p>
        </motion.div>

        {/* Featured */}
        <div className="mt-10">
          <FeaturedCard p={DATA.featured} />
        </div>

        {/* 3-up grid */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {DATA.projects.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </div>

        {/* Also built */}
        <motion.div variants={item} className="mt-10">
          <p className="text-center font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
            Also built
          </p>
          <div className="mx-auto mt-4 grid max-w-4xl gap-3 sm:grid-cols-2">
            {DATA.alsoBuilt.map((m) => (
              <div
                key={m.name}
                className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <b className="text-sm font-semibold text-slate-800">{m.name}</b>{" "}
                <span className="text-sm text-slate-400">{m.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
