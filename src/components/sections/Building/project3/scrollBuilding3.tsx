"use client";

import { useState } from "react";
import SystemArchitecture3 from "./system3";

const NotificationCamp = () => {
  const [showGraph, setShowGraph] = useState(false);
  // Blur style helper
  const getBlurStyle = (shouldBlur: boolean) => ({
    filter: `blur(${shouldBlur ? 10 : 0}px)`,
    transition: "filter 0.5s ease",
  });
  return (
    <div className="flex w-full min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Left Section - 40% */}
      <div
        className="w-[40%] min-h-screen flex flex-col justify-center px-12 py-16 relative"
        style={getBlurStyle(showGraph)}
      >
        {/* Subtle background accent */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-emerald-500/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Status Label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-2 h-2 bg-emerald-400 rounded-full">
              <div className="absolute inset-[-4px] rounded-full border-2 border-emerald-500 animate-ping"></div>
            </div>
            <p className="ml-3 text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
              SuperApp Microservice Ecosystem
            </p>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold leading-[1.15] mb-5 tracking-tight">
            Enterprise-Scale
            <br />
            <span className="text-emerald-400">Commerce & Travel</span>
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-10 max-w-sm">
            A microservices-driven platform unifying accommodation, transport,
            food ordering, dining reservations, parcel delivery, and vendor
            operations.
          </p>

          {/* Feature List - Architecture Focused */}
          <div className="space-y-5 mb-8">
            {/* Feature 1: Distributed Socket Orchestration */}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Unified Booking Infrastructure
                </p>
                <p className="text-xs text-gray-500">
                  Real-time booking with inventory sync
                </p>
              </div>
            </div>

            {/* Feature 2: State Synchronization Engine */}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Vendor Marketplace Orchestration
                </p>
                <p className="text-xs text-gray-500">
                  Catalog, pricing, commissions & settlements
                </p>
              </div>
            </div>

            {/* Feature 3: Monetization & Extension Workflow */}
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Payments & Revenue Engine
                </p>
                <p className="text-xs text-gray-500">
                  Processing, refunds, wallets & reconciliation
                </p>
              </div>
            </div>

            {/* Feature 4: WebRTC Media Infrastructure */}
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Logistics & Fulfillment Network
                </p>
                <p className="text-xs text-gray-500">
                  Allocation, tracking & operational visibility
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              "React",
              "Next.js",
              "Node.js",
              "MongoDB",
              "Redis",
              "Socket.IO",
              "RabbitMQ",
              "Docker",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-medium bg-[#111111] border border-[#222222] rounded-md text-gray-300 hover:border-emerald-500/50 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.1)] transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <button className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group">
            <span>VIEW SYSTEM DESIGN</span>
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

      {/* Right Section - 60% */}
      <div className="mt-8 w-[60%] h-full relative p-4">
        <div className="mt-8 h-[100%] bg-[#02a77303] border border-[#1a1a1a] rounded-2xl p-4">
          <div className="h-[32rem] flex items-center justify-center">
            <SystemArchitecture3 setShowGraph={setShowGraph} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCamp;
