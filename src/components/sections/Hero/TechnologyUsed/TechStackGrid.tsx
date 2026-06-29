"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiRedux,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiRedis,
  SiSocketdotio,
  SiVercel,
  SiGit,
  SiMysql,
  SiGooglecloud,
  SiFirebase,
  SiStripe,
  SiDocker,
  SiJsonwebtokens,
  SiPostgresql,
  SiGithubactions,
  SiNetlify,
  SiDigitalocean,
  SiDiagramsdotnet,
  SiChartdotjs,
  SiLottiefiles,
  SiAgora,
  SiOpenai,
  SiClaude,
  SiGooglegemini,
  SiGithubcopilot,
} from "react-icons/si";

import { FaCube } from "react-icons/fa6";
import type { IconType } from "react-icons";

// BullMQ custom icon
const BullMqIcon = ({ className }: { className?: string }) => (
  <img
    className=""
    src={
      "https://user-images.githubusercontent.com/95200/143832033-32e868df-f3b0-4251-97fb-c64809a43d36.png"
    }
  />
);

interface Tech {
  name: string;
  Icon:
    | IconType
    | (({ className }: { className?: string }) => React.JSX.Element);
  /** Brand colour — drives the icon tint and the hover glow. */
  color: string;
  /** Official docs / homepage — opens on click. */
  href: string;
}

// Flat list with proper brand colours (the triangle layout is derived below).
const techStack: Tech[] = [
  { name: "Next.js",        Icon: SiNextdotjs,      color: "#111827", href: "https://nextjs.org" },
  { name: "React",          Icon: SiReact,           color: "#61DAFB", href: "https://react.dev" },
  { name: "TypeScript",     Icon: SiTypescript,      color: "#3178C6", href: "https://www.typescriptlang.org" },
  { name: "Redux",          Icon: SiRedux,           color: "#764ABC", href: "https://redux.js.org" },
  { name: "Tailwind",       Icon: SiTailwindcss,     color: "#06B6D4", href: "https://tailwindcss.com" },
  { name: "Framer",         Icon: SiFramer,          color: "#0055FF", href: "https://www.framer.com/motion/" },
  { name: "Three.js",       Icon: SiThreedotjs,      color: "#111827", href: "https://threejs.org" },
  { name: "Node.js",        Icon: SiNodedotjs,       color: "#339933", href: "https://nodejs.org" },
  { name: "Express",        Icon: SiExpress,         color: "#111827", href: "https://expressjs.com" },
  { name: "MongoDB",        Icon: SiMongodb,         color: "#47A248", href: "https://www.mongodb.com" },
  { name: "Redis",          Icon: SiRedis,           color: "#DC382D", href: "https://redis.io" },
  { name: "Socket.IO",      Icon: SiSocketdotio,     color: "#1f2937", href: "https://socket.io" },
  { name: "Agora",          Icon: SiAgora,           color: "#099DFD", href: "https://www.agora.io" },
  { name: "BullMQ",         Icon: BullMqIcon,        color: "#E11D48", href: "https://bullmq.io" },
  { name: "Chart.js",       Icon: SiChartdotjs,      color: "#FF6384", href: "https://www.chartjs.org" },
  { name: "Lottie",         Icon: SiLottiefiles,     color: "#00DDB3", href: "https://lottiefiles.com" },
  { name: "Vercel",         Icon: SiVercel,          color: "#111827", href: "https://vercel.com" },
  { name: "Netlify",        Icon: SiNetlify,         color: "#00C7B7", href: "https://www.netlify.com" },
  { name: "DigitalOcean",   Icon: SiDigitalocean,    color: "#0080FF", href: "https://www.digitalocean.com" },
  { name: "Git",            Icon: SiGit,             color: "#F05032", href: "https://git-scm.com" },
  { name: "GitHub Actions", Icon: SiGithubactions,   color: "#2088FF", href: "https://github.com/features/actions" },
  { name: "MySQL",          Icon: SiMysql,           color: "#4479A1", href: "https://www.mysql.com" },
  { name: "Postgres",       Icon: SiPostgresql,      color: "#336791", href: "https://www.postgresql.org" },
  { name: "GCP",            Icon: SiGooglecloud,     color: "#4285F4", href: "https://cloud.google.com" },
  { name: "Firebase",       Icon: SiFirebase,        color: "#F59E0B", href: "https://firebase.google.com" },
  { name: "Stripe",         Icon: SiStripe,          color: "#635BFF", href: "https://stripe.com" },
  { name: "Docker",         Icon: SiDocker,          color: "#2496ED", href: "https://www.docker.com" },
  { name: "draw.io",        Icon: SiDiagramsdotnet,  color: "#F08705", href: "https://app.diagrams.net" },
  { name: "JWT",            Icon: SiJsonwebtokens,   color: "#EC4899", href: "https://jwt.io" },
];

interface AiTool {
  name: string;
  color: string;
  role: string;
  href: string;
  /** Brand icon when available; otherwise a monogram is shown. */
  Icon?: IconType;
  /** Monogram fallback letter for tools without a brand icon. */
  mono?: string;
}

const AI_TOOLS: AiTool[] = [
  { name: "Claude Code",    Icon: SiClaude,        color: "#D97757", role: "Engineering assistant",  href: "https://claude.ai/code" },
  { name: "ChatGPT",        Icon: SiOpenai,        color: "#10A37F", role: "Conversation & analysis", href: "https://chat.openai.com" },
  { name: "ChatGPT Codex",  Icon: SiOpenai,        color: "#0F172A", role: "Code generation",        href: "https://openai.com/codex" },
  { name: "Gemini",         Icon: SiGooglegemini,  color: "#4285F4", role: "Multimodal research",    href: "https://gemini.google.com" },
  { name: "GitHub Copilot", Icon: SiGithubcopilot, color: "#24292F", role: "In-editor completion",   href: "https://github.com/features/copilot" },
  { name: "Cursor",         Icon: FaCube ,             color: "#09141a", role: "AI-powered editor",      href: "https://www.cursor.com" },
  { name: "KIMI",           mono: "K",             color: "#111827", role: "Long-context reading",   href: "https://kimi.ai" },
  { name: "QWEN",           mono: "Q",             color: "#615CED", role: "Model comparison",       href: "https://chat.qwen.ai" },
];

export default function TechStackGrid() {
  // Build an inverted-triangle layout (rows of 7, 6, 5, 4 for 22 items).
  const triangleRows = useMemo(() => {
    const rows: Tech[][] = [];
    let i = 0;
    let rowWidth = Math.ceil((Math.sqrt(8 * techStack.length + 1) - 1) / 2);
    while (i < techStack.length && rowWidth > 0) {
      rows.push(techStack.slice(i, i + rowWidth));
      i += rowWidth;
      rowWidth--;
    }
    return rows;
  }, []);

  // Running index so the entrance stagger flows across all rows.
  let globalIndex = 0;

  return (
    <div className="flex flex-col items-center px-6 py-12">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <span className="inline-block rounded-full border border-indigo-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-500 shadow-sm backdrop-blur">
          Tech Stack
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Tools I build with
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
          A Modern, Full-Stack Toolkit I Trust
        </p>
      </motion.div>

      {/* ── Triangle of glass chips ── */}
      <div className="flex flex-col items-center gap-5 sm:gap-6">
        {triangleRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-wrap items-start justify-center gap-5 sm:gap-7"
          >
            {row.map((tech) => {
              const delay = globalIndex * 0.035;
              globalIndex += 1;
              return (
                <motion.a
                  key={tech.name}
                  href={tech.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{ y: -8, scale: 1.08 }}
                  className="cursor-pointer group flex w-[84px] flex-col items-center gap-2.5"
                  style={{ "--glow": tech.color } as React.CSSProperties}
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-[0_6px_18px_-6px_rgba(15,23,42,0.25)] backdrop-blur-md transition-shadow duration-300 group-hover:shadow-[0_16px_34px_-8px_var(--glow)] sm:h-[72px] sm:w-[72px]">
                    {/* brand-colour glow wash on hover */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-[0.14]"
                      style={{ backgroundColor: tech.color }}
                    />
                    <tech.Icon
                      className="relative z-10 h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
                      style={{ color: tech.color }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-900 transition-colors duration-300 group-hover:text-slate-900">
                    {tech.name}
                  </span>
                </motion.a>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── AI Tools ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-14 w-full"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="inline-block rounded-full border border-purple-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-purple-500 shadow-sm backdrop-blur">
            AI Tools
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            AI I work with daily
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {AI_TOOLS.map((tool, i) => (
            <motion.a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ y: -4, scale: 1.04 }}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur transition-shadow hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
                {tool.Icon ? (
                  <tool.Icon className="h-5 w-5" style={{ color: tool.color }} />
                ) : (
                  <span
                    className="text-base font-bold leading-none"
                    style={{ color: tool.color }}
                  >
                    {tool.mono}
                  </span>
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{tool.name}</p>
                <p className="text-xs text-slate-400">{tool.role}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
