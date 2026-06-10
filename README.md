# Ashay Portfolio - Scrolling Architecture Deep Dive

A sophisticated Next.js portfolio with **advanced scroll-driven animations** using Framer Motion and Lenis smooth scrolling. This README provides an in-depth understanding of the scrolling system implementation for AI comprehension and future development.

## 🎯 Quick Overview

**Tech Stack:**
- Next.js 16.2.6 (Turbopack)
- React 19.2.4
- Framer Motion 12.38.0 (Animations)
- Lenis 1.3.23 (Smooth Scrolling)
- TypeScript 5
- Tailwind CSS 4

**Key Features:**
- 🎬 Scroll-driven animations with timeline-based ranges
- 📍 Component-level scroll tracking
- 🔄 Smooth scrolling via Lenis (hijacks native scroll)
- 🎨 Advanced visual effects (blur reveals, scramble text, parallax)
- 🐛 Real-time debug panel for scroll tracking

---

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/
│   ├── DebugPanel.tsx           # 🐛 Scroll debugging UI
│   ├── sections/                # Main page sections
│   │   ├── Hero/                # Hero section (h-[400vh])
│   │   ├── Magic/               # Magic section (h-[500vh])
│   │   ├── Building/            # Building section
│   │   └── Shared/              # Shared section components
│   ├── effects/                 # Animation effects
│   │   ├── BlurReveal.tsx
│   │   ├── SlotText.tsx
│   │   ├── scramble.ts
│   │   └── scrambleSpark.ts
│   ├── ui/                      # UI components
│   │   ├── Navbar.tsx
│   │   └── BottomBar.tsx
│   └── lib/                     # Component utilities
│
├── hooks/                        # Custom React hooks
│   ├── useGlobalTimeline.ts     # Global scroll progress
│   ├── useSectionProgress.ts    # Section-specific progress
│   ├── useParallax.ts           # Parallax effect hook
│   ├── useComponentScroll.ts    # Component scroll tracking
│   ├── useStickyScene.ts        # Sticky positioning
│   └── useDebugLogger.ts        # Debug logging hook
│
├── providers/                    # React context providers
│   ├── TimelineProvider.tsx     # Global scroll timeline
│   ├── DebugProvider.tsx        # Debug logging provider
│
├── lib/                          # Utility functions
│   ├── interpolation.ts         # Range normalization & mapping
│   ├── math.ts                  # Math utilities
│   └── motion.ts                # Motion value utilities
│
└── timeline/                     # Timeline configuration
    ├── timeline.ts              # Section timeline ranges (0.0-1.0)
    ├── sections.ts              # Section definitions
    ├── timings.ts               # Animation timings
    └── transitions.ts           # Transition configurations
```

---

## 🔄 SCROLLING ARCHITECTURE - COMPLETE SYSTEM EXPLANATION

This is the most important section. Read this to understand how EVERYTHING works.

### The Complete Scroll Flow (Step by Step)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER SCROLLS (mouse wheel / touch / keyboard)            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. LENIS SMOOTH SCROLL (Hijacks native scroll events)       │
│    - Virtualizes scroll position                            │
│    - Uses RequestAnimationFrame                             │
│    - Updates window.scrollY                                 │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. MANUAL SCROLL LISTENER (Because Lenis breaks Framer)     │
│    const progress = window.scrollY / scrollHeight * 100     │
│    setLocalProgress(progress)                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. NORMALIZE TO SECTION RANGE (0.0 → 1.0)                  │
│    if scrolling in Magic section [0.1, 0.2]                │
│    → section progress = (0.15 - 0.1) / (0.2 - 0.1) = 0.5   │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. FRAMER-MOTION TRANSFORMS (Map to animation values)       │
│    useTransform(progress, [0, 0.5, 1], [0, 0.5, 1])        │
│    Maps scroll % to any value (opacity, position, scale)    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. MOTION VALUES UPDATE (No React re-render!)               │
│    MotionValue.set(newValue)                                │
│    60fps smooth animations via browser paint cycles         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. COMPONENTS ANIMATE (Applied to motion.*)                 │
│    <motion.div style={{ opacity, scale, y }} />             │
│    Visual result: Smooth scroll-driven animation            │
└─────────────────────────────────────────────────────────────┘
```

### 1. Lenis Smooth Scrolling - The Foundation

**File:** `package.json` dependency: `"lenis": "^1.3.23"`

**What it does:**
```typescript
// Lenis intercepts all scroll events
window.addEventListener('scroll', (e) => {
  // Native scroll interrupted here
  // Lenis takes over and smooths it
  requestAnimationFrame(() => {
    // Applies smooth acceleration/deceleration
    element.scrollTop = smoothedValue;
  });
});
```

**Why it matters:**
- ✅ Creates silky smooth scrolling (not jerky)
- ✅ Works across all browsers consistently
- ❌ **BREAKS framer-motion's scroll detection** (This is key!)
- ❌ Virtualizes `window.scrollY` position

**The Problem:**
```typescript
// Framer-Motion tries to track scroll:
const { scrollYProgress } = useScroll();
// But Lenis hijacks events before Framer sees them
// Result: scrollYProgress stays at 0
```

**Our Solution:**
```typescript
// Manual listener on window.scrollY
useEffect(() => {
  const handleScroll = () => {
    const progress = window.scrollY / (pageHeight - viewportHeight);
    setProgress(progress);
  };
  window.addEventListener('scroll', handleScroll);
}, []);
// Result: Real-time scroll tracking ✅
```

### 2. TimelineProvider - Global Context

**File:** [src/providers/TimelineProvider.tsx](src/providers/TimelineProvider.tsx)

```typescript
export function TimelineProvider({ children }: PropsWithChildren) {
  // Framer-Motion detects document scroll (when Lenis doesn't interfere)
  const { scrollYProgress } = useScroll();

  // Wrap in context for global access
  const value = useMemo(
    () => ({ progress: scrollYProgress }),
    [scrollYProgress],
  );

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}
```

**Accessible via:**
```typescript
const { progress } = useGlobalTimeline();
// Or directly:
const context = useContext(TimelineContext);
const globalProgress = context?.progress; // MotionValue<number>
```

**Note:** In this project, Lenis prevents this from working properly. We use manual scroll listeners instead in the DebugPanel and components.

### 3. Timeline System - The Master Controller

**File:** [src/timeline/timeline.ts](src/timeline/timeline.ts)

```typescript
export const TIMELINE = {
  hero: [0.0, 0.1],      // Hero takes up 0-10% of total scroll
  magic: [0.1, 0.2],     // Magic takes up 10-20% of total scroll  
  building: [0.2, 0.3],  // Building takes up 20-30% of total scroll
} as const;
```

**How it defines the experience:**
```
Total Page Scroll: 0.0 → 1.0 (normalized)
                   |
                   ├─ [0.0 - 0.1] HERO SECTION
                   │  ├─ 0.0: Title enters
                   │  ├─ 0.05: Peak visibility
                   │  └─ 0.1: Fades to next section
                   │
                   ├─ [0.1 - 0.2] MAGIC SECTION
                   │  ├─ 0.1: "Building" title appears
                   │  ├─ 0.15: Supporting titles animate
                   │  └─ 0.2: Next section takes over
                   │
                   └─ [0.2 - 0.3] BUILDING SECTION
                      └─ Detailed animations...
```

**Real-world example:**
```
User scrolls to 15% of page (global progress = 0.15)
  → Falls in MAGIC range [0.1, 0.2]
  → Magic section progress = (0.15 - 0.1) / (0.2 - 0.1) = 0.5
  → All animations in Magic are at 50% completion
  → Titles at 50% opacity, positioned at 50% of animation range
```

### 4. useSectionProgress Hook - The Normalizer

**File:** [src/hooks/useSectionProgress.ts](src/hooks/useSectionProgress.ts)

```typescript
export function useSectionProgress(
  range: TimelineRange,
  sourceProgress?: MotionValue<number>,
) {
  const { progress: globalProgress } = useGlobalTimeline();
  const progress = sourceProgress ?? globalProgress;
  const [start, end] = range;

  // Maps global progress to section progress
  return useTransform(progress, (latest) => 
    normalizeRange(latest, start, end)
  );
}
```

**The normalization formula:**
```typescript
function normalizeRange(value: number, start: number, end: number) {
  // Clamp value between 0 and 1
  const normalized = (value - start) / (end - start);
  return Math.max(0, Math.min(1, normalized));
}
```

**Example calculation:**
```
Global scroll at 12% (0.12)
Section range: [0.1, 0.2]

Normalized = (0.12 - 0.1) / (0.2 - 0.1)
           = 0.02 / 0.1
           = 0.2 (20% through section)
```

**Why it matters:**
- Each section gets its own 0.0 → 1.0 progress scale
- Animations are relative to WHEN YOU ENTER that section
- You don't need to know global scroll %s in components

### 5. useTransform - The Animation Mapper

**File:** From Framer Motion core

```typescript
const opacity = useTransform(
  scrollProgress,              // Input MotionValue
  [0.0, 0.25, 0.5],           // Input keyframe positions (0-1)
  [0.0, 0.5, 1.0],            // Output keyframe values
);
```

**What happens step-by-step:**
```
Section progress: 0.0 (just entered)
  → Check input ranges: 0.0 is at position 0
  → Output value: 0.0 → opacity = 0 (invisible)

Section progress: 0.25 (quarter way through)
  → Check input ranges: 0.25 is at position 1
  → Output value: 0.5 → opacity = 0.5 (50% visible)

Section progress: 0.5 (halfway through)
  → Check input ranges: 0.5 is at position 2
  → Output value: 1.0 → opacity = 1.0 (fully visible)

Section progress: 0.75 (between 0.5 and 1.0)
  → Interpolate between output[2] and next range
  → opacity = 1.0 (still fully visible)
```

**Why no React re-renders:**
- `useTransform` returns a MotionValue (not React state)
- MotionValue updates directly via Framer Motion
- Browser paint cycles read the MotionValue
- Zero React state updates = 60fps guaranteed

### 6. Section Components - Putting It All Together

**File:** [src/components/sections/Magic/index.tsx](src/components/sections/Magic/index.tsx)

```typescript
export default function MagicPage() {
  const storyRef = useRef<HTMLElement>(null);
  
  // STEP 1: Get scroll progress WITHIN this section
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,                    // Track THIS element's scroll
    offset: ["start start", "end end"],  // From when it enters to when it exits
  });

  // STEP 2: Map section progress to animation values
  const introBuildingOpacity = useTransform(
    storyProgress,
    [0.0, 0.25, 0.5],    // Fade in during first 50% of section scroll
    [0.0, 0.5, 1.0],
  );

  const introBuildingY = useTransform(
    storyProgress,
    [0.0, 0.5],          // Move up during first 50%
    [100, 0],            // From 100px down to 0px
  );

  // STEP 3: Apply to motion components
  return (
    <section ref={storyRef} className="h-[500vh]">
      {/* Sticky container stays fixed while scrolling within section */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.h1
          style={{
            opacity: introBuildingOpacity,
            y: introBuildingY,
          }}
        >
          Building Scalable Solutions
        </motion.h1>
      </div>

      {/* Extra content that pushes the sticky element up */}
      <div className="h-[400vh] bg-black" />
    </section>
  );
}
```

**The h-[500vh] magic:**
```
h-[500vh] = 5x viewport height

So if viewport is 1000px:
  total section height = 5000px
  sticky content height = 1000px (h-screen)
  scrollable content = 4000px to scroll through this section

Result:
  - 4000px of smooth scroll
  - Sticky title animates as you scroll through
  - Gets pushed up by next section
```

### 7. Sticky Positioning - The Visual Effect

**How it works:**
```html
<section ref={storyRef} class="h-[500vh]">
  <!-- This stays fixed while you scroll -->
  <div class="sticky top-0 h-screen">
    <motion.h1 style={animationValues}>Content</motion.h1>
  </div>
  
  <!-- This extra space makes you scroll through the section -->
  <div class="h-[400vh]" />
</section>
```

**The browser does:**
```
1. Section starts at top of viewport
2. Scroll within section
3. Sticky div stays at top-0 (fixed position within section)
4. Scroll value increases
5. Next section's top reaches current viewport
6. Sticky div gets pushed up by next section's content
7. New section takes over
```

**Animation timeline:**
```
0% scroll through section:
  → "Building" title appears at center
  → Opacity = 0, Y = 100px (below)

25% scroll through section:
  → Title fades in
  → Opacity = 0.5, Y = 50px

50% scroll through section:
  → Title fully visible
  → Opacity = 1.0, Y = 0px

75% scroll through section:
  → Stays visible
  → Supporting titles animate

100% scroll through section:
  → Next section pushes everything up
  → This section exits viewport
```

---

## 🐛 Debug Panel - The Debugging Superpower

**File:** [src/components/DebugPanel.tsx](src/components/DebugPanel.tsx)

**Location:** Fixed top-right corner (z-50)

### What It Shows:

```
┌──────────────────────────────────────────┐
│ 📍 Page Scroll (Accurate): 79%           │
│ [████████████████░░░░░░░░░░░░░░] 79%    │
│                                          │
│ 🎬 Framer-Motion (Lenis Issue): 0%      │
│ [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%     │
│                                          │
│ 📏 Page Height: 2516px                   │
│ 👀 Viewport: 960px                       │
│ 📍 Scroll Y: 1586px                      │
│ 🔢 Scrollable: 1556px                    │
├──────────────────────────────────────────┤
│ [Clear] [−]  DEBUG LOG (12)              │
├──────────────────────────────────────────┤
│ [16:30:45] LOG: Component mounted        │
│ [16:30:46] ERROR: Animation failed       │
│ [16:30:47] WARN: Slow scroll detected    │
│ ...more logs below...                    │
└──────────────────────────────────────────┘
```

### Real-Time Values Explained:

| Value | Meaning | Formula |
|-------|---------|---------|
| **Page Scroll** | Your actual scroll % | `(window.scrollY / scrollableHeight) * 100` |
| **Page Height** | Total document height | `document.documentElement.scrollHeight` |
| **Viewport** | Window height | `window.innerHeight` |
| **Scroll Y** | Current scroll position | `window.scrollY` |
| **Scrollable** | Available scroll distance | `pageHeight - viewport` |

### How the Manual Scroll Listener Works:

```typescript
useEffect(() => {
  const handleScroll = () => {
    // Total distance you can scroll
    const scrollableHeight = 
      document.documentElement.scrollHeight - window.innerHeight;
    
    // How far down you've scrolled
    const scrolledDistance = window.scrollY;
    
    // Convert to percentage
    const progress = (scrolledDistance / scrollableHeight) * 100;
    
    // Update state
    setLocalProgress(Math.round(progress));
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Using Debug Logger in Components:

```typescript
import { useDebugLogger } from "@/hooks";

export function MyComponent() {
  const { log, error, warn, info } = useDebugLogger();
  
  useEffect(() => {
    log("Component mounted");
    log(`Section progress: ${progress}`);
  }, [progress]);
  
  return <div>{/* Component */}</div>;
}
```

**All console methods are captured:**
```typescript
console.log("message")    // → Appears in debug panel
console.error("message")  // → Appears in debug panel  
console.warn("message")   // → Appears in debug panel
console.info("message")   // → Appears in debug panel
```

---

## 🎨 Advanced Animation Effects

### Blur Reveal
[src/components/effects/BlurReveal.tsx](src/components/effects/BlurReveal.tsx)
- Animates blur from 20px to 0px as scroll progresses
- Creates "sharpening" effect on text/images
- Uses `filter: blur(${value}px)`

### Scramble Text
[src/components/effects/scramble.ts](src/components/effects/scramble.ts)
- Text characters shuffle/scramble during scroll
- Each character animates to reveal the final text
- Adds dynamic motion and visual interest

### Parallax Hook
[src/hooks/useParallax.ts](src/hooks/useParallax.ts)
- Elements move at different speeds
- Formula: `offset = progress * depth * direction`
- Depth < 1 = moves slower (background)
- Depth > 1 = moves faster (foreground)

---

## 📊 Performance Optimization

### Why It's Fast (60fps):

1. **MotionValues > React State**
   - Animations use Framer MotionValues (not React state)
   - MotionValues update without triggering React renders
   - Result: 60fps smooth animations

2. **RequestAnimationFrame Throttling**
   - Lenis uses RAF for smooth scroll
   - Animations sync to browser paint cycles
   - Single event listener instead of per-component

3. **useTransform Memoization**
   - Interpolation cached between renders
   - Only recalculates when inputs change
   - Zero unnecessary computations

4. **Lazy Component Loading**
   - Components use Intersection Observer
   - Only animate when visible in viewport
   - Reduces off-screen calculations

### Known Limitation: Lenis vs Framer-Motion

**The Problem:**
```
Framer-Motion's useScroll() reads from browser's native scroll API
Lenis hijacks that API and virtualizes the scroll position
Result: Framer-Motion sees 0 scroll, even though user is scrolling
```

**Our Workaround:**
```typescript
// Instead of relying on Framer-Motion's scroll detection:
const { scrollYProgress } = useScroll(); // ❌ Always 0 with Lenis

// We manually track:
useEffect(() => {
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / scrollableHeight;
    setProgress(progress); // ✅ Works with Lenis
  });
}, []);
```

---

## 🚀 Adding New Animated Sections

### Complete Example: Adding "About" Section

**Step 1: Add to timeline**
```typescript
// src/timeline/timeline.ts
export const TIMELINE = {
  hero: [0.0, 0.1],
  magic: [0.1, 0.2],
  building: [0.2, 0.3],
  about: [0.3, 0.4],  // ← New
} as const;
```

**Step 2: Create component**
```typescript
// src/components/sections/About/index.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Get scroll progress within THIS section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Create animations
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <section ref={sectionRef} className="h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div style={{ opacity: titleOpacity, y: contentY }}>
          <h2 className="text-4xl font-bold">About Me</h2>
          <p className="text-lg text-gray-400">My story...</p>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 3: Add to home page**
```typescript
// src/app/page.tsx
import Hero from "@/components/sections/Hero";
import MagicPage from "@/components/sections/Magic";
import AboutSection from "@/components/sections/About";
import BuildingSection from "@/components/sections/Building";

export default function Home() {
  return (
    <main className="bg-[#0D0F10] text-white">
      <Hero />
      <MagicPage />
      <AboutSection />  {/* ← Add here */}
      <BuildingSection />
    </main>
  );
}
```

**Step 4: Test**
- Open debug panel (top-right)
- Scroll into About section
- Watch "About Progress" go from 0 → 1
- Adjust animations in useTransform

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run linter
npm run lint
```

### Access During Development

- **Main site:** `http://localhost:3000`
- **Debug panel:** Top-right corner (always visible)
- **Browser console:** F12 > Console tab (shows all logs)

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Scroll bar not moving | Lenis took over | Check manual listener in DebugPanel |
| Animations stuck at 0% | useScroll in wrong component | Move scroll tracking to actual section |
| 60fps drops | Too many transforms | Use `will-change: transform` CSS |
| Section doesn't animate | Timeline range wrong | Verify TIMELINE config |

---

## 📚 Key Files Reference

| File | Purpose | Exports |
|------|---------|---------|
| [TimelineProvider.tsx](src/providers/TimelineProvider.tsx) | Global scroll context | `TimelineProvider`, `TimelineContext` |
| [timeline.ts](src/timeline/timeline.ts) | Section ranges | `TIMELINE`, `TimelineSection` |
| [useSectionProgress.ts](src/hooks/useSectionProgress.ts) | Normalize scroll | `useSectionProgress()` |
| [useParallax.ts](src/hooks/useParallax.ts) | Parallax effect | `useParallax()` |
| [interpolation.ts](src/lib/interpolation.ts) | Math utilities | `normalizeRange()`, `mapRange()` |
| [DebugPanel.tsx](src/components/DebugPanel.tsx) | Scroll debugging | `DebugPanel` |
| [Magic/index.tsx](src/components/sections/Magic/index.tsx) | Example section | `MagicPage` |

---

## 💡 The Math Behind Everything

### Progress Normalization
```
When global scroll reaches 15% and Magic section is [0.1, 0.2]:

sectionProgress = (globalProgress - rangeStart) / (rangeEnd - rangeStart)
                = (0.15 - 0.1) / (0.2 - 0.1)
                = 0.05 / 0.1
                = 0.5

Result: Magic section is 50% complete
```

### Scroll Percentage Calculation
```
When page has 5000px total height and viewport is 1000px:

scrollableHeight = 5000 - 1000 = 4000px
currentScroll = 2000px (halfway down page)

percentage = (2000 / 4000) * 100 = 50%
```

### Animation Interpolation
```
useTransform with [0, 0.5, 1] input and [0, 0.5, 1] output:

At progress 0.0: output = 0.0
At progress 0.25: output = 0.25 (interpolated)
At progress 0.5: output = 0.5
At progress 0.75: output = 0.75 (interpolated)
At progress 1.0: output = 1.0
```

---

## 🎯 For AI Approaching This Project

**Load this in your context first:**

1. **Timeline System** is the foundation
   - Read `src/timeline/timeline.ts`
   - Understand [0.0, 1.0] ranges map to sections

2. **Scroll Flow** determines behavior
   - User scroll → Lenis → Manual listener → Section progress → Animation

3. **Debug Panel** is your best friend
   - Check scroll values in real-time
   - Use console.log to trace execution

4. **Component Pattern** is consistent
   - useScroll on section
   - useTransform for animations
   - Apply to motion components

5. **Lenis is the gotcha**
   - It breaks Framer-Motion's scroll detection
   - Always use manual window.scrollY listeners
   - This is why blue progress bar shows 0%

---

## 📝 License & Notes

This is a personal portfolio project. The scrolling architecture is designed to be:
- ✅ Performant (60fps guaranteed)
- ✅ Scalable (add new sections easily)
- ✅ Debuggable (real-time monitoring)
- ✅ Maintainable (clean component patterns)

Feel free to reference, learn from, or adapt this architecture for your own projects!
