"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiDocker,
  SiGithubactions,
  SiGooglecloud,
  SiRedis,
  SiSocketdotio,
  SiDiagramsdotnet,
} from "react-icons/si";
import {
  Network,
  Database,
  Share2,
  Target,
  ShieldCheck,
  Cpu,
  MapPin,
  Building2,
} from "lucide-react";
import type { IconType } from "react-icons";

type AnyIcon =
  | IconType
  | (({ className }: { className?: string }) => React.JSX.Element);

interface TechIcon {
  Icon: AnyIcon;
  color: string;
  label: string;
}

interface Milestone {
  num: string;
  title: string;
  desc: string;
  tech: TechIcon[];
}

// BullMQ custom mark (no brand icon in the set)
const BullMqIcon = ({ className }: { className?: string }) => (
  <img className="" src={"https://user-images.githubusercontent.com/95200/143832033-32e868df-f3b0-4251-97fb-c64809a43d36.png"}/>
);

const milestones: Milestone[] = [
  {
    num: "01",
    title: "Frontend Development",
    desc: "Started by shipping responsive, production UIs for client products with React and Next.js.",
    tech: [
      { Icon: SiReact, color: "#61DAFB", label: "React" },
      { Icon: SiNextdotjs, color: "#111827", label: "Next.js" },
      { Icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
      { Icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind" },
    ],
  },
  {
    num: "02",
    title: "Building Complete Features",
    desc: "Owned features from UI to data, delivering complete flows instead of isolated screens.",
    tech: [
      { Icon: SiReact, color: "#61DAFB", label: "React" },
      { Icon: SiNodedotjs, color: "#339933", label: "Node.js" },
      { Icon: SiMongodb, color: "#47A248", label: "MongoDB" },
    ],
  },
  {
    num: "03",
    title: "Backend Development",
    desc: "Moved into backend work with REST APIs, auth and data models on Node.js, Express and MongoDB.",
    tech: [
      { Icon: SiNodedotjs, color: "#339933", label: "Node.js" },
      { Icon: SiExpress, color: "#111827", label: "Express" },
      { Icon: SiMongodb, color: "#47A248", label: "MongoDB" },
    ],
  },
  {
    num: "04",
    title: "System Design",
    desc: "Designed for scale with caching, rate limiting, replication and partitioning across services.",
    tech: [
      { Icon: SiRedis, color: "#DC382D", label: "Redis" },
      { Icon: Network, color: "#6366F1", label: "Distributed" },
      { Icon: Share2, color: "#0EA5E9", label: "Partitioning" },
    ],
  },
  {
    num: "05",
    title: "Architecture Design",
    desc: "Designed service architectures and data flows, mapping systems in draw.io before building them.",
    tech: [
      { Icon: SiDiagramsdotnet, color: "#F08705", label: "draw.io" },
      { Icon: Network, color: "#6366F1", label: "Architecture" },
      { Icon: Database, color: "#8B5CF6", label: "Data Flow" },
    ],
  },
  {
    num: "06",
    title: "Scalable Systems",
    desc: "Built real-time, high-throughput systems with Redis, BullMQ, Socket.IO, caching and queues.",
    tech: [
      { Icon: SiRedis, color: "#DC382D", label: "Redis" },
      { Icon: BullMqIcon, color: "#2088FF", label: "BullMQ" },
      { Icon: SiSocketdotio, color: "#111827", label: "Socket.IO" },
    ],
  },
  {
    num: "07",
    title: "Production Deployments",
    desc: "Set up deployments, CI/CD, Docker and monitoring for reliable production releases.",
    tech: [
      { Icon: SiDocker, color: "#2496ED", label: "Docker" },
      { Icon: SiGithubactions, color: "#2088FF", label: "CI/CD" },
      { Icon: SiGooglecloud, color: "#4285F4", label: "Cloud" },
    ],
  },
  {
    num: "08",
    title: "Engineering Ownership",
    desc: "Now own products end to end: reliable, maintainable, business-driven software shipped in a fast-paced team.",
    tech: [
      { Icon: Target, color: "#6366F1", label: "Reliability" },
      { Icon: ShieldCheck, color: "#10B981", label: "Maintainable" },
      { Icon: Cpu, color: "#8B5CF6", label: "Impact" },
    ],
  },
];

const N = milestones.length;
const ITEM_H = 170; // each milestone row height (px)
const WINDOW_H = 480; // fixed viewport the timeline focuses within (px)

export default function SnakeTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  // Page scroll → 0..1 while the card is pinned.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.0005,
  });

  // Continuous "active milestone" index (0 .. N-1) drives everything.
  const active = useTransform(smooth, [0, 1], [0, N - 1]);
  const contentY = useTransform(active, (a) => -a * ITEM_H);
  const barWidth = useTransform(active, [0, N - 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative h-[480vh] bg-white">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-4">
        <div className="relative w-full max-w-5xl rounded-3xl border border-slate-100 bg-[linear-gradient(154deg,#ffffff,#032dfc1c)] px-6 py-8 shadow-sm sm:px-12">
          {/* ── Header ── */}
          <div>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Experience
              </span>
            </div>

            {/* Company header card */}
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                  <img
                    src="https://www.cisin.com/images/logo_black.png"
                    alt="Cyber Infrastructure (CIS)"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                    <Building2 size={15} className="text-indigo-500" />
                    Cyber Infrastructure (CIS)
                  </p>
                  <p className="text-sm text-slate-500">Full-Stack Developer</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Oct 2023 to Present
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                  <MapPin size={12} className="text-indigo-500" />
                  Indore, India
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                  Full-time · On-site
                </span>
              </div>
            </div>

            {/* Step progress bar */}
            <div className="mx-auto mt-5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
              <motion.div
                style={{ width: barWidth }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              />
            </div>
          </div>

          {/* ── Focus window ── */}
          <div
            className="relative mt-6 overflow-hidden"
            style={{ height: WINDOW_H }}
          >
            {/* Center spine: faint full path + completed top half */}
            <div className="absolute top-0 left-[26px] h-full w-[3px] -translate-x-1/2 rounded-full bg-slate-200 sm:left-1/2" />
            <div className="absolute top-0 left-[26px] h-1/2 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 sm:left-1/2" />

            {/* Focus halo where the active node lands */}
            <div className="pointer-events-none absolute top-1/2 left-[26px] z-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-xl sm:left-1/2" />

            {/* fade masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white to-transparent" />

            {/* Sliding list */}
            <motion.div
              style={{
                y: contentY,
                paddingTop: WINDOW_H / 2 - ITEM_H / 2,
                paddingBottom: WINDOW_H / 2 - ITEM_H / 2,
              }}
            >
              {milestones.map((m, idx) => (
                <TimelineItem key={idx} m={m} idx={idx} active={active} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  m,
  idx,
  active,
}: {
  m: Milestone;
  idx: number;
  active: MotionValue<number>;
}) {
  const isEven = idx % 2 === 0;

  const opacity = useTransform(active, [idx - 1, idx, idx + 1], [0.2, 1, 0.2]);
  const cardScale = useTransform(
    active,
    [idx - 1, idx, idx + 1],
    [0.84, 1.04, 0.84],
  );
  const blur = useTransform(active, [idx - 0.85, idx, idx + 0.85], [5, 0, 5]);
  const cardFilter = useMotionTemplate`blur(${blur}px)`;

  const cardShadow = useTransform(
    active,
    [idx - 0.5, idx, idx + 0.5],
    [
      "0 4px 14px rgba(15,23,42,0.05)",
      "0 22px 48px -12px rgba(99,102,241,0.4)",
      "0 4px 14px rgba(15,23,42,0.05)",
    ],
  );

  const nodeScale = useTransform(
    active,
    [idx - 0.5, idx, idx + 0.5],
    [1, 1.3, 1],
  );
  const nodeGlow = useTransform(
    active,
    [idx - 0.5, idx, idx + 0.5],
    [
      "0 0 0 0 rgba(99,102,241,0)",
      "0 0 26px 5px rgba(99,102,241,0.55)",
      "0 0 0 0 rgba(99,102,241,0)",
    ],
  );

  // The node shows the stage's primary logo so it reads at a glance.
  const LeadIcon = m.tech[0].Icon;

  return (
    <motion.div
      style={{ opacity, height: ITEM_H }}
      className="relative flex w-full items-center"
    >
      {/* Node — primary logo on a white disc */}
      <motion.div
        style={{ scale: nodeScale, boxShadow: nodeGlow }}
        className="absolute top-1/2 left-[26px] z-10 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-[2px] sm:left-1/2"
      >
        <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
          <LeadIcon className="h-6 w-6" style={{ color: m.tech[0].color }} />
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        style={{ scale: cardScale }}
        className={`w-full pr-4 pl-20 sm:w-1/2 ${
          isEven
            ? "sm:ml-auto sm:pr-10 sm:pl-12 sm:text-left"
            : "sm:mr-auto sm:flex sm:justify-end sm:pr-12 sm:pl-10 sm:text-right"
        }`}
      >
        <motion.div
          style={{ filter: cardFilter, boxShadow: cardShadow }}
          className="inline-block rounded-2xl border border-slate-100 bg-white px-5 py-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Stage {m.num}
          </span>
          <h3 className="mt-1 text-lg font-bold tracking-wide text-slate-900 sm:text-xl">
            {m.title}
          </h3>

          {/* Logo row — instant visual meaning */}
          <div
            className={`mt-3 flex flex-wrap gap-2 ${
              isEven ? "sm:justify-start" : "sm:justify-end"
            }`}
          >
            {m.tech.map((t) => (
              <div
                key={t.label}
                className="group/tech relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-transform hover:scale-110"
              >
                <t.Icon className="h-5 w-5" style={{ color: t.color }} />
                {/* Hover tooltip */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[0.7rem] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tech:opacity-100">
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
            {m.desc}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
