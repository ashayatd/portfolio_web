"use client";

import { useState, useEffect, useRef } from "react";
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

import ProjectStepper from "./BottomBar/BottomProgress";
import PoolManagementSlide from "./project1/scrollBuilding";
import VideoCallDashboard from "./project2/scrollBuilding2";
import NotificationCamp from "./project3/scrollBuilding3";

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

export default function Building() {
  const [selectedProject, setSelectedProject] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isFloating, setIsFloating] = useState(false);

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

  // ─── KEY FIX: Scroll-based detection for when to stick the header ───
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !headingRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const headingHeight = headingRef.current.offsetHeight; // 128px (h-32) or 80px (h-20)

      // The container's top edge relative to viewport
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;

      // Section is "active" when it's in the viewport
      const isSectionInView = containerBottom > 0 && containerTop < window.innerHeight;

      // Sticky trigger: when the section's top reaches the top of viewport (or goes above it)
      // We add a small offset so it sticks when the heading area is about to scroll out
      const shouldStick = isSectionInView && containerTop <= 0;

      setIsFloating(shouldStick);
    };

    handleScroll(); // Check immediately on mount

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

  const projects = [
    {
      id: 1,
      title: "ERP System",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      component: PoolManagementSlide,
    },
    {
      id: 2,
      title: "Video Calling",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
      ),
      component: VideoCallDashboard,
    },
    {
      id: 3,
      title: "Notification Campaign",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
      component: NotificationCamp,
    },
  ];

  const ActiveProject = projects.find((p) => p.id === selectedProject)?.component;

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
                background: "radial-gradient(circle at 50% 50%, rgba(31, 143, 95, 0.2), transparent 70%)",
              }}
            />

            <div className="flex">
              {"BUILDING".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-2xl md:text-2xl font-bold tracking-tight"
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
                  {letter}
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
              Flagship Projects
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="px-22 py-16 mt-[-2rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {ActiveProject && (
              <motion.div
                key={`project-${selectedProject}`}
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="overflow-hidden"
              >
                <ActiveProject />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-[-1.5rem]">
          <ProjectStepper
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={handleProjectChange}
          />
        </div>
      </div>
    </div>
  );
}