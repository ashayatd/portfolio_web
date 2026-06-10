"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface Project {
  id: number;
  title: string;
  icon?: React.ReactNode;
}

interface ProjectStepperProps {
  projects: Project[];
  selectedProject: number;
  setSelectedProject: (projectId: number) => void;
}

export default function ProjectStepper({
  projects,
  selectedProject,
  setSelectedProject,
}: ProjectStepperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
  });

  // Measure and update pill position
  const updatePill = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector(
      `[data-project-id="${selectedProject}"]`,
    ) as HTMLElement;
    if (!activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setPillStyle({
      left: btnRect.left - containerRect.left,
      top: btnRect.top - containerRect.top,
      width: btnRect.width,
      height: btnRect.height,
    });
  }, [selectedProject]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  return (
    <div className="relative w-fit mx-auto">
      <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-3xl" />

      <div
        ref={containerRef}
        className="
          relative
          flex
          items-center
          rounded-2xl
          border
          border-emerald-500/20
          bg-black/60
          backdrop-blur-xl
          px-1
          py-1
        "
      >
        {/* Shared animated pill */}
        <motion.div
          className="
            absolute
            rounded-xl
            border
            border-emerald-400/20
            bg-emerald-500/15
            pointer-events-none
          "
          animate={{
            left: pillStyle.left,
            top: pillStyle.top,
            width: pillStyle.width,
            height: pillStyle.height,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />

        {projects.map((project, index) => {
          const isActive = selectedProject === project.id;

          return (
            <React.Fragment key={project.id}>
              <button
                data-project-id={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`
                  relative
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  transition-colors
                  duration-300
                  cursor-pointer
                  z-10
                  ${isActive ? "text-emerald-200" : "text-zinc-400 hover:text-zinc-200"}
                `}
              >
                {project.icon && (
                  <span className="flex items-center">{project.icon}</span>
                )}
                <span className="text-sm font-medium tracking-wide whitespace-nowrap">
                  {project.title}
                </span>
              </button>

              {index !== projects.length - 1 && (
                <div className="mx-1 h-6 w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
