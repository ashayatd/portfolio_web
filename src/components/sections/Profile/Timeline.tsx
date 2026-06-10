"use client";

const timelineData = [
  {
    number: "01",
    year: "2019",
    title: "CURIOSITY",
    description: "Started with interfaces.\nI was fascinated by how products\nguide users through complexity.",
  },
  {
    number: "02",
    year: "2020",
    title: "OWNERSHIP",
    description: "Frontend wasn't enough.\nI wanted to understand data,\nAPIs, and the entire product.",
  },
  {
    number: "03",
    year: "2021",
    title: "SYSTEMS THINKING",
    description: "Features became systems.\nRealtime, permissions and workflows\nintroduced new complexity.",
  },
  {
    number: "04",
    year: "2022-23",
    title: "SCALE & PERFORMANCE",
    description: "Building became predictable.\nScaling, performance and architecture\nbecame the real challenge.",
  },
  {
    number: "05",
    year: "2024+",
    title: "TODAY",
    description: "I focus on solving business problems\nthrough engineering and building\nsystems that scale with impact.",
  },
];

export default function Timeline() {
  return (
    <div className="relative">
      {timelineData.map((item, index) => (
        <div key={item.number} className="relative flex gap-4 mb-5 last:mb-0">
          {/* Vertical connecting line */}
          {index < timelineData.length - 1 && (
            <div 
              className="absolute left-5 top-10 w-px bg-zinc-800" 
              style={{ height: 'calc(100% + 1.25rem)' }}
            />
          )}
          
          {/* Number Circle */}
          <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border border-green-500 flex items-center justify-center text-sm font-bold text-green-500 bg-[#0a0a0a]">
            {item.number}
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-0.5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-green-500 text-[13px] font-semibold tracking-wide">
                {item.title}
              </h3>
              <span className="text-green-500 text-[13px] font-medium">
                {item.year}
              </span>
            </div>
            <p className="text-zinc-400 text-[13px] leading-[1.6] whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}