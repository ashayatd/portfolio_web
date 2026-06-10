"use client";

const skills = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    title: "Frontend",
    items: "React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
      </svg>
    ),
    title: "Backend",
    items: "Node.js, Express, FastAPI, GraphQL",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    title: "Data & Storage",
    items: "MongoDB, Redis, Firebase, PostgreSQL",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
        <circle cx="12" cy="12" r="2"></circle>
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
        <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
      </svg>
    ),
    title: "Realtime & Messaging",
    items: "Socket.IO, Redis Pub/Sub, WebRTC",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
    ),
    title: "DevOps & Tools",
    items: "Docker, Git, CI/CD, Render, GCP, AWS",
  },
];

export default function SkillsSection() {
  return (
    <div>
      <h3 className="text-green-500 text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
        WHAT I WORK WITH
      </h3>
      <div>
        {skills.map((skill) => (
          <div key={skill.title} className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-b-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900/60 flex items-center justify-center border border-zinc-800/40">
              {skill.icon}
            </div>
            <div>
              <h4 className="text-white text-[13px] font-semibold">{skill.title}</h4>
              <p className="text-zinc-500 text-[11px] mt-0.5">{skill.items}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}