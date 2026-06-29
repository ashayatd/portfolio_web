"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  label: string;
  /** Matches the `id` on the corresponding section in the page. */
  id: string;
}

// Single source of truth for navigation — used by the Navbar and any future
// modal / quick-nav components. Order matches the page's section order.
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Tools", id: "tech" },
  { label: "About", id: "about" },
];

/**
 * Tracks which section is currently in view, so nav links can stay highlighted.
 * A section counts as active while it crosses a thin band near the top third
 * of the viewport.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
