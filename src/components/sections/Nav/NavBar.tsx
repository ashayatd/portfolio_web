"use client";

import React from "react";
import { Download } from "lucide-react";
import { NAV_ITEMS, useActiveSection } from "@/lib/nav";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

// ─── Navbar ─────────────────────────────────────────────────────────
export function Navbar() {
  const { scrollTo } = useSmoothScroll();
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id));

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <nav className="  w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
      {/* Logo */}
      <a
        href="#home"
        onClick={go("home")}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg tracking-tight">
            AT
          </span>
        </div>
        <span className="text-slate-900 font-semibold text-lg tracking-wide uppercase">
          Ashay Tamrakar
        </span>
      </a>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={go(link.id)}
            className={`text-sm font-medium transition-colors ${
              active === link.id
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Resume Button */}
      <button className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
        Resume
        <Download size={16} />
      </button>
    </nav>
  );
}
