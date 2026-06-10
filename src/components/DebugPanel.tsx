"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { DebugContext } from "@/providers/DebugProvider";
import { TimelineContext } from "@/providers/TimelineProvider";

export function DebugPanel() {
  const debugContext = useContext(DebugContext);
  const timelineContext = useContext(TimelineContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  //   const animationFrameId = useRef<number>();

  // Listen to global scroll progress from TimelineContext using RAF
  //   useEffect(() => {
  //     if (!timelineContext?.progress) return;

  //     const updateProgress = () => {
  //       try {
  //         const value = (timelineContext.progress as any).get?.();
  //         if (value !== undefined && value !== null) {
  //           setGlobalProgress(Math.round(value * 100));
  //         }
  //       } catch (error) {
  //         // Silently handle errors
  //       }
  //       animationFrameId.current = requestAnimationFrame(updateProgress);
  //     };

  //     animationFrameId.current = requestAnimationFrame(updateProgress);

  //     return () => {
  //       if (animationFrameId.current) {
  //         cancelAnimationFrame(animationFrameId.current);
  //       }
  //     };
  //   }, [timelineContext?.progress]);

  // Listen to local scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const vpHeight = window.innerHeight;
      const scrollHeight = docHeight - vpHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;

      setPageHeight(docHeight);
      setViewportHeight(vpHeight);
      setScrollY(scrolled);
      setLocalProgress(Math.round(progress));

      // Debug logging
      if (scrolled > 0) {
        console.log("Scroll Event:", {
          docHeight,
          vpHeight,
          scrollHeight,
          scrolled,
          progress: Math.round(progress),
        });
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [debugContext?.logs]);

  if (!debugContext) return null;

  const getLogColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-300";
    }
  };

  const getLogBg = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500/10";
      case "warn":
        return "bg-yellow-500/10";
      case "info":
        return "bg-blue-500/10";
      default:
        return "bg-gray-500/5";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl backdrop-blur-sm">
        {/* Progress Bars */}
        <div className="px-3 py-2 border-b border-gray-700 bg-gray-800/50 space-y-2">
          {/* Manual Scroll Listener - ACCURATE */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-green-300">
                📍 Page Scroll (Accurate)
              </span>
              <span className="text-xs text-green-300/70">
                {localProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-100"
                style={{ width: `${localProgress}%` }}
              />
            </div>
          </div>

          {/* Framer-Motion Progress - May not work with Lenis */}
          <div className="space-y-1 opacity-50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-300">
                🎬 Framer-Motion (Lenis Issue)
              </span>
              <span className="text-xs text-blue-300/70">
                {globalProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-100"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
          </div>

          {/* Debug Info */}
          <div className="text-xs text-gray-400 pt-1 border-t border-gray-600 space-y-1">
            <div>
              📏 Page Height:{" "}
              <span className="text-cyan-400">{Math.round(pageHeight)}px</span>
            </div>
            <div>
              👀 Viewport:{" "}
              <span className="text-cyan-400">
                {Math.round(viewportHeight)}px
              </span>
            </div>
            <div>
              📍 Scroll Y:{" "}
              <span className="text-cyan-400">{Math.round(scrollY)}px</span>
            </div>
            <div>
              🔢 Scrollable:{" "}
              <span className="text-cyan-400">
                {Math.round(pageHeight - viewportHeight)}px
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300">
              DEBUG LOG ({debugContext.logs.length})
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => debugContext.clear()}
              className="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 text-xs bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded transition-colors"
            >
              {isExpanded ? "−" : "+"}
            </button>
          </div>
        </div>

        {/* Logs Container */}
        {isExpanded && (
          <div
            ref={scrollRef}
            className="h-64 overflow-y-auto text-xs font-mono space-y-1 p-2"
          >
            {debugContext.logs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No logs yet</div>
            ) : (
              debugContext.logs.map((log) => (
                <div
                  key={log.id}
                  className={`px-2 py-1 rounded ${getLogBg(
                    log.type,
                  )} ${getLogColor(log.type)} break-words`}
                >
                  <span className="text-gray-500">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>{" "}
                  <span className="font-bold text-gray-400">
                    {log.type.toUpperCase()}:
                  </span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
