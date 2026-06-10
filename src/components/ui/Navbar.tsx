"use client";

import NavItem from "./NavItem";

type NavLink = {
  label: string;
  href: string;
};

type NavbarProps = {
  links?: NavLink[];
};

const defaultNavLinks: NavLink[] = [
  { label: "BUILDING", href: "#building" },
  { label: "ABOUT", href: "#about" },
  { label: "BLOG", href: "#blog" },
  { label: "RESUME", href: "#resume" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar({ links = defaultNavLinks }: NavbarProps) {
  return (
    <nav className="relative z-50 flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
          <span className="text-sm font-bold text-black">A</span>
        </div>

        <span className="text-sm font-semibold tracking-wide text-white">
          Ashay
        </span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {links.map((item) => (
          <NavItem key={item.label} label={item.label} href={item.href} />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-emerald-500/30 px-5 py-2 text-xs font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-500/10">
          Subscribe
        </button>

        <button className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-medium text-black transition-all duration-200 hover:bg-emerald-400">
          Message
        </button>
      </div>
    </nav>
  );
}
