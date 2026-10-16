export const HERO_TOTAL_FRAMES = 70;

export const HERO_PROFILE = {
  name: "ASHAY TAMRAKAR",
  role: "FULL-STACK AI ENGINEER",
  image: "/your-image.jpg",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "LangGraph",
    "MongoDB",
    "MySQL",
    "Docker",
    "AWS",
  ],
} as const;

export const HERO_VIDEO_SRC = "/assets/heroVideo/frame_.mp4";

export function getHeroFrameSrc(frame: number) {
  return `/assets/frames/frame__${String(frame).padStart(3, "0")}.png`;
}
