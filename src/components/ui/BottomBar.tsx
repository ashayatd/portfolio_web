"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import LogoItem from "./LogoItem";

export type TechItem = {
  name: string;
  logoUrl?: string;
  icon?: React.ReactNode;
};

type BottomBarProps = {
  currentPageOpacity: MotionValue<number> | any;
  heroScrollProgress: MotionValue<number>;
  logos?: TechItem[];
};

export const defaultTechStack: TechItem[] = [
  { name: "Next.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "React", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Node.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "MongoDB", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "MySQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "FastAPI", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  // { name: "Framer Motion", logoUrl: "github.com/user-attachments/assets/00d6d1c3-72c4-4c2f-a664-69da13182ffc" },
  { name: "Tailwind CSS", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Firestore", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
];

export default function BottomBar({
  currentPageOpacity,
  heroScrollProgress,
  logos = defaultTechStack,
}: BottomBarProps) {
  const y = useTransform(heroScrollProgress, [0.5, 0.8], [0, 80]);

  // Duplicate for seamless loop (2x is enough with proper width calculation)
  const duplicatedLogos = [...logos, ...logos];

  return (
    <motion.div
      style={{ opacity: currentPageOpacity, y }}
      className="absolute bottom-0 left-0 right-0 z-10 border-t border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden"
    >
      <div className="relative w-full">
        {/* Marquee Track */}
        <motion.div
          className="flex gap-[3rem] md:gap-[5rem] py-5"
          animate={{ x: [0, -100 * logos.length] }} // Move by 100% of original set width
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20, // Adjust speed here
              ease: "linear",
            },
          }}
          // Pause on hover (optional)
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedLogos.map((tech, index) => (
            <div key={`${tech.name}-${index}`} className="flex-shrink-0">
              <LogoItem name={tech.name} logoUrl={tech.logoUrl} icon={tech.icon} />
            </div>
          ))}
        </motion.div>

        {/* Fade edges for polish */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a]/90 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a]/90 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}