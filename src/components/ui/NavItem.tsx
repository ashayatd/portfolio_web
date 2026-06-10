"use client";

import { useState } from "react";
import { useScrambleText } from "@/components/effects/scramble";

export default function NavItem({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);
  const display = useScrambleText(label, hovered, 20);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-xs uppercase tracking-[0.25em] text-zinc-400 transition-colors duration-300 hover:text-emerald-400"
    >
      {display}

      <span className="absolute -bottom-1 left-0 h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
    </a>
  );
}
