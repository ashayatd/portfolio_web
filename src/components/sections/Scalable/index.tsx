"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import type { Variants } from "framer-motion";

import RealtimeBlock from "./RealtimePage/realTime";
import PerformanceBlock from "./PerformancePage";
import CachingBlock from "./CachingPage";
import AccessControlBlock from "./AcPage";
import ArchitectureBlock from "./ArchitecturePage";
import { useScrollReveal } from "./hooks";

const pageVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 40 : -40,
    scale: 0.98,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -40 : 40,
    scale: 0.98,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  }),
};

const floatVariants: Variants = {
  initial: {
    x: "100vw",
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 20,
      mass: 1.2,
      delay: 0.2,
    },
  },
};

function AnimatedBlock({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── STEP CONFIGURATION ───
const STEPS = [
  {
    id: 1,
    label: "Realtime",
    description: "Live data streaming",
    component: RealtimeBlock,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Performance",
    description: "Optimization metrics",
    component: PerformanceBlock,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Caching",
    description: "Data persistence layer",
    component: CachingBlock,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "Access Control",
    description: "Security & permissions",
    component: AccessControlBlock,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 5,
    label: "Architecture",
    description: "System design overview",
    component: ArchitectureBlock,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
];

export default function Scalable() {
  const [selectedProject, setSelectedProject] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isFloating, setIsFloating] = useState(false);

  // ─── NEW: Active step state for stepper ───
  const [activeStep, setActiveStep] = useState(1);
  const [stepDirection, setStepDirection] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const floatWeight = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 20, mass: 1.2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const weightedX = useTransform(
    [smoothMouseX, floatWeight],
    ([x, weight]) => (x as number) * (weight as number),
  );
  const weightedY = useTransform(
    [smoothMouseY, floatWeight],
    ([y, weight]) => (y as number) * (weight as number),
  );

  const { scrollY } = useScroll();

  const headingOpacity = useTransform(scrollY, [0, 50, 100], [1, 0.9, 0.7]);
  const headingScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const offsetX = (e.clientX - rect.left - centerX) / centerX;
      const offsetY = (e.clientY - rect.top - centerY) / centerY;

      mouseX.set(offsetX * -300);
      mouseY.set(offsetY * 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll-based detection for floating header
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !headingRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;

      const isSectionInView =
        containerBottom > 0 && containerTop < window.innerHeight;
      const shouldStick = isSectionInView && containerTop <= 0;

      setIsFloating(shouldStick);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth transition for float weight
  useEffect(() => {
    const controls = animate(floatWeight, isFloating ? 1 : 0, {
      duration: 0.5,
      ease: "easeInOut",
    });
    return controls.stop;
  }, [isFloating, floatWeight]);

  // ─── NEW: Handle step click with direction tracking ───
  const handleStepClick = (stepId: number) => {
    if (stepId === activeStep) return;
    setStepDirection(stepId > activeStep ? 1 : -1);
    setActiveStep(stepId);
  };

  // ─── NEW: Get current active component ───
  const ActiveComponent = STEPS.find((s) => s.id === activeStep)?.component;

  const projects = [
    {
      id: 1,
      title: "ERP System",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      component: <></>,
    },
    {
      id: 2,
      title: "Video Calling",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
      ),
      component: <></>,
    },
    {
      id: 3,
      title: "Notification Campaign",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
      component: <></>,
    },
  ];

  const ActiveProject = projects.find(
    (p) => p.id === selectedProject,
  )?.component;

  const handleProjectChange = (newId: number) => {
    setDirection(newId > selectedProject ? 1 : -1);
    setSelectedProject(newId);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen mb-16">
      <div className="relative h-32 pointer-events-none">
        <motion.div
          ref={headingRef}
          className={`left-0 right-0 z-50 flex items-center justify-center pointer-events-none ${
            isFloating ? "fixed top-0 h-20" : "absolute top-0 h-32"
          }`}
          style={{
            x: weightedX,
            y: weightedY,
            opacity: headingOpacity,
            scale: headingScale,
          }}
          initial="initial"
          animate="animate"
          variants={floatVariants}
        >
          <div
            className="relative px-8 py-4 rounded-2xl backdrop-blur-xl border border-white/10 flex flex-col items-center gap-1"
            style={{
              background: isFloating ? "rgba(13, 15, 16, 0.85)" : "transparent",
              boxShadow: isFloating
                ? "0 8px 32px rgba(31, 143, 95, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "none",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0"
              animate={{
                opacity: isFloating ? [0.3, 0.6, 0.3] : 0,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(31, 143, 95, 0.2), transparent 70%)",
              }}
            />

            <div className="flex">
              {`SCALABLE SYSTEMS`.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-2xl font-bold tracking-tight"
                  style={{
                    color: "#F5F7F7",
                    textShadow: isFloating
                      ? "0 0 40px rgba(31, 143, 95, 0.3)"
                      : "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + i * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="text-md font-medium"
              style={{ color: "#A5B0AD", fontWeight: 600 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              What happens when complexity increases
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4 items-start py-8 px-4">
        {/* ─── INTERACTIVE VERTICAL STEPPER ─── */}
        <ol className="flex flex-col ml-3 items-start w-[18%] sticky top-24">
          {STEPS.map((step, index) => {
            const isCompleted = activeStep > step.id;
            const isActive = activeStep === step.id;
            const isPending = activeStep < step.id;
            const isLast = index === STEPS.length - 1;

            return (
              <li
                key={step.id}
                className="flex w-full items-start group cursor-pointer"
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex flex-col items-center mr-3">
                  {/* Step Circle */}
                  <motion.span
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? "bg-brand-softer"
                        : isActive
                          ? "bg-[#1F8F5F] shadow-[0_0_20px_rgba(31,143,95,0.4)]"
                          : "bg-neutral-tertiary hover:bg-neutral-secondary"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5 text-fg-brand"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    ) : (
                      <span className={isActive ? "text-white" : "text-body"}>
                        {step.icon}
                      </span>
                    )}
                  </motion.span>

                  {/* Connector Line */}
                  {!isLast && (
                    <span
                      className={`w-1 h-full rounded-full mt-2 min-h-[50px] transition-all duration-500 ${
                        isCompleted
                          ? "bg-brand-subtle"
                          : isActive
                            ? "bg-gradient-to-b from-brand-subtle to-default"
                            : "bg-default"
                      }`}
                    />
                  )}
                </div>

                {/* Step Label */}
                <div className="pt-2 pb-6">
                  <motion.span
                    className={`text-sm font-bold block transition-colors duration-300 ${
                      isActive
                        ? "text-[#1F8F5F]"
                        : isCompleted
                          ? "text-fg-brand"
                          : "text-body group-hover:text-fg-default"
                    }`}
                    animate={
                      isActive
                        ? {
                            textShadow: [
                              "0 0 0px rgba(31,143,95,0)",
                              "0 0 10px rgba(31,143,95,0.3)",
                              "0 0 0px rgba(31,143,95,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.label}
                  </motion.span>
                  <span
                    className={`text-xs mt-1 block transition-colors duration-300 ${
                      isActive ? "text-[#A5B0AD]" : "text-muted"
                    }`}
                  >
                    {step.description}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* ─── MAIN CONTENT: SINGLE ACTIVE COMPONENT ─── */}
        <div className="w-[82%] border border-default rounded-lg px-8 py-8 min-h-[500px]">
          <AnimatePresence mode="wait" custom={stepDirection}>
            <motion.div
              key={`step-${activeStep}`}
              custom={stepDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>

          <style>{`
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 0px rgba(46,182,125,0); }
              50% { box-shadow: 0 0 15px rgba(46,182,125,0.3); }
            }
            @keyframes tag-in {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
