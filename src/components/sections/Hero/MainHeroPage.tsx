"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Download,
  ChevronDown,
  Rocket,
  Code2,
  Users,
  Zap,
  X,
} from "lucide-react";
import { CityCanvas } from "./simpleWorld/CityCanvas";
import { getExperience, PROJECT_COUNT } from "@/lib/profile";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { RiNextjsFill, RiReactjsLine } from "react-icons/ri";
import {
  SiDocker,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiRedis,
  SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

// ─── Hero ───────────────────────────────────────────────────────────

export function Hero() {
  const [explore, setExplore] = useState(false);
  const { scrollTo, setScrollLock } = useSmoothScroll();
  // Walking the city needs a keyboard + a lockable pointer, so it is desktop
  // only (Tailwind `lg` and up).
  const isDesktop = useIsDesktop();

  // Clicking a billboard in the 3D city navigates to that section
  // (and exits explore mode if we're walking around).
  const navigate = (id: string) => {
    setExplore(false);
    scrollTo(`#${id}`);
  };

  // While the overlay is open: freeze the page behind it, let Esc close it
  // (the browser eats the first Esc to release pointer lock, so the second one
  // closes), and bail out entirely if the viewport shrinks below desktop.
  useEffect(() => {
    if (!explore) return;
    setScrollLock(true);

    // Hide the global navbar — it overlaps the city and can't be out-stacked.
    // The overlay lives inside a flex item carrying z-10, which opens a
    // stacking context its own z-60 can never escape, so the z-50 header wins
    // no matter what. Set the style directly rather than via a stylesheet
    // class: it applies the moment this runs, with no CSS rebuild involved.
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const previousDisplay = header?.style.display ?? "";
    if (header) header.style.display = "none";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.pointerLockElement) setExplore(false);
    };
    const tooSmall = window.matchMedia("(max-width: 1023px)");
    const onResize = () => {
      if (tooSmall.matches) setExplore(false);
    };

    window.addEventListener("keydown", onKey);
    tooSmall.addEventListener("change", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      tooSmall.removeEventListener("change", onResize);
      if (header) header.style.display = previousDisplay;
      setScrollLock(false);
    };
  }, [explore, setScrollLock]);

  // Compute experience on the client to keep server/client markup in sync
  // across month boundaries (avoids hydration mismatch).
  const [exp, setExp] = useState({ short: "2Y+", label: "2 Years +" });
  useEffect(() => {
    const e = getExperience();
    setExp({ short: e.short, label: e.label });
  }, []);

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 pt-24 lg:pt-28 pb-16 bg-[linear-gradient(154deg,#ffffff,#032dfc1c)]">
      <div className="relative w-full flex flex-col lg:flex-row mt-6 lg:mt-[3rem] items-center">
        {/* Left Content */}
        {/* No z-index here: as a flex item it would open a stacking context,
            trapping the fullscreen city overlay's z-60 below the z-50 navbar.
            It's the only flex child, so it has nothing to stack against. */}
        <div className="w-full lg:w-[50%] flex flex-col gap-6 sm:gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
              Full Stack Engineer
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Ashay Tamrakar<br/>
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Full Stack Developer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
            I build end-to-end products with clean code, modern technologies and
            scalable architecture. From intuitive interfaces to robust backend
            systems.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <button className="flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200">
              View My Projects
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center justify-center cursor-pointer gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 transition-colors">
              Download Resume
              <Download size={16} />
            </button>
            {/* Desktop only — walking the city needs WASD + a mouse. */}
            {isDesktop && (
              <button
                onClick={() => setExplore(true)}
                className="flex items-center justify-center gap-2 cursor-pointer bg-white hover:bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl text-sm font-semibold border border-indigo-200 transition-colors"
              >
                Explore City
                <Rocket size={16} />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-wrap lg:justify-center lg:gap-10 bg-white px-3 py-4 rounded-xl">
              <div className="flex items-center gap-3 pr-4 lg:border-r lg:border-gray-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {PROJECT_COUNT}
                  </p>
                  <p className="text-sm text-gray-500">Production Projects</p>
                  <p className="text-xs text-gray-400">Built & Deployed</p>
                </div>
              </div>

              {/* <div className="flex items-center gap-3 pr-4 lg:border-r lg:border-gray-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {exp.short}
                  </p>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-xs text-gray-400">Since Oct 2023</p>
                </div>
              </div> */}

              <div className="flex items-center gap-3 pr-4 lg:border-r lg:border-gray-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">100%</p>
                  <p className="text-sm text-gray-500">Commitment</p>
                  <p className="text-xs text-gray-400">To Quality</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Always</p>
                  <p className="text-sm text-gray-500">Learning</p>
                  <p className="text-xs text-gray-400">Always Building</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side — 3D city "modal". Default: docked on the right with
              auto-rotation. On "Explore Campus": fills the whole screen and
              rotation is disabled so you can freely orbit it. */}
          <div
            className={
              explore
                ? "fixed inset-0 z-[60] bg-white"
                : "relative w-full h-[320px] sm:h-[440px] mt-4 z-20 bg-transparent lg:absolute lg:top-[20px] lg:right-0 lg:w-[66%] lg:h-[600px] lg:mt-[-90px]"
            }
          >
            {explore && (
              <>
                <button
                  onClick={() => {
                    document.exitPointerLock?.();
                    setExplore(false);
                  }}
                  aria-label="Close campus view"
                  className="absolute right-5 top-5 z-[61] flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
                >
                  <X size={16} />
                  Close
                </button>
                <div className="absolute bottom-5 left-5 z-[61] rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                  <p>
                    <b className="text-slate-900">Click</b> — Capture mouse ·{" "}
                    <b className="text-slate-900">Mouse</b> — Look
                  </p>
                  <p>
                    <b className="text-slate-900">WASD</b> — Move ·{" "}
                    <b className="text-slate-900">Shift</b> — Run
                  </p>
                  <p>
                    <b className="text-slate-900">Esc</b> — Release mouse, again
                    to exit
                  </p>
                </div>
              </>
            )}
            <CityCanvas explore={explore} onNavigate={navigate} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex flex-col items-center justify-center mt-12 gap-2">
        <span className="text-indigo-500 text-xs font-semibold uppercase tracking-widest">
          Scroll to Explore
        </span>
        <ChevronDown size={20} className="text-indigo-400 animate-bounce" />
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────
export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white from-white via-slate-50/50 to-white">
      <Hero />
    </main>
  );
}
