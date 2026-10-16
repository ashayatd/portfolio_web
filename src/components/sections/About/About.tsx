"use client";

import { motion, type Variants } from "framer-motion";
import {
  Code2,
  Layers,
  Rocket,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { PROJECT_COUNT } from "@/lib/profile";

const stats = [
  { icon: Code2, value: PROJECT_COUNT, label: "Products Shipped" },
  { icon: Layers, value: "40+", label: "Technologies" },
  { icon: Rocket, value: "3+", label: "Years Experience" },
];

const contacts = [
  {
    icon: FiGithub,
    label: "GitHub",
    value: "github.com/ashayatd",
    href: "https://github.com/ashayatd",
  },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/ashayatd",
    href: "https://www.linkedin.com/in/ashayatd",
  },
  {
    icon: FiMail,
    label: "Email",
    value: "ashay.tamrakar@gmail.com",
    href: "mailto:ashay.tamrakar@gmail.com",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

export default function About() {
  return (
    <section className="w-full px-4 py-20 sm:py-28">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto rounded-3xl border border-slate-100 px-6 py-12 shadow-sm sm:px-12"
      >
        {/* ── Top: two sections (left / right) ── */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT — about text */}
          <motion.div variants={item} className="flex flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              About
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Building Software
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Beyond The Interface.
              </span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
              3+ years owning products end to end, with full-stack depth in
              Node.js and Next.js. Now building RAG and agentic AI systems in
              Python.
            </p>

            <p className="mt-5 leading-relaxed text-slate-600">
              My focus is not just writing code. I enjoy solving business
              problems through clean architecture, thoughtful user experiences,
              and scalable engineering practices.
            </p>

            {/* Philosophy quote — pinned to the bottom of the left column */}
            <div className="relative mt-auto overflow-hidden rounded-2xl border border-indigo-100 bg-white px-6 py-5 shadow-sm">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-violet-500" />
              <p className="text-lg font-semibold leading-snug text-slate-900">
                I don&apos;t just build features.
              </p>
              <p className="mt-1 text-lg font-semibold leading-snug">
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  I build solutions people can rely on.
                </span>
              </p>
            </div>
          </motion.div>

          {/* RIGHT — contact card on top, image space below */}
          <motion.div variants={item} className="flex flex-col gap-6">
            {/* Profile photo */}
            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/70 shadow-sm">
              <img
                src="/assets/profile.png"
                alt="Ashay Tamrakar"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>

            {/* Contact card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Ashay Tamrakar
                  </p>
                  <p className="text-sm text-slate-500">Full-Stack AI Engineer</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                  <MapPin size={13} className="text-indigo-500" />
                  Indore, India
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {contacts.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 transition-colors hover:bg-white"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                      <Icon size={15} />
                    </span>
                    <span className="flex-1 text-sm font-medium text-slate-700">
                      {label}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="text-slate-300 transition-colors group-hover:text-indigo-500"
                    />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom: stats, horizontal full-width ── */}
        <motion.div
          variants={item}
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <Icon size={18} className="text-indigo-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                  {value}
                </div>
                <div className="text-xs leading-snug text-slate-400">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
