# Ashay Portfolio - Complete Codebase Documentation

A comprehensive guide to understanding the entire codebase architecture, component structure, animation systems, and data flow.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Core Architecture](#core-architecture)
4. [Timeline & Animation System](#timeline--animation-system)
5. [Section-by-Section Breakdown](#section-by-section-breakdown)
6. [Hooks & Utilities](#hooks--utilities)
7. [Data Flow](#data-flow)
8. [Component Patterns](#component-patterns)
9. [Animation Patterns](#animation-patterns)
10. [How Everything Connects](#how-everything-connects)

---

## Project Overview

**What is this?**
A high-performance portfolio website for Ashay Tamrakar featuring cinematic scroll animations, interactive UI, and multiple showcase sections.

**Tech Stack:**
- **Framework:** Next.js (React 18+)
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Build Tool:** Turbopack

**Key Features:**
- Scroll-driven animations with precise control
- Hero section with canvas frame animations
- Magic/story section with cinematic title transitions
- Infrastructure showcase with project cards
- Responsive design across all devices

---

## Folder Structure

```
src/
├── app/                          # Next.js app router
│   ├── page.tsx                 # Main home page entry
│   ├── layout.tsx               # Root layout with providers
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── NavItem.tsx          # Individual nav links
│   │   ├── BottomBar.tsx        # Bottom logo bar
│   │   └── LogoItem.tsx         # Logo display component
│   │
│   ├── effects/                 # Animation & effect components
│   │   ├── SlotText.tsx         # Slot machine text effect
│   │   ├── BlurReveal.tsx       # Blur reveal animation
│   │   ├── scramble.ts          # Text scramble effect hook
│   │   ├── scrambleSpark.ts     # Utility for scramble chars
│   │   └── index.ts             # Exports
│   │
│   └── sections/                # Page sections
│       ├── Hero/                # Hero section
│       │   ├── index.tsx        # Main Hero component
│       │   ├── hooks.ts         # useHeroScene() hook
│       │   ├── animations.ts    # Animation ranges
│       │   ├── constants.ts     # Hero config & profile
│       │   ├── HeroVideo.tsx    # Video overlay
│       │   ├── HeroIntro.tsx    # Intro/bio card
│       │   ├── HeroContent.tsx  # Skills & info
│       │   └── HeroOverlay.tsx  # Scroll indicator
│       │
│       ├── Magic/               # Magic/story section
│       │   ├── index.tsx        # Main Magic component
│       │   ├── hooks.ts         # Scramble & handoff hooks
│       │   ├── animations.ts    # Animation ranges
│       │   ├── constants.ts     # Title words & config
│       │   ├── Building.tsx     # Building title component
│       │   ├── Scalable.tsx     # Scalable title component
│       │   ├── Solutions.tsx    # Solutions title component
│       │   ├── ScrollIndicator.tsx  # Scroll hint
│       │   └── SceneContent.tsx # Scene content renderer
│       │
│       ├── Building/            # Infrastructure section
│       │   ├── index.tsx        # Main Building component
│       │   ├── animations.ts    # Animation transitions
│       │   ├── hooks.ts         # useBuildingReveal hook
│       │   ├── constants.ts     # Projects & metrics
│       │   ├── Grid.tsx         # Project cards grid
│       │   ├── Metrics.tsx      # Stats with counters
│       │   └── Infrastructure.tsx  # Header & visuals
│       │
│       └── Shared/              # Shared section utilities
│           ├── SectionWrapper.tsx  # Section container
│           ├── StickyLayer.tsx    # Sticky positioning
│           ├── TransitionLayer.tsx # Overlay transitions
│           └── TimelineDebug.tsx   # Debug component
│
├── hooks/                        # Custom React hooks
│   ├── useComponentScroll.ts    # Track individual element scroll
│   ├── useGlobalTimeline.ts     # Access global scroll context
│   ├── useSectionProgress.ts    # Map global progress to section
│   ├── useParallax.ts           # Parallax effect helper
│   ├── useStickyScene.ts        # Sticky container hook
│   └── index.ts                 # Exports
│
├── lib/                          # Utility functions
│   ├── motion.ts                # Framer Motion utilities
│   ├── math.ts                  # Math helpers (clamp, lerp)
│   └── interpolation.ts         # Range mapping functions
│
├── providers/                    # React context providers
│   └── TimelineProvider.tsx     # Global scroll progress context
│
├── timeline/                     # Timeline & animation config
│   ├── timeline.ts              # TIMELINE object (section ranges)
│   ├── sections.ts              # Section arrays
│   ├── transitions.ts           # Easing & transition presets
│   └── timings.ts               # Timing constants
│
└── types/                        # TypeScript type definitions
    └── index.ts                 # Exported types
```

---

## Core Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Scrolls Page                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
     ┌────────────────────────────────┐
     │  Browser measures scroll       │
     │  position & velocity           │
     └────────┬───────────────────────┘
              │
              ▼
     ┌────────────────────────────────┐
     │  TimelineProvider (Context)    │
     │  useScroll() → scrollYProgress │
     │  Emits to all consumers        │
     └────────┬───────────────────────┘
              │
         ┌────┴────┬─────────┬──────────┐
         │          │         │          │
         ▼          ▼         ▼          ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
    │  Hero   │ │ Magic   │ │Building │ │  Navbar  │
    │ Section │ │ Section │ │ Section │ │  (UI)    │
    └────┬────┘ └────┬────┘ └────┬────┘ └──────────┘
         │           │           │
         │      ┌────┴────┐      │
         │      │          │      │
         ▼      ▼          ▼      ▼
    useHeroScene   |  useMagicTitleScramble  |  useBuildingReveal
    ├─ useComponentScroll()   │
    ├─ useTransform() for animations
    └─ Calculates progress 0→1
```

### TimelineProvider (Global Context)

**File:** `src/providers/TimelineProvider.tsx`

```typescript
// Provides global scroll progress to entire app
export const TimelineContext = createContext<{
  progress: MotionValue<number>;  // 0 to 1 as user scrolls page
} | null>(null);

// Usage:
const { progress } = useGlobalTimeline();
```

**Why?**
- Single source of truth for scroll position
- All sections can access global progress
- Enables coordinated animations across sections

---

## Timeline & Animation System

### The TIMELINE Object

**File:** `src/timeline/timeline.ts`

```typescript
export const TIMELINE = {
  hero: [0.0, 0.1],      // Hero occupies 0-10% of page scroll
  magic: [0.1, 0.2],     // Magic occupies 10-20%
  building: [0.2, 0.3],  // Building occupies 20-30%
} as const satisfies TimelineRangeMap<SectionId>;
```

**What does this mean?**
- Total page scroll is mapped to 0→1 range
- Each section gets a range within that
- Hero takes first 10% of page height
- Magic takes next 10% of page height
- Building takes next 10% of page height
- Remaining 70% is for content below

**How is it used?**

```typescript
// In components:
const { progress: globalProgress } = useGlobalTimeline();

// Map global progress to section-local progress
const sectionProgress = useSectionProgress([0.1, 0.2], globalProgress);
// Result: When global is 0.1→0.2, sectionProgress goes 0→1
```

### Animation Ranges Pattern

**Each section defines animation ranges in animations.ts**

```typescript
// Example from Magic section:
export const magicAnimationRanges = {
  introBuilding: {
    opacityInput: [0, 0.18, 0.36, 0.42],    // Section progress values
    opacityOutput: [1, 1, 0.45, 0],         // Corresponding opacity values
    yInput: [0.18, 0.42],                   // Y position input range
    yOutput: [0, -260],                     // Y position output range (pixels)
    scaleInput: [0.18, 0.42],
    scaleOutput: [1, 0.34],
  },
  // ... more animations
};

// Usage in component:
const opacity = useTransform(
  storyProgress,                           // Motion value to track
  magicAnimationRanges.introBuilding.opacityInput,    // When progress reaches these:
  magicAnimationRanges.introBuilding.opacityOutput,   // Output these opacity values
);
// Result: Smooth animation mapped to scroll progress
```

**How useTransform Works:**

```
Input Progress:  0  →  0.18  →  0.36  →  0.42
                ↓      ↓        ↓        ↓
Output Opacity:  1  →  1    →  0.45  →  0
                
Real-world example:
- User scrolls to 0%: opacity = 1 (fully visible)
- User scrolls to 18%: opacity = 1 (stays visible)
- User scrolls to 36%: opacity = 0.45 (fading)
- User scrolls to 42%: opacity = 0 (hidden)
- Anywhere in between: Framer Motion interpolates smoothly
```

---

## Section-by-Section Breakdown

### 1. Hero Section

**File:** `src/components/sections/Hero/`

**Purpose:**
- Introduction with animated background
- Smooth transition to Magic section
- Profile info display

**Component Hierarchy:**
```
Hero (main)
├── Canvas frame animation (70 frames)
├── HeroVideo (overlay with fade)
├── HeroOverlay (scroll indicator)
├── HeroIntro (name/role card)
├── HeroContent (skills & info)
└── [Nested inside] MagicPage (transitions in)
```

**How it Works:**

1. **Canvas Animation** (70 PNG frames)
   - Tracks Hero scroll progress (0→1)
   - Frame number = progress × 69
   - Renders frame on canvas
   - Smooth pseudo-video effect

   ```typescript
   // From useHeroScene hook:
   const handleScroll = () => {
     targetFrame = heroScrollProgress × (HERO_TOTAL_FRAMES - 1);  // 0→69
   };
   ```

2. **Video Fade-in** (0% → 12%)
   - Video appears over canvas
   - Both fade/scale during this range
   - Creates layered reveal effect

3. **MagicPage Transition** (94% → 100%)
   - MagicPage becomes visible
   - Opacity increases from 0 to 1
   - Scale increases from 0.97 to 1
   - At 97%: becomes interactive (pointer-events-auto)
   - After delay: scroll unlocks inside MagicPage

**Key Animations:**
```typescript
// From heroAnimationRanges:
videoOpacity: {
  input: [0, 0.06, 0.12],      // 0%, 6%, 12% of Hero scroll
  output: [1, 1, 0],            // Fade from visible to hidden
},
magicPageOpacity: {
  input: [0.94, 0.98, 1],      // Last 6% of Hero
  output: [0, 1, 1],            // Fade from hidden to visible
},
```

**Special Logic:**
- `isFullyMerged` flag: When Hero scroll reaches 97%
- `magicScrollUnlocked` flag: After 600ms delay from merge
- These flags control pointer-events and scroll behavior

---

### 2. Magic Section

**File:** `src/components/sections/Magic/`

**Purpose:**
- Cinematic story about three key concepts
- Title transitions (Building → Scalable → Solutions)
- Animated content reveal per scene

**Component Hierarchy:**
```
MagicPage (main)
├── Navbar
├── Three Title Sections (animated)
│   ├── Building (0-42%)
│   ├── Scalable (62-90%)
│   └── Solutions (82-100%)
├── ScrollIndicator
└── BottomBar
```

**Animation Timeline (0% → 100% of Magic scroll):**

```
0-18%:     Building title enters, dominates screen
18-42%:    Building title stays, Scalable/Solutions fade below
42-62%:    Building exits upward
62-72%:    Scalable title enters, becomes dominant
72-82%:    Scalable title stays visible
82-92%:    Solutions title enters
92-100%:   Solutions dominates until end
```

**How Titles Work:**

```typescript
// Each title has independent animation ranges
const buildingHeadingOpacity = useTransform(
  storyProgress,
  [0.28, 0.42, 0.62, 0.7],   // Building visible 28%-70%
  [0, 1, 1, 0],               // Fade: in, stay, out
);

const scalableHeadingOpacity = useTransform(
  storyProgress,
  [0.62, 0.72, 0.82, 0.9],   // Scalable visible 62%-90%
  [0, 1, 1, 0],
);

// Each title moves vertically simultaneously
const buildingHeadingY = useTransform(
  storyProgress,
  [0.28, 0.42, 0.7],
  [48, 0, -24],              // Enters from below, exits upward
);
```

**SlotText Animation:**
- Each letter "spins" like a slot machine
- Triggered at specific scroll points
- Creates cinematic text reveal effect

```typescript
// From useMagicTitleScramble:
- Scrambles text when section comes into view
- Randomly staggers individual title scrambles
- Repeats every 6 seconds for visual interest
```

**Content Scenes:**
- Building content (metrics, grid)
- Scalable content (diagram, info)
- Solutions content (cards, features)
- Each scene fades in/out with title

---

### 3. Building Section

**File:** `src/components/sections/Building/`

**Purpose:**
- Showcase infrastructure projects
- Display metrics and statistics
- Interactive project cards

**Component Hierarchy:**
```
Building (main)
├── InfrastructureHeader
│   ├── Title animation
│   └── Description text
├── Metrics (4 animated counters)
│   └── AnimatedCounter (counts up)
├── Terminal Lines (3 horizontal bars)
└── Grid (6 project cards)
    ├── ProjectCard
    │   ├── StatusBadge (live/beta)
    │   ├── Project info
    │   ├── Tag pills
    │   └── Metric display
    └── ActivityBar (animated bars)
```

**Animations:**

1. **Section Reveal:**
   - When section enters viewport (useInView)
   - Header slides up with fade
   - Cards stagger in from bottom

   ```typescript
   // Use IntersectionObserver:
   const { ref, isInView } = useBuildingReveal("-80px");
   // Triggers animation when 80px from viewport
   ```

2. **Metric Counters:**
   - On section visibility
   - Counts from 0 to final value
   - 1800ms duration with easing

   ```typescript
   // Example: 99.97% animates smoothly from 0→99.97
   const tick = (now) => {
     const progress = (now - start) / 1800;
     const eased = 1 - (1 - progress)³;  // Cubic easing
     setCurrent(target × eased);
   };
   ```

3. **Card Hover Effects:**
   - Border highlights with glow
   - Top/bottom gradient bars appear
   - Shadow increases
   - Icon background brightens

   ```typescript
   onMouseEnter={() => setHovered(true)}
   // Triggers: border color, shadow, glow updates
   ```

**Color System:**
```typescript
const BUILDING_COLORS = {
  bg: "#0D0F10",           // Dark background
  surface: "#131619",      // Card surface
  surfaceHover: "#181C1F", // Lighter on hover
  accent: "#10B981",       // Emerald green (primary)
  accentGlow: "rgba(16,185,129,0.4)",
  // ... more colors
};
```

---

## Hooks & Utilities

### 1. useComponentScroll

**File:** `src/hooks/useComponentScroll.ts`

**Purpose:** Track scroll progress of a specific element

```typescript
// Measures how far through an element you've scrolled
const progress = useComponentScroll(heroRef);
// Returns: 0 when element enters viewport
//         1 when element leaves viewport

// Formula:
const pixelsScrolledPastTop = -rect.top;
const scrollableRange = rect.height - window.innerHeight;
const percentage = pixelsScrolledPastTop / scrollableRange;
```

**Used by:** Hero, Magic, Building sections (individual tracking)

---

### 2. useGlobalTimeline

**File:** `src/hooks/useGlobalTimeline.ts`

**Purpose:** Access global scroll progress context

```typescript
const { progress: globalProgress } = useGlobalTimeline();
// Returns: 0 at page top, 1 at page bottom

// Reads from TimelineProvider context, falls back to useScroll()
```

**Used by:** Navbar, sections that need global awareness

---

### 3. useSectionProgress

**File:** `src/hooks/useSectionProgress.ts`

**Purpose:** Map global scroll to section-local progress

```typescript
const sectionProgress = useSectionProgress([0.1, 0.2]);
// Maps global [0.1→0.2] to local [0→1]
// When user at page 10%: sectionProgress = 0
// When user at page 15%: sectionProgress = 0.5
// When user at page 20%: sectionProgress = 1

// Implementation:
const normalizeRange = (value, start, end) => {
  return (value - start) / (end - start);
};
```

---

### 4. useParallax

**File:** `src/hooks/useParallax.ts`

**Purpose:** Create parallax offset based on scroll

```typescript
const parallaxY = useParallax(progress, 100);
// Input: progress (0→1), distance (pixels)
// Output: -100 to +100 Y offset

// Used for: Depth effects, layered animations
```

---

### 5. useStickyScene

**File:** `src/hooks/useStickyScene.ts`

**Purpose:** Create sticky container with scroll tracking

```typescript
const { ref, progress } = useStickyScene();
// Progress: 0 when entering, 1 when exiting
// Used for: Sections that "stick" while you scroll

// Configuration:
offset: ["start start", "end start"]
// "start start": top of element reaches top of viewport
// "end start": bottom of element reaches top of viewport
```

---

### 6. useBuildingReveal

**File:** `src/components/sections/Building/hooks.ts`

**Purpose:** Track when elements enter viewport

```typescript
const { ref, isInView } = useBuildingReveal("-80px");
// isInView: true when element is visible
// margin: "-80px" triggers 80px before entering viewport

// Used for: Staggered animations on scroll
```

---

### Utility Functions

**File:** `src/lib/interpolation.ts`

```typescript
// Map a value from one range to another
mapRange(0.5, 0, 1, 0, 100)  // Returns: 50

// Normalize a value within a range to 0→1
normalizeRange(50, 0, 100)    // Returns: 0.5
```

**File:** `src/lib/math.ts`

```typescript
clamp(5, 0, 10)      // Returns: 5
clamp(15, 0, 10)     // Returns: 10
clamp(-5, 0, 10)     // Returns: 0

lerp(0, 100, 0.5)    // Returns: 50 (linear interpolation)
```

---

## Data Flow

### Example: User Scrolls Hero Section

```
1. User scrolls page down 200px
   ↓
2. Browser fires scroll event
   ↓
3. TimelineProvider's useScroll() detects scroll
   ↓
4. scrollYProgress MotionValue updates → 0.05 (5% of page)
   ↓
5. Hero component:
   - useComponentScroll(heroRef) calculates Hero's local progress
   - Hero is 400vh tall → progress = 0.15 (15% through Hero)
   ↓
6. useTransform creates derived values:
   - videoOpacity = useTransform([0, 0.06, 0.12], [1, 1, 0])
   - At 0.15 progress → opacity = 0 (video hidden)
   ↓
7. Canvas draws frame:
   - targetFrame = 0.15 × 69 = 10.35
   - Smooth easing: currentFrame += (targetFrame - current) × 0.1
   ↓
8. motion.video style updates:
   - opacity: 0
   - scale: (interpolated value)
   ↓
9. Browser repaints screen with new values
```

### Example: Titles in Magic Section

```
1. User scrolls into Magic section
   ↓
2. MagicPage tracks its own scroll with useScroll()
   ↓
3. useMagicTitleScramble hook detects viewport entry (45%+ scroll)
   ↓
4. Sets scrambleBuilding = true (triggers animation)
   ↓
5. SlotText component receives trigger prop
   ↓
6. SlotLetter components animate each character:
   - Creates "reel" of random characters
   - Spins 3x full height + easing
   - Spring settle at end
   - Result: Satisfying slot machine effect
   ↓
7. Simultaneously, useTransform animates:
   - buildingHeadingOpacity: 0→1→1→0
   - buildingHeadingY: 48px→0→-24px
   ↓
8. Results in:
   - Title spins in with text scramble
   - Positioned at center
   - Later exits upward
```

---

## Component Patterns

### Pattern 1: Scroll-Driven Animation

**Template:**
```typescript
const MyComponent = () => {
  const ref = useRef<HTMLElement>(null);
  
  // Track this element's scroll
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  
  // Create animations
  const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(progress, [0, 1], [100, -100]);
  
  return (
    <section ref={ref}>
      <motion.div style={{ opacity, y }}>
        Content
      </motion.div>
    </section>
  );
};
```

**Examples in codebase:**
- Hero (useComponentScroll)
- Magic (useScroll)
- Building (useInView for viewport)

---

### Pattern 2: Staggered Animations

**Template:**
```typescript
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: index * 0.08,  // Stagger 80ms per item
      duration: 0.6,
      ease: "easeOut",
    }}
  >
    {item.content}
  </motion.div>
))}
```

**Examples:**
- Building metrics (4 cards)
- Building project cards (6 cards)
- Hero skills (8 tags)

---

### Pattern 3: Animated Counter

**Template:**
```typescript
const { current, target } = useSpring({ target: value });

useEffect(() => {
  // Animate from 0 to target over duration
  const tick = (now) => {
    const progress = (now - start) / duration;
    const eased = easeFunction(progress);
    setCurrent(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}, [target]);
```

**Examples:**
- Building metrics counters
- Project throughput displays

---

## Animation Patterns

### 1. Fade In/Out

```typescript
opacity: useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
// Fades: in (0-30%), stays (30-70%), out (70-100%)
```

### 2. Slide & Fade

```typescript
const y = useTransform(progress, [0, 0.5, 1], [100, 0, -100]);
const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
// Element enters from below, centers, exits upward
```

### 3. Scale & Fade

```typescript
const scale = useTransform(progress, [0, 0.3, 1], [0.8, 1, 0.8]);
const opacity = useTransform(progress, [0, 0.3, 1], [0, 1, 0]);
// Element zooms in while fading, then reverses
```

### 4. Staggered Sequence

```typescript
// Used in Magic titles
// Building visible: 28-70%
// Scalable visible: 62-90%
// Solutions visible: 82-100%
// Each takes turn while previous exits
```

---

## How Everything Connects

### The Complete Flow

```
app/page.tsx (Home)
    │
    └─→ TimelineProvider wrapper
        │
        └─→ Hero Section
            ├─ useComponentScroll(heroRef)
            ├─ tracks: canvas, video, overlay animations
            ├─ At 97% scroll: merges with MagicPage
            ├─ At 100% scroll: MagicPage becomes interactive
            │
            └─→ MagicPage (nested inside Hero)
                ├─ useScroll() on storyRef
                ├─ useMagicTitleScramble() for text effects
                ├─ Three title sections (Building/Scalable/Solutions)
                ├─ Animated scene content below titles
                └─ BottomBar with logos
    
    └─→ Magic Section (standalone)
        ├─ Independent scroll tracking
        ├─ Title animations with useTransform
        ├─ Content scene reveals
        └─ BottomBar
    
    └─→ Building Section
        ├─ useInView() for viewport detection
        ├─ Staggered card reveals
        ├─ Animated metrics
        ├─ Hover state interactions
        └─ Activity bar background animation
```

### Animation Sync Points

```
Global Page Scroll (0 → ∞)
├─ Hero Progress: 0-400vh = 0-1 (useComponentScroll)
│  ├─ Canvas animation (70 frames)
│  ├─ Video fade (0-12%)
│  └─ MagicPage merge (94-100%)
│
├─ Magic Progress: 400-900vh = 0-1 (useScroll)
│  ├─ Building title (0-42%)
│  ├─ Scalable title (62-90%)
│  └─ Solutions title (82-100%)
│
└─ Building Progress: 900vh+ = viewport entry (useInView)
   ├─ Header reveal
   ├─ Cards stagger
   └─ Metrics count up
```

### State Management

```
MotionValue (Framer Motion)
├─ Immutable, subscriptable values
├─ Updated by useTransform()
├─ Can be listened to with .on("change")
└─ Don't cause re-renders, just DOM updates

useMotionValue()
├─ Created manually
├─ Updated with .set()
└─ Used for imperative animations

Context (React)
├─ TimelineContext
├─ Provides global scrollYProgress
└─ Accessed by useGlobalTimeline()
```

---

## Key Files Reference

### Critical System Files

| File | Purpose |
|------|---------|
| `src/providers/TimelineProvider.tsx` | Global scroll context |
| `src/timeline/timeline.ts` | Section ranges (0.1-0.2, etc) |
| `src/timeline/transitions.ts` | Easing & animation presets |
| `src/timeline/timings.ts` | Animation durations |
| `src/types/index.ts` | TypeScript definitions |

### Component Files

| File | Purpose |
|------|---------|
| `src/components/sections/Hero/index.tsx` | Main Hero component |
| `src/components/sections/Hero/hooks.ts` | useHeroScene (frame animation) |
| `src/components/sections/Magic/index.tsx` | Main Magic component |
| `src/components/sections/Magic/hooks.ts` | Title scramble effects |
| `src/components/sections/Building/index.tsx` | Main Building component |

### Hook Files

| File | Purpose |
|------|---------|
| `src/hooks/useComponentScroll.ts` | Element scroll tracking |
| `src/hooks/useGlobalTimeline.ts` | Global progress access |
| `src/hooks/useSectionProgress.ts` | Local progress mapping |

---

## Common Tasks

### Task: Add a New Animation to Hero

```typescript
// 1. Add to heroAnimationRanges in animations.ts:
myNewElement: {
  opacityInput: [0.3, 0.7, 1],
  opacityOutput: [0, 1, 0],
},

// 2. Create transform in useHeroScene hook:
const myNewOpacity = useTransform(
  heroScrollProgress,
  heroAnimationRanges.myNewElement.opacityInput,
  heroAnimationRanges.myNewElement.opacityOutput,
);

// 3. Apply to element:
<motion.div style={{ opacity: myNewOpacity }}>
  Content
</motion.div>
```

### Task: Add a New Project Card

```typescript
// 1. Add to BUILDING_PROJECTS in constants.ts:
{
  id: "infra-07",
  name: "New Project",
  description: "...",
  tags: ["tag1", "tag2"],
  status: "live",
  metric: "123",
  metricSuffix: "",
  metricLabel: "Label",
},

// 2. Card automatically renders in Grid.tsx
// Staggered animation applied based on index
```

### Task: Adjust Animation Timing

```typescript
// Option 1: Change input range
opacityInput: [0, 0.2, 0.8, 1]  // Earlier transition
// vs
opacityInput: [0, 0.4, 0.6, 1]  // Later transition

// Option 2: Change duration in transitions.ts:
CINEMATIC_EASE = [0.22, 1, 0.36, 1]  // Cubic Bezier
```

---

## Debugging Tips

### Check Scroll Progress

```typescript
// Add to any component:
useEffect(() => {
  return scrollProgress.on("change", (value) => {
    console.log(`Progress: ${value.toFixed(3)}`);
  });
}, [scrollProgress]);

// Watch console as you scroll
```

### Inspect Animation Values

```typescript
// In component:
useEffect(() => {
  return opacity.on("change", (value) => {
    console.log(`Opacity: ${value}`);
  });
}, [opacity]);
```

### Visual Debug Component

```typescript
// Use TimelineDebug component:
<TimelineDebug progress={progress} label="Hero" />
// Shows current progress in fixed corner
```

---

## Performance Considerations

1. **MotionValues don't cause re-renders**
   - Animations are GPU-accelerated
   - Safe to update many times per frame

2. **useTransform is memoized**
   - Only updates when inputs change
   - Doesn't create new objects constantly

3. **useInView has once: true**
   - Elements animate only when first viewed
   - Reduces animation overhead

4. **Canvas rendering optimized**
   - 70 frames preloaded
   - Smooth interpolation between frames
   - Single canvas element for efficiency

---

## Summary

This portfolio is built on a **scroll-driven animation foundation** where:

1. **Global scroll position** is tracked via `TimelineProvider`
2. **Each section tracks its own progress** with `useScroll` or `useComponentScroll`
3. **Animations map progress to values** using `useTransform`
4. **Values update smoothly** as user scrolls
5. **No re-renders occur** - just DOM style updates
6. **Sections transition seamlessly** with carefully choreographed timings

The architecture allows for **precise control** of every animation frame while maintaining **excellent performance** and **responsiveness** across all devices.

---

**End of Documentation**

For questions or clarifications, refer to specific section headings or file paths mentioned throughout.
