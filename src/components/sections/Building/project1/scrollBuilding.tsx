"use client";

import { useState } from "react";
import { memo } from "react";
import SystemArchitecture from "./system";

// Blur style helper
const getBlurStyle = (shouldBlur: boolean) => ({
  filter: `blur(${shouldBlur ? 10 : 0}px)`,
  transition: "filter 0.5s ease",
});

const PoolManagementSlide = () => {
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div className=" flex  w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Left Section - 30% */}
      <div
        className="w-[40%] h-full flex flex-wrap justify-center px-10 py-12 relative"
        style={getBlurStyle(showGraph)}
      >
        {/* Content */}
        <div className="mt-8">
          {/* Label */}
          <p className="text-xs font-medium tracking-widest text-emerald-400 uppercase mb-4">
            Realtime Platform
          </p>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Realtime Pool Management{" "}
            <span className="text-emerald-400">ERP </span> System
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-sm">
            A full-scale platform to manage billiards venues with real-time
            table sync, live scoring, payments, and role based access.
          </p>

          {/* Feature List */}
          <div className="space-y-5 mb-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Real-time table coordination
                </p>
                <p className="text-xs text-gray-500">using WebSockets</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Live scoring & match tracking
                </p>
                <p className="text-xs text-gray-500">across devices</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Role-based access control
                </p>
                <p className="text-xs text-gray-500">for secure operations</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Session & booking management
                </p>
                <p className="text-xs text-gray-500">with conflict handling</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "Next.js",
              "Node.js",
              "MongoDB",
              "Redis",
              "WebSockets",
              "Zustand",
              "TailwindCSS",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] rounded text-gray-300 hover:border-emerald-500/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <button className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group">
            <span>VIEW SYSTEM</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Section - 70% */}
      <div className="mt-8 w-[60%] h-full relative p-4">
        <div className="mt-8 h-[100%] bg-[#02a77303] border border-[#1a1a1a] rounded-2xl p-4">
          <div className="h-[32rem] flex items-center justify-center">
            {/* // commenting out for feels heavy and Lagging in ui.  */}
            <SystemArchitecture setShowGraph={setShowGraph} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PoolManagementSlide);
